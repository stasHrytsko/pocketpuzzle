(function () {
  var BOARD = ['. . C . .', '# # # . R', '. . . . .', '. . . . .', '. . B . .'].map(function (r) { return r.split(' '); });
  var HAND = ['line3', 'dash2', 'diag', 'side'], SOL = [['diag', [3, 1]], ['dash2', [3, 3]], ['line3', [0, 3]], ['side', [0, 2]]];
  var NAMES = { step: 'Step', diag: 'Diagonal', knight: 'Knight', line3: 'Line up to 3', dash2: 'Dash 2', side: 'Sideways', ud2: 'Up-down up to 2' };
  var O = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function inb(r, c) { return r >= 0 && c >= 0 && r < 5 && c < 5; }
  function dests(card, pos) {
    var r = pos[0], c = pos[1], out = [];
    function line(dirs, mn, mx) { dirs.forEach(function (d) { for (var k = 1; k <= mx; k++) { var rr = r + d[0] * k, cc = c + d[1] * k; if (!inb(rr, cc) || BOARD[rr][cc] === '#') break; if (k >= mn) out.push([rr, cc]); } }); }
    if (card === 'step') line(O, 1, 1);
    if (card === 'diag') [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (d) { var rr = r + d[0], cc = c + d[1]; if (inb(rr, cc) && BOARD[rr][cc] !== '#') out.push([rr, cc]); });
    if (card === 'knight') [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(function (d) { var rr = r + d[0], cc = c + d[1]; if (inb(rr, cc) && BOARD[rr][cc] !== '#') out.push([rr, cc]); });
    if (card === 'line3') line(O, 1, 3);
    if (card === 'dash2') line(O, 2, 2);
    if (card === 'side') line([[0, 1], [0, -1]], 1, 1);
    if (card === 'ud2') line([[1, 0], [-1, 0]], 1, 2);
    return out;
  }
  function dist(a, b) { var q = [[a, 0]], seen = {}; seen[a] = 1; while (q.length) { var x = q.shift(), p = x[0]; if (p[0] === b[0] && p[1] === b[1]) return x[1]; O.forEach(function (d) { var rr = p[0] + d[0], cc = p[1] + d[1]; if (inb(rr, cc) && BOARD[rr][cc] !== '#' && !seen[[rr, cc]]) { seen[[rr, cc]] = 1; q.push([[rr, cc], x[1] + 1]); } }); } return 99; }
  function find(ch) { for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) if (BOARD[r][c] === ch) return [r, c]; }
  function fresh() { return { blue: find('B'), red: find('R'), hand: HAND.slice(), status: 'playing' }; }
  var CRYSTAL = find('C');
  /* play card to dest; returns {ok, red} */
  function play(s, card, d) {
    if (s.status !== 'playing' || s.hand.indexOf(card) < 0) return false;
    if (!dests(card, s.blue).some(function (x) { return x[0] === d[0] && x[1] === d[1]; })) return false;
    if (d[0] === s.red[0] && d[1] === s.red[1]) return false;
    s.hand = s.hand.filter(function (x) { return x !== card; }); s.blue = d;
    if (d[0] === CRYSTAL[0] && d[1] === CRYSTAL[1]) { s.status = 'won'; return true; }
    var opts = dests(card, s.red);
    if (opts.length) { opts.sort(function (a, b) { return dist(a, d) - dist(b, d) || a[0] - b[0] || a[1] - b[1]; }); s.red = opts[0]; }
    if (s.red[0] === d[0] && s.red[1] === d[1]) { s.status = 'lost'; return true; }
    if (!s.hand.length) s.status = 'lost';
    return true;
  }
  var engine = { fresh: fresh, play: play, dests: dests, HAND: HAND, SOL: SOL };
  Games.register({ id: 'shadow-step', total: 1, playable: 1, name: 'Shadow Step', color: COLORS.butter, icon: 'o', engine: engine,
    rules: '<b>Pick a card, then a cell</b> for the blue piece. Reach the crystal before the cards run out. After every move the <b>red piece makes the same move</b>, choosing the cell closest to you. If red lands on you, you lose. Each card works once; pieces can be jumped over.',
    mount: function (root, api) {
      var s = fresh(), sel = null, msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(5,1fr);max-width:320px;gap:5px' }), hand = h('div', { class: 'chips', style: 'margin-top:8px' });
      root.appendChild(grid); root.appendChild(h('div', { class: 'lbl', style: 'text-align:center' }, ['Your hand'])); root.appendChild(hand); root.appendChild(msg);
      function draw() {
        grid.innerHTML = ''; var ok = sel ? dests(sel, s.blue) : [];
        for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) (function (r, c) {
          var wall = BOARD[r][c] === '#', isB = s.blue[0] === r && s.blue[1] === c, isR = s.red[0] === r && s.red[1] === c, isC = CRYSTAL[0] === r && CRYSTAL[1] === c;
          var can = ok.some(function (x) { return x[0] === r && x[1] === c; }) && !isR;
          var sym = isB ? '<span class="dot" style="width:60%;height:60%;background:#AECAD1;border:2.5px solid #2f3a26"></span>' : isR ? '<span class="dot" style="width:60%;height:60%;background:#E8B093;border:2.5px solid #2f3a26"></span>' : isC ? '<span style="font-size:24px">◆</span>' : '';
          var el = h('div', { class: 'cell' + (wall ? ' wall' : '') + (can ? ' sel' : ''), style: isC && !isB ? 'background:#F1CA7D55' : '', html: sym });
          el.addEventListener('click', function () {
            if (!sel || s.status !== 'playing') return;
            if (!play(s, sel, [r, c])) { shake(el); msg.textContent = 'Pick one of the outlined cells.'; return; }
            sel = null; msg.textContent = ''; draw();
            if (s.status === 'won') api.win('Crystal reached');
            if (s.status === 'lost') { msg.className = 'msg bad'; msg.textContent = s.hand.length ? 'Red caught you. Restart (↻).' : 'Out of cards. Restart (↻).'; }
          });
          grid.appendChild(el);
        })(r, c);
        hand.innerHTML = '';
        HAND.forEach(function (card) { var used = s.hand.indexOf(card) < 0; hand.appendChild(h('button', { class: 'chip' + (sel === card ? ' on' : '') + (used ? ' used' : ''), style: 'padding:0 12px;font-size:15px', onclick: function () { if (!used && s.status === 'playing') { sel = card; draw(); } } }, [NAMES[card]])); });
      }
      draw();
    } });
})();

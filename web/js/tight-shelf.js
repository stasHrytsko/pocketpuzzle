(function () {
  var RULES = ['....', 't...', '.ss.', '..Y.'], TARGET = 5;
  var COL = { B: COLORS.blue, Y: COLORS.butter, C: COLORS.apr }, CN = { B: 'blue', Y: 'yellow', C: 'coral' };
  var LINES = (function () { var L = []; for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) [[0, 1], [1, 0], [1, 1], [1, -1]].forEach(function (d) { var cells = []; for (var k = 0; k < 3; k++) { var rr = r + d[0] * k, cc = c + d[1] * k; if (rr < 0 || rr > 3 || cc < 0 || cc > 3) { cells = null; break; } cells.push(rr * 4 + cc); } if (cells) L.push(cells); }); return L; })();
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function piece(r) { return 'BYC'[Math.floor(r() * 3)] + 'ost'[Math.floor(r() * 3)]; }
  function fits(rule, p) { return rule === '.' || rule === p[0] || rule === p[1]; }
  function rules() { return RULES.join('').split(''); }
  function placeAt(board, i, p) {
    board[i] = p; var gone = {}, lines = 0;
    LINES.forEach(function (L) { if (L.indexOf(i) < 0) return; var ps = L.map(function (k) { return board[k]; }); if (ps.some(function (x) { return !x; })) return;
      if (ps.every(function (x) { return x[0] === ps[0][0]; }) || ps.every(function (x) { return x[1] === ps[0][1]; })) { lines++; L.forEach(function (k) { gone[k] = 1; }); } });
    Object.keys(gone).forEach(function (k) { board[k] = null; }); return lines;
  }
  function anyFit(board, rs, p) { return board.some(function (x, i) { return !x && fits(rs[i], p); }); }
  var engine = { LINES: LINES, fits: fits, placeAt: placeAt, rules: rules, anyFit: anyFit, rng: rng, piece: piece };
  Games.register({ id: 'tight-shelf', name: 'Tight Shelf', color: COLORS.apr, icon: 'o', engine: engine,
    rules: '<b>Tap an empty cell</b> that accepts the current piece: a colour-ringed cell wants that colour, a shape cell wants that shape, a plain cell takes anything. Three in a row (any direction) with one colour <i>or</i> one shape vanish. Clear <b>5 lines</b> — no clock, take your time.',
    mount: function (root, api) {
      var r = rng(26), queue = [piece(r), piece(r), piece(r), piece(r)], board = []; for (var i = 0; i < 16; i++) board.push(null);
      var rs = rules(), lines = 0, placed = 0, over = false;
      var q = h('div', { class: 'row', style: 'align-items:center;gap:18px' }), stat = h('div', { class: 'stat' }), msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(4,1fr);max-width:320px' });
      root.appendChild(q); root.appendChild(stat); root.appendChild(grid); root.appendChild(msg);
      function pv(p, size) { return h('div', { style: 'width:' + size + 'px;height:' + size + 'px;display:grid;place-items:center;border-radius:12px;background:' + COL[p[0]], html: shape(p[1], 'none') }); }
      function draw() {
        q.innerHTML = ''; q.appendChild(h('div', { style: 'text-align:center;font-size:12px;color:var(--mut)' }, [pv(queue[0], 56), 'Now']));
        var nx = h('div', { style: 'text-align:center;font-size:12px;color:var(--mut)' }, [h('div', { style: 'display:flex;gap:6px' }, queue.slice(1).map(function (p) { return pv(p, 40); })), 'Next']); q.appendChild(nx);
        stat.innerHTML = '<span>Pieces <b>' + placed + '</b></span><span>Lines <b>' + lines + ' / ' + TARGET + '</b></span>';
        grid.innerHTML = '';
        for (var i = 0; i < 16; i++) (function (i) {
          var rule = rs[i], p = board[i], st = 'border-color:var(--line)';
          if (!p && rule !== '.' && 'BYC'.indexOf(rule) >= 0) st = 'border:2.5px solid ' + COL[rule];
          var cell = h('div', { class: 'cell', style: st, html: p ? '<div style="width:86%;height:86%;border-radius:10px;display:grid;place-items:center;background:' + COL[p[0]] + '">' + shape(p[1], 'none') + '</div>' : ('ost'.indexOf(rule) >= 0 ? '<span style="opacity:.45">' + shape(rule, 'none') + '</span>' : '') });
          cell.addEventListener('click', function () {
            if (over) return;
            if (board[i] || !fits(rs[i], queue[0])) { shake(cell); msg.textContent = 'That cell doesn’t take this piece.'; return; }
            msg.textContent = '';
            var n = placeAt(board, i, queue[0]); lines += n; placed++;
            queue.shift(); queue.push(piece(r)); draw();
            if (lines >= TARGET) { over = true; api.win(lines + ' lines cleared'); }
            else if (!anyFit(board, rs, queue[0])) { over = true; msg.className = 'msg bad'; msg.textContent = 'No cell takes this piece. Restart (↻).'; }
          });
          grid.appendChild(cell);
        })(i);
      }
      draw();
    } });
})();

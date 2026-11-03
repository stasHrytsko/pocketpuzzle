(function () {
  /* Parcels — one game, two rule sets on the same "frame, vanish, fall" idea.
     numbers: a frame holds exactly one number and its area equals it (solid cubes).
     pairs (formerly Cave In): a frame holds exactly one black + one white dot and no stones. */
  function copy(g) { return g.map(function (r) { return r.slice(); }); }
  function fall(g, r, c, h, w, fill) { var o = copy(g), n = g.length; for (var j = c; j < c + w; j++) { var col = []; for (var i = 0; i < n; i++) col.push(o[i][j]); var nc = col.slice(0, r).concat(col.slice(r + h)); while (nc.length < n) nc.unshift(fill); for (var k = 0; k < n; k++) o[k][j] = nc[k]; } return o; }
  function anyFrame(g, valid) { var n = g.length, m = g[0].length; for (var r = 0; r < n; r++) for (var c = 0; c < m; c++) for (var h = 1; r + h <= n; h++) for (var w = 1; c + w <= m; w++) if (valid(g, r, c, h, w)) return true; return false; }

  var NUM = {
    id: 'numbers', title: 'Parcels', START: ['2 0 0 2 0', '2 0 0 0 5', '0 0 3 0 3', '0 0 3 0 0', '0 0 5 0 0'].map(function (r) { return r.split(' ').map(Number); }),
    SOL: [[0, 0, 1, 2], [0, 3, 1, 2], [1, 0, 1, 2], [2, 0, 1, 3], [2, 2, 1, 3], [3, 2, 1, 3], [3, 0, 1, 5], [4, 0, 1, 5]],
    rules: '<b>Drag a frame</b> over cubes: it must hold exactly one number, and its area must equal that number. The parcel leaves and the cubes above it <b>drop</b>. Ship every cube.',
    valid: function (g, r, c, h, w) { var n = 0, num = 0; for (var i = r; i < r + h; i++) for (var j = c; j < c + w; j++) { if (g[i][j] === null) return false; if (g[i][j] > 0) { n++; num = g[i][j]; } } return n === 1 && num === h * w; },
    apply: function (g, r, c, h, w) { return fall(g, r, c, h, w, null); },
    done: function (g) { return g.every(function (r) { return r.every(function (v) { return v === null; }); }); },
    gap: 4, text: 'All parcels shipped', stuck: 'No parcel can be cut any more. Undo or restart.', bad: 'A parcel needs one number and that exact area.'
  };
  var PAIRS = {
    id: 'pairs', title: 'Pairs & stones', START: ['. W . . . .', 'S S S W S B', '. B . . W B', '. S B W B .', 'S . . . . .', '. . . . W .'].map(function (r) { return r.split(' '); }),
    SOL: [[2, 0, 1, 5], [0, 0, 2, 6], [3, 2, 1, 2], [3, 4, 3, 1], [0, 3, 4, 3]],
    rules: '<b>Drag a frame</b> around exactly one black and one white dot (no stones inside; empty cells are fine). The framed cells vanish and everything above them <b>falls</b>. Clear every dot — stones stay.',
    valid: function (g, r, c, h, w) { var b = 0, wh = 0, s = 0; for (var i = r; i < r + h; i++) for (var j = c; j < c + w; j++) { var v = g[i][j]; if (v === 'B') b++; else if (v === 'W') wh++; else if (v === 'S') s++; } return b === 1 && wh === 1 && s === 0; },
    apply: function (g, r, c, h, w) { return fall(g, r, c, h, w, '.'); },
    done: function (g) { return !g.some(function (r) { return r.some(function (v) { return v === 'B' || v === 'W'; }); }); },
    gap: 3, text: 'Every pair cleared', stuck: 'No pair can be framed any more. Undo or restart.', bad: 'A frame needs exactly one black + one white dot and no stones.'
  };
  var LEVELS = [NUM, PAIRS];
  LEVELS.forEach(function (L) { L.anyMove = function (g) { return anyFrame(g, L.valid); }; });
  var engine = { levels: LEVELS };

  Games.register({ id: 'parcels', total: 2, playable: 2, name: 'Parcels', color: COLORS.blue, icon: 's', engine: engine,
    rules: '',
    mount: function (root, api) {
      var L = LEVELS[api.level || 0], g = copy(L.START), hist = [], prev = null;
      var rulesEl = h('div', { class: 'rules', html: L.rules }), msg = h('div', { class: 'msg' });
      var n = g.length, m = g[0].length;
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(' + m + ',1fr);max-width:' + (m === 5 ? 320 : 340) + 'px;gap:' + (L.gap) + 'px' });
      root.appendChild(rulesEl); root.appendChild(grid); root.appendChild(msg);
      root.appendChild(h('div', { class: 'row' }, [h('button', { class: 'btn o s', onclick: function () { if (hist.length) { g = hist.pop(); msg.textContent = ''; msg.className = 'msg'; draw(); } } }, ['Undo'])]));
      function draw() {
        grid.innerHTML = '';
        var lo = prev ? [Math.min(prev[0][0], prev[1][0]), Math.min(prev[0][1], prev[1][1]), Math.max(prev[0][0], prev[1][0]), Math.max(prev[0][1], prev[1][1])] : null;
        for (var r = 0; r < n; r++) for (var c = 0; c < m; c++) {
          var v = g[r][c], pv = lo && r >= lo[0] && r <= lo[2] && c >= lo[1] && c <= lo[3], cls = 'cell', inner = '';
          if (L.id === 'numbers') { cls += v === null ? ' void' : ' c-butter'; if (v > 0) inner = String(v); }
          else { if (v === 'S') cls += ' wall'; if (v === 'B' || v === 'W') inner = h('span', { class: 'dot ' + (v === 'B' ? 'k' : 'w') }); }
          grid.appendChild(h('div', { class: cls + (pv && v !== null ? ' sel' : ''), 'data-r': r, 'data-c': c }, [inner]));
        }
      }
      rectDrag(grid, function (r1, c1, r2, c2) {
        var hh = r2 - r1 + 1, ww = c2 - c1 + 1;
        if (!L.valid(g, r1, c1, hh, ww)) { shake(grid); msg.className = 'msg'; msg.textContent = L.bad; return; }
        hist.push(g); g = L.apply(g, r1, c1, hh, ww); msg.className = 'msg'; msg.textContent = ''; draw();
        if (L.done(g)) api.win(L.text);
        else if (!L.anyMove(g)) { msg.className = 'msg bad'; msg.textContent = L.stuck; }
      }, function (a, b) { prev = a ? [a, b] : null; draw(); });
      draw();
    } });
})();

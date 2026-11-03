(function () {
  var START = ['. W . . . .', 'S S S W S B', '. B . . W B', '. S B W B .', 'S . . . . .', '. . . . W .'].map(function (r) { return r.split(' '); });
  var SOL = [[2, 0, 1, 5], [0, 0, 2, 6], [3, 2, 1, 2], [3, 4, 3, 1], [0, 3, 4, 3]];
  function copy(g) { return g.map(function (r) { return r.slice(); }); }
  function valid(g, r, c, h, w) { var b = 0, wh = 0, s = 0; for (var i = r; i < r + h; i++) for (var j = c; j < c + w; j++) { var v = g[i][j]; if (v === 'B') b++; else if (v === 'W') wh++; else if (v === 'S') s++; } return b === 1 && wh === 1 && s === 0; }
  function apply(g, r, c, h, w) { var o = copy(g); for (var j = c; j < c + w; j++) { var col = []; for (var i = 0; i < 6; i++) col.push(o[i][j]); var nc = col.slice(0, r).concat(col.slice(r + h)); while (nc.length < 6) nc.unshift('.'); for (var k = 0; k < 6; k++) o[k][j] = nc[k]; } return o; }
  function done(g) { return !g.some(function (r) { return r.some(function (v) { return v === 'B' || v === 'W'; }); }); }
  function anyMove(g) { for (var r = 0; r < 6; r++) for (var c = 0; c < 6; c++) for (var h = 1; r + h <= 6; h++) for (var w = 1; c + w <= 6; w++) if (valid(g, r, c, h, w)) return true; return false; }
  var engine = { START: START, SOL: SOL, valid: valid, apply: apply, done: done, anyMove: anyMove };
  Games.register({ id: 'cave-in', name: 'Cave In', color: COLORS.butter, icon: 's', engine: engine,
    rules: '<b>Drag a frame</b> around exactly one black and one white dot (no stones inside; empty cells are fine). The framed cells vanish and everything above them <b>falls</b>. Clear every dot — stones stay.',
    mount: function (root, api) {
      var g = copy(START), hist = [], prev = null, msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(6,1fr);max-width:340px;gap:3px' });
      root.appendChild(grid); root.appendChild(msg);
      root.appendChild(h('div', { class: 'row' }, [h('button', { class: 'btn o s', onclick: function () { if (hist.length) { g = hist.pop(); msg.textContent = ''; msg.className = 'msg'; draw(); } } }, ['Undo'])]));
      function draw() {
        grid.innerHTML = '';
        for (var r = 0; r < 6; r++) for (var c = 0; c < 6; c++) {
          var v = g[r][c], pv = prev && r >= prev[0][0] && r <= prev[1][0] && c >= prev[0][1] && c <= prev[1][1];
          var lo = prev ? [Math.min(prev[0][0], prev[1][0]), Math.min(prev[0][1], prev[1][1]), Math.max(prev[0][0], prev[1][0]), Math.max(prev[0][1], prev[1][1])] : null;
          pv = lo && r >= lo[0] && r <= lo[2] && c >= lo[1] && c <= lo[3];
          grid.appendChild(h('div', { class: 'cell' + (v === 'S' ? ' wall' : '') + (pv ? ' sel' : ''), 'data-r': r, 'data-c': c }, [v === 'B' || v === 'W' ? h('span', { class: 'dot ' + (v === 'B' ? 'k' : 'w') }) : '']));
        }
      }
      rectDrag(grid, function (r1, c1, r2, c2) {
        var hh = r2 - r1 + 1, ww = c2 - c1 + 1;
        if (!valid(g, r1, c1, hh, ww)) { shake(grid); msg.className = 'msg'; msg.textContent = 'A frame needs exactly one black + one white dot and no stones.'; return; }
        hist.push(g); g = apply(g, r1, c1, hh, ww); msg.textContent = ''; msg.className = 'msg'; draw();
        if (done(g)) api.win('Every pair cleared');
        else if (!anyMove(g)) { msg.className = 'msg bad'; msg.textContent = 'No pair can be framed any more. Undo or restart.'; }
      }, function (a, b) { prev = a ? [a, b] : null; draw(); });
      draw();
    } });
})();

(function () {
  var DIRS = { '^': [-1, 0], '>': [0, 1], 'v': [1, 0], '<': [0, -1] };
  var CW = { '^': '>', '>': 'v', 'v': '<', '<': '^' };
  var LEVEL = { size: 4, blocks: [
    { id: '0', row: 0, col: 0, dir: '>' }, { id: '1', row: 0, col: 1, dir: '>' }, { id: '2', row: 0, col: 2, dir: '^' },
    { id: '3', row: 1, col: 1, dir: '<' }, { id: '4', row: 1, col: 3, dir: '<' }, { id: '5', row: 2, col: 1, dir: '<' },
    { id: '6', row: 3, col: 0, dir: '^' }, { id: '7', row: 3, col: 1, dir: 'v' }] };
  function fresh() { return { size: LEVEL.size, blocks: LEVEL.blocks.map(function (b) { return { id: b.id, row: b.row, col: b.col, dir: b.dir }; }), moves: 0 }; }
  function at(s, r, c) { return s.blocks.filter(function (b) { return b.row === r && b.col === c; })[0]; }
  /* returns null if tap does nothing; otherwise applies move */
  function tap(s, id) {
    var b = s.blocks.filter(function (x) { return x.id === id; })[0]; if (!b) return null;
    var d = DIRS[b.dir], path = [[b.row, b.col]], r = b.row, c = b.col, exited = false;
    for (;;) {
      var nr = r + d[0], nc = c + d[1];
      if (nr < 0 || nc < 0 || nr >= s.size || nc >= s.size) { exited = true; break; }
      if (at(s, nr, nc)) break;
      r = nr; c = nc; path.push([r, c]);
    }
    if (!exited && path.length === 1) return null;
    var touched = {};
    path.forEach(function (p) { [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (q) { var o = at(s, p[0] + q[0], p[1] + q[1]); if (o && o !== b) touched[o.id] = 1; }); });
    s.blocks.forEach(function (o) { if (touched[o.id]) o.dir = CW[o.dir]; });
    if (exited) s.blocks = s.blocks.filter(function (o) { return o !== b; }); else { b.row = r; b.col = c; }
    s.moves++;
    return touched;
  }
  function hasMove(s) { return s.blocks.some(function (b) { var c = JSON.parse(JSON.stringify(s)); return tap(c, b.id) !== null; }); }
  var engine = { fresh: fresh, tap: tap, hasMove: hasMove, LEVEL: LEVEL };

  Games.register({ id: 'arrow-flip', name: 'Arrow Flip', color: COLORS.apr, icon: 's', engine: engine,
    rules: '<b>Tap a block</b> and it slides where its arrow points. Every block it brushes past turns 90° clockwise. Send all blocks off the board.',
    mount: function (root, api) {
      var s = fresh(), msg = h('div', { class: 'msg' }), stat = h('div', { class: 'stat' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(' + s.size + ',1fr);max-width:340px' });
      root.appendChild(stat); root.appendChild(grid); root.appendChild(msg);
      var CL = { '^': 'c-apr', '<': 'c-blue', '>': 'c-sage', 'v': 'c-butter' }, AR = { '^': '↑', '<': '←', '>': '→', 'v': '↓' };
      function draw(touched) {
        grid.innerHTML = ''; stat.innerHTML = '<span>Moves <b>' + s.moves + '</b></span><span>Blocks <b>' + s.blocks.length + '</b></span>';
        for (var r = 0; r < s.size; r++) for (var c = 0; c < s.size; c++) {
          var b = at(s, r, c), cell = h('div', { class: 'cell ' + (b ? CL[b.dir] : '') + (b && touched && touched[b.id] ? ' sel' : '') }, [b ? AR[b.dir] : '']);
          if (b) cell.addEventListener('click', (function (b, cell) { return function () {
            var t = tap(s, b.id);
            if (!t) { shake(cell); msg.textContent = 'Blocked — that block can’t move.'; return; }
            msg.textContent = ''; draw(t);
            if (!s.blocks.length) api.win('Cleared in ' + s.moves + ' moves');
            else if (!hasMove(s)) { msg.className = 'msg bad'; msg.textContent = 'No block can move. Restart (↻) and try another order.'; }
          }; })(b, cell));
          grid.appendChild(cell);
        }
      }
      draw();
    } });
})();

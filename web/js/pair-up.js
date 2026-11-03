(function () {
  var BOARD = ['. . . . . .', '. . B . . W', 'W . . W . .', '. B B B B .', '. . W . . B', '. . . W . W'].map(function (r) { return r.split(' '); });
  var SOL = [[0, 0, 6, 2], [0, 2, 3, 2], [0, 4, 4, 2], [3, 2, 3, 1], [3, 3, 3, 1], [4, 4, 2, 2]];
  function count(rect) { var b = 0, w = 0; for (var r = rect[0]; r < rect[0] + rect[2]; r++) for (var c = rect[1]; c < rect[1] + rect[3]; c++) { if (BOARD[r][c] === 'B') b++; if (BOARD[r][c] === 'W') w++; } return [b, w]; }
  function ok(rect) { var x = count(rect); return x[0] === 1 && x[1] === 1; }
  function inter(a, b) { return !(a[0] + a[2] <= b[0] || b[0] + b[2] <= a[0] || a[1] + a[3] <= b[1] || b[1] + b[3] <= a[1]); }
  function addRect(rects, rect) { return rects.filter(function (x) { return !inter(x, rect); }).concat([rect]); }
  function solved(rects) { var cov = 0; rects.forEach(function (x) { cov += x[2] * x[3]; }); return cov === 36 && rects.every(ok); }
  var engine = { BOARD: BOARD, SOL: SOL, ok: ok, addRect: addRect, solved: solved };
  Games.register({ id: 'pair-up', name: 'Pair Up', color: COLORS.sage, icon: 'o', engine: engine,
    rules: '<b>Drag</b> across the board to draw a rectangle. Cover the whole board with rectangles, each holding <b>exactly one black and one white dot</b>. A new rectangle replaces any it overlaps; <b>tap</b> a rectangle to remove it.',
    mount: function (root, api) {
      var rects = [], prev = null, msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(6,1fr);max-width:340px;gap:3px' });
      root.appendChild(grid); root.appendChild(msg);
      function rectAt(r, c) { return rects.filter(function (x) { return r >= x[0] && r < x[0] + x[2] && c >= x[1] && c < x[1] + x[3]; })[0]; }
      function draw() {
        grid.innerHTML = '';
        for (var r = 0; r < 6; r++) for (var c = 0; c < 6; c++) {
          var x = rectAt(r, c), bg = '', pv = prev && r >= Math.min(prev[0][0], prev[1][0]) && r <= Math.max(prev[0][0], prev[1][0]) && c >= Math.min(prev[0][1], prev[1][1]) && c <= Math.max(prev[0][1], prev[1][1]);
          var cell = h('div', { class: 'cell' + (x ? (ok(x) ? ' c-sage' : ' c-apr') : '') + (pv ? ' sel' : ''), 'data-r': r, 'data-c': c }, [BOARD[r][c] === '.' ? '' : h('span', { class: 'dot ' + (BOARD[r][c] === 'B' ? 'k' : 'w') })]);
          grid.appendChild(cell);
        }
      }
      rectDrag(grid, function (r1, c1, r2, c2) {
        if (r1 === r2 && c1 === c2) { var x = rectAt(r1, c1); if (x) { rects = rects.filter(function (y) { return y !== x; }); draw(); } return; }
        rects = addRect(rects, [r1, c1, r2 - r1 + 1, c2 - c1 + 1]); draw();
        var bad = rects.filter(function (x) { return !ok(x); }).length; msg.className = 'msg' + (bad ? ' bad' : ''); msg.textContent = bad ? 'Orange = not exactly one black + one white.' : '';
        if (solved(rects)) api.win('Every dot found its pair');
      }, function (a, b) { prev = a ? [a, b] : null; draw(); });
      draw();
    } });
})();

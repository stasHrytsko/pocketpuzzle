(function () {
  var MAP = ['  .  ', '.... ', ' ....'], NUMS = [5, 4];
  var PAL = ['c-apr', 'c-blue', 'c-sage', 'c-butter'];
  function connected(cells) {
    if (!cells.length) return false; var key = function (p) { return p[0] + ',' + p[1]; }, set = {}; cells.forEach(function (p) { set[key(p)] = 1; });
    var seen = {}, st = [cells[0]]; seen[key(cells[0])] = 1;
    while (st.length) { var p = st.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var q = [p[0] + d[0], p[1] + d[1]]; if (set[key(q)] && !seen[key(q)]) { seen[key(q)] = 1; st.push(q); } }); }
    return Object.keys(seen).length === cells.length;
  }
  /* shape = cells in builder (r,c); anchor = first in reading order; place at board cell (r,c) */
  function place(board, shapeCells, r, c) {
    var s = shapeCells.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }), a = s[0], out = [];
    for (var i = 0; i < s.length; i++) { var rr = r + s[i][0] - a[0], cc = c + s[i][1] - a[1]; if (board[rr] === undefined || board[rr][cc] !== 0) return null; out.push([rr, cc]); }
    return out;
  }
  function boardFrom(map) { return map.map(function (row) { return row.split('').map(function (ch) { return ch === '.' ? 0 : -1; }); }); }
  var engine = { connected: connected, place: place, boardFrom: boardFrom, MAP: MAP, NUMS: NUMS };
  Games.register({ id: 'perfect-fit', total: 50, playable: 1, name: 'Perfect Fit', color: COLORS.sage, icon: 'o', engine: engine,
    rules: '<b>Pick a number</b>, tap that many squares in the builder (they must touch), then <b>tap a board cell</b> to drop the piece (its first square lands there). Numbers add up to the board exactly — fill it.',
    mount: function (root, api) {
      var board = boardFrom(MAP), used = NUMS.map(function () { return false; }), sel = -1, built = {}, msg = h('div', { class: 'msg' });
      var chips = h('div', { class: 'chips' }), bgrid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(5,1fr);max-width:300px' });
      var builder = h('div', { class: 'grid', style: 'grid-template-columns:repeat(4,1fr);max-width:200px' });
      root.appendChild(bgrid); root.appendChild(msg); root.appendChild(chips);
      root.appendChild(h('div', { class: 'lbl', style: 'text-align:center' }, ['Builder']));
      root.appendChild(builder);
      root.appendChild(h('div', { class: 'row' }, [h('button', { class: 'btn o s', onclick: function () { built = {}; drawB(); } }, ['Clear'])]));
      function cells() { return Object.keys(built).map(function (k) { return k.split(',').map(Number); }); }
      function ready() { return sel >= 0 && cells().length === NUMS[sel] && connected(cells()); }
      function drawChips() { chips.innerHTML = ''; NUMS.forEach(function (n, i) { chips.appendChild(h('button', { class: 'chip' + (sel === i ? ' on' : '') + (used[i] ? ' used' : ''), onclick: function () { if (used[i]) return; sel = i; built = {}; drawB(); drawChips(); } }, [String(n)])); }); }
      function drawBoard() {
        bgrid.innerHTML = '';
        board.forEach(function (row, r) { row.forEach(function (v, c) {
          var cell = h('div', { class: 'cell' + (v === -1 ? ' void' : v > 0 ? ' ' + PAL[v - 1] : '') }, [v > 0 ? String(NUMS[v - 1]) : '']);
          cell.addEventListener('click', function () {
            if (!ready()) { msg.textContent = sel < 0 ? 'Pick a number first.' : 'Build a connected piece of ' + NUMS[sel] + ' squares.'; return; }
            var p = place(board, cells(), r, c);
            if (!p) { shake(cell); msg.textContent = 'It doesn’t fit there.'; return; }
            p.forEach(function (q) { board[q[0]][q[1]] = sel + 1; }); used[sel] = true; sel = -1; built = {}; msg.textContent = '';
            drawBoard(); drawChips(); drawB();
            if (!board.some(function (rw) { return rw.some(function (x) { return x === 0; }); })) api.win('Board filled'); 
          });
          bgrid.appendChild(cell);
        }); });
      }
      function drawB() {
        builder.innerHTML = '';
        for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) (function (r, c) {
          var k = r + ',' + c, cell = h('div', { class: 'cell' + (built[k] ? ' ' + (sel >= 0 ? PAL[sel] : 'c-sage') : '') });
          cell.addEventListener('click', function () {
            if (sel < 0) { msg.textContent = 'Pick a number first.'; return; }
            if (built[k]) delete built[k]; else if (cells().length < NUMS[sel]) built[k] = 1; drawB();
          });
          builder.appendChild(cell);
        })(r, c);
      }
      drawBoard(); drawChips(); drawB();
    } });
})();

(function () {
  var BOARD = ['B B G', '. . R', 'R G .'].map(function (r) { return r.split(' '); });
  var COL = { B: COLORS.blue, G: COLORS.sage, R: COLORS.apr }, KEEP = [[0, 0], [1, 2], [2, 1]];
  function conflicts(a, b) { return a[0] === b[0] || a[1] === b[1] || BOARD[a[0]][a[1]] === BOARD[b[0]][b[1]]; }
  function solved(sel) { if (sel.length !== 3) return false; for (var i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) if (conflicts(sel[i], sel[j])) return false; return true; }
  var engine = { BOARD: BOARD, KEEP: KEEP, conflicts: conflicts, solved: solved };
  Games.register({ id: 'one-each', name: 'One Each', color: COLORS.blue, icon: 'o', engine: engine,
    rules: '<b>Tap marbles to keep them.</b> Keep exactly 3: one in every row, one in every column and one of every colour. Marbles that clash with a kept one fade.',
    mount: function (root, api) {
      var sel = [], msg = h('div', { class: 'msg' }), grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(3,1fr);max-width:260px;gap:8px' });
      root.appendChild(grid); root.appendChild(msg);
      function has(r, c) { return sel.some(function (p) { return p[0] === r && p[1] === c; }); }
      function draw() {
        grid.innerHTML = '';
        for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) (function (r, c) {
          var v = BOARD[r][c], kept = has(r, c), dim = v !== '.' && !kept && sel.some(function (p) { return conflicts(p, [r, c]); });
          var cell = h('div', { class: 'cell' + (dim ? ' dim' : ''), style: kept ? 'border-color:var(--ink);border-width:3px' : '', html: v === '.' ? '' : '<span class="dot" style="width:64%;height:64%;background:' + COL[v] + ';border:2px solid #2f3a26"></span>' });
          if (v !== '.') cell.addEventListener('click', function () {
            if (kept) sel = sel.filter(function (p) { return !(p[0] === r && p[1] === c); }); else sel.push([r, c]);
            draw(); var bad = sel.length > 1 && sel.some(function (a, i) { return sel.some(function (b, j) { return i < j && conflicts(a, b); }); });
            msg.className = 'msg' + (bad ? ' bad' : ''); msg.textContent = bad ? 'Two kept marbles share a row, column or colour.' : '';
            if (solved(sel)) api.win('One of each — row, column and colour');
          });
          grid.appendChild(cell);
        })(r, c);
      }
      draw();
    } });
})();

(function () {
  /* One Each — sliding marbles (like the 15-puzzle). Win: in every row and every column no colour repeats. */
  var N = 3, START = [0, 1, 1, 2, 3, 1, 2, 2, 0], SOL = [[1, 0], [4, 1], [3, 4], [0, 3], [1, 0], [2, 1], [5, 8], [4, 5], [5, 2], [7, 4]];
  var COL = { 1: COLORS.blue, 2: COLORS.apr, 3: COLORS.sage }, SH = { 1: 'o', 2: 't', 3: 's' };
  function fresh() { return START.slice(); }
  function adjacent(i, j) { var r1 = Math.floor(i / N), c1 = i % N, r2 = Math.floor(j / N), c2 = j % N; return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1; }
  function move(s, i, j) { if (!s[i] || s[j] || !adjacent(i, j)) return false; s[j] = s[i]; s[i] = 0; return true; }
  function lines() { var L = []; for (var r = 0; r < N; r++) { var a = [], b = []; for (var c = 0; c < N; c++) { a.push(r * N + c); b.push(c * N + r); } L.push(a, b); } return L; }
  var LINES = lines();
  function conflicts(s) { var bad = {}; LINES.forEach(function (L) { var seen = {}; L.forEach(function (i) { if (!s[i]) return; (seen[s[i]] = seen[s[i]] || []).push(i); }); Object.keys(seen).forEach(function (k) { if (seen[k].length > 1) seen[k].forEach(function (i) { bad[i] = 1; }); }); }); return bad; }
  function won(s) { return Object.keys(conflicts(s)).length === 0; }
  var engine = { fresh: fresh, move: move, won: won, conflicts: conflicts, SOL: SOL, START: START, N: N };
  Games.register({ id: 'one-each', total: 1, playable: 1, name: 'One Each', color: COLORS.blue, icon: 'o', engine: engine,
    rules: '<b>Drag a marble</b> into a free neighbouring cell (like the 15-puzzle; a tap also works when only one cell is free). Arrange them so <b>no colour repeats in any row or column</b>. Marbles that still clash are outlined.',
    mount: function (root, api) {
      var s = fresh(), hist = [], moves = 0, msg = h('div', { class: 'msg' }), stat = h('div', { class: 'stat' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(3,1fr);max-width:270px;gap:8px;touch-action:none' });
      root.appendChild(stat); root.appendChild(grid); root.appendChild(msg);
      root.appendChild(h('div', { class: 'row' }, [h('button', { class: 'btn o s', onclick: function () { if (hist.length) { s = hist.pop(); moves--; msg.textContent = ''; draw(); } } }, ['Undo'])]));
      function empties(i) { var r = Math.floor(i / N), c = i % N, out = []; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var rr = r + d[0], cc = c + d[1]; if (rr >= 0 && cc >= 0 && rr < N && cc < N && !s[rr * N + cc]) out.push(rr * N + cc); }); return out; }
      function go(i, j, cell) {
        var prev = s.slice(); if (!move(s, i, j)) { if (cell) shake(cell); msg.textContent = 'Drag it into a free cell next to it.'; return; }
        hist.push(prev); moves++; msg.textContent = ''; draw(); if (won(s)) api.win('No repeats in any row or column — ' + moves + ' moves');
      }
      function draw() {
        stat.innerHTML = '<span>Moves <b>' + moves + '</b></span>'; grid.innerHTML = ''; var bad = conflicts(s);
        for (var i = 0; i < N * N; i++) (function (i) {
          var v = s[i], cell = h('div', { class: 'cell', 'data-i': i });
          if (v) {
            var m = h('div', { style: 'width:82%;height:82%;border-radius:50%;display:grid;place-items:center;cursor:grab;touch-action:none;background:' + COL[v] + ';border:2.5px solid ' + (bad[i] ? '#b0603a' : '#2f3a26'), html: shape(SH[v], 'none') });
            var sx, sy, on = false;
            m.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; on = true; m.style.zIndex = 5; try { m.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
            m.addEventListener('pointermove', function (e) { if (!on) return; m.style.transform = 'translate(' + (e.clientX - sx) + 'px,' + (e.clientY - sy) + 'px)'; });
            function end(e) {
              if (!on) return; on = false; m.style.transform = ''; m.style.zIndex = '';
              var dx = e.clientX - sx, dy = e.clientY - sy, d = Math.max(Math.abs(dx), Math.abs(dy)), r = Math.floor(i / N), c = i % N;
              if (d < 10) { var em = empties(i); if (em.length === 1) go(i, em[0], cell); else { shake(cell); msg.textContent = em.length ? 'Drag it to the free cell you want.' : 'No free cell next to it.'; } return; }
              var j = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? (c < N - 1 ? i + 1 : -1) : (c > 0 ? i - 1 : -1)) : (dy > 0 ? (r < N - 1 ? i + N : -1) : (r > 0 ? i - N : -1));
              if (j < 0) { shake(cell); return; } go(i, j, cell);
            }
            m.addEventListener('pointerup', end); m.addEventListener('pointercancel', function () { on = false; m.style.transform = ''; });
            cell.appendChild(m);
          }
          grid.appendChild(cell);
        })(i);
      }
      draw();
    } });
})();

(function () {
  var START = ['2 0 0 2 0', '2 0 0 0 5', '0 0 3 0 3', '0 0 3 0 0', '0 0 5 0 0'].map(function (r) { return r.split(' ').map(Number); });
  var SOL = [[0, 0, 1, 2], [0, 3, 1, 2], [1, 0, 1, 2], [2, 0, 1, 3], [2, 2, 1, 3], [3, 2, 1, 3], [3, 0, 1, 5], [4, 0, 1, 5]];
  function copy(g) { return g.map(function (r) { return r.slice(); }); }
  function valid(g, r, c, h, w) { var n = 0, num = 0; for (var i = r; i < r + h; i++) for (var j = c; j < c + w; j++) { if (g[i][j] === null) return false; if (g[i][j] > 0) { n++; num = g[i][j]; } } return n === 1 && num === h * w; }
  function apply(g, r, c, h, w) { var o = copy(g); for (var j = c; j < c + w; j++) { var col = []; for (var i = 0; i < 5; i++) col.push(o[i][j]); var nc = col.slice(0, r).concat(col.slice(r + h)); while (nc.length < 5) nc.unshift(null); for (var k = 0; k < 5; k++) o[k][j] = nc[k]; } return o; }
  function done(g) { return g.every(function (r) { return r.every(function (v) { return v === null; }); }); }
  function anyMove(g) { for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) for (var h = 1; r + h <= 5; h++) for (var w = 1; c + w <= 5; w++) if (valid(g, r, c, h, w)) return true; return false; }
  var engine = { START: START, SOL: SOL, valid: valid, apply: apply, done: done, anyMove: anyMove };
  Games.register({ id: 'parcels', name: 'Parcels', color: COLORS.blue, icon: 's', engine: engine,
    rules: '<b>Drag a frame</b> over cubes: it must hold exactly one number, and its area must equal that number. The parcel leaves and the cubes above it <b>drop</b>. Ship every cube.',
    mount: function (root, api) {
      var g = copy(START), hist = [], prev = null, msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(5,1fr);max-width:320px;gap:4px' });
      root.appendChild(grid); root.appendChild(msg);
      root.appendChild(h('div', { class: 'row' }, [h('button', { class: 'btn o s', onclick: function () { if (hist.length) { g = hist.pop(); msg.textContent = ''; msg.className = 'msg'; draw(); } } }, ['Undo'])]));
      function draw() {
        grid.innerHTML = '';
        var lo = prev ? [Math.min(prev[0][0], prev[1][0]), Math.min(prev[0][1], prev[1][1]), Math.max(prev[0][0], prev[1][0]), Math.max(prev[0][1], prev[1][1])] : null;
        for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) {
          var v = g[r][c], pv = lo && r >= lo[0] && r <= lo[2] && c >= lo[1] && c <= lo[3];
          grid.appendChild(h('div', { class: 'cell' + (v === null ? ' void' : ' c-butter') + (pv && v !== null ? ' sel' : ''), 'data-r': r, 'data-c': c }, [v > 0 ? String(v) : '']));
        }
      }
      rectDrag(grid, function (r1, c1, r2, c2) {
        var hh = r2 - r1 + 1, ww = c2 - c1 + 1;
        if (!valid(g, r1, c1, hh, ww)) { shake(grid); msg.textContent = 'A parcel needs one number and that exact area.'; return; }
        hist.push(g); g = apply(g, r1, c1, hh, ww); msg.className = 'msg'; msg.textContent = ''; draw();
        if (done(g)) api.win('All parcels shipped');
        else if (!anyMove(g)) { msg.className = 'msg bad'; msg.textContent = 'No parcel can be cut any more. Undo or restart.'; }
      }, function (a, b) { prev = a ? [a, b] : null; draw(); });
      draw();
    } });
})();

(function () {
  var N = 5, BLOCKS = [[4, 1, "r"], [4, 3, "r"], [1, 0, "y"], [0, 2, "r"], [3, 2, "y"], [3, 0, "r"], [1, 4, "b"], [1, 2, "y"], [3, 3, "b"], [2, 0, "b"], [1, 1, "b"], [2, 2, "r"], [0, 0, "b"], [0, 1, "y"], [0, 3, "y"], [4, 0, "r"], [1, 3, "b"]]; /* [row, col, colour r|b|y] */
  var GOALS = [["b", "bottom", 1, 9, 0], ["r", "right", 3, 7, 1], ["r", "bottom", 4, 7, 2]]; /* [colour, side, index, countdown, unlockAfterServed] */
  var CL = { r: 'c-apr', b: 'c-blue', y: 'c-butter' };
  var D = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
  function cellOf(g) { var s = g.side, i = g.index; return s === 'bottom' ? [N - 1, i] : s === 'top' ? [0, i] : s === 'left' ? [i, 0] : [i, N - 1]; }
  function fresh() {
    var s = { blocks: BLOCKS.map(function (b, i) { return { id: i, row: b[0], col: b[1], color: b[2] }; }), goals: GOALS.map(function (g, i) { return { id: i, color: g[0], side: g[1], index: g[2], init: g[3], unlock: g[4], countdown: g[3], status: 'queued' }; }), moves: 0, served: 0, status: 'playing' };
    activate(s); return s;
  }
  function at(s, r, c) { return s.blocks.filter(function (b) { return b.row === r && b.col === c; })[0]; }
  function serveAt(s, g) { var p = cellOf(g), b = at(s, p[0], p[1]); if (b && b.color === g.color) { s.blocks = s.blocks.filter(function (x) { return x !== b; }); g.status = 'served'; s.served++; return true; } return false; }
  function activate(s) {
    for (var again = true; again;) {
      again = false;
      s.goals.forEach(function (g) { if (g.status === 'queued' && g.unlock <= s.served) { g.status = 'waiting'; g.countdown = g.init; if (serveAt(s, g)) again = true; } });
    }
    if (s.goals.every(function (g) { return g.status === 'served'; })) s.status = 'won';
  }
  function move(s, id, dir) {
    if (s.status !== 'playing') return false;
    var b = s.blocks.filter(function (x) { return x.id === id; })[0]; if (!b) return false;
    var nr = b.row + D[dir][0], nc = b.col + D[dir][1];
    if (nr < 0 || nc < 0 || nr >= N || nc >= N || at(s, nr, nc)) return false;
    b.row = nr; b.col = nc; s.moves++;
    var closed = {};
    s.goals.forEach(function (g) { if (g.status === 'waiting' && serveAt(s, g)) closed[g.id] = 1; });
    s.goals.forEach(function (g) { if (g.status === 'waiting' && !closed[g.id]) g.countdown--; });
    if (s.goals.some(function (g) { return g.status === 'waiting' && g.countdown <= 0; })) { s.status = 'failed'; return true; }
    activate(s); return true;
  }
  var engine = { fresh: fresh, move: move, N: N };
  Games.register({ id: 'slide-out', name: 'Slide Out', color: COLORS.blue, icon: 's', engine: engine,
    rules: '<b>Swipe a tile</b> into a neighbouring empty cell. When a tile stands on the edge cell next to a waiting goal of its colour, it slides out. Every move ticks all other goals down — don’t let one reach 0.',
    mount: function (root, api) {
      var s = fresh(), stat = h('div', { class: 'stat' }), msg = h('div', { class: 'msg' });
      var gw = h('div', { class: 'gw', style: 'max-width:320px;margin:38px auto' }), grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(5,1fr);margin:0;gap:5px' });
      gw.appendChild(grid); root.appendChild(stat); root.appendChild(gw); root.appendChild(msg);
      function draw() {
        stat.innerHTML = '<span>Moves <b>' + s.moves + '</b></span><span>Goals <b>' + s.served + ' / ' + s.goals.length + '</b></span>';
        grid.innerHTML = ''; gw.querySelectorAll('.badge').forEach(function (e) { e.remove(); });
        for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) (function (r, c) {
          var b = at(s, r, c), cell = h('div', { class: 'cell' + (b ? ' ' + CL[b.color] : '') });
          if (b) swipeable(cell, function (dir) {
            if (!move(s, b.id, dir)) { shake(cell); msg.textContent = 'There’s no free cell that way.'; return; }
            msg.textContent = ''; draw();
            if (s.status === 'won') api.win('All goals served in ' + s.moves + ' moves');
            if (s.status === 'failed') { msg.className = 'msg bad'; msg.textContent = 'A goal ran out of time. Restart (↻).'; }
          });
          grid.appendChild(cell);
        })(r, c);
        s.goals.forEach(function (g) {
          if (g.status === 'served') return;
          var p = cellOf(g), x = p[1] + .5, y = p[0] + .5;
          if (g.side === 'bottom') y = N + .35; if (g.side === 'top') y = -.35; if (g.side === 'left') x = -.35; if (g.side === 'right') x = N + .35;
          var waiting = g.status === 'waiting';
          gw.appendChild(h('div', { class: 'badge ' + CL[g.color], style: 'left:' + (x / N * 100) + '%;top:' + (y / N * 100) + '%;opacity:' + (waiting ? 1 : .45) + (g.countdown <= 2 && waiting ? ';border-color:#b0603a' : '') }, [waiting ? String(g.countdown) : '·']));
        });
      }
      draw();
    } });
})();

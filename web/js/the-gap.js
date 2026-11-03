(function () {
  var LV = { w: 3, h: 3, exits: [{ x: 0, y: 2, dx: -1, dy: 0 }, { x: 2, y: 0, dx: 0, dy: -1 }, { x: 0, y: 1, dx: -1, dy: 0 }, { x: 0, y: 0, dx: 0, dy: -1 }],
    caps: [2, 2, 2, 2], field: [0, 2, 2, 0, 0, 0, 0, 0, 0], flasks: [[], [1], [], [1]], opt: 7,
    solution: [{ type: 'swipe', x: 1, y: 0, dir: 'down' }, { type: 'swipe', x: 2, y: 0, dir: 'down' }, { type: 'swipe', x: 1, y: 2, dir: 'left' }, { type: 'swipe', x: 2, y: 2, dir: 'left' }, { type: 'tap-flask', n: 2 }, { type: 'swipe', x: 2, y: 0, dir: 'left' }, { type: 'swipe', x: 0, y: 0, dir: 'up' }] };
  var D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  function fresh() { return { field: LV.field.slice(), flasks: LV.flasks.map(function (f) { return f.slice(); }), moves: 0 }; }
  function exitAt(x, y) { for (var i = 0; i < LV.exits.length; i++) if (LV.exits[i].x === x && LV.exits[i].y === y) return i; return -1; }
  function swipe(s, x, y, dir) {
    var col = s.field[y * LV.w + x]; if (col <= 0) return false;
    var d = D[dir], cx = x, cy = y, moved = false;
    for (;;) {
      var ei = exitAt(cx, cy);
      if (ei >= 0 && LV.exits[ei].dx === d[0] && LV.exits[ei].dy === d[1] && s.flasks[ei].length < LV.caps[ei]) { s.field[cy * LV.w + cx] = 0; s.flasks[ei].push(col); s.moves++; return true; }
      var nx = cx + d[0], ny = cy + d[1];
      if (nx < 0 || ny < 0 || nx >= LV.w || ny >= LV.h || s.field[ny * LV.w + nx] !== 0) break;
      s.field[cy * LV.w + cx] = 0; s.field[ny * LV.w + nx] = col; cx = nx; cy = ny; moved = true;
    }
    if (moved) s.moves++; return moved;
  }
  function tapFlask(s, i) {
    var e = LV.exits[i]; if (!s.flasks[i].length || s.field[e.y * LV.w + e.x] !== 0) return false;
    s.field[e.y * LV.w + e.x] = s.flasks[i].pop(); s.moves++; return true;
  }
  function won(s) {
    if (s.field.some(function (v) { return v > 0; })) return false; var where = {};
    for (var i = 0; i < s.flasks.length; i++) { var f = s.flasks[i]; if (!f.length) continue; if (f.some(function (v) { return v !== f[0]; })) return false; if (where[f[0]] !== undefined) return false; where[f[0]] = i; }
    return true;
  }
  var engine = { fresh: fresh, swipe: swipe, tapFlask: tapFlask, won: won, LV: LV };
  var CN = { 1: COLORS.blue, 2: COLORS.apr }, SH = { 1: 'o', 2: 't' };
  Games.register({ id: 'the-gap', name: 'The Gap', color: COLORS.butter, icon: 't', engine: engine,
    rules: '<b>Swipe a square</b> — it slides until it hits something. A square reaching an exit cell and moving toward the gap drops into that numbered flask. <b>Tap a flask</b> to take its top square back out (the exit cell must be free). Sort so every colour sits alone in one flask.',
    mount: function (root, api) {
      var s = fresh(), stat = h('div', { class: 'stat' }), msg = h('div', { class: 'msg' });
      var gw = h('div', { class: 'gw', style: 'max-width:300px;margin:34px auto 22px' }), grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(' + LV.w + ',1fr);margin:0' });
      var fl = h('div', { class: 'flasks' });
      gw.appendChild(grid); root.appendChild(stat); root.appendChild(gw); root.appendChild(fl); root.appendChild(msg);
      function draw() {
        stat.innerHTML = '<span>Moves <b>' + s.moves + '</b></span><span>Best <b>' + LV.opt + '</b></span>';
        grid.innerHTML = ''; gw.querySelectorAll('.badge').forEach(function (b) { b.remove(); });
        for (var y = 0; y < LV.h; y++) for (var x = 0; x < LV.w; x++) (function (x, y) {
          var v = s.field[y * LV.w + x], cell = h('div', { class: 'cell' + (v === -1 ? ' wall' : v > 0 ? ' ' + (v === 1 ? 'c-blue' : 'c-apr') : '') }, [v > 0 ? h('span', { html: shape(SH[v], 'none') }) : '']);
          if (v > 0) swipeable(cell, function (dir) { if (!swipe(s, x, y, dir)) { shake(cell); msg.textContent = 'That square can’t move that way.'; return; } msg.textContent = ''; draw(); if (won(s)) api.win('Sorted in ' + s.moves + ' moves (best ' + LV.opt + ')'); });
          grid.appendChild(cell);
        })(x, y);
        LV.exits.forEach(function (e, i) {
          var b = h('div', { class: 'badge', style: 'left:' + ((e.x + .5 + e.dx * .62) / LV.w * 100) + '%;top:' + ((e.y + .5 + e.dy * .62) / LV.h * 100) + '%' }, [String(i + 1)]); gw.appendChild(b);
        });
        fl.innerHTML = '';
        LV.caps.forEach(function (cap, i) {
          var f = h('div', { class: 'flask', onclick: function () { if (!tapFlask(s, i)) { shake(f); msg.textContent = 'Can’t take it out: flask empty or exit cell busy.'; return; } msg.textContent = ''; draw(); } }, [h('div', { class: 'n' }, [String(i + 1)])]);
          for (var k = 0; k < cap; k++) { var v = s.flasks[i][k]; f.appendChild(h('div', { class: 'slot' + (v ? ' f c-' + (v === 1 ? 'blue' : 'apr') : ''), html: v ? shape(SH[v], 'none') : '' })); }
          fl.appendChild(f);
        });
      }
      draw();
    } });
})();

(function () {
  var MAP = ['# . C . . .', 'A . . . . .', '. . . . . .', '. . B . . #', '. . . . . #', '. . D . . .'].map(function (r) { return r.split(' '); });
  var SIZE = { A: 2, B: 13, C: 8, D: 10 }, SOL = 'BCCADDBDBBBC'.split('');
  var CL = { A: 'c-sage', B: 'c-apr', C: 'c-blue', D: 'c-butter' };
  function fresh() { var own = {}; MAP.forEach(function (row, r) { row.forEach(function (v, c) { if ('ABCD'.indexOf(v) >= 0) own[r + ',' + c] = v; }); }); return own; }
  function click(own, t) {
    var n = {}, any = false;
    Object.keys(own).forEach(function (k) { if (own[k] !== t) return; var p = k.split(',').map(Number);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var r = p[0] + d[0], c = p[1] + d[1], kk = r + ',' + c; if (r < 0 || c < 0 || r > 5 || c > 5 || MAP[r][c] === '#' || own[kk]) return; n[kk] = t; any = true; }); });
    if (!any) return null; var o = {}; for (var k in own) o[k] = own[k]; for (var k2 in n) o[k2] = n[k2]; return o;
  }
  function counts(own) { var c = { A: 0, B: 0, C: 0, D: 0 }; for (var k in own) c[own[k]]++; return c; }
  function over(own) { var c = counts(own); return Object.keys(SIZE).some(function (t) { return c[t] > SIZE[t]; }); }
  function total() { var n = 0; MAP.forEach(function (r) { r.forEach(function (v) { if (v !== '#') n++; }); }); return n; }
  function won(own) { var c = counts(own); return Object.keys(own).length === total() && Object.keys(SIZE).every(function (t) { return c[t] === SIZE[t]; }); }
  var engine = { fresh: fresh, click: click, counts: counts, over: over, won: won, SOL: SOL, SIZE: SIZE };
  Games.register({ id: 'outgrow', total: 1, playable: 1, name: 'Outgrow', color: COLORS.sage, icon: 'o', engine: engine,
    rules: '<b>Tap a territory</b> and it grows one full layer into every free neighbouring cell. Each must end up exactly its target size (shown as <i>now / need</i>) with no free cells left. Territories and walls stop growth — grow one to keep another from overgrowing.',
    mount: function (root, api) {
      var own = fresh(), hist = [], msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(6,1fr);max-width:340px;gap:4px' });
      root.appendChild(grid); root.appendChild(msg);
      root.appendChild(h('div', { class: 'row' }, [h('button', { class: 'btn o s', onclick: function () { if (hist.length) { own = hist.pop(); msg.textContent = ''; msg.className = 'msg'; draw(); } } }, ['Undo'])]));
      function draw() {
        grid.innerHTML = ''; var cn = counts(own);
        for (var r = 0; r < 6; r++) for (var c = 0; c < 6; c++) (function (r, c) {
          var k = r + ',' + c, t = own[k], seed = MAP[r][c] !== '#' && MAP[r][c] !== '.';
          var cell = h('div', { class: 'cell' + (MAP[r][c] === '#' ? ' wall' : t ? ' ' + CL[t] : ''), style: 'font-size:13px;font-weight:600;color:#2f3a26' }, [seed ? cn[t] + '/' + SIZE[t] : '']);
          if (t) cell.addEventListener('click', function () {
            var n = click(own, t); if (!n) { shake(cell); msg.textContent = 'No free neighbour to grow into.'; return; }
            hist.push(own); own = n; msg.textContent = ''; msg.className = 'msg'; draw();
            if (over(own)) { msg.className = 'msg bad'; msg.textContent = 'A territory overgrew. Undo.'; }
            else if (won(own)) api.win('Every territory grew to size');
          });
          grid.appendChild(cell);
        })(r, c);
      }
      draw();
    } });
})();

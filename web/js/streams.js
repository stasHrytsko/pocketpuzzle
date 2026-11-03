(function () {
  var N = 5, S = [3, 3], P = [4, 2], A = [4, 1], B = [3, 2], F1 = [4, 0], F2 = [4, 4], BUDGET = 12;
  var DROPS = { '0,1': 5, '3,0': 3, '3,4': 5 };
  var k = function (p) { return p[0] + ',' + p[1]; }, eq = function (a, b) { return a && b && a[0] === b[0] && a[1] === b[1]; };
  function adj(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1; }
  function fresh() { var v = {}; v[k(S)] = 1; return { vis: v, trunk: [S], b1: [], b2: [], budget: BUDGET, forked: false, sel: 1 }; }
  function clone(s) { return JSON.parse(JSON.stringify(s)); }
  function tip(s, w) { return w === 1 ? (s.b1.length ? s.b1[s.b1.length - 1] : P) : (s.b2.length ? s.b2[s.b2.length - 1] : P); }
  function spend(s, cell) { s.budget = s.budget - 1 + (DROPS[k(cell)] || 0); s.vis[k(cell)] = 1; }
  /* try to extend with cell; returns new state or null */
  function extend(s0, cell) {
    var s = clone(s0); if (s.budget <= 0 || s.vis[k(cell)] || cell[0] < 0 || cell[1] < 0 || cell[0] >= N || cell[1] >= N) return null;
    if (!s.forked) {
      var t = s.trunk[s.trunk.length - 1]; if (!adj(t, cell) || eq(cell, F1) || eq(cell, F2) || eq(cell, A) || eq(cell, B)) return null;
      s.trunk.push(cell); spend(s, cell); if (eq(cell, P)) s.forked = true; return s;
    }
    var order = s.sel === 1 ? [1, 2] : [2, 1];
    for (var i = 0; i < 2; i++) {
      var w = order[i], t2 = tip(s, w), fin = w === 1 ? F1 : F2, other = w === 1 ? F2 : F1, first = w === 1 ? A : B, lst = w === 1 ? s.b1 : s.b2;
      if (lst.length && eq(lst[lst.length - 1], fin)) continue;
      if (!adj(t2, cell) || eq(cell, other)) continue;
      if (!lst.length && !eq(cell, first)) continue;
      if (!lst.length && eq(cell, (w === 1 ? B : A))) continue;
      lst.push(cell); spend(s, cell); s.sel = w; return s;
    }
    return null;
  }
  function undo(s) { /* retract last cell of selected branch / trunk — implemented by history in UI */ return s; }
  function won(s) { return Object.keys(s.vis).length === N * N && s.b1.length && eq(s.b1[s.b1.length - 1], F1) && s.b2.length && eq(s.b2[s.b2.length - 1], F2); }
  var engine = { fresh: fresh, extend: extend, won: won, BUDGET: BUDGET };
  var C1 = '#E8B093', C2 = '#AECAD1';
  Games.register({ id: 'streams', total: 1, playable: 1, name: 'Streams', color: COLORS.blue, icon: 't', engine: engine,
    rules: '<b>Tap the next cell</b> to extend the line from the start <b>S</b> to the fork <b>P</b>, then grow both branches (the arrows show where each begins) to their own finish ring. Cover <b>every cell</b>. One shared budget of moves; each step costs 1, a <b>+N</b> drop gives N back. Branches can be advanced in any order — you will need to alternate.',
    mount: function (root, api) {
      var s = fresh(), hist = [], stat = h('div', { class: 'stat' }), msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(5,1fr);max-width:320px;gap:4px' });
      root.appendChild(stat); root.appendChild(grid); root.appendChild(msg);
      root.appendChild(h('div', { class: 'row' }, [h('button', { class: 'btn o s', onclick: function () { if (hist.length) { s = hist.pop(); msg.textContent = ''; msg.className = 'msg'; draw(); } } }, ['Undo'])]));
      function draw() {
        stat.innerHTML = '<span>Moves left <b>' + s.budget + '</b></span><span>Cells <b>' + Object.keys(s.vis).length + ' / 25</b></span>';
        grid.innerHTML = '';
        for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) (function (r, c) {
          var cell = [r, c], key = k(cell), lbl = '', st = '';
          if (s.trunk.some(function (p) { return eq(p, cell); })) st = 'background:#cfd6bd;border-color:#cfd6bd';
          if (s.b1.some(function (p) { return eq(p, cell); })) st = 'background:' + C1 + ';border-color:' + C1;
          if (s.b2.some(function (p) { return eq(p, cell); })) st = 'background:' + C2 + ';border-color:' + C2;
          if (eq(cell, S)) lbl = 'S'; else if (eq(cell, P)) lbl = 'P'; else if (eq(cell, A)) lbl = '←'; else if (eq(cell, B)) lbl = '↑'; else if (eq(cell, F1)) lbl = '◎1'; else if (eq(cell, F2)) lbl = '◎2'; else if (DROPS[key]) lbl = '+' + DROPS[key];
          var cur = (!s.forked && eq(cell, s.trunk[s.trunk.length - 1])) ? ' sel' : '';
          var el = h('div', { class: 'cell' + cur, style: st + ';font-size:15px;font-weight:600' }, [lbl]);
          el.addEventListener('click', function () {
            var n = extend(s, cell); if (!n) { shake(el); msg.textContent = s.budget <= 0 ? 'No moves left.' : 'Can’t extend there — tap a free cell next to a line end.'; return; }
            hist.push(s); s = n; msg.textContent = ''; msg.className = 'msg'; draw();
            if (won(s)) api.win('All 25 cells covered');
            else if (s.budget <= 0) { msg.className = 'msg bad'; msg.textContent = 'Out of moves. Undo or restart.'; }
          });
          grid.appendChild(el);
        })(r, c);
      }
      draw();
    } });
})();

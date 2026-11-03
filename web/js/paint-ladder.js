(function () {
  var PAINT = { 1: { 0: 'R', 1: 'G' }, 2: { 1: 'R', 2: 'R' }, 3: { 0: 'G', 2: 'R' }, 4: { 0: 'R', 3: 'Y' }, 5: { 1: 'R', 2: 'Y' }, 6: { 1: 'B', 2: 'Y' }, 7: {} };
  var START = ['G', 'R', 'B', 'Y'], GOAL = ['R', 'Y', 'B', 'B'], MOVES = 7;
  var CL = { R: 'c-apr', B: 'c-blue', G: 'c-sage', Y: 'c-butter' }, COL = { R: '#E8B093', B: '#AECAD1', G: '#B1BA96', Y: '#F1CA7D' };
  function fresh() { return { chips: START.slice(), row: 0 }; }
  /* swap: null or i (swap lanes i and i+1, 0-based) */
  function step(s, swap) { var c = s.chips.slice(); if (swap !== null && swap !== undefined) { var t = c[swap]; c[swap] = c[swap + 1]; c[swap + 1] = t; } var row = s.row + 1; for (var l = 0; l < 4; l++) if (PAINT[row][l]) c[l] = PAINT[row][l]; return { chips: c, row: row }; }
  function matches(s) { return s.chips.every(function (c, i) { return c === GOAL[i]; }); }
  var engine = { fresh: fresh, step: step, matches: matches, MOVES: MOVES, PAINT: PAINT, GOAL: GOAL, START: START };
  Games.register({ id: 'paint-ladder', total: 1, playable: 1, name: 'Paint Ladder', color: COLORS.apr, icon: 't', engine: engine,
    rules: '<b>Before each move</b> you may swap two neighbouring chips (pick a swap, or none), then press <b>Forward</b>: every chip climbs one row and takes the colour of any paint it lands on. After 7 moves each lane must match the colour on top.',
    mount: function (root, api) {
      var s = fresh(), hist = [], pick = null, msg = h('div', { class: 'msg' });
      var grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(4,1fr);max-width:300px;gap:5px' }), ctr = h('div', { class: 'row' });
      var stat = h('div', { class: 'stat' });
      root.appendChild(stat); root.appendChild(grid); root.appendChild(ctr); root.appendChild(msg);
      function dotc(c) { return '<span class="dot" style="background:' + COL[c] + ';width:30%;height:30%;opacity:.8"></span>'; }
      function draw() {
        stat.innerHTML = '<span>Move <b>' + Math.min(s.row + 1, MOVES) + ' / ' + MOVES + '</b></span>';
        grid.innerHTML = '';
        grid.appendChild(h('div', { style: 'grid-column:1/5;text-align:center;font-size:12px;color:var(--mut)' }, ['Goal']));
        GOAL.forEach(function (g) { grid.appendChild(h('div', { class: 'cell ' + CL[g], style: 'aspect-ratio:2.2' })); });
        for (var r = MOVES; r >= 1; r--) for (var l = 0; l < 4; l++) {
          var chip = s.row === r && s.chips[l], p = PAINT[r][l];
          grid.appendChild(h('div', { class: 'cell', style: 'aspect-ratio:1.5;background:' + (p ? COL[p] + '55' : 'transparent'), html: (p ? dotc(p) : '') }, []));
        }
        for (var l2 = 0; l2 < 4; l2++) grid.appendChild(h('div', { class: 'cell ' + (s.row === 0 ? CL[s.chips[l2]] : ''), style: 'aspect-ratio:1.5' }));
        if (s.row >= 1) { var cells = grid.children, idx = 5 + (MOVES - s.row) * 4; for (var l3 = 0; l3 < 4; l3++) { cells[idx + l3].className = 'cell ' + CL[s.chips[l3]]; cells[idx + l3].innerHTML = ''; } }
        ctr.innerHTML = '';
        if (s.row < MOVES) {
          [['—', null], ['1↔2', 0], ['2↔3', 1], ['3↔4', 2]].forEach(function (o) { ctr.appendChild(h('button', { class: 'chip' + (pick === o[1] ? ' on' : ''), onclick: function () { pick = o[1]; draw(); } }, [o[0]])); });
          ctr.appendChild(h('button', { class: 'btn s', onclick: forward }, ['Forward']));
        }
        ctr.appendChild(h('button', { class: 'btn o s', onclick: function () { if (hist.length) { var x = hist.pop(); s = x[0]; pick = x[1]; msg.textContent = ''; msg.className = 'msg'; draw(); } } }, ['Undo']));
      }
      function forward() {
        hist.push([s, pick]); s = step(s, pick); pick = null; draw();
        if (s.row === MOVES) { if (matches(s)) api.win('Every lane matches its goal'); else { msg.className = 'msg bad'; msg.textContent = 'Not a match. Undo a few moves or restart.'; } }
      }
      draw();
    } });
})();

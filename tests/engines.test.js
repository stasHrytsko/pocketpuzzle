/* Replays known solutions through each game's pure engine (web/js/*.js).
   Run: node tests/engines.test.js   — exits non-zero on any failure. */
global.COLORS = { apr: 1, blue: 2, sage: 3, butter: 4 }; global.h = () => {}; global.shape = () => '';
global.Games = { list: [], engines: {}, register(g) { this.list.push(g); if (g.engine) this.engines[g.id] = g.engine; } };
const path = require('path'), JS = path.join(__dirname, '..', 'web', 'js');
['arrow-flip', 'perfect-fit', 'the-gap', 'slide-out', 'tight-shelf', 'pair-up', 'parcels', 'outgrow', 'paint-ladder', 'streams', 'shadow-step', 'one-each'].forEach(f => require(path.join(JS, f + '.js')));
const E = Games.engines; let fail = 0;
const check = (name, ok, extra) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra ? ' — ' + extra : '')); if (!ok) fail++; };

// Arrow Flip: BFS finds a clearing sequence
{ const A = E['arrow-flip'], key = s => s.blocks.map(b => b.id + b.row + b.col + b.dir).sort().join('|'); const seen = new Set(), q = [[A.fresh(), 0]]; let best = null;
  while (q.length) { const [s, d] = q.shift(), k = key(s); if (seen.has(k)) continue; seen.add(k); if (!s.blocks.length) { best = d; break; } for (const b of s.blocks) { const c = JSON.parse(JSON.stringify(s)); if (A.tap(c, b.id) !== null) q.push([c, d + 1]); } }
  check('arrow-flip solvable', best !== null, best + ' moves min'); }
// The Gap: stored optimal solution
{ const G = E['the-gap'], s = G.fresh(); for (const a of G.LV.solution) a.type === 'swipe' ? G.swipe(s, a.x, a.y, a.dir) : G.tapFlask(s, a.n - 1); check('the-gap optimal solution', G.won(s) && s.moves === G.LV.opt, s.moves + ' moves'); }
// Perfect Fit
{ const P = E['perfect-fit'], b = P.boardFrom(P.MAP); const sol = [[[1, 0], [1, 1], [2, 1], [2, 2]], [[0, 2], [1, 2], [1, 3], [2, 3], [2, 4]]]; let ok = true;
  for (const sh of sol) { const a = sh.slice().sort((x, y) => x[0] - y[0] || x[1] - y[1])[0], p = P.connected(sh) && P.place(b, sh, a[0], a[1]); if (!p) { ok = false; break; } p.forEach(q => b[q[0]][q[1]] = 1); }
  check('perfect-fit board fillable', ok && !b.some(r => r.some(x => x === 0))); }
// Slide Out: greedy best-first search
{ const S = E['slide-out']; const cl = s => ({ blocks: s.blocks.map(b => ({ ...b })), goals: s.goals.map(g => ({ ...g })), moves: s.moves, served: s.served, status: s.status });
  const key = s => s.blocks.map(b => b.id + ':' + b.row * 5 + b.col).join(',') + '|' + s.goals.map(g => g.status[0] + g.countdown).join('');
  const cellOf = g => g.side === 'bottom' ? [4, g.index] : g.side === 'top' ? [0, g.index] : g.side === 'left' ? [g.index, 0] : [g.index, 4];
  const hv = s => s.goals.reduce((a, g) => { if (g.status === 'served') return a; const p = cellOf(g); let m = 99; s.blocks.forEach(b => { if (b.color === g.color) m = Math.min(m, Math.abs(b.row - p[0]) + Math.abs(b.col - p[1])); }); return a + m * (g.status === 'waiting' ? 3 : 1); }, 0);
  const open = [[0, S.fresh(), 0]], seen = new Set(); let found = null;
  while (open.length && !found) { open.sort((a, b) => b[0] - a[0]); const [, s] = open.pop(), k = key(s); if (seen.has(k)) continue; seen.add(k);
    for (const b of s.blocks) for (const d of ['up', 'down', 'left', 'right']) { const c = cl(s); if (!S.move(c, b.id, d)) continue; if (c.status === 'won') { found = c.moves; break; } if (c.status === 'playing') open.push([hv(c) + c.moves * .3, c, 0]); } }
  check('slide-out solvable', !!found, found + ' moves'); }
// Tight Shelf: a line clears, +fits
{ const T = E['tight-shelf']; const b = Array(16).fill(null); b[0] = 'Bo'; b[1] = 'Bs'; const n = T.placeAt(b, 2, 'Bt'); check('tight-shelf line clears', n === 1 && !b[0] && !b[1] && !b[2]); }
// Pair Up / Cave In / Parcels
{ const P = E['pair-up']; let r = []; P.SOL.forEach(x => { r = P.addRect(r, x); }); check('pair-up solution', P.solved(r)); }
{ const P2 = E['parcels']; P2.levels.forEach(L => { let g = L.START, ok = true; L.SOL.forEach(m => { if (!L.valid(g, ...m)) ok = false; else g = L.apply(g, ...m); }); check('parcels ' + L.id + ' solution', ok && L.done(g)); }); }
// Outgrow / Paint Ladder / One Each / Shadow Step
{ const O = E['outgrow']; let own = O.fresh(), ok = true; O.SOL.forEach(t => { const n = O.click(own, t); if (!n) ok = false; else own = n; }); check('outgrow solution', ok && O.won(own) && !O.over(own)); }
{ const L = E['paint-ladder']; let s = L.fresh(); [null, 2, null, 2, 2, null, 1].forEach(x => { s = L.step(s, x); }); check('paint-ladder solution', L.matches(s)); }
check('one-each solution', E['one-each'].solved(E['one-each'].KEEP));
{ const W = E['shadow-step'], s = W.fresh(); let ok = true; W.SOL.forEach(([c, d]) => { if (!W.play(s, c, d)) ok = false; }); check('shadow-step solution', ok && s.status === 'won'); }
// Streams: DFS finds full cover within budget
{ const R = E['streams'], seen = new Set(); let sol = null; const key = s => Object.keys(s.vis).sort().join(';') + '|' + s.trunk.length + '|' + s.b1.slice(-1) + '|' + s.b2.slice(-1) + '|' + s.budget + '|' + s.forked;
  (function dfs(s) { if (sol) return; if (R.won(s)) { sol = true; return; } const k = key(s); if (seen.has(k)) return; seen.add(k); for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { const n = R.extend(s, [r, c]); if (n) dfs(n); } })(R.fresh());
  check('streams solvable', !!sol); }
process.exit(fail ? 1 : 0);

(function () {
  var app = document.getElementById('app');
  var cleanups = [];
  function clean() { cleanups.forEach(function (f) { try { f(); } catch (e) {} }); cleanups = []; }
  /* progress: { gameId: [passed level numbers] } */
  var done = {};
  try { done = JSON.parse(localStorage.getItem('postie:done') || '{}'); } catch (e) {}
  Object.keys(done).forEach(function (k) { if (!Array.isArray(done[k])) done[k] = [1]; });
  function save() { try { localStorage.setItem('postie:done', JSON.stringify(done)); } catch (e) {} }
  function passed(g) { return done[g.id] || []; }
  /* total = real number of levels in the game (from its card); playable = levels built in this preview */
  function total(g) { return g.total || g.playable || 1; }
  function playable(g) { return g.playable || 1; }
  function nextLevel(g) { var p = passed(g); for (var n = 1; n <= playable(g); n++) if (p.indexOf(n) < 0) return n; return playable(g); }

  function home() {
    clean(); app.innerHTML = '';
    app.appendChild(h('header', null, [h('span', { style: 'width:44px' }), h('div', { class: 't' }, [h('h1', null, ['Postie']), h('small', null, [Games.list.length + ' games · playable samples'])]), h('span', { style: 'width:44px' })]));
    var tiles = h('div', { class: 'tiles' });
    Games.list.forEach(function (g) {
      var n = passed(g).length;
      tiles.appendChild(h('button', { class: 'tile', onclick: function () { location.hash = '#/' + g.id; } }, [
        h('div', { class: 'ico', style: 'background:' + g.color, html: shape(g.icon, 'none') }),
        h('b', null, [g.name]),
        h('div', { class: 'bar' }, [h('i', { style: 'width:' + Math.round(n / total(g) * 100) + '%' })]),
        h('small', null, [n + ' of ' + total(g)])
      ]));
    });
    app.appendChild(h('main', null, [tiles,
      h('p', { class: 'msg', style: 'margin-top:20px' }, ['Design preview. Only the first levels are built; progress is saved on this device.']),
      h('p', { class: 'msg' }, [h('a', { class: 'lnk', href: 'design.html' }, ['Design references']), ' · ', h('a', { class: 'lnk', href: 'app.html' }, ['Letter flow preview'])])]));
  }

  /* level grid of one game */
  function levels(g) {
    clean(); app.innerHTML = '';
    var p = passed(g), cur = nextLevel(g), n = p.length;
    app.appendChild(h('header', null, [
      h('button', { class: 'ib', 'aria-label': 'All games', html: ic('back'), onclick: function () { location.hash = '#/'; } }),
      h('div', { class: 't' }, [h('h1', null, [g.name])]), h('span', { style: 'width:44px' })]));
    var grid = h('div', { class: 'lvgrid' });
    for (var i = 1; i <= total(g); i++) (function (i) {
      var isDone = p.indexOf(i) >= 0, can = i <= playable(g), isCur = can && i === cur && !(isDone && p.length >= playable(g));
      var cls = 'lv' + (isDone ? ' done' : '') + (isCur && !isDone ? ' cur' : '') + (!can ? ' far' : '');
      var inner = isDone ? '<span class="gl">✓</span>' : isCur ? '<span class="gl">▶</span>' : '';
      grid.appendChild(h('button', { class: cls, disabled: can ? null : 'disabled', onclick: function () { if (can) location.hash = '#/' + g.id + '/' + i; }, html: inner + '<span class="no">' + i + '</span>' }));
    })(i);
    app.appendChild(h('main', { style: 'padding-bottom:96px' }, [
      h('div', { class: 'lbl', style: 'text-align:center;margin-top:4px' }, ['Progress']),
      h('div', { style: 'display:flex;align-items:center;gap:12px;margin:0 8px 18px' }, [h('div', { class: 'bar', style: 'flex:1;height:10px' }, [h('i', { style: 'width:' + Math.round(n / total(g) * 100) + '%' })]), h('b', { style: 'font-weight:500' }, [n + ' of ' + total(g)])]),
      grid,
      total(g) > playable(g) ? h('p', { class: 'msg' }, ['Preview: only ' + (playable(g) === 1 ? 'level 1 is' : 'levels 1–' + playable(g) + ' are') + ' built.']) : null]));
    app.appendChild(h('div', { class: 'bottom' }, [h('button', { class: 'btn', style: 'width:100%', onclick: function () { location.hash = '#/' + g.id + '/' + cur; } }, ['Play · level ' + cur])]));
  }

  function play(g, lv) {
    clean(); app.innerHTML = '';
    var body = h('main'), rulesBox = h('div', { class: 'rules', html: g.rules || '' }), showRules = true;
    function mount() {
      clean(); body.innerHTML = '';
      if (g.rules) body.appendChild(rulesBox);
      var root = h('div'); body.appendChild(root);
      g.mount(root, {
        level: lv - 1,
        win: function (text) {
          var p = passed(g); if (p.indexOf(lv) < 0) { p.push(lv); done[g.id] = p; save(); }
          var hasNext = lv < playable(g);
          var ov = h('div', { class: 'ov' }, [h('div', { class: 'dlg' }, [
            h('div', { class: 'chk' }, [h('span', null, ['✓'])]), h('h2', null, ['Well done']), h('p', null, [text || 'Level solved']),
            hasNext ? h('button', { class: 'btn', onclick: function () { location.hash = '#/' + g.id + '/' + (lv + 1); } }, ['Next level']) : null,
            h('button', { class: hasNext ? 'btn o' : 'btn', onclick: function () { location.hash = '#/' + g.id; } }, ['All levels']),
            h('button', { class: 'btn o', onclick: function () { ov.remove(); mount(); } }, ['Play again'])
          ])]);
          document.body.appendChild(ov);
        },
        cleanup: function (f) { cleanups.push(f); }
      });
    }
    app.appendChild(h('header', null, [
      h('button', { class: 'ib', 'aria-label': 'Levels', html: ic('grid'), onclick: function () { location.hash = '#/' + g.id; } }),
      h('div', { class: 't' }, [h('h1', null, [g.name]), h('small', null, ['Level ' + lv])]),
      h('div', { style: 'display:flex' }, [
        h('button', { class: 'ib', 'aria-label': 'How to play', html: ic('help'), onclick: function () { showRules = !showRules; rulesBox.style.display = showRules ? '' : 'none'; } }),
        h('button', { class: 'ib', 'aria-label': 'Restart', html: ic('redo'), onclick: mount })
      ])
    ]));
    app.appendChild(body);
    mount();
  }

  function route() {
    document.querySelectorAll('.ov').forEach(function (o) { o.remove(); });
    var parts = (location.hash || '').replace('#/', '').split('/'), id = parts[0], lv = parseInt(parts[1], 10);
    var g = Games.list.filter(function (x) { return x.id === id; })[0];
    window.scrollTo(0, 0);
    if (!g) home(); else if (lv >= 1 && lv <= playable(g)) play(g, lv); else levels(g);
  }
  window.addEventListener('hashchange', route);
  route();
})();

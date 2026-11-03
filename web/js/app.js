(function () {
  var app = document.getElementById('app');
  var cleanups = [];
  function clean() { cleanups.forEach(function (f) { try { f(); } catch (e) {} }); cleanups = []; }
  var done = {};
  try { done = JSON.parse(localStorage.getItem('postie:done') || '{}'); } catch (e) {}
  function save() { try { localStorage.setItem('postie:done', JSON.stringify(done)); } catch (e) {} }

  function home() {
    clean(); app.innerHTML = '';
    app.appendChild(h('header', null, [h('span', { style: 'width:44px' }), h('div', { class: 't' }, [h('h1', null, ['Postie']), h('small', null, ['13 games · one level each'])]), h('span', { style: 'width:44px' })]));
    var tiles = h('div', { class: 'tiles' });
    Games.list.forEach(function (g) {
      tiles.appendChild(h('button', { class: 'tile', onclick: function () { location.hash = '#/' + g.id; } }, [
        h('div', { class: 'ico', style: 'background:' + g.color, html: shape(g.icon, 'none') }),
        h('div', null, [h('b', null, [g.name]), h('small', null, [done[g.id] ? 'Level 1 · solved ✓' : 'Level 1'])]),
        h('div', { class: 'bar' }, [h('i', { style: 'width:' + (done[g.id] ? 100 : 0) + '%' })])
      ]));
    });
    app.appendChild(h('main', null, [h('div', { class: 'lbl' }, ['Core']), tiles]));
    var main = app.querySelector('main');
    var all = main.querySelector('.tiles');
    // split core (first 3) vs the rest
    var rest = h('div', { class: 'tiles' }); var kids = Array.prototype.slice.call(all.children);
    kids.slice(3).forEach(function (k) { rest.appendChild(k); });
    main.appendChild(h('div', { class: 'lbl' }, ['Coming by mail · playable samples'])); main.appendChild(rest);
    main.appendChild(h('p', { class: 'msg', style: 'margin-top:20px' }, ['Design preview. Each game is its first level; progress is saved on this device.']));
    main.appendChild(h('p', { class: 'msg' }, [h('a', { class: 'lnk', href: 'design.html' }, ['Design references']), ' · ', h('a', { class: 'lnk', href: 'app.html' }, ['Letter flow preview'])]));
  }

  function play(g) {
    clean(); app.innerHTML = '';
    var body = h('main'); var rulesBox = h('div', { class: 'rules', html: g.rules });
    var showRules = true;
    function mount() {
      clean(); body.innerHTML = '';
      body.appendChild(rulesBox);
      var root = h('div'); body.appendChild(root);
      g.mount(root, {
        win: function (text) {
          done[g.id] = 1; save();
          var ov = h('div', { class: 'ov' }, [h('div', { class: 'dlg' }, [
            h('div', { class: 'chk' }, [h('span', null, ['✓'])]), h('h2', null, ['Well done']), h('p', null, [text || 'Level solved']),
            h('button', { class: 'btn', onclick: function () { location.hash = '#/'; } }, ['All games']),
            h('button', { class: 'btn o', onclick: function () { ov.remove(); mount(); } }, ['Play again'])
          ])]);
          document.body.appendChild(ov);
        },
        cleanup: function (f) { cleanups.push(f); }
      });
    }
    app.appendChild(h('header', null, [
      h('button', { class: 'ib', 'aria-label': 'All games', html: ic('grid'), onclick: function () { location.hash = '#/'; } }),
      h('div', { class: 't' }, [h('h1', null, [g.name]), h('small', null, ['Level 1'])]),
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
    var id = (location.hash || '').replace('#/', '');
    var g = Games.list.filter(function (x) { return x.id === id; })[0];
    window.scrollTo(0, 0);
    if (g) play(g); else home();
  }
  window.addEventListener('hashchange', route);
  route();
})();

// Мини-рантайм формата .dc.html для самостоятельной страницы прототипа.
// Поддерживает: {{путь}} в тексте и атрибутах, <sc-if value>, <sc-for list as>,
// <dc-import name ...props>, обработчики onClick / onPointerDown / onPointerUp,
// class Component extends DCLogic с state / setState / renderVals / componentDidMount.
(function () {
  'use strict';

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(partial) {
      var next = typeof partial === 'function' ? partial(this.state, this.props) : partial;
      this.state = Object.assign({}, this.state, next);
      if (this.__requestRender) this.__requestRender();
    }
    forceUpdate() { if (this.__requestRender) this.__requestRender(); }
  }

  // ---------- компоненты ----------
  var classes = {}, templates = {};
  window.__DC_COMPONENTS.forEach(function (name) {
    var code = document.getElementById('code-' + name).textContent;
    classes[name] = new Function('DCLogic', code + '\n;return Component;')(DCLogic);
    templates[name] = document.getElementById('tpl-' + name).content;
  });

  // ---------- выражения ----------
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  function resolve(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    var parts = expr.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  function attrValue(raw, scope) {
    var m = raw.match(WHOLE);
    if (m) return resolve(m[1], scope);
    return raw.replace(/\{\{\s*([^}]+?)\s*\}\}/g, function (_, e) {
      var v = resolve(e, scope);
      return v == null ? '' : String(v);
    });
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }

  var EVENTS = { onclick: 'click', onpointerdown: 'pointerdown', onpointerup: 'pointerup' };
  var BOOL_ATTRS = { disabled: 1, hidden: 1 };

  // ---------- рендер шаблона в DOM ----------
  function renderChildren(parentTpl, scope, out) {
    var nodes = parentTpl.childNodes;
    for (var i = 0; i < nodes.length; i++) renderNode(nodes[i], scope, out);
  }

  function renderNode(node, scope, out) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      if (t.indexOf('{{') !== -1) t = attrValue(t, scope);
      out.push(document.createTextNode(t == null ? '' : String(t)));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.localName;

    if (tag === 'sc-if') {
      if (attrValue(node.getAttribute('value') || '', scope)) renderChildren(node, scope, out);
      return;
    }
    if (tag === 'sc-for') {
      var list = attrValue(node.getAttribute('list') || '', scope) || [];
      var as = node.getAttribute('as') || 'item';
      for (var i = 0; i < list.length; i++) {
        var sc = Object.create(scope);
        sc[as] = list[i];
        sc.$index = i;
        renderChildren(node, sc, out);
      }
      return;
    }
    if (tag === 'dc-import') {
      var props = {}, name = node.getAttribute('name');
      for (var a = 0; a < node.attributes.length; a++) {
        var at = node.attributes[a];
        if (at.name === 'name' || at.name.indexOf('hint-') === 0) continue;
        props[camel(at.name)] = attrValue(at.value, scope);
      }
      var defaults = window.__DC_DEFAULTS[name] || {};
      var inst = new classes[name](Object.assign({}, defaults, props));
      renderComponent(name, inst, out);
      return;
    }
    if (tag === 'helmet' || tag === 'script') return;

    var el = document.createElementNS(node.namespaceURI, node.localName);
    el.__ev = null;
    for (var j = 0; j < node.attributes.length; j++) {
      var attr = node.attributes[j], an = attr.name;
      if (an.indexOf('hint-') === 0) continue;
      var lower = an.toLowerCase();
      if (EVENTS[lower]) {
        var fn = attrValue(attr.value, scope);
        if (typeof fn === 'function') { el.__ev = el.__ev || {}; el.__ev[EVENTS[lower]] = fn; }
        continue;
      }
      var v = attr.value.indexOf('{{') !== -1 ? attrValue(attr.value, scope) : attr.value;
      if (BOOL_ATTRS[lower]) { if (v && v !== 'false') el.setAttribute(an, ''); continue; }
      if (v == null || typeof v === 'function') continue;
      el.setAttribute(an, String(v));
    }
    var kids = [];
    renderChildren(node, scope, kids);
    kids.forEach(function (k) { el.appendChild(k); });
    out.push(el);
  }

  function renderComponent(name, inst, out) {
    var vals = inst.renderVals ? inst.renderVals() : {};
    renderChildren(templates[name], vals, out);
  }

  // ---------- аккуратное обновление DOM (без потери прокрутки и анимаций) ----------
  function morph(a, b) {
    if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName || a.namespaceURI !== b.namespaceURI) {
      a.parentNode.replaceChild(b, a);
      return;
    }
    if (a.nodeType === 3) {
      if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue;
      return;
    }
    var i, at;
    for (i = a.attributes.length - 1; i >= 0; i--) {
      at = a.attributes[i];
      if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
    }
    for (i = 0; i < b.attributes.length; i++) {
      at = b.attributes[i];
      if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
    }
    a.__ev = b.__ev;
    var ac = Array.prototype.slice.call(a.childNodes), bc = Array.prototype.slice.call(b.childNodes);
    for (i = 0; i < bc.length; i++) {
      if (i < ac.length) morph(ac[i], bc[i]);
      else a.appendChild(bc[i]);
    }
    for (i = bc.length; i < ac.length; i++) a.removeChild(ac[i]);
  }

  // ---------- запуск ----------
  var host = document.getElementById('app');
  var entry = window.__DC_ENTRY;
  var root = new classes[entry](Object.assign({}, window.__DC_DEFAULTS[entry] || {}));
  var scheduled = false;

  function render() {
    scheduled = false;
    var out = [];
    renderComponent(entry, root, out);
    var next = out.filter(function (n) { return n.nodeType === 1; })[0];
    if (!host.firstChild) host.appendChild(next);
    else morph(host.firstChild, next);
    fit();
  }
  root.__requestRender = function () {
    if (scheduled) return;
    scheduled = true;
    Promise.resolve().then(render);
  };

  // делегирование событий, всплытие как в React
  ['click', 'pointerdown', 'pointerup'].forEach(function (type) {
    host.addEventListener(type, function (e) {
      var chain = [], n = e.target;
      while (n && n !== host) { if (n.__ev && n.__ev[type]) chain.push(n.__ev[type]); n = n.parentNode; }
      chain.forEach(function (fn) { fn(e); });
    });
  });

  // масштаб под экран: на телефоне — во всю ширину, на компьютере — целиком по высоте
  function fit() {
    var el = host.firstChild;
    if (!el) return;
    var w = el.offsetWidth || 390, h = el.offsetHeight || 844;
    var vw = window.innerWidth, vh = window.innerHeight;
    var pad = vw <= 500 ? 0 : 32;
    var s = Math.min(vw / w, (vh - pad) / h, 1.25);
    host.style.transform = 'scale(' + s + ')';
    host.style.marginTop = (pad / 2) + 'px';
  }
  window.addEventListener('resize', fit);

  render();
  if (root.componentDidMount) root.componentDidMount();
})();

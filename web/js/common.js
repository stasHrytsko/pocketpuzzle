/* Postie — common shell. Games register here; engines stay pure so tests can load them in Node. */
var Games = (typeof Games !== 'undefined') ? Games : { list: [], engines: {}, register: function (g) { this.list.push(g); if (g.engine) this.engines[g.id] = g.engine; } };
if (typeof module !== 'undefined') module.exports = Games;

var ICONS = {
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  redo: '<path d="M20 12a8 8 0 11-3-6.2M20 4v5h-5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 115 0c0 1.8-2.5 2-2.5 4M12 17v.3"/>',
  undo: '<path d="M4 12a8 8 0 108-8M4 4v5h5"/>'
};
function ic(n) { return '<svg viewBox="0 0 24 24">' + ICONS[n] + '</svg>'; }

function h(tag, attrs, kids) {
  var e = document.createElement(tag);
  if (attrs) for (var k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k === 'style') e.style.cssText = attrs[k];
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
  return e;
}
function shape(s, color, cls) {
  var p = s === 'o' ? '<circle cx="12" cy="12" r="8.5"/>' : s === 't' ? '<path d="M12 3.5l9 16H3z"/>' : '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/>';
  return '<svg viewBox="0 0 24 24" class="sh ' + (cls || '') + '" style="fill:' + (color || 'none') + ';stroke:#2f3a26;stroke-width:1.6;stroke-linejoin:round">' + p + '</svg>';
}
var COLORS = { apr: '#E8B093', blue: '#AECAD1', sage: '#B1BA96', butter: '#F1CA7D' };

/* rectangle drag over a grid; calls onRect(r1,c1,r2,c2) on release (same cell = tap) */
function rectDrag(gridEl, onRect, onPreview) {
  var start = null, cur = null;
  function cellAt(x, y) {
    var e = document.elementFromPoint(x, y);
    while (e && e !== gridEl && !(e.dataset && e.dataset.r !== undefined)) e = e.parentNode;
    return e && e.dataset && e.dataset.r !== undefined ? [+e.dataset.r, +e.dataset.c] : null;
  }
  gridEl.addEventListener('pointerdown', function (ev) { var c = cellAt(ev.clientX, ev.clientY); if (!c) return; start = c; cur = c; if (onPreview) onPreview(c, c); ev.preventDefault(); });
  gridEl.addEventListener('pointermove', function (ev) { if (!start) return; var c = cellAt(ev.clientX, ev.clientY); if (c) { cur = c; if (onPreview) onPreview(start, c); } });
  function end() { if (!start) return; var s = start, c = cur; start = cur = null; if (onPreview) onPreview(null, null); onRect(Math.min(s[0], c[0]), Math.min(s[1], c[1]), Math.max(s[0], c[0]), Math.max(s[1], c[1])); }
  gridEl.addEventListener('pointerup', end);
  gridEl.addEventListener('pointercancel', function () { start = cur = null; if (onPreview) onPreview(null, null); });
}
/* swipe on element: calls cb(dir) with 'up|down|left|right' after >=24px */
function swipeable(el, cb) {
  var sx, sy, on = false;
  el.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; on = true; try { el.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
  function up(e) {
    if (!on) return; on = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    cb(Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', function () { on = false; });
}
function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

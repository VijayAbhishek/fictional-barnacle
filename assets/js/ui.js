/* Tiger Fitness — UI helpers: safe DOM builder, toasts, dialogs, a11y announcements. */
(function () {
  'use strict';

  // h('div', {class:'card', onclick:fn, aria:{label:'x'}}, child1, 'text', [more...])
  // Text children are ALWAYS set via textContent (no HTML injection possible).
  function h(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    for (var key in attrs) {
      var val = attrs[key];
      if (val === null || val === undefined || val === false) continue;
      if (key === 'class') node.className = val;
      else if (key === 'dataset') { for (var d in val) node.dataset[d] = val[d]; }
      else if (key === 'aria') { for (var a in val) node.setAttribute('aria-' + a, val[a]); }
      else if (key === 'style') node.style.cssText = val;
      else if (key.indexOf('on') === 0 && typeof val === 'function') node.addEventListener(key.slice(2), val);
      else if (val === true) node.setAttribute(key, '');
      else node.setAttribute(key, val);
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }

  function append(node, child) {
    if (child === null || child === undefined || child === false || child === '') return;
    if (Array.isArray(child)) { for (var i = 0; i < child.length; i++) append(node, child[i]); return; }
    if (child instanceof Node) { node.appendChild(child); return; }
    node.appendChild(document.createTextNode(String(child)));
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  function table(head, rows, opts) {
    opts = opts || {};
    var thead = h('thead', {}, h('tr', {}, head.map(function (c) { return h('th', { scope: 'col' }, c); })));
    var tbody = h('tbody', {}, rows.map(function (r) {
      return h('tr', {}, r.map(function (c, i) {
        return i === 0 && opts.rowHeader ? h('th', { scope: 'row' }, c) : h('td', {}, c);
      }));
    }));
    return h('div', { class: 'table-wrap' }, h('table', { class: 'info-table' }, thead, tbody));
  }

  /* ---------- inline SVG icons (no icon-font CDN) ---------- */

  var PATHS = {
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18M6 6l12 12',
    lock: 'M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8.5-3a8.4 8.4 0 0 0-.2-1.7l2-1.5-2-3.5-2.4 1a8.5 8.5 0 0 0-2.9-1.7L14.6 2h-4l-.4 2.6a8.5 8.5 0 0 0-2.9 1.7l-2.4-1-2 3.5 2 1.5a8.4 8.4 0 0 0 0 3.4l-2 1.5 2 3.5 2.4-1a8.5 8.5 0 0 0 2.9 1.7l.4 2.6h4l.4-2.6a8.5 8.5 0 0 0 2.9-1.7l2.4 1 2-3.5-2-1.5c.13-.55.2-1.12.2-1.7z',
    water: 'M12 2s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12z',
    flame: 'M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-4 2-5 0 2 1 3 2 3 0-3 1-6 1-8z',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.3-4.3',
    dice: 'M4 4h16v16H4zM8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01',
    back: 'M15 18l-6-6 6-6',
    plus: 'M12 5v14M5 12h14',
    download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 21h16',
    upload: 'M12 21V9m0 0 4 4m-4-4-4 4M4 3h16',
    trash: 'M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14h.01M12 12v6',
    play: 'M7 4l12 8-12 8z'
  };

  function icon(name, cls) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'ic' + (cls ? ' ' + cls : ''));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', PATHS[name] || PATHS.info);
    svg.appendChild(path);
    return svg;
  }

  /* ---------- toast + live region ---------- */

  var toastTimer = null;
  function toast(msg, kind) {
    var host = document.getElementById('toast');
    if (!host) return;
    host.textContent = msg;
    host.className = 'toast show' + (kind ? ' ' + kind : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { host.className = 'toast'; }, 3500);
  }

  function announce(msg) {
    var live = document.getElementById('live');
    if (live) { live.textContent = ''; live.textContent = msg; }
  }

  /* ---------- SVG progress ring ---------- */

  function ring(pct, sizePx, label) {
    var NS = 'http://www.w3.org/2000/svg';
    var size = sizePx || 64;
    var stroke = 6;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label || (pct + '% complete'));
    var track = document.createElementNS(NS, 'circle');
    var bar = document.createElementNS(NS, 'circle');
    [track, bar].forEach(function (el) {
      el.setAttribute('cx', size / 2);
      el.setAttribute('cy', size / 2);
      el.setAttribute('r', r);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke-width', stroke);
    });
    track.setAttribute('stroke', 'var(--border)');
    bar.setAttribute('stroke', 'var(--orange)');
    bar.setAttribute('stroke-linecap', 'round');
    bar.setAttribute('stroke-dasharray', c);
    bar.setAttribute('stroke-dashoffset', c * (1 - Math.max(0, Math.min(100, pct)) / 100));
    bar.setAttribute('transform', 'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')');
    var text = document.createElementNS(NS, 'text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('dy', '0.36em');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'ring-text');
    text.textContent = pct + '%';
    svg.appendChild(track);
    svg.appendChild(bar);
    svg.appendChild(text);
    return svg;
  }

  window.TF_UI = { h: h, append: append, clear: clear, table: table, icon: icon, toast: toast, announce: announce, ring: ring };
})();

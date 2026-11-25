/* ==========================================================================
   CogniSteed — Interactive SVG "six pillars" ecosystem
   The CogniSteed mark sits at the centre, with the six service pillars
   around it. Hovering or focusing a pillar lights its connection and shows
   the service scope (read from the service cards, so it is always in the
   current language). Selecting it opens that service card. It auto-tours
   gently while in view until the visitor interacts. Keyboard: Tab or arrow
   keys move between pillars; Enter or Space opens the card.
   ========================================================================== */
(function () {
  'use strict';
  var CS = window.CS; if (!CS) return;
  var svg = CS.$('#eco-svg'); if (!svg) return;
  var NS = 'http://www.w3.org/2000/svg';
  var CX = 340, CY = 290, R = 190, N = 6;
  var ICONS = ['i-strategy', 'i-pmo', 'i-ai', 'i-biz', 'i-learn', 'i-research'];
  var active = 0, touring = true, tourT = null, inView = false, nodes = [], spokes = [];

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function svcTitle(i) { var t = CS.$('[data-i18n="svc.' + (i + 1) + '.t"]'); return t ? t.textContent : ''; }
  function svcItems(i) { return ['a', 'b', 'c', 'd'].map(function (k) { var t = CS.$('[data-i18n="svc.' + (i + 1) + '.' + k + '"]'); return t ? t.textContent : ''; }); }
  function pillar(i) { var t = CS.$('.marquee__track li[data-i18n="pillar.' + (i + 1) + '"]'); return t ? t.textContent : svcTitle(i); }

  function build() {
    svg.innerHTML = '';
    nodes = []; spokes = [];
    var rtl = document.documentElement.dir === 'rtl';
    var defs = el('defs', {}, svg);
    var g = el('radialGradient', { id: 'ecoGlow' }, defs);
    el('stop', { offset: '0', 'stop-color': '#D6AD51', 'stop-opacity': '.35' }, g);
    el('stop', { offset: '1', 'stop-color': '#D6AD51', 'stop-opacity': '0' }, g);
    // Orbits
    el('circle', { cx: CX, cy: CY, r: R + 46, class: 'eco__orbit eco__orbit--slow' }, svg);
    el('circle', { cx: CX, cy: CY, r: R, class: 'eco__orbit' }, svg);
    el('circle', { cx: CX, cy: CY, r: 92, class: 'eco__orbit eco__orbit--inner' }, svg);
    var pts = [];
    for (var i = 0; i < N; i++) {
      var a = (-90 + (rtl ? -1 : 1) * i * 60) * Math.PI / 180;   // pillars follow the reading direction
      pts.push([CX + Math.cos(a) * R, CY + Math.sin(a) * R]);
    }
    // Ring links between neighbours
    var ring = el('g', { class: 'eco__ring' }, svg);
    pts.forEach(function (p, i) { var q = pts[(i + 1) % N]; el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, ring); });
    // Spokes
    var sg = el('g', {}, svg);
    pts.forEach(function (p) { spokes.push(el('line', { x1: CX, y1: CY, x2: p[0], y2: p[1], class: 'eco__spoke' }, sg)); });
    // Centre
    el('circle', { cx: CX, cy: CY, r: 120, fill: 'url(#ecoGlow)' }, svg);
    el('circle', { cx: CX, cy: CY, r: 64, class: 'eco__core' }, svg);
    el('image', { href: 'assets/img/mark.webp', x: CX - 42, y: CY - 40, width: 84, height: 75, preserveAspectRatio: 'xMidYMid meet' }, svg);
    // Nodes
    pts.forEach(function (p, i) {
      var n = el('g', { class: 'eco__node', tabindex: '0', role: 'button', 'data-i': i, transform: 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')' }, svg);
      n.setAttribute('aria-label', '0' + (i + 1) + ' — ' + svcTitle(i));
      el('circle', { r: 40, class: 'eco__halo' }, n);
      el('circle', { r: 30, class: 'eco__dot' }, n);
      var u = el('use', { href: '#' + ICONS[i], x: -13, y: -13, width: 26, height: 26, class: 'eco__ico' }, n);
      u.setAttribute('aria-hidden', 'true');
      var num = el('text', { y: -44, class: 'eco__n', 'text-anchor': 'middle' }, n); num.textContent = '0' + (i + 1);
      var below = p[1] >= CY - 10;
      var lab = el('text', { y: below ? 62 : -64, class: 'eco__label', 'text-anchor': 'middle' }, n); lab.textContent = pillar(i);
      if (!below) { lab.setAttribute('y', -68); num.setAttribute('y', -46); }
      nodes.push(n);
    });
    setActive(active, false);
  }

  function setActive(i, user) {
    active = i;
    nodes.forEach(function (n, j) { n.classList.toggle('is-active', j === i); });
    spokes.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
    CS.$('#eco-num').textContent = '0' + (i + 1);
    CS.$('#eco-name').textContent = svcTitle(i);
    CS.$('#eco-list').innerHTML = svcItems(i).map(function (t) { return '<li>' + CS.esc(t) + '</li>'; }).join('');
    var panel = CS.$('#eco-panel'); panel.classList.remove('is-swap'); void panel.offsetWidth; panel.classList.add('is-swap');
    if (user) stopTour();
  }
  function openCard(i) {
    var art = CS.$('.svc[data-svc="' + i + '"]'); if (!art) return;
    var b = CS.$('.svc__more', art);
    if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
    var y = art.getBoundingClientRect().top + window.scrollY - 110;
    if (CS.scrollToY) CS.scrollToY(y); else window.scrollTo(0, y);
    setTimeout(function () { b && b.focus({ preventScroll: true }); }, 900);
  }
  function stopTour() { touring = false; clearInterval(tourT); tourT = null; }
  function startTour() {
    if (!touring || CS.reduced || tourT) return;
    tourT = setInterval(function () { if (inView && !document.hidden) setActive((active + 1) % N, false); }, 3200);
  }

  svg.addEventListener('pointerover', function (e) { var n = e.target.closest('.eco__node'); if (n) setActive(+n.dataset.i, true); });
  svg.addEventListener('focusin', function (e) { var n = e.target.closest('.eco__node'); if (n) setActive(+n.dataset.i, true); });
  svg.addEventListener('click', function (e) { var n = e.target.closest('.eco__node'); if (n) openCard(+n.dataset.i); });
  svg.addEventListener('keydown', function (e) {
    var n = e.target.closest('.eco__node'); if (!n) return;
    var i = +n.dataset.i;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(i); }
    else if (/Arrow(Right|Down)/.test(e.key)) { e.preventDefault(); nodes[(i + 1) % N].focus(); }
    else if (/Arrow(Left|Up)/.test(e.key)) { e.preventDefault(); nodes[(i + N - 1) % N].focus(); }
  });
  CS.$('#eco-go').addEventListener('click', function () { stopTour(); openCard(active); });
  new IntersectionObserver(function (en) { inView = en[0].isIntersecting; if (inView) { svg.classList.add('is-drawn'); startTour(); } }, { threshold: 0.35 }).observe(svg);
  CS.onLang(build);
  build();
})();

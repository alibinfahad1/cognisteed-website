/* ==========================================================================
   CogniSteed — core: i18n, navigation, motion, shared helpers (window.CS)
   ========================================================================== */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var DICT = window.CS_I18N, DATA = window.CS_DATA;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var CS = window.CS = {
    lang: root.lang === 'en' ? 'en' : 'ar',
    reduced: mqReduce.matches,
    data: DATA,
    _subs: [],
    onLang: function (fn) { this._subs.push(fn); },
    L: function (o) { return o ? (o[this.lang] != null ? o[this.lang] : o.ar) : ''; },
    ui: function (k) { return DATA.ui[this.lang][k]; },
    $: function (s, c) { return (c || doc).querySelector(s); },
    $$: function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); },
    esc: function (t) { var d = doc.createElement('div'); d.textContent = t == null ? '' : String(t); return d.innerHTML; },
    num: function (n, opts) { return new Intl.NumberFormat(this.lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', opts || {}).format(n); }
  };
  mqReduce.addEventListener && mqReduce.addEventListener('change', function (e) { CS.reduced = e.matches; root.classList.toggle('reduce-motion', e.matches); });

  /* ---------------- Toast ---------------- */
  var toastEl, toastT;
  CS.toast = function (msg) {
    if (!toastEl) { toastEl = doc.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); doc.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  };

  /* ---------------- Chart.js lazy loader (pinned + SRI) ---------------- */
  var chartP = null;
  CS.loadChart = function () {
    if (window.Chart) return Promise.resolve(window.Chart);
    if (chartP) return chartP;
    chartP = new Promise(function (res, rej) {
      var s = doc.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      s.integrity = 'sha384-9nhczxUqK87bcKHh20fSQcTGD4qq5GhayNYSYWqwBkINBhOfQLg/P5HG5lF1urn4';
      s.crossOrigin = 'anonymous';
      s.onload = function () {
        var C = window.Chart;
        C.defaults.font.family = 'Tajawal, system-ui, -apple-system, "Segoe UI", Tahoma, Arial, sans-serif';
        C.defaults.font.weight = '500';
        C.defaults.font.size = 12.5;
        C.defaults.plugins.tooltip.titleFont = { weight: '700' };
        C.defaults.plugins.tooltip.bodyFont = { weight: '500' };
        C.defaults.color = '#5A6780';
        C.defaults.borderColor = '#E3E8EF';
        C.defaults.plugins.legend.labels.usePointStyle = true;
        C.defaults.plugins.legend.labels.boxWidth = 8;
        C.defaults.plugins.tooltip.backgroundColor = '#102345';
        C.defaults.plugins.tooltip.padding = 10;
        C.defaults.plugins.tooltip.cornerRadius = 8;
        C.defaults.animation.duration = CS.reduced ? 0 : 900;
        res(C);
      };
      s.onerror = function () { chartP = null; rej(new Error('Chart.js failed to load')); };
      doc.head.appendChild(s);
    });
    return chartP;
  };

  /* ---------------- i18n ---------------- */
  var store = new Map();            // element -> {text|html|attrs} original Arabic
  function capture() {
    CS.$$('[data-i18n],[data-i18n-html],[data-i18n-attr]').forEach(function (el) {
      if (store.has(el)) return;
      var rec = {};
      if (el.hasAttribute('data-i18n')) rec.text = el.textContent;
      if (el.hasAttribute('data-i18n-html')) rec.html = el.innerHTML;
      if (el.hasAttribute('data-i18n-attr')) {
        rec.attrs = {};
        el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
          var p = pair.split(':'); rec.attrs[p[0].trim()] = { key: p[1].trim(), ar: el.getAttribute(p[0].trim()) };
        });
      }
      store.set(el, rec);
    });
  }
  function applyStatic(lang) {
    var en = DICT.en;
    store.forEach(function (rec, el) {
      if (rec.text != null) {
        var k = el.getAttribute('data-i18n');
        el.textContent = lang === 'en' ? (en[k] != null ? en[k] : rec.text) : rec.text;
        if (el.hasAttribute('data-alt-lang')) el.setAttribute('lang', lang === 'en' ? 'ar' : 'en');
      }
      if (rec.html != null) {
        var kh = el.getAttribute('data-i18n-html');
        el.innerHTML = lang === 'en' ? (en[kh] != null ? en[kh] : rec.html) : rec.html;
      }
      if (rec.attrs) Object.keys(rec.attrs).forEach(function (a) {
        var r = rec.attrs[a]; el.setAttribute(a, lang === 'en' ? (en[r.key] != null ? en[r.key] : r.ar) : r.ar);
      });
    });
    var lbl = CS.$('#lang-toggle span'); if (lbl) lbl.setAttribute('lang', lang === 'en' ? 'ar' : 'en');
    var m = DICT.meta[lang];
    doc.title = m.title;
    var md = CS.$('meta[name="description"]'); if (md) md.setAttribute('content', m.desc);
    var ol = CS.$('meta[property="og:locale"]'); if (ol) ol.setAttribute('content', lang === 'en' ? 'en_US' : 'ar_SA');
  }
  CS.setLang = function (lang, opts) {
    lang = lang === 'en' ? 'en' : 'ar';
    var changed = lang !== CS.lang || (opts && opts.force);
    CS.lang = lang;
    root.lang = lang; root.dir = lang === 'en' ? 'ltr' : 'rtl';
    applyStatic(lang);
    splitHeadline();
    fillSelects();
    try { localStorage.setItem('cs-lang', lang); } catch (e) {}
    try { var u = new URL(location.href); if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang'); history.replaceState(null, '', u); } catch (e) {}
    if (changed) CS._subs.forEach(function (fn) { try { fn(lang); } catch (e) { console.error(e); } });
  };

  /* ---------------- Staggered headline ---------------- */
  function splitHeadline() {
    CS.$$('[data-split]').forEach(function (h) {
      var idx = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var parts = n.textContent.split(/(\s+)/), frag = doc.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(' ')); return; }
              var o = doc.createElement('span'); o.className = 'split-word';
              var i = doc.createElement('span'); i.textContent = p; i.style.setProperty('--w', idx++);
              o.appendChild(i); frag.appendChild(o);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1 && !n.classList.contains('split-word')) walk(n);
        });
      })(h);
      h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    });
  }

  /* ---------------- Form selects (sector / service / timeframe) ---------------- */
  function fillSelects() {
    [['#f-sector', DATA.sectors], ['#f-service', DATA.services], ['#f-time', DATA.timeframes]].forEach(function (p) {
      var sel = CS.$(p[0]); if (!sel) return;
      var v = sel.value, ph = sel.options[0];
      while (sel.options.length > 1) sel.remove(1);
      p[1].forEach(function (o, i) { var op = doc.createElement('option'); op.value = String(i); op.textContent = CS.L(o); sel.appendChild(op); });
      sel.value = v; if (ph) ph.value = '';
    });
  }

  /* ---------------- Prefill consultation form ---------------- */
  CS.prefill = function (o) {
    o = o || {};
    if (o.service != null) { var s = CS.$('#f-service'); if (s) { s.value = String(o.service); s.dispatchEvent(new Event('change')); } }
    if (o.sector != null) { var se = CS.$('#f-sector'); if (se) se.value = String(o.sector); }
    if (o.message) { var m = CS.$('#f-msg'); if (m && (!m.value.trim() || m.dataset.prefilled === '1')) { m.value = o.message; m.dataset.prefilled = '1'; m.dispatchEvent(new Event('input')); } }
    if (o.diag) { var d = CS.$('#form-diag'); if (d) { d.hidden = false; d.innerHTML = o.diag; } }
    if (o.toast) CS.toast(o.toast);
  };

  /* ---------------- Navigation ---------------- */
  var nav = CS.$('#nav'), burger = CS.$('#nav-burger'), links = CS.$('#nav-links');
  function closeMenu() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); doc.body.style.overflow = ''; setBurgerLabel(false); }
  function setBurgerLabel(open) { burger.setAttribute('aria-label', CS.lang === 'en' ? (open ? DICT.en['nav.close'] : DICT.en['nav.open']) : (open ? 'إغلاق القائمة' : 'فتح القائمة')); }
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open));
    doc.body.style.overflow = open ? 'hidden' : ''; setBurgerLabel(open);
    burger.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    if (open) setTimeout(function () { var f = links.querySelector('a'); f && f.focus(); }, 80);
  });
  links.addEventListener('click', function (e) { if (e.target.closest('a') && nav.classList.contains('is-open')) { closeMenu(); burger.querySelector('use').setAttribute('href', '#i-menu'); } });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); burger.querySelector('use').setAttribute('href', '#i-menu'); burger.focus(); } });

  /* Cinematic language switch: a branded wipe covers the re-flow between RTL and LTR */
  var wipe = CS.$('.wipe'), switching = false;
  CS.$('#lang-toggle').addEventListener('click', function () {
    var next = CS.lang === 'ar' ? 'en' : 'ar';
    if (CS.reduced || !wipe || switching) { if (!switching) CS.setLang(next); return; }
    switching = true;
    wipe.classList.remove('is-out'); wipe.classList.add('is-in');
    setTimeout(function () {
      CS.setLang(next);
      requestAnimationFrame(function () { wipe.classList.add('is-out'); });
      setTimeout(function () { wipe.classList.remove('is-in', 'is-out'); switching = false; }, 750);
    }, 520);
  });

  /* Sliding active-link indicator */
  var pill = CS.$('.nav__pill');
  function movePill() {
    if (!pill) return;
    var a = CS.$('.nav__links a.is-active');
    if (!a || window.innerWidth <= 1120) { pill.classList.remove('is-on'); return; }
    var pr = links.getBoundingClientRect(), r = a.getBoundingClientRect();
    pill.style.setProperty('--px', (r.left - pr.left) + 'px'); pill.style.setProperty('--pw', r.width + 'px');
    pill.classList.add('is-on');
  }
  CS.movePill = movePill;
  window.addEventListener('resize', movePill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);

  /* Active section highlighting */
  var navMap = {};
  CS.$$('.nav__links a').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
  var secIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var id = en.target.id, map = { story: 'about', why: 'services', methodology: 'services', diagnostic: 'solutions', clients: 'insights', pillars: 'home' };
      var key = navMap[id] ? id : map[id];
      CS.$$('.nav__links a').forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
      if (navMap[key]) { navMap[key].classList.add('is-active'); navMap[key].setAttribute('aria-current', 'true'); }
      movePill();
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  CS.$$('main > section[id]').forEach(function (s) { secIO.observe(s); });

  /* ---------------- Scroll-driven: progress, nav state, parallax, timeline ---------------- */
  var progress = CS.$('.scroll-progress span'), lastY = 0, ticking = false;
  var parallaxEls = CS.$$('[data-parallax]');
  var tl = CS.$('#timeline');
  function onScroll() {
    var y = window.scrollY, h = doc.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);
    nav.classList.toggle('is-scrolled', y > 30);
    if (!nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > 600 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
    if (!CS.reduced) parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      var c = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = 'translate3d(0,' + (c * parseFloat(el.dataset.parallax)).toFixed(1) + 'px,0)' + (el.classList.contains('story__bg') && root.dir === 'rtl' ? ' scaleX(-1)' : '');
    });
    if (tl) {
      var tr = tl.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - tr.top) / (tr.height + vh * 0.35)));
      tl.style.setProperty('--tp', p.toFixed(3));
      var reached = Math.round(p * 6);
      CS.$$('.phase', tl).forEach(function (b, i) { b.classList.toggle('is-reached', i < reached); });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', function () { requestAnimationFrame(onScroll); });

  /* ---------------- Reveal on view ---------------- */
  var revIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); revIO.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  CS.$$('.reveal').forEach(function (el) { revIO.observe(el); });

  /* ---------------- Magnetic buttons + glow ---------------- */
  function bindMagnetic(el) {
    if (el.dataset.mag) return; el.dataset.mag = '1';
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      if (CS.reduced || !finePointer || !el.classList.contains('magnetic')) return;
      el.style.transform = 'translate(' + ((x - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((y - r.height / 2) * 0.3).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  }
  CS.bindMagnetic = bindMagnetic;
  CS.$$('.btn').forEach(bindMagnetic);

  /* ---------------- 3D tilt service cards ---------------- */
  CS.$$('[data-tilt]').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--gx', (px * 100) + '%'); card.style.setProperty('--gy', (py * 100) + '%');
      if (CS.reduced || !finePointer) return;
      card.classList.add('is-tilting');
      card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', function () { card.classList.remove('is-tilting'); card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });

  /* Expandable service details */
  CS.$$('.svc__more').forEach(function (btn) {
    var art = btn.closest('.svc'), det = CS.$('#' + btn.getAttribute('aria-controls'));
    det.setAttribute('inert', '');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open)); art.classList.toggle('is-open', open);
      if (open) det.removeAttribute('inert'); else det.setAttribute('inert', '');
    });
  });
  doc.addEventListener('click', function (e) {
    var ps = e.target.closest('[data-prefill-service]');
    if (ps) CS.prefill({ service: +ps.dataset.prefillService, toast: CS.ui('prefilledService') });
    var pm = e.target.closest('[data-prefill-message="demo"]');
    if (pm) CS.prefill({ message: CS.ui('demoMsg') });
    var dm = e.target.closest('[data-demo]');
    if (dm && CS.showDemo) CS.showDemo(dm.dataset.demo);
  });

  /* ---------------- Methodology ---------------- */
  var phaseIdx = 0, tabsBox = CS.$('#phase-tabs');
  function renderPhases() {
    tabsBox.innerHTML = DATA.phases.map(function (p, i) {
      var d = CS.L(p);
      return '<button class="phase" role="tab" id="phase-tab-' + i + '" aria-controls="phase-panel" aria-selected="' + (i === phaseIdx) + '" tabindex="' + (i === phaseIdx ? 0 : -1) + '" data-i="' + i + '">' +
        '<span class="phase__dot" lang="en">0' + (i + 1) + '</span><span class="phase__text"><span class="phase__t">' + CS.esc(d.t) + '</span><span class="phase__d">' + CS.esc(d.d) + '</span></span></button>';
    }).join('');
    showPhase(phaseIdx, false);
    onScroll();
  }
  function showPhase(i, focus) {
    phaseIdx = i;
    CS.$$('.phase', tabsBox).forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; if (j === i && focus) b.focus(); });
    var d = CS.L(DATA.phases[i]);
    CS.$('#phase-num').textContent = '0' + (i + 1);
    CS.$('#phase-title').textContent = d.t; CS.$('#phase-desc').textContent = d.d;
    CS.$('#phase-panel').setAttribute('aria-labelledby', 'phase-tab-' + i);
    CS.$('#phase-outs').innerHTML = d.o.map(function (o, k) { return '<li style="--i:' + k + '"><svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>' + CS.esc(o) + '</li>'; }).join('');
  }
  tabsBox.addEventListener('click', function (e) { var b = e.target.closest('.phase'); if (b) showPhase(+b.dataset.i, false); });
  tabsBox.addEventListener('keydown', function (e) {
    var n = DATA.phases.length, rtl = root.dir === 'rtl', k = e.key, i = phaseIdx;
    if (k === 'ArrowRight' || k === 'ArrowDown') i = rtl && k === 'ArrowRight' ? i - 1 : i + 1;
    else if (k === 'ArrowLeft' || k === 'ArrowUp') i = rtl && k === 'ArrowLeft' ? i + 1 : i - 1;
    else if (k === 'Home') i = 0; else if (k === 'End') i = n - 1; else return;
    e.preventDefault(); showPhase((i + n) % n, true);
  });

  /* ---------------- Industries ---------------- */
  var indBar = CS.$('#ind-bar'), indSel = null;
  CS.$('#ind-grid').addEventListener('click', function (e) {
    var b = e.target.closest('.ind'); if (!b) return;
    var i = +b.dataset.sector, on = indSel !== i;
    CS.$$('.ind').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    indSel = on ? i : null;
    if (on) b.setAttribute('aria-pressed', 'true');
    indBar.hidden = !on; updateInd();
  });
  function updateInd() { if (indSel != null) CS.$('#ind-name').textContent = CS.L(DATA.sectors[indSel]); }
  CS.$('#ind-cta').addEventListener('click', function () { if (indSel != null) CS.prefill({ sector: indSel, toast: CS.ui('prefilledSector') }); });

  /* ---------------- Marquee (clone for seamless loop) ---------------- */
  var track = CS.$('.marquee__track');
  function buildMarquee() {
    CS.$$('[aria-hidden="true"]', track).forEach(function (n) { n.remove(); });
    var items = CS.$$('li', track);
    for (var r = 0; r < 2; r++) items.forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.removeAttribute('data-i18n'); track.appendChild(c); });
  }

  /* ---------------- Knowledge center ---------------- */
  CS.$('.kc-filter').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    CS.$$('.kc-filter .chip').forEach(function (c) { var on = c === b; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
    CS.$$('.kc').forEach(function (k) { var show = b.dataset.kc === 'all' || k.dataset.topic === b.dataset.kc; k.classList.toggle('is-filtered', !show); if (show) k.classList.add('is-in'); });
  });
  function updateNotifyLinks() {
    CS.$$('[data-notify]').forEach(function (a) {
      var el = CS.$('[data-i18n="' + a.dataset.notify + '"]');
      a.href = 'mailto:info@cognisteed.com?subject=' + encodeURIComponent(CS.ui('notifySubject') + (el ? el.textContent : ''));
    });
  }

  /* ---------------- Notices dialog ---------------- */
  var dlg = CS.$('#privacy-dialog'), lastFocus = null;
  function openNotice(kind) {
    var u = DATA.ui[CS.lang], title = u.privacyT, items = u.privacyItems;
    if (kind === 'terms') { title = u.termsT; items = u.termsItems; } else if (kind === 'cookies') { title = u.cookiesT; items = u.cookiesItems; }
    CS.$('#privacy-title').textContent = title;
    CS.$('#privacy-body').innerHTML = '<p>' + CS.esc(u.noticeIntro) + '</p><ul>' + items.map(function (t) { return '<li>' + CS.esc(t) + '</li>'; }).join('') + '</ul>';
    lastFocus = doc.activeElement;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  doc.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open-privacy]'); if (o) { e.preventDefault(); openNotice(o.getAttribute('data-open-privacy')); }
    if (e.target.closest('[data-close-dialog]') || e.target === dlg) { dlg.close ? dlg.close() : dlg.removeAttribute('open'); }
  });
  dlg.addEventListener('close', function () { lastFocus && lastFocus.focus && lastFocus.focus(); });

  /* ---------------- Init ---------------- */
  var y = CS.$('#year'); if (y) y.textContent = new Date().getFullYear();
  capture();
  CS.onLang(function () { renderPhases(); updateInd(); buildMarquee(); updateNotifyLinks(); setBurgerLabel(nav.classList.contains('is-open')); requestAnimationFrame(movePill); });
  CS.setLang(CS.lang, { force: true });
  onScroll();

  /* Fix hash-scroll for deep links after content is laid out */
  if (location.hash && CS.$(location.hash)) setTimeout(function () { CS.$(location.hash).scrollIntoView(); }, 60);
})();

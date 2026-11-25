/* ==========================================================================
   CogniSteed — Motion layer (v2)
   Intro curtain · custom cursor · eased anchor navigation · scroll-lit
   statement · pinned "Cogni + Steed" story · section index rail · hero
   spotlight. Every effect degrades gracefully and is disabled for
   prefers-reduced-motion; nothing here is required to use the site.
   ========================================================================== */
(function () {
  'use strict';
  var CS = window.CS; if (!CS) return;
  var root = document.documentElement, doc = document;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------------- 1. Intro curtain ---------------- */
  (function () {
    if (CS.reduced) { root.classList.add('is-loaded'); return; }
    var t0 = performance.now(), done = false;
    function lift() {
      if (done) return; done = true;
      setTimeout(function () { root.classList.add('is-loaded'); }, Math.max(0, 750 - (performance.now() - t0)));
    }
    var fontsReady = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1300); })]).then(lift, lift);
  })();

  /* ---------------- 2. Eased anchor navigation ---------------- */
  var anim = null;
  function easeInOut(t) { return t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; }
  function scrollToY(y) {
    if (anim) cancelAnimationFrame(anim.raf);
    var start = window.scrollY, dist = y - start;
    if (CS.reduced || Math.abs(dist) < 4) { window.scrollTo(0, y); return; }
    var dur = clamp(450 + Math.abs(dist) * 0.18, 600, 1500), t0 = performance.now();
    anim = {};
    function step(now) {
      var p = clamp((now - t0) / dur, 0, 1);
      window.scrollTo(0, start + dist * easeInOut(p));
      if (p < 1) anim.raf = requestAnimationFrame(step); else anim = null;
    }
    anim.raf = requestAnimationFrame(step);
  }
  function cancelAnim() { if (anim) { cancelAnimationFrame(anim.raf); anim = null; } }
  window.addEventListener('wheel', cancelAnim, { passive: true });
  window.addEventListener('touchstart', cancelAnim, { passive: true });
  window.addEventListener('keydown', function (e) { if (/Arrow|Page|Home|End|Space/.test(e.code)) cancelAnim(); });
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var target = doc.getElementById(id.slice(1)); if (!target) return;
    e.preventDefault();
    var offset = target.id === 'main' || target.id === 'home' ? 0 : 70;
    scrollToY(Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset));
    try { history.replaceState(null, '', location.pathname + location.search + id); } catch (er) {}
    // Move keyboard focus for accessibility without a second jump
    if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  CS.scrollToY = scrollToY;

  /* ---------------- 3. Custom cursor (decorative; native cursor stays) ---------------- */
  if (fine && !CS.reduced) {
    var cur = CS.$('.cursor'), ring = cur && cur.firstElementChild;
    if (cur) {
      root.classList.add('has-cursor');
      var mx = -100, my = -100, rx = -100, ry = -100, loop = 0;
      var tick = function () {
        rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
        ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
        loop = (Math.abs(mx - rx) + Math.abs(my - ry) > 0.3) ? requestAnimationFrame(tick) : 0;
      };
      doc.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        mx = e.clientX; my = e.clientY; cur.classList.add('is-on');
        if (!loop) loop = requestAnimationFrame(tick);
      }, { passive: true });
      doc.addEventListener('pointerover', function (e) {
        var t = e.target;
        var text = t.closest('input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea');
        var view = !text && t.closest('[data-tilt],.kc,.eq-card,.logos li');
        var link = !text && !view && t.closest('a,button,select,label,[role=tab],summary');
        cur.classList.toggle('is-text', !!text); cur.classList.toggle('is-view', !!view); cur.classList.toggle('is-link', !!link);
        cur.classList.toggle('is-dark', !!t.closest('.hero,.section--dark,.section--navy,.cta-band,.footer,.pillars'));
      });
      doc.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); });
      doc.addEventListener('mousedown', function () { ring.style.scale = '.82'; });
      doc.addEventListener('mouseup', function () { ring.style.scale = ''; });
    }
  }

  /* ---------------- 4. Hero spotlight ---------------- */
  var hero = CS.$('.hero');
  if (hero && fine && !CS.reduced) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--hx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--hy', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------------- 5. Scroll-lit statement ---------------- */
  var scrubs = [];
  function splitScrub() {
    scrubs = CS.$$('[data-scrub]').map(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w) { return '<span class="sw">' + CS.esc(w) + '</span>'; }).join(' ');
      return { el: el, words: CS.$$('.sw', el), lit: -1 };
    });
  }

  /* ---------------- 6. Pinned story ---------------- */
  var pin = CS.$('#story-pin'), progressBar = null;
  var mqPin = window.matchMedia('(min-width: 1000px) and (min-height: 700px)');
  function setupPin() {
    if (!pin) return;
    var on = mqPin.matches && !CS.reduced;
    pin.classList.toggle('is-pinned', on);
    if (on) {
      if (!progressBar) { progressBar = doc.createElement('div'); progressBar.className = 'story__progress'; progressBar.setAttribute('aria-hidden', 'true'); progressBar.innerHTML = '<i></i>'; pin.querySelector('.story__sticky').appendChild(progressBar); }
      // Elements inside the pin are choreographed by step, not by the reveal observer
      CS.$$('.reveal', pin).forEach(function (r) { r.classList.add('is-in'); });
    } else { pin.removeAttribute('data-step'); }
  }
  mqPin.addEventListener && mqPin.addEventListener('change', function () { setupPin(); onScroll(); });

  /* ---------------- 7. Section index rail ---------------- */
  var rail = CS.$('.rail'), railNum = rail && CS.$('.rail__num', rail), railLabel = rail && CS.$('.rail__label', rail), railBar = rail && CS.$('.rail__bar', rail);
  var railSections = CS.$$('main > section[id]').filter(function (s) { return s.querySelector('.eyebrow') && s.id !== 'home'; });
  var current = null;
  function railText(sec) {
    var eb = sec.querySelector('.eyebrow'), spans = CS.$$('span', eb).filter(function (s) { return !s.classList.contains('eyebrow__num'); });
    return (spans.length ? spans[spans.length - 1] : eb).textContent.trim();
  }
  function updateRail() {
    if (!rail) return;
    var mid = window.innerHeight * 0.45, found = null;
    railSections.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) found = s; });
    rail.classList.toggle('is-on', !!found && window.scrollY > window.innerHeight * 0.7);
    if (found && found !== current) {
      current = found;
      railNum.textContent = String(railSections.indexOf(found) + 1).padStart(2, '0');
      railLabel.textContent = railText(found);
    }
    if (found) { var r = found.getBoundingClientRect(); railBar.style.setProperty('--rp', clamp((mid - r.top) / r.height, 0, 1).toFixed(3)); }
  }

  /* ---------------- Scroll loop ---------------- */
  var ticking = false;
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    scrubs.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      var p = CS.reduced ? 1 : clamp((vh * 0.9 - r.top) / (r.height + vh * 0.45), 0, 1);
      var n = Math.round(p * s.words.length);
      if (n !== s.lit) { s.words.forEach(function (w, i) { w.classList.toggle('is-lit', i < n); }); s.lit = n; }
    });
    if (pin && pin.classList.contains('is-pinned')) {
      var pr = pin.getBoundingClientRect(), span = pr.height - vh;
      var sp = clamp(-pr.top / span, 0, 1);
      var step = sp < 0.14 ? 1 : sp < 0.36 ? 2 : sp < 0.6 ? 3 : 4;
      if (pin.getAttribute('data-step') !== String(step)) pin.setAttribute('data-step', step);
      if (progressBar) progressBar.style.setProperty('--sp', sp.toFixed(3));
    }
    updateRail();
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', function () { requestAnimationFrame(onScroll); });

  CS.onLang(function () { splitScrub(); current = null; onScroll(); });
  splitScrub(); setupPin(); onScroll();
})();

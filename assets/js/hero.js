/* ==========================================================================
   CogniSteed — Hero: cinematic digital steed (Canvas 2D)
   The horse geometry is derived from the original CogniSteed logo artwork
   (assets/js/horse-points.js). Particles assemble into the steed, network
   lines connect them, signal pulses travel along the constellation, and
   everything reacts to the cursor. Pauses off-screen; static when the user
   prefers reduced motion.
   ========================================================================== */
(function () {
  'use strict';
  var CS = window.CS, H = window.CS_HORSE;
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !H || !canvas.getContext) return;
  var ctx = canvas.getContext('2d', { alpha: true });
  var hero = canvas.parentElement;
  var DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  var W = 0, Hh = 0, small = false;
  var pts = [], links = [], netLinks = [], adj = [], ambient = [], pulses = [];
  var box = { x: 0, y: 0, w: 0, h: 0 };
  var mouse = { x: -9999, y: -9999, active: false, sx: 0, sy: 0 };
  var running = false, visible = true, raf = 0, t0 = performance.now(), introDone = false, lastNow = 0, artFade = 0, simT = 0;
  var scrollY = 0;

  var GOLD = '214,173,81', ICE = '207,227,255', WHITE = '255,255,255';

  /* ---------- Glow sprite ---------- */
  var glow = document.createElement('canvas'); glow.width = glow.height = 64;
  (function () { var g = glow.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(235,244,255,1)'); gr.addColorStop(0.18, 'rgba(190,220,255,.65)'); gr.addColorStop(0.5, 'rgba(120,170,255,.12)'); gr.addColorStop(1, 'rgba(120,170,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); })();
  var glowGold = document.createElement('canvas'); glowGold.width = glowGold.height = 64;
  (function () { var g = glowGold.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(0.25, 'rgba(214,173,81,.55)'); gr.addColorStop(1, 'rgba(214,173,81,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); })();

  /* Original logo artwork, revealed very faintly beneath the constellation */
  var art = new Image(), artReady = false; art.decoding = 'async';
  art.onload = function () { artReady = true; if (CS.reduced) renderStatic(); };
  setTimeout(function () { art.src = 'assets/img/horse.webp'; }, 400);

  /* ---------- Build geometry (normalized space, done once) ---------- */
  var base = [];
  for (var i = 0; i < H.pts.length; i += 3) base.push({ nx: H.pts[i], ny: H.pts[i + 1], type: H.pts[i + 2] });
  function buildLinks() {
    links = []; netLinks = []; adj = base.map(function () { return []; });
    var A = H.aspect, n = base.length, seen = {};
    function key(a, b) { return a < b ? a + '_' + b : b + '_' + a; }
    for (var a = 0; a < n; a++) {
      var pa = base[a], cand = [];
      for (var b = 0; b < n; b++) {
        if (a === b) continue;
        var pb = base[b], dx = (pa.nx - pb.nx) * A, dy = pa.ny - pb.ny, d = dx * dx + dy * dy;
        cand.push([d, b]);
      }
      cand.sort(function (x, y) { return x[0] - y[0]; });
      if (pa.type === 0) {
        // Network nodes: long constellation lines to other nodes (like the logo)
        var c = 0;
        for (var k = 0; k < cand.length && c < 4; k++) {
          var bb = cand[k][1]; if (base[bb].type !== 0 || cand[k][0] > 0.09) continue;
          var kk = key(a, bb); if (!seen[kk]) { seen[kk] = 1; netLinks.push([a, bb]); adj[a].push(bb); adj[bb].push(a); } c++;
        }
        for (k = 0; k < 6; k++) { var b2 = cand[k][1], k2 = key(a, b2); if (!seen[k2] && cand[k][0] < 0.004) { seen[k2] = 1; links.push([a, b2, 2]); } }
      } else {
        var lim = pa.type === 1 ? 2 : 3, maxD = pa.type === 1 ? 0.0009 : 0.0022;
        for (k = 0; k < lim; k++) {
          var b3 = cand[k][1]; if (cand[k][0] > maxD) break;
          var k3 = key(a, b3); if (seen[k3]) continue; seen[k3] = 1;
          var style = (pa.type === 1 && base[b3].type === 1) ? 0 : (pa.type === 3 || base[b3].type === 3) ? 3 : 1;
          links.push([a, b3, style]);
        }
      }
    }
  }
  buildLinks();

  /* ---------- Layout ---------- */
  function layout() {
    var r = hero.getBoundingClientRect();
    W = Math.max(1, r.width); Hh = Math.max(1, r.height);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(Hh * DPR);
    canvas.style.width = W + 'px'; canvas.style.height = Hh + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    small = W < 900;
    var rtl = document.documentElement.dir === 'rtl';
    if (small) {
      var vh = window.innerHeight;
      box.h = Math.min(vh * 0.4, W * 0.74); box.w = box.h * H.aspect;
      if (box.w > W * 0.92) { box.w = W * 0.92; box.h = box.w / H.aspect; }
      box.x = (W - box.w) / 2; box.y = 72;
    } else {
      box.h = Math.min(Hh * 0.78, (W * 0.5 - 40) / H.aspect); box.w = box.h * H.aspect;
      box.x = rtl ? W * 0.04 : W - box.w - W * 0.04; box.y = (Hh - box.h) / 2 + 10;
    }
    var first = pts.length === 0;
    if (first) {
      pts = base.map(function (b, i) {
        if (small && b.type === 4 && i % 2) return null;
        var ang = Math.random() * Math.PI * 2, rad = Math.max(W, Hh) * (0.6 + Math.random() * 0.5);
        return { b: b, i: i, x: W / 2 + Math.cos(ang) * rad, y: Hh / 2 + Math.sin(ang) * rad, vx: 0, vy: 0,
          delay: b.nx * 700 + (1 - b.ny) * 250 + Math.random() * 500, ph: Math.random() * 6.283,
          sx: (Math.random() - 0.5) * 2, sy: (Math.random() - 0.5) * 2 - 0.5,
          size: b.type === 0 ? 2.4 : b.type === 3 ? 1.7 : b.type === 1 ? 1.35 : b.type === 2 ? 1.05 : 0.85 };
      });
      var count = small ? 34 : 70;
      ambient = [];
      for (var a = 0; a < count; a++) ambient.push({ x: Math.random() * W, y: Math.random() * Hh, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.2 + 0.4 });
    }
    pts.forEach(function (p) { if (!p) return; p.hx = box.x + p.b.nx * box.w; p.hy = box.y + p.b.ny * box.h; });
    if (CS.reduced) { pts.forEach(function (p) { if (p) { p.x = p.hx; p.y = p.hy; } }); introDone = true; }
  }

  /* ---------- Pulses along the network ---------- */
  function spawnPulse(from) {
    var a = from != null ? from : netLinks.length ? netLinks[(Math.random() * netLinks.length) | 0][0] : -1;
    if (a < 0 || !adj[a].length || !pts[a]) return null;
    var b = adj[a][(Math.random() * adj[a].length) | 0];
    if (!pts[b]) return null;
    return { a: a, b: b, t: 0, sp: 0.008 + Math.random() * 0.01, life: 3 + (Math.random() * 4 | 0) };
  }

  /* ---------- Frame ---------- */
  function frame(now) {
    raf = 0;
    var dt = lastNow ? Math.min(50, now - lastNow) : 16.67; lastNow = now;
    var k = dt / 16.67; simT += dt;
    var t = CS.reduced ? now - t0 : simT;
    var damp = Math.pow(0.86, k);
    ctx.clearRect(0, 0, W, Hh);
    // Smooth mouse parallax of the whole steed
    var tx = mouse.active ? (mouse.x - W / 2) * -0.018 : 0, ty = mouse.active ? (mouse.y - Hh / 2) * -0.018 : 0;
    mouse.sx += (tx - mouse.sx) * 0.05; mouse.sy += (ty - mouse.sy) * 0.05;
    var ox = mouse.sx, oy = mouse.sy - Math.min(scrollY, Hh) * 0.12;
    var fade = Math.max(0, 1 - scrollY / (Hh * 0.9));

    /* Ambient connected field (reacts to cursor) */
    var amb = ambient, i, j, p, q, dx, dy, d;
    ctx.lineWidth = 0.6;
    for (i = 0; i < amb.length; i++) {
      p = amb[i];
      if (!CS.reduced) { p.x += p.vx * k; p.y += p.vy * k; if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = Hh + 10; if (p.y > Hh + 10) p.y = -10; }
      for (j = i + 1; j < amb.length; j++) {
        q = amb[j]; dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
        if (d < 12100) { ctx.strokeStyle = 'rgba(' + WHITE + ',' + (0.07 * (1 - d / 12100)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      if (mouse.active) {
        dx = p.x - mouse.x; dy = p.y - mouse.y; d = dx * dx + dy * dy;
        if (d < 32000) { ctx.strokeStyle = 'rgba(' + GOLD + ',' + (0.4 * (1 - d / 32000)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
      ctx.fillStyle = 'rgba(' + WHITE + ',.35)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }

    /* Steed particles: spring physics + cursor repulsion */
    var settled = 0, R = small ? 90 : 130, R2 = R * R;
    /* Scroll storytelling: the steed disperses into the network as the visitor scrolls on */
    var disp = CS.reduced ? 0 : Math.min(1, scrollY / (Hh * 0.75)); disp = disp * disp;
    var dW = W * 0.45 * disp, dH = Hh * 0.5 * disp;
    for (i = 0; i < pts.length; i++) {
      p = pts[i]; if (!p) continue;
      if (!CS.reduced) {
        var active = t > p.delay;
        var hx = p.hx + ox + Math.sin(t * 0.0011 + p.ph) * 1.4 + p.sx * dW, hy = p.hy + oy + Math.cos(t * 0.0013 + p.ph) * 1.4 + p.sy * dH;
        if (active) { p.vx += (hx - p.x) * 0.022 * k; p.vy += (hy - p.y) * 0.022 * k; }
        if (mouse.active) {
          dx = p.x - mouse.x; dy = p.y - mouse.y; d = dx * dx + dy * dy;
          if (d < R2 && d > 0.01) { var dd = Math.sqrt(d), f = (1 - dd / R); f = f * f * 7 * k; p.vx += dx / dd * f; p.vy += dy / dd * f; }
        }
        p.vx *= damp; p.vy *= damp; p.x += p.vx * k; p.y += p.vy * k;
        if (Math.abs(hx - p.x) < 2 && Math.abs(hy - p.y) < 2) settled++;
      } else { p.x = p.hx; p.y = p.hy + oy; settled++; }
    }
    if (!introDone && settled > pts.length * 0.8) introDone = true;
    var intro = CS.reduced ? 1 : Math.min(1, t / 2600);
    ctx.globalAlpha = fade;

    if (artReady) { ctx.save(); if (introDone && artFade < 1) artFade = Math.min(1, artFade + dt / 2200); ctx.globalAlpha = fade * 0.12 * artFade; ctx.globalCompositeOperation = 'screen'; ctx.drawImage(art, box.x + ox, box.y + oy, box.w, box.h); ctx.restore(); ctx.globalAlpha = fade; }
    /* Lines, batched by style */
    var styles = [
      ['rgba(' + GOLD + ',' + (0.42 * intro).toFixed(3) + ')', 0.8],
      ['rgba(' + ICE + ',' + (0.13 * intro).toFixed(3) + ')', 0.6],
      ['rgba(' + ICE + ',' + (0.3 * intro).toFixed(3) + ')', 0.8],
      ['rgba(' + GOLD + ',' + (0.6 * intro).toFixed(3) + ')', 1]
    ];
    for (var s = 0; s < styles.length; s++) {
      ctx.strokeStyle = styles[s][0]; ctx.lineWidth = styles[s][1]; ctx.beginPath();
      for (i = 0; i < links.length; i++) {
        var L = links[i]; if (L[2] !== s) continue; p = pts[L[0]]; q = pts[L[1]]; if (!p || !q) continue;
        dx = p.x - q.x; dy = p.y - q.y; if (dx * dx + dy * dy > 3600) continue;
        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    }
    /* Constellation network (logo lines) */
    ctx.strokeStyle = 'rgba(' + ICE + ',' + (0.5 * intro).toFixed(3) + ')'; ctx.lineWidth = 0.9; ctx.beginPath();
    var nl2 = Math.pow(box.w * 0.45, 2);
    for (i = 0; i < netLinks.length; i++) { p = pts[netLinks[i][0]]; q = pts[netLinks[i][1]]; if (!p || !q) continue; dx = p.x - q.x; dy = p.y - q.y; if (dx * dx + dy * dy > nl2) continue; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
    ctx.stroke();

    /* Dots */
    for (var ty2 = 1; ty2 <= 4; ty2++) {
      ctx.fillStyle = ty2 === 3 ? 'rgba(' + GOLD + ',.95)' : ty2 === 1 ? 'rgba(' + GOLD + ',.8)' : 'rgba(' + ICE + ',' + (ty2 === 2 ? 0.7 : 0.45) + ')';
      ctx.beginPath();
      for (i = 0; i < pts.length; i++) { p = pts[i]; if (!p || p.b.type !== ty2) continue; ctx.moveTo(p.x + p.size, p.y); ctx.arc(p.x, p.y, p.size, 0, 6.283); }
      ctx.fill();
    }
    /* Network nodes with breathing glow */
    for (i = 0; i < pts.length; i++) {
      p = pts[i]; if (!p || p.b.type !== 0) continue;
      var g = 16 + Math.sin(t * 0.002 + p.ph) * 4;
      ctx.drawImage(glow, p.x - g, p.y - g, g * 2, g * 2);
      ctx.fillStyle = '#f2f8ff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2.1, 0, 6.283); ctx.fill();
    }
    /* Pulses */
    if (!CS.reduced && introDone) {
      while (pulses.length < (small ? 4 : 8)) { var np = spawnPulse(); if (!np) break; pulses.push(np); }
      for (i = pulses.length - 1; i >= 0; i--) {
        var P = pulses[i]; P.t += P.sp * 1.6 * k;
        var a = pts[P.a], b = pts[P.b];
        if (!a || !b) { pulses.splice(i, 1); continue; }
        var x = a.x + (b.x - a.x) * P.t, y = a.y + (b.y - a.y) * P.t;
        ctx.drawImage(glowGold, x - 9, y - 9, 18, 18);
        if (P.t >= 1) {
          P.life--;
          var nx = P.life > 0 ? spawnPulse(P.b) : null;
          if (nx) { nx.life = P.life; pulses[i] = nx; } else pulses.splice(i, 1);
        }
      }
    }
    ctx.globalAlpha = 1;
    if (running && !CS.reduced) raf = requestAnimationFrame(frame);
  }

  function start() { if (running || CS.reduced) return; running = true; lastNow = 0; if (!raf) raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  function renderStatic() { stop(); introDone = true; artFade = 1; frame(performance.now()); }

  /* ---------- Events ---------- */
  hero.addEventListener('pointermove', function (e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true; });
  hero.addEventListener('pointerleave', function () { mouse.active = false; mouse.x = mouse.y = -9999; });
  hero.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') { mouse.active = false; mouse.x = mouse.y = -9999; } });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(); if (CS.reduced) renderStatic(); }, 120); });
  window.addEventListener('scroll', function () { scrollY = window.scrollY; if (CS.reduced) renderStatic(); }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (visible) start(); });
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); else stop(); }, { threshold: 0 }).observe(hero);
  CS.onLang(function () { layout(); if (CS.reduced) renderStatic(); });
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener && mq.addEventListener('change', function () { if (mq.matches) { layout(); renderStatic(); } else start(); });

  layout();
  if (CS.reduced) renderStatic(); else start();
})();

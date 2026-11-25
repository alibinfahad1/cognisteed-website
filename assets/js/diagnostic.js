/* ==========================================================================
   CogniSteed — Smart Strategic Diagnostic (rule-based, runs in the browser)
   Rules (also explained to the user on the results screen):
   • Maturity per pillar = average of its two statements (1–5).
   • Need score = (5 − maturity) / 4 × 100, +25 if the matching challenge is
     selected (capped at 100).
   • Services are ranked by need; up to three with need ≥ 35 are recommended.
   • Suggested starting phase from the overall maturity.
   ========================================================================== */
(function () {
  'use strict';
  var CS = window.CS; if (!CS) return;
  var box = CS.$('#diag'); if (!box) return;

  var T = {
    ar: {
      step: 'الخطوة', of: 'من', back: 'السابق', next: 'التالي', finish: 'اعرض النتائج', restart: 'ابدأ من جديد',
      s0t: 'تعريف بالمؤسسة', s0d: 'معلومات عامة تساعد على قراءة النتائج في سياقها.', sector: 'القطاع', sectorPh: 'اختر القطاع (اختياري)', size: 'حجم المؤسسة (عدد الموظفين)',
      sizes: ['أقل من 50', '50 – 250', '250 – 1000', 'أكثر من 1000'],
      s1t: 'الاستراتيجية والتنفيذ', s2t: 'البيانات والعمليات', s3t: 'الأفراد والمعرفة', sQd: 'إلى أي مدى تنطبق العبارات التالية على مؤسستك؟',
      s4t: 'التحديات الحالية', s4d: 'اختر تحديًا أو أكثر — يرفع ذلك أولوية الخدمة المرتبطة به.', urgency: 'متى تحتاج إلى البدء؟',
      urg: ['خلال شهر', 'خلال 3 أشهر', 'خلال 6 أشهر', 'نستكشف الخيارات'],
      scale: ['لا أوافق بشدة', 'لا أوافق', 'محايد', 'أوافق', 'أوافق بشدة'], scaleLo: 'لا أوافق بشدة', scaleHi: 'أوافق بشدة',
      errAll: 'يُرجى الإجابة عن جميع العبارات للمتابعة.', errSize: 'يُرجى اختيار حجم المؤسسة.',
      resT: 'نتيجة التشخيص الاسترشادي', resD: 'ملخص يقارن نضج مؤسستك في الركائز الست ويقترح نقطة الانطلاق.',
      radar: 'مستوى النضج حسب الركيزة (من 5)', overall: 'النضج العام', recsT: 'الخدمات المقترحة كنقطة انطلاق', startPhase: 'مرحلة البدء المقترحة من منهجيتنا',
      maturity: 'النضج', need: 'الأولوية', chosen: 'ضمن التحديات المختارة', none: 'نتائجك قوية في جميع الركائز؛ نقترح التركيز على الاستدامة وتعظيم القيمة.',
      levels: ['مبدئي', 'نامٍ', 'راسخ', 'متقدم'],
      dims: ['الاستراتيجية والحوكمة', 'تنفيذ المشاريع', 'البيانات والذكاء الاصطناعي', 'العمليات والتنظيم', 'الأفراد والقدرات', 'الأدلة والدراسات'],
      rulesT: 'كيف حُسبت النتيجة؟', rules: 'النضج = متوسط عبارتي كل ركيزة. الأولوية = (5 − النضج) ÷ 4 × 100، مع إضافة 25 نقطة إذا اخترت التحدي المرتبط. تُقترح حتى ثلاث خدمات أولويتها 35 فأكثر.',
      disclaimer: 'نتيجة استرشادية مبنية على قواعد ثابتة وإجاباتك فقط، ولا تُعد استشارة مهنية. لم تُرسَل أي بيانات من متصفحك.',
      print: 'طباعة / حفظ PDF', toForm: 'حوّل التشخيص إلى طلب استشارة', date: 'التاريخ', reportFor: 'تقرير التشخيص الاستراتيجي — CogniSteed',
      formIntro: 'ملخص التشخيص المرفق بطلبك:', toast: 'أُضيف ملخص التشخيص إلى نموذج الطلب', profile: 'الملف', urgencyL: 'موعد البدء'
    },
    en: {
      step: 'Step', of: 'of', back: 'Back', next: 'Next', finish: 'See results', restart: 'Start over',
      s0t: 'About your organization', s0d: 'General context that helps interpret the results.', sector: 'Sector', sectorPh: 'Select sector (optional)', size: 'Organization size (employees)',
      sizes: ['Under 50', '50 – 250', '250 – 1,000', 'Over 1,000'],
      s1t: 'Strategy & delivery', s2t: 'Data & processes', s3t: 'People & knowledge', sQd: 'How well do these statements describe your organization?',
      s4t: 'Current challenges', s4d: 'Pick one or more — this raises the priority of the related service.', urgency: 'When do you need to start?',
      urg: ['Within a month', 'Within 3 months', 'Within 6 months', 'Exploring options'],
      scale: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'], scaleLo: 'Strongly disagree', scaleHi: 'Strongly agree',
      errAll: 'Please answer every statement to continue.', errSize: 'Please select your organization size.',
      resT: 'Your indicative diagnostic', resD: 'A summary of maturity across the six pillars and a suggested starting point.',
      radar: 'Maturity by pillar (out of 5)', overall: 'Overall maturity', recsT: 'Suggested services to start with', startPhase: 'Suggested starting phase of our methodology',
      maturity: 'Maturity', need: 'Priority', chosen: 'among selected challenges', none: 'Your results are strong across all pillars; we suggest focusing on sustaining and scaling value.',
      levels: ['Initial', 'Developing', 'Established', 'Advanced'],
      dims: ['Strategy & governance', 'Project delivery', 'Data & AI', 'Processes & organization', 'People & capability', 'Evidence & research'],
      rulesT: 'How was this calculated?', rules: 'Maturity = average of the two statements per pillar. Priority = (5 − maturity) ÷ 4 × 100, plus 25 points if you selected the related challenge. Up to three services with priority ≥ 35 are suggested.',
      disclaimer: 'Indicative result based on fixed rules and your answers only — not professional advice. No data has left your browser.',
      print: 'Print / save PDF', toForm: 'Turn this into a consultation request', date: 'Date', reportFor: 'Strategic Diagnostic Report — CogniSteed',
      formIntro: 'Diagnostic summary attached to your request:', toast: 'Diagnostic summary added to the request form', profile: 'Profile', urgencyL: 'Start'
    }
  };
  var Q = [
    { d: 0, ar: 'لدينا أولويات استراتيجية واضحة ومعتمدة ومفهومة لدى الفرق.', en: 'We have clear, approved strategic priorities that teams understand.' },
    { d: 0, ar: 'نتابع تنفيذ الاستراتيجية بمؤشرات أداء وحوكمة منتظمة.', en: 'We track strategy execution with KPIs and regular governance.' },
    { d: 1, ar: 'تُسلَّم مشاريعنا غالبًا في الوقت والميزانية المحددين.', en: 'Our projects are usually delivered on time and on budget.' },
    { d: 1, ar: 'لدينا مكتب أو منهجية موحدة لإدارة المشاريع والمحافظ.', en: 'We have a PMO or a standard method for managing projects and portfolios.' },
    { d: 2, ar: 'تعتمد قراراتنا على بيانات موثوقة ولوحات متابعة محدثة.', en: 'Our decisions rely on trusted data and up-to-date dashboards.' },
    { d: 2, ar: 'حددنا حالات استخدام واضحة للذكاء الاصطناعي أو الأتمتة.', en: 'We have identified clear use cases for AI or automation.' },
    { d: 3, ar: 'إجراءاتنا موثقة ومحدثة وواضحة المسؤوليات.', en: 'Our processes are documented, current and have clear ownership.' },
    { d: 3, ar: 'هيكلنا التنظيمي ونموذج التشغيل يدعمان أهدافنا الحالية.', en: 'Our structure and operating model support our current goals.' },
    { d: 4, ar: 'نحلل الاحتياجات التدريبية بشكل منهجي ومرتبط بالأهداف.', en: 'We analyze training needs systematically and link them to goals.' },
    { d: 4, ar: 'نقيس أثر برامج التدريب على الأداء الفعلي.', en: 'We measure the impact of training on actual performance.' },
    { d: 5, ar: 'نستند إلى دراسات سوق أو مقارنات معيارية في قرارات التوسع والاستثمار.', en: 'We use market studies or benchmarks for growth and investment decisions.' },
    { d: 5, ar: 'نقيّم المبادرات بعد تنفيذها ونقيس عائدها.', en: 'We evaluate initiatives after delivery and measure their return.' }
  ];
  var STEPS = [{ k: 'profile' }, { k: 'q', title: 's1t', qs: [0, 1, 2, 3] }, { k: 'q', title: 's2t', qs: [4, 5, 6, 7] }, { k: 'q', title: 's3t', qs: [8, 9, 10, 11] }, { k: 'challenges' }, { k: 'result' }];
  var S = { step: 0, sector: '', size: null, ans: {}, ch: [], urg: null, err: '' };
  var radarChart = null;
  function t(k) { return T[CS.lang][k]; }
  function n(v, o) { return CS.num(v, o); }

  /* ---------------- Scoring ---------------- */
  function compute() {
    var mat = [0, 1, 2, 3, 4, 5].map(function (d) {
      var vals = Q.map(function (q, i) { return q.d === d ? S.ans[i] : null; }).filter(function (v) { return v != null; });
      return vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
    });
    var need = mat.map(function (m, d) { return Math.min(100, Math.round((5 - m) / 4 * 100 + (S.ch.indexOf(d) > -1 ? 25 : 0))); });
    var order = [0, 1, 2, 3, 4, 5].sort(function (a, b) { return need[b] - need[a] || (S.ch.indexOf(b) > -1) - (S.ch.indexOf(a) > -1) || a - b; });
    var recs = order.filter(function (d) { return need[d] >= 35; }).slice(0, 3);
    var overall = mat.reduce(function (a, b) { return a + b; }, 0) / 6;
    var phase = overall < 2.5 ? 0 : overall < 3.5 ? 1 : 4;
    return { mat: mat, need: need, recs: recs, overall: overall, phase: phase };
  }
  function level(m) { return t('levels')[m < 2 ? 0 : m < 3 ? 1 : m < 4 ? 2 : 3]; }

  /* ---------------- Render ---------------- */
  function render(focus) {
    if (radarChart) { radarChart.destroy(); radarChart = null; }
    var st = STEPS[S.step], total = STEPS.length - 1, html = '';
    html += '<div class="diag__top"><ol class="steps" aria-hidden="true">' + STEPS.slice(0, total).map(function (_, i) { return '<li class="' + (i < S.step || st.k === 'result' ? 'is-done' : i === S.step ? 'is-done' : '') + '"></li>'; }).join('') + '</ol>' +
      '<div class="diag__meta"><span>' + (st.k === 'result' ? t('resT') : t('step') + ' ' + n(S.step + 1) + ' ' + t('of') + ' ' + n(total)) + '</span><span>' + (st.k === 'result' ? '' : n(Math.round(S.step / total * 100)) + '%') + '</span></div></div>';
    html += '<div class="diag__body"><div class="diag__step" id="diag-step">';
    if (st.k === 'profile') {
      html += '<h3 tabindex="-1">' + t('s0t') + '</h3><p>' + t('s0d') + '</p><div class="diag__fields">' +
        '<div class="field"><label for="dg-sector">' + t('sector') + '</label><select id="dg-sector"><option value="">' + t('sectorPh') + '</option>' +
        CS.data.sectors.map(function (s, i) { return '<option value="' + i + '"' + (String(S.sector) === String(i) ? ' selected' : '') + '>' + CS.esc(CS.L(s)) + '</option>'; }).join('') + '</select></div>' +
        '<fieldset class="field" style="border:0;padding:0;margin:0"><legend style="font-size:14px;font-weight:600;margin-bottom:6px">' + t('size') + ' <span class="req">*</span></legend><div class="chips" style="margin-top:0">' +
        t('sizes').map(function (s, i) { return '<button type="button" class="chip" data-size="' + i + '" aria-pressed="' + (S.size === i) + '">' + CS.esc(s) + '</button>'; }).join('') + '</div></fieldset></div>';
    } else if (st.k === 'q') {
      html += '<h3 tabindex="-1">' + t(st.title) + '</h3><p>' + t('sQd') + '</p>';
      st.qs.forEach(function (qi) {
        var q = Q[qi];
        html += '<fieldset class="q' + (S.err && S.ans[qi] == null ? ' has-error' : '') + '" style="border-width:1px;border-style:solid" data-q="' + qi + '"><legend><span class="q__dim">' + CS.esc(t('dims')[q.d]) + '</span>' + CS.esc(q[CS.lang]) + '</legend><div class="scale">' +
          [1, 2, 3, 4, 5].map(function (v) { var id = 'q' + qi + 'v' + v; return '<input type="radio" id="' + id + '" name="q' + qi + '" value="' + v + '"' + (S.ans[qi] === v ? ' checked' : '') + '><label for="' + id + '"><b lang="en">' + v + '</b>' + CS.esc(t('scale')[v - 1]) + '</label>'; }).join('') +
          '</div><div class="scale-legend" aria-hidden="true"><span>' + t('scaleLo') + '</span><span>' + t('scaleHi') + '</span></div></fieldset>';
      });
    } else if (st.k === 'challenges') {
      html += '<h3 tabindex="-1">' + t('s4t') + '</h3><p>' + t('s4d') + '</p><div class="chips" role="group" aria-label="' + t('s4t') + '">' +
        CS.data.challenges.map(function (c, i) { return '<button type="button" class="chip" data-ch="' + i + '" aria-pressed="' + (S.ch.indexOf(i) > -1) + '">' + CS.esc(CS.L(c)) + '</button>'; }).join('') + '</div>' +
        '<p style="margin-top:26px;font-weight:600;color:var(--navy)">' + t('urgency') + '</p><div class="chips" role="group" aria-label="' + t('urgency') + '" style="margin-top:10px">' +
        t('urg').map(function (u, i) { return '<button type="button" class="chip" data-urg="' + i + '" aria-pressed="' + (S.urg === i) + '">' + CS.esc(u) + '</button>'; }).join('') + '</div>';
    } else html += renderResult();
    html += '</div></div>';
    if (st.k !== 'result') {
      html += '<div class="diag__nav"><button type="button" class="btn btn--line" id="dg-back"' + (S.step === 0 ? ' disabled' : '') + '>' + t('back') + '</button>' +
        '<p class="diag__err" id="dg-err" role="alert">' + (S.err ? CS.esc(S.err) : '') + '</p>' +
        '<button type="button" class="btn btn--navy magnetic" id="dg-next">' + (st.k === 'challenges' ? t('finish') : t('next')) + '<svg class="ico ico--flip" aria-hidden="true"><use href="#i-arrow"/></svg></button></div>';
    }
    box.innerHTML = html;
    CS.$$('.btn', box).forEach(CS.bindMagnetic);
    bind();
    if (st.k === 'result') drawRadar();
    if (focus) { var h = CS.$('#diag-step h3', box); if (h) h.focus({ preventScroll: true }); var top = box.getBoundingClientRect().top; if (top < 0 || top > window.innerHeight * 0.4) box.scrollIntoView({ behavior: CS.reduced ? 'auto' : 'smooth', block: 'start' }); }
  }

  function renderResult() {
    var R = compute(), today = new Date().toLocaleDateString(CS.lang === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    var prof = [S.sector !== '' ? CS.L(CS.data.sectors[+S.sector]) : null, S.size != null ? t('sizes')[S.size] : null].filter(Boolean).join(' · ');
    var ph = CS.L(CS.data.phases[R.phase]);
    var h = '<div class="print-only" style="margin-bottom:18px"><img src="assets/img/mark.webp" alt="" width="60" style="width:60px"><h2 style="font-size:22px;margin-top:8px">' + t('reportFor') + '</h2><p>' + t('date') + ': ' + today + (prof ? ' · ' + t('profile') + ': ' + CS.esc(prof) : '') + '</p></div>';
    h += '<h3 tabindex="-1">' + t('resT') + '</h3><p>' + t('resD') + '</p><div class="result" style="margin-top:22px"><div>' +
      '<p style="font-weight:700;font-size:14px">' + t('radar') + '</p><div class="result__radar"><canvas id="dg-radar" role="img" aria-label="' + t('radar') + '"></canvas></div>' +
      '<div class="scores">' + R.mat.map(function (m, d) { return '<div class="score"><span>' + CS.esc(t('dims')[d]) + '</span><b lang="en">' + n(m, { maximumFractionDigits: 1 }) + '</b><span class="muted">' + level(m) + '</span></div>'; }).join('') + '</div></div><div>' +
      '<div class="kpi" style="display:flex;justify-content:space-between;align-items:center"><div><p class="kpi__l">' + t('overall') + '</p><p class="kpi__v">' + n(R.overall, { maximumFractionDigits: 1 }) + ' / 5</p></div><span class="status status--' + (R.overall < 2.5 ? 'risk' : R.overall < 3.5 ? 'watch' : 'ok') + '">' + level(R.overall) + '</span></div>' +
      '<p style="font-weight:700;margin-top:20px">' + t('recsT') + '</p><div class="recs">' +
      (R.recs.length ? R.recs.map(function (d, i) {
        return '<div class="rec"><span class="rec__n" lang="en">0' + (d + 1) + '</span><span class="rec__t">' + CS.esc(CS.L(CS.data.services[d])) + '</span><span class="rec__why">' + t('maturity') + ' ' + n(R.mat[d], { maximumFractionDigits: 1 }) + '/5 · ' + t('need') + ' ' + n(R.need[d]) + '/100' + (S.ch.indexOf(d) > -1 ? ' · ' + t('chosen') : '') + '</span></div>';
      }).join('') : '<div class="rec"><span class="rec__n" lang="en">06</span><span class="rec__t">' + CS.esc(ph.t) + '</span><span class="rec__why">' + t('none') + '</span></div>') + '</div>' +
      '<div class="kpi" style="margin-top:14px"><p class="kpi__l">' + t('startPhase') + '</p><p style="font-weight:700;font-size:17px;margin-top:4px"><span lang="en" style="color:var(--terra)">0' + (R.phase + 1) + '</span> — ' + CS.esc(ph.t) + '</p><p class="kpi__s">' + CS.esc(ph.o.join(' · ')) + '</p></div>' +
      '</div></div>' +
      '<details class="result__note" style="background:var(--paper);border:1px solid var(--line);color:var(--text-2)"><summary style="cursor:pointer;font-weight:700">' + t('rulesT') + '</summary><p style="margin-top:8px">' + t('rules') + '</p></details>' +
      '<p class="result__note">' + t('disclaimer') + '</p>' +
      '<div class="result__actions"><button type="button" class="btn btn--gold magnetic" id="dg-form">' + t('toForm') + '<svg class="ico ico--flip" aria-hidden="true"><use href="#i-arrow"/></svg></button>' +
      '<button type="button" class="btn btn--navy" id="dg-print"><svg class="ico" aria-hidden="true"><use href="#i-print"/></svg>' + t('print') + '</button>' +
      '<button type="button" class="btn btn--line" id="dg-restart"><svg class="ico" aria-hidden="true"><use href="#i-refresh"/></svg>' + t('restart') + '</button></div>';
    return h;
  }

  function drawRadar() {
    var cv = CS.$('#dg-radar', box), R = compute();
    CS.loadChart().then(function (Chart) {
      if (!document.body.contains(cv)) return;
      radarChart = new Chart(cv, { type: 'radar', data: { labels: t('dims'), datasets: [{ label: t('maturity'), data: R.mat.map(function (m) { return +m.toFixed(2); }), borderColor: '#102345', backgroundColor: 'rgba(214,173,81,.28)', pointBackgroundColor: '#C1521F', pointRadius: 4, borderWidth: 2 }] },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { rtl: CS.lang === 'ar' } }, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, backdropColor: 'transparent', font: { size: 10 } }, pointLabels: { font: { size: 11.5, weight: '700' }, color: '#102345' }, grid: { color: '#E3E8EF' }, angleLines: { color: '#E3E8EF' } } } } });
    }).catch(function () {
      // Fallback: accessible text already lists every score; show a note in place of the chart
      cv.parentNode.innerHTML = '<p class="empty">' + R.mat.map(function (m, d) { return CS.esc(t('dims')[d]) + ': ' + n(m, { maximumFractionDigits: 1 }); }).join(' · ') + '</p>';
    });
  }

  /* ---------------- Interactions ---------------- */
  function validate() {
    var st = STEPS[S.step];
    if (st.k === 'profile' && S.size == null) return t('errSize');
    if (st.k === 'q' && st.qs.some(function (qi) { return S.ans[qi] == null; })) return t('errAll');
    return '';
  }
  function bind() {
    var st = STEPS[S.step];
    box.onchange = function (e) {
      if (e.target.id === 'dg-sector') S.sector = e.target.value;
      if (e.target.type === 'radio') { var qi = +e.target.name.slice(1); S.ans[qi] = +e.target.value; var fs = e.target.closest('.q'); fs && fs.classList.remove('has-error'); if (S.err && !validate()) { S.err = ''; CS.$('#dg-err', box).textContent = ''; } }
    };
    box.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.size != null) { S.size = +b.dataset.size; CS.$$('[data-size]', box).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); S.err = ''; var er = CS.$('#dg-err', box); if (er) er.textContent = ''; }
      else if (b.dataset.ch != null) { var c = +b.dataset.ch, k = S.ch.indexOf(c); if (k < 0) S.ch.push(c); else S.ch.splice(k, 1); b.setAttribute('aria-pressed', String(k < 0)); }
      else if (b.dataset.urg != null) { S.urg = S.urg === +b.dataset.urg ? null : +b.dataset.urg; CS.$$('[data-urg]', box).forEach(function (x) { x.setAttribute('aria-pressed', String(+x.dataset.urg === S.urg)); }); }
      else if (b.id === 'dg-back') { S.err = ''; S.step = Math.max(0, S.step - 1); render(true); }
      else if (b.id === 'dg-next') {
        var err = validate();
        if (err) {
          S.err = err; CS.$('#dg-err', box).textContent = err;
          if (st.k === 'q') { st.qs.forEach(function (qi) { if (S.ans[qi] == null) CS.$('[data-q="' + qi + '"]', box).classList.add('has-error'); }); var first = CS.$('.q.has-error input', box); first && first.focus(); }
          else { var f = CS.$('[data-size]', box); f && f.focus(); }
          return;
        }
        S.err = ''; S.step++; render(true);
      }
      else if (b.id === 'dg-restart') { S.step = 0; S.ans = {}; S.ch = []; S.size = null; S.sector = ''; S.urg = null; render(true); }
      else if (b.id === 'dg-print') printReport();
      else if (b.id === 'dg-form') toForm();
    };
  }

  function summaryText() {
    var R = compute(), lines = [];
    lines.push(t('reportFor'));
    var prof = [S.sector !== '' ? CS.L(CS.data.sectors[+S.sector]) : null, S.size != null ? t('sizes')[S.size] : null].filter(Boolean).join(' · ');
    if (prof) lines.push(t('profile') + ': ' + prof);
    lines.push(t('overall') + ': ' + R.overall.toFixed(1) + '/5');
    R.mat.forEach(function (m, d) { lines.push('- ' + t('dims')[d] + ': ' + m.toFixed(1) + '/5'); });
    if (S.ch.length) lines.push(t('s4t') + ': ' + S.ch.map(function (c) { return CS.L(CS.data.challenges[c]); }).join(CS.lang === 'ar' ? '، ' : ', '));
    if (S.urg != null) lines.push(t('urgencyL') + ': ' + t('urg')[S.urg]);
    lines.push(t('recsT') + ': ' + (R.recs.length ? R.recs.map(function (d) { return CS.L(CS.data.services[d]); }).join(' | ') : '—'));
    return { text: lines.join('\n'), R: R };
  }
  function toForm() {
    var s = summaryText(), R = s.R;
    CS.prefill({
      service: R.recs.length ? R.recs[0] : null,
      sector: S.sector !== '' ? +S.sector : null,
      message: s.text,
      diag: '<strong>' + CS.esc(t('formIntro')) + '</strong> ' + CS.esc(t('overall')) + ' ' + R.overall.toFixed(1) + '/5 — ' + CS.esc(R.recs.map(function (d) { return CS.L(CS.data.services[d]); }).join('، ')),
      toast: t('toast')
    });
    CS.$('#contact').scrollIntoView({ behavior: CS.reduced ? 'auto' : 'smooth' });
    setTimeout(function () { var f = CS.$('#f-name'); f && f.focus({ preventScroll: true }); }, CS.reduced ? 0 : 700);
  }
  function printReport() {
    var holder = CS.$('.result__radar', box), img = null;
    if (radarChart) { img = new Image(); img.alt = t('radar'); img.src = radarChart.toBase64Image('image/png', 1); img.className = 'print-only'; holder.appendChild(img); CS.$('canvas', holder).classList.add('screen-only'); }
    document.body.classList.add('printing-diag');
    var done = function () { document.body.classList.remove('printing-diag'); if (img) { img.remove(); } window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(function () { window.print(); }, 60);
  }

  CS.onLang(function () { render(false); });
  render(false);
})();

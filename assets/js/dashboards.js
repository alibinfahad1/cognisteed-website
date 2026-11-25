/* ==========================================================================
   CogniSteed — Interactive demo dashboards (Chart.js)
   ALL DATA BELOW IS FICTIONAL SAMPLE DATA FOR DEMONSTRATION ONLY.
   It does not represent any real client, project or result.
   ========================================================================== */
(function () {
  'use strict';
  var CS = window.CS; if (!CS) return;
  var C = { navy: '#102345', navy2: '#3B5486', gold: '#D6AD51', terra: '#C1521F', slate: '#8C9BB5', light: '#C9D3E3', green: '#2E8B57' };

  var T = {
    ar: {
      all: 'الكل', filterPortfolio: 'المحفظة', filterStatus: 'الحالة', filterPeriod: 'الفترة', filterUnit: 'الوحدة', filterProgram: 'البرنامج', filterSector: 'القطاع', filterView: 'العرض',
      pmoT: 'لوحة المحفظة', pmoS: 'معاينة CogniSteed PMO — بيانات تجريبية',
      projects: 'المشاريع', onTrack: 'ضمن الخطة', watch: 'تحت المراقبة', highRisk: 'مخاطر مرتفعة', budgetUse: 'استهلاك الميزانية',
      progress: 'الإنجاز', planned: 'المخطط', actual: 'الفعلي', budget: 'الميزانية', spent: 'المصروف', viewProgress: 'الإنجاز', viewBudget: 'الميزانية',
      progressChart: 'الإنجاز الفعلي مقابل المخطط (%)', budgetChart: 'الميزانية مقابل المصروف (مليون ريال)', statusChart: 'توزيع حالة المشاريع',
      project: 'المشروع', portfolio: 'المحفظة', status: 'الحالة', noData: 'لا توجد مشاريع مطابقة لعوامل التصفية.',
      pf: ['التحول الرقمي', 'تأسيس PMO', 'بناء القدرات'],
      insT: 'لوحة المؤشرات التنفيذية', insS: 'معاينة CogniSteed Insights — بيانات تجريبية',
      m6: '6 أشهر', m12: '12 شهرًا', units: ['العمليات', 'خدمة العملاء', 'المالية', 'رأس المال البشري'],
      kpiAch: 'تحقق المؤشرات الاستراتيجية', kpiOn: 'مؤشرات على المستهدف', initDone: 'مبادرات مكتملة', dq: 'جودة البيانات',
      trendChart: 'الأداء الفعلي مقابل المستهدف', perspChart: 'التحقق حسب منظور بطاقة الأداء المتوازن (%)', target: 'المستهدف',
      persp: ['المالي', 'العملاء', 'العمليات الداخلية', 'التعلم والنمو'],
      months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      lrnT: 'لوحة التدريب وقياس الأثر', lrnS: 'معاينة CogniSteed Learning — بيانات تجريبية',
      programs: ['أكاديمية القيادات', 'احتراف إدارة المشاريع', 'أساسيات الذكاء الاصطناعي'],
      trainees: 'المتدربون', completion: 'نسبة الإكمال', satisfaction: 'رضا المتدربين', gain: 'تحسن المعرفة',
      kirkChart: 'قياس الأثر بنموذج كيركباتريك (%)', kirk: ['المستوى 1: رد الفعل', 'المستوى 2: التعلم', 'المستوى 3: السلوك', 'المستوى 4: النتائج'],
      prePost: 'التقييم القبلي والبعدي حسب الوحدة (%)', pre: 'قبلي', post: 'بعدي', module: 'الوحدة',
      aiT: 'لوحة الجاهزية للذكاء الاصطناعي', aiS: 'معاينة CogniSteed AI Advisory — بيانات تجريبية',
      dims: ['الاستراتيجية', 'البيانات', 'البنية التقنية', 'المهارات', 'الحوكمة', 'الثقافة'],
      current: 'الوضع الحالي', targetState: 'المستهدف', readiness: 'مؤشر الجاهزية', gap: 'أكبر فجوة', opps: 'فرص محددة', quick: 'مكاسب سريعة',
      radarChart: 'ملف الجاهزية الرقمية (من 5)', bubbleChart: 'مصفوفة فرص الذكاء الاصطناعي', impact: 'الأثر', feas: 'قابلية التنفيذ',
      roadmap: 'خارطة الطريق المقترحة (وفق قواعد الأثر وقابلية التنفيذ)', h1: 'مكاسب سريعة · 0–6 أشهر', h2: 'بناء القدرات · 6–12 شهرًا', h3: 'التوسع · 12+ شهرًا',
      oppNames: ['أتمتة معالجة المستندات', 'مساعد رقمي لخدمة المستفيدين', 'التنبؤ بالطلب', 'التنبؤ بمخاطر المشاريع', 'البحث المعرفي الذكي', 'تحليل الملاحظات النصية'],
      csv: 'تنزيل البيانات التجريبية (CSV)', csvNote: 'بيانات تجريبية افتراضية لأغراض العرض فقط — ليست بيانات عملاء', rowHint: 'اختر مشروعًا لإبرازه في الرسم البياني.',
      chartErr: 'تعذّر تحميل مكتبة الرسوم البيانية. تحقّق من الاتصال ثم أعد المحاولة.', retry: 'إعادة المحاولة'
    },
    en: {
      all: 'All', filterPortfolio: 'Portfolio', filterStatus: 'Status', filterPeriod: 'Period', filterUnit: 'Unit', filterProgram: 'Program', filterSector: 'Sector', filterView: 'View',
      pmoT: 'Portfolio dashboard', pmoS: 'CogniSteed PMO preview — sample data',
      projects: 'Projects', onTrack: 'On track', watch: 'Watch', highRisk: 'High risk', budgetUse: 'Budget utilization',
      progress: 'Progress', planned: 'Planned', actual: 'Actual', budget: 'Budget', spent: 'Spent', viewProgress: 'Progress', viewBudget: 'Budget',
      progressChart: 'Actual vs planned progress (%)', budgetChart: 'Budget vs spent (SAR m)', statusChart: 'Project status mix',
      project: 'Project', portfolio: 'Portfolio', status: 'Status', noData: 'No projects match the selected filters.',
      pf: ['Digital transformation', 'PMO setup', 'Capability building'],
      insT: 'Executive KPI dashboard', insS: 'CogniSteed Insights preview — sample data',
      m6: '6 months', m12: '12 months', units: ['Operations', 'Customer service', 'Finance', 'Human capital'],
      kpiAch: 'Strategic KPI achievement', kpiOn: 'KPIs on target', initDone: 'Initiatives completed', dq: 'Data quality',
      trendChart: 'Actual vs target performance', perspChart: 'Achievement by balanced-scorecard perspective (%)', target: 'Target',
      persp: ['Financial', 'Customer', 'Internal process', 'Learning & growth'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      lrnT: 'Learning & impact dashboard', lrnS: 'CogniSteed Learning preview — sample data',
      programs: ['Leadership Academy', 'Project Management Professional', 'AI Foundations'],
      trainees: 'Trainees', completion: 'Completion rate', satisfaction: 'Trainee satisfaction', gain: 'Knowledge gain',
      kirkChart: 'Impact measurement — Kirkpatrick model (%)', kirk: ['Level 1: Reaction', 'Level 2: Learning', 'Level 3: Behavior', 'Level 4: Results'],
      prePost: 'Pre- vs post-assessment by module (%)', pre: 'Pre', post: 'Post', module: 'Module',
      aiT: 'AI readiness dashboard', aiS: 'CogniSteed AI Advisory preview — sample data',
      dims: ['Strategy', 'Data', 'Infrastructure', 'Skills', 'Governance', 'Culture'],
      current: 'Current state', targetState: 'Target', readiness: 'Readiness index', gap: 'Largest gap', opps: 'Opportunities mapped', quick: 'Quick wins',
      radarChart: 'Digital readiness profile (out of 5)', bubbleChart: 'AI opportunity matrix', impact: 'Impact', feas: 'Feasibility',
      roadmap: 'Suggested roadmap (rule-based on impact & feasibility)', h1: 'Quick wins · 0–6 months', h2: 'Build · 6–12 months', h3: 'Scale · 12+ months',
      oppNames: ['Document processing automation', 'Digital service assistant', 'Demand forecasting', 'Project risk prediction', 'Intelligent knowledge search', 'Text feedback analytics'],
      csv: 'Download demo data (CSV)', csvNote: 'Fictional sample data for demonstration only — not client data', rowHint: 'Select a project to highlight it in the chart.',
      chartErr: "The charting library couldn't load. Check your connection and try again.", retry: 'Retry'
    }
  };
  function t(k) { return T[CS.lang][k]; }
  function n(v, o) { return CS.num(v, o); }

  /* ---------------- Fictional sample datasets ---------------- */
  var LETTERS = { ar: ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل'], en: 'ABCDEFGHIJKL'.split('') };
  // [portfolio, actual %, planned %, budget SAR m, spent SAR m, status 0 ok / 1 watch / 2 high risk]
  var PROJECTS = [[0, 72, 70, 8.4, 5.9, 0], [1, 48, 50, 3.2, 1.6, 0], [2, 31, 30, 2.1, 0.7, 0], [0, 55, 68, 6.5, 4.8, 2], [0, 84, 82, 4.0, 3.3, 0], [1, 63, 60, 2.6, 1.7, 0],
    [2, 22, 35, 1.8, 0.6, 2], [0, 40, 44, 5.1, 2.2, 1], [1, 91, 90, 1.9, 1.8, 0], [2, 67, 65, 2.4, 1.5, 0], [0, 12, 10, 7.2, 0.8, 0], [1, 77, 75, 2.0, 1.4, 0]];
  var NAMES = {
    ar: ['التحول الرقمي', 'مكتب PMO', 'أكاديمية القيادات', 'منصة الخدمات الإلكترونية', 'أتمتة الإجراءات', 'حوكمة المحفظة', 'برنامج المواهب', 'تكامل البيانات', 'لوحات الأداء', 'التدريب الإداري', 'التحليلات المتقدمة', 'إدارة المخاطر'],
    en: ['Digital transformation', 'PMO setup', 'Leadership academy', 'e-Services platform', 'Process automation', 'Portfolio governance', 'Talent program', 'Data integration', 'Performance dashboards', 'Management training', 'Advanced analytics', 'Risk management']
  };
  function rng(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }

  /* ---------------- Chart helpers ---------------- */
  var charts = {};   // panel -> [Chart]
  function kill(panel) { (charts[panel] || []).forEach(function (c) { c.destroy(); }); charts[panel] = []; }
  function make(panel, canvas, cfg) { var ch = new window.Chart(canvas, cfg); (charts[panel] = charts[panel] || []).push(ch); return ch; }
  function rtlOpts() { return { rtl: CS.lang === 'ar', textDirection: CS.lang === 'ar' ? 'rtl' : 'ltr' }; }
  function legend() { var o = rtlOpts(); return { position: 'bottom', rtl: o.rtl, textDirection: o.textDirection, labels: { padding: 14 } }; }
  function tooltip() { return rtlOpts(); }
  function axisFlip() { return CS.lang === 'ar'; }

  function select(id, label, opts, val) {
    return '<label class="dp__filter" for="' + id + '">' + CS.esc(label) + '<select id="' + id + '">' +
      opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + CS.esc(o[1]) + '</option>'; }).join('') + '</select></label>';
  }
  function seg(id, label, opts, val) {
    return '<div class="dp__filter"><span id="' + id + '-l">' + CS.esc(label) + '</span><div class="dp__seg" role="group" aria-labelledby="' + id + '-l" id="' + id + '">' +
      opts.map(function (o) { return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (String(o[0]) === String(val)) + '">' + CS.esc(o[1]) + '</button>'; }).join('') + '</div></div>';
  }
  function kpi(label, value, sub, cls) { return '<div class="kpi"><p class="kpi__l">' + CS.esc(label) + '</p><p class="kpi__v ' + (cls || '') + '">' + value + '</p>' + (sub ? '<p class="kpi__s">' + CS.esc(sub) + '</p>' : '') + '</div>'; }
  /* Animated KPI values: numbers roll up to their value (static for reduced motion) */
  function countUp(box) {
    if (CS.reduced || !box) return;
    CS.$$('.kpi__v', box).forEach(function (v) {
      var m = v.textContent.match(/^([+]?)([\d,]*\.?\d+)(.*)$/); if (!m) return;
      var target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, t0 = performance.now(), final = v.textContent;
      (function step(now) {
        var p = Math.min(1, (now - t0) / 800), e = 1 - Math.pow(1 - p, 3);
        v.textContent = p < 1 ? m[1] + n(target * e, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3] : final;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }
  function downloadCSV(name, header, rows) {
    var esc = function (x) { x = String(x == null ? '' : x); return /[",\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; };
    var csv = '\ufeff' + [[t('csvNote')]].concat([header], rows).map(function (r) { return r.map(esc).join(','); }).join('\r\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function head(title, sub, filters) { return '<div class="dp__bar"><h3 class="dp__title">' + CS.esc(title) + '<small>' + CS.esc(sub) + '</small></h3><div class="dp__filters">' + filters + '</div></div>'; }
  function card(title, id, full, h) { return '<div class="chart-card' + (full ? ' chart-card--full' : '') + '"><h4>' + CS.esc(title) + '</h4><div class="chart-box"' + (h ? ' style="height:' + h + 'px"' : '') + '><canvas id="' + id + '" role="img" aria-label="' + CS.esc(title) + '"></canvas></div></div>'; }
  function segBind(el, id, cb) { el.querySelector('#' + id).addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; CS.$$('button', this).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); cb(b.dataset.v); }); }

  /* ================= PMO ================= */
  var pmoState = { pf: 'all', st: 'all', view: 'progress' }, lastRows = [];
  function renderPMO(el) {
    var s = pmoState, L = CS.lang;
    el.innerHTML = head(t('pmoT'), t('pmoS'),
      select('pmo-pf', t('filterPortfolio'), [['all', t('all')]].concat(t('pf').map(function (p, i) { return [i, p]; })), s.pf) +
      select('pmo-st', t('filterStatus'), [['all', t('all')], [0, t('onTrack')], [1, t('watch')], [2, t('highRisk')]], s.st) +
      seg('pmo-view', t('filterView'), [['progress', t('viewProgress')], ['budget', t('viewBudget')]], s.view) +
      '<button type="button" class="btn btn--line btn--sm dp__csv" id="pmo-csv"><svg class="ico" aria-hidden="true"><use href="#i-doc"/></svg><span>' + CS.esc(t('csv')) + '</span></button>') +
      '<div class="kpis" id="pmo-kpis"></div><div class="charts">' + card(t('progressChart'), 'pmo-bar', false, 300) + card(t('statusChart'), 'pmo-donut', false, 300) +
      '<div class="chart-card chart-card--full"><div class="table-wrap" id="pmo-table"></div></div></div>';
    kill('pmo');
    var bar = make('pmo', el.querySelector('#pmo-bar'), { type: 'bar', data: { labels: [], datasets: [] },
      options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: legend(), tooltip: tooltip() },
        scales: { x: { reverse: axisFlip(), beginAtZero: true, grid: { color: '#EEF1F5' } }, y: { position: axisFlip() ? 'right' : 'left', grid: { display: false }, ticks: { font: { size: 11 } } } } } });
    var donut = make('pmo', el.querySelector('#pmo-donut'), { type: 'doughnut', data: { labels: [t('onTrack'), t('watch'), t('highRisk')], datasets: [{ data: [0, 0, 0], backgroundColor: [C.navy, C.gold, C.terra], borderWidth: 0, hoverOffset: 6 }] },
      options: { maintainAspectRatio: false, cutout: '68%', plugins: { legend: legend(), tooltip: tooltip() } } });
    function update() {
      var rows = PROJECTS.map(function (p, i) { return { i: i, pf: p[0], act: p[1], plan: p[2], bud: p[3], sp: p[4], st: p[5], name: (L === 'ar' ? 'مشروع (' + LETTERS.ar[i] + ') — ' : 'Project ' + LETTERS.en[i] + ' — ') + NAMES[L][i] }; })
        .filter(function (r) { return (s.pf === 'all' || r.pf === +s.pf) && (s.st === 'all' || r.st === +s.st); });
      var ok = rows.filter(function (r) { return r.st === 0; }).length, risk = rows.filter(function (r) { return r.st === 2; }).length;
      var tb = rows.reduce(function (a, r) { return a + r.bud; }, 0), ts = rows.reduce(function (a, r) { return a + r.sp; }, 0);
      el.querySelector('#pmo-kpis').innerHTML = kpi(t('projects'), n(rows.length)) + kpi(t('onTrack'), n(ok), '', 'up') + kpi(t('highRisk'), n(risk), '', risk ? 'warn' : '') +
        kpi(t('budgetUse'), tb ? n(ts / tb, { style: 'percent' }) : '—', tb ? n(ts, { maximumFractionDigits: 1 }) + ' / ' + n(tb, { maximumFractionDigits: 1 }) + (L === 'ar' ? ' مليون ريال' : ' SAR m') : ''); countUp(el.querySelector('#pmo-kpis'));
      var short = rows.map(function (r) { return (L === 'ar' ? 'مشروع ' + LETTERS.ar[r.i] : 'Project ' + LETTERS.en[r.i]); });
      bar.data.labels = short;
      if (s.view === 'progress') {
        bar.data.datasets = [{ label: t('actual'), data: rows.map(function (r) { return r.act; }), backgroundColor: rows.map(function (r) { return r.st === 2 ? C.terra : r.st === 1 ? C.gold : C.navy; }), borderRadius: 4, barPercentage: 0.7 },
          { label: t('planned'), data: rows.map(function (r) { return r.plan; }), backgroundColor: C.light, borderRadius: 4, barPercentage: 0.7 }];
        bar.options.scales.x.max = 100;
      } else {
        bar.data.datasets = [{ label: t('budget'), data: rows.map(function (r) { return r.bud; }), backgroundColor: C.light, borderRadius: 4, barPercentage: 0.7 },
          { label: t('spent'), data: rows.map(function (r) { return r.sp; }), backgroundColor: C.gold, borderRadius: 4, barPercentage: 0.7 }];
        bar.options.scales.x.max = undefined;
      }
      el.querySelector('#pmo-bar').closest('.chart-card').querySelector('h4').textContent = s.view === 'progress' ? t('progressChart') : t('budgetChart');
      bar.update();
      donut.data.datasets[0].data = [ok, rows.filter(function (r) { return r.st === 1; }).length, risk]; donut.update();
      var stName = [t('onTrack'), t('watch'), t('highRisk')], stCls = ['ok', 'watch', 'risk'];
      lastRows = rows;
      el.querySelector('#pmo-table').innerHTML = rows.length ? '<p class="table-hint">' + CS.esc(t('rowHint')) + '</p><table class="ptable"><thead><tr><th scope="col">' + t('project') + '</th><th scope="col">' + t('portfolio') + '</th><th scope="col">' + t('progress') + '</th><th scope="col">' + t('status') + '</th></tr></thead><tbody>' +
        rows.map(function (r, k) { return '<tr tabindex="0" data-k="' + k + '"><td>' + CS.esc(r.name) + '</td><td>' + CS.esc(t('pf')[r.pf]) + '</td><td><div class="pbar"><div class="pbar__t"><div class="pbar__f" style="width:' + r.act + '%;background:' + (r.st === 2 ? C.terra : r.st === 1 ? C.gold : C.navy) + '"></div></div><span>' + n(r.act) + '%</span></div></td><td><span class="status status--' + stCls[r.st] + '">' + stName[r.st] + '</span></td></tr>'; }).join('') + '</tbody></table>'
        : '<p class="empty">' + t('noData') + '</p>';
    }
    el.querySelector('#pmo-pf').addEventListener('change', function () { s.pf = this.value; update(); });
    el.querySelector('#pmo-st').addEventListener('change', function () { s.st = this.value; update(); });
    segBind(el, 'pmo-view', function (v) { s.view = v; update(); });
    function pick(tr) {
      if (!tr) return;
      CS.$$('#pmo-table tr.is-active', el).forEach(function (x) { x.classList.remove('is-active'); });
      tr.classList.add('is-active');
      var k = +tr.dataset.k, act = bar.data.datasets.map(function (_, di) { return { datasetIndex: di, index: k }; });
      bar.setActiveElements(act); bar.tooltip.setActiveElements(act, { x: 0, y: 0 }); bar.update();
    }
    el.querySelector('#pmo-table').addEventListener('click', function (e) { pick(e.target.closest('tr[data-k]')); });
    el.querySelector('#pmo-table').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e.target.closest('tr[data-k]')); } });
    el.querySelector('#pmo-csv').addEventListener('click', function () {
      var L = CS.lang, stName = [t('onTrack'), t('watch'), t('highRisk')];
      downloadCSV('cognisteed-pmo-demo-data.csv', [t('project'), t('portfolio'), t('actual') + ' %', t('planned') + ' %', t('budget'), t('spent'), t('status')],
        lastRows.map(function (r) { return [r.name, t('pf')[r.pf], r.act, r.plan, r.bud, r.sp, stName[r.st]]; }));
    });
    update();
  }

  /* ================= Insights ================= */
  var insState = { period: '12', unit: 'all' };
  function renderInsights(el) {
    var s = insState;
    el.innerHTML = head(t('insT'), t('insS'),
      seg('ins-period', t('filterPeriod'), [['6', t('m6')], ['12', t('m12')]], s.period) +
      select('ins-unit', t('filterUnit'), [['all', t('all')]].concat(t('units').map(function (u, i) { return [i, u]; })), s.unit)) +
      '<div class="kpis" id="ins-kpis"></div><div class="charts">' + card(t('trendChart'), 'ins-line', false, 280) + card(t('perspChart'), 'ins-bar', false, 280) + '</div>';
    kill('insights');
    var line = make('insights', el.querySelector('#ins-line'), { type: 'line', data: { labels: [], datasets: [] },
      options: { maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: legend(), tooltip: tooltip() },
        scales: { x: { reverse: axisFlip(), grid: { display: false } }, y: { position: axisFlip() ? 'right' : 'left', min: 40, max: 100, grid: { color: '#EEF1F5' } } } } });
    var bar = make('insights', el.querySelector('#ins-bar'), { type: 'bar', data: { labels: t('persp'), datasets: [] },
      options: { maintainAspectRatio: false, plugins: { legend: legend(), tooltip: tooltip() },
        scales: { x: { reverse: axisFlip(), grid: { display: false }, ticks: { font: { size: 11 } } }, y: { position: axisFlip() ? 'right' : 'left', beginAtZero: true, max: 100, grid: { color: '#EEF1F5' } } } } });
    function update() {
      var u = s.unit === 'all' ? 9 : +s.unit, r = rng(41 + u * 7), m = +s.period;
      var months = t('months').slice(12 - m), act = [], tgt = [], v = 62 + r() * 6;
      for (var i = 0; i < m; i++) { v = Math.min(96, v + (r() * 6 - 1.6)); act.push(+v.toFixed(1)); tgt.push(+(70 + i * (m === 6 ? 2.6 : 1.3)).toFixed(1)); }
      if (m === 6) { act = act.map(function (x) { return +(x + 6).toFixed(1); }); }
      line.data.labels = months;
      line.data.datasets = [{ label: t('actual'), data: act, borderColor: C.navy, backgroundColor: 'rgba(16,35,69,.08)', fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: C.navy, borderWidth: 2.2 },
        { label: t('target'), data: tgt, borderColor: C.gold, borderDash: [6, 5], pointRadius: 0, borderWidth: 2, fill: false }];
      line.update();
      var persp = [0, 1, 2, 3].map(function () { return Math.round(58 + r() * 36); });
      bar.data.labels = t('persp');
      bar.data.datasets = [{ label: t('actual'), data: persp, backgroundColor: persp.map(function (x) { return x >= 80 ? C.navy : x >= 68 ? C.gold : C.terra; }), borderRadius: 6, barPercentage: 0.6 }];
      bar.update();
      var last = act[act.length - 1], lt = tgt[tgt.length - 1];
      el.querySelector('#ins-kpis').innerHTML = kpi(t('kpiAch'), n(Math.round(last)) + '%', t('target') + ': ' + n(Math.round(lt)) + '%', last >= lt ? 'up' : 'warn') +
        kpi(t('kpiOn'), n(Math.round(14 + r() * 10)) + ' / ' + n(32)) + kpi(t('initDone'), n(Math.round(m === 6 ? 4 + r() * 4 : 9 + r() * 6))) + kpi(t('dq'), n(Math.round(76 + r() * 18)) + '%'); countUp(el.querySelector('#ins-kpis'));
    }
    segBind(el, 'ins-period', function (v) { s.period = v; update(); });
    el.querySelector('#ins-unit').addEventListener('change', function () { s.unit = this.value; update(); });
    update();
  }

  /* ================= Learning ================= */
  var lrnState = { prog: 'all' };
  function renderLearning(el) {
    var s = lrnState;
    el.innerHTML = head(t('lrnT'), t('lrnS'), select('lrn-prog', t('filterProgram'), [['all', t('all')]].concat(t('programs').map(function (p, i) { return [i, p]; })), s.prog)) +
      '<div class="kpis" id="lrn-kpis"></div><div class="charts">' + card(t('kirkChart'), 'lrn-kirk', false, 280) + card(t('prePost'), 'lrn-pp', false, 280) + '</div>';
    kill('learning');
    var kirk = make('learning', el.querySelector('#lrn-kirk'), { type: 'bar', data: { labels: t('kirk'), datasets: [] },
      options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltip() },
        scales: { x: { reverse: axisFlip(), beginAtZero: true, max: 100, grid: { color: '#EEF1F5' } }, y: { position: axisFlip() ? 'right' : 'left', grid: { display: false } } } } });
    var pp = make('learning', el.querySelector('#lrn-pp'), { type: 'bar', data: { labels: [], datasets: [] },
      options: { maintainAspectRatio: false, plugins: { legend: legend(), tooltip: tooltip() },
        scales: { x: { reverse: axisFlip(), grid: { display: false } }, y: { position: axisFlip() ? 'right' : 'left', beginAtZero: true, max: 100, grid: { color: '#EEF1F5' } } } } });
    function update() {
      var p = s.prog === 'all' ? 5 : +s.prog, r = rng(97 + p * 13);
      var lv = [Math.round(84 + r() * 10), Math.round(70 + r() * 15), Math.round(52 + r() * 16), Math.round(34 + r() * 16)];
      kirk.data.labels = t('kirk');
      kirk.data.datasets = [{ data: lv, backgroundColor: [C.navy, C.navy2, C.gold, C.terra], borderRadius: 6, barPercentage: 0.62 }];
      kirk.update();
      var mods = [1, 2, 3, 4, 5].map(function (i) { return t('module') + ' ' + n(i); }), pre = [], post = [];
      mods.forEach(function () { var a = Math.round(38 + r() * 20); pre.push(a); post.push(Math.min(98, Math.round(a + 22 + r() * 18))); });
      pp.data.labels = mods;
      pp.data.datasets = [{ label: t('pre'), data: pre, backgroundColor: C.light, borderRadius: 4 }, { label: t('post'), data: post, backgroundColor: C.navy, borderRadius: 4 }];
      pp.update();
      var avgPre = pre.reduce(function (a, b) { return a + b; }, 0) / pre.length, avgPost = post.reduce(function (a, b) { return a + b; }, 0) / post.length;
      el.querySelector('#lrn-kpis').innerHTML = kpi(t('trainees'), n(s.prog === 'all' ? 186 : Math.round(40 + r() * 40))) + kpi(t('completion'), n(Math.round(78 + r() * 18)) + '%', '', 'up') +
        kpi(t('satisfaction'), n(+(4 + r() * 0.8).toFixed(1)) + ' / 5') + kpi(t('gain'), '+' + n(Math.round(avgPost - avgPre)) + (CS.lang === 'ar' ? ' نقطة' : ' pts')); countUp(el.querySelector('#lrn-kpis'));
    }
    el.querySelector('#lrn-prog').addEventListener('change', function () { s.prog = this.value; update(); });
    update();
  }

  /* ================= AI Advisory ================= */
  var aiState = { sector: 0 };
  var AI_SECTORS = [0, 1, 2, 3, 4, 6];  // indices into CS_DATA.sectors
  function renderAI(el) {
    var s = aiState;
    el.innerHTML = head(t('aiT'), t('aiS'), select('ai-sector', t('filterSector'), AI_SECTORS.map(function (i) { return [i, CS.L(CS.data.sectors[i])]; }), s.sector)) +
      '<div class="kpis" id="ai-kpis"></div><div class="charts">' + card(t('radarChart'), 'ai-radar', false, 300) + card(t('bubbleChart'), 'ai-bubble', false, 300) +
      '<div class="chart-card chart-card--full"><h4>' + CS.esc(t('roadmap')) + '</h4><div id="ai-road" class="ai-road"></div></div></div>';
    kill('ai');
    var radar = make('ai', el.querySelector('#ai-radar'), { type: 'radar', data: { labels: t('dims'), datasets: [] },
      options: { maintainAspectRatio: false, plugins: { legend: legend(), tooltip: tooltip() }, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, backdropColor: 'transparent', font: { size: 10 } }, pointLabels: { font: { size: 12, weight: '700' }, color: C.navy }, grid: { color: '#E3E8EF' }, angleLines: { color: '#E3E8EF' } } } } });
    var bubble = make('ai', el.querySelector('#ai-bubble'), { type: 'bubble', data: { datasets: [] },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: Object.assign(tooltip(), { callbacks: { label: function (c) { return c.raw.name + ' — ' + t('impact') + ' ' + c.raw.y + ' · ' + t('feas') + ' ' + c.raw.x; } } }) },
        scales: { x: { reverse: axisFlip(), min: 0, max: 10, title: { display: true, text: t('feas') }, grid: { color: '#EEF1F5' } }, y: { position: axisFlip() ? 'right' : 'left', min: 0, max: 10, title: { display: true, text: t('impact') }, grid: { color: '#EEF1F5' } } } } });
    function update() {
      var r = rng(211 + s.sector * 17);
      var cur = t('dims').map(function () { return +(1.6 + r() * 2.2).toFixed(1); }), tgt = cur.map(function (c) { return +Math.min(5, c + 1 + r() * 0.8).toFixed(1); });
      radar.data.labels = t('dims');
      radar.data.datasets = [{ label: t('current'), data: cur, borderColor: C.navy, backgroundColor: 'rgba(16,35,69,.18)', pointBackgroundColor: C.navy, borderWidth: 2 },
        { label: t('targetState'), data: tgt, borderColor: C.gold, backgroundColor: 'rgba(214,173,81,.12)', borderDash: [5, 4], pointBackgroundColor: C.gold, borderWidth: 2 }];
      radar.update();
      var opps = t('oppNames').map(function (nm) { return { name: nm, x: +(2 + r() * 7.5).toFixed(1), y: +(2.5 + r() * 7).toFixed(1), r: 6 + r() * 10 }; });
      bubble.data.datasets = [{ data: opps, backgroundColor: opps.map(function (o) { return o.x >= 5.5 && o.y >= 5.5 ? 'rgba(214,173,81,.8)' : o.y >= 5.5 ? 'rgba(16,35,69,.75)' : 'rgba(140,155,181,.6)'; }), borderColor: '#fff', borderWidth: 1.5 }];
      bubble.update();
      var avg = cur.reduce(function (a, b) { return a + b; }, 0) / cur.length, gi = 0;
      cur.forEach(function (c, i) { if (tgt[i] - c > tgt[gi] - cur[gi]) gi = i; });
      var quick = opps.filter(function (o) { return o.x >= 5.5 && o.y >= 5.5; }), build = opps.filter(function (o) { return o.y >= 5.5 && o.x < 5.5; }), scale = opps.filter(function (o) { return o.y < 5.5; });
      el.querySelector('#ai-kpis').innerHTML = kpi(t('readiness'), n(avg, { maximumFractionDigits: 1 }) + ' / 5') + kpi(t('gap'), CS.esc(t('dims')[gi]), '', 'warn') + kpi(t('opps'), n(opps.length)) + kpi(t('quick'), n(quick.length), '', 'up'); countUp(el.querySelector('#ai-kpis'));
      function col(title, list, color) { return '<div class="road-col"><p class="road-col__t"><span style="background:' + color + '"></span>' + CS.esc(title) + '</p><ul>' + (list.length ? list.map(function (o) { return '<li>' + CS.esc(o.name) + '</li>'; }).join('') : '<li class="muted">—</li>') + '</ul></div>'; }
      el.querySelector('#ai-road').innerHTML = col(t('h1'), quick, C.gold) + col(t('h2'), build, C.navy) + col(t('h3'), scale, C.slate);
    }
    el.querySelector('#ai-sector').addEventListener('change', function () { s.sector = +this.value; update(); });
    update();
  }

  /* ---------------- Tabs & lifecycle ---------------- */
  var RENDER = { pmo: renderPMO, insights: renderInsights, learning: renderLearning, ai: renderAI };
  var active = 'pmo', rendered = {}, armed = false;
  var tabs = CS.$$('.dash__tab');
  function render(name) {
    var el = CS.$('#panel-' + name);
    CS.loadChart().then(function () { RENDER[name](el); rendered[name] = CS.lang; })
      .catch(function () {
        el.innerHTML = '<p class="empty">' + CS.esc(t('chartErr')) + ' <button type="button" class="btn btn--line btn--sm">' + CS.esc(t('retry')) + '</button></p>';
        el.querySelector('button').addEventListener('click', function () { render(name); });
      });
  }
  function activate(name, focus) {
    active = name;
    tabs.forEach(function (tb) { var on = tb.dataset.dash === name; tb.setAttribute('aria-selected', String(on)); tb.tabIndex = on ? 0 : -1; if (on && focus) tb.focus(); });
    CS.$$('.dash__panel').forEach(function (p) { p.hidden = p.id !== 'panel-' + name; });
    if (armed && rendered[name] !== CS.lang) render(name);
  }
  tabs.forEach(function (tb) { tb.addEventListener('click', function () { activate(tb.dataset.dash); }); });
  CS.$('.dash__tabs').addEventListener('keydown', function (e) {
    var i = tabs.findIndex(function (x) { return x.dataset.dash === active; }), rtl = document.documentElement.dir === 'rtl', k = e.key;
    if (k === 'ArrowRight') i += rtl ? -1 : 1; else if (k === 'ArrowLeft') i += rtl ? 1 : -1; else if (k === 'Home') i = 0; else if (k === 'End') i = tabs.length - 1; else return;
    e.preventDefault(); activate(tabs[(i + tabs.length) % tabs.length].dataset.dash, true);
  });
  CS.showDemo = function (name) { if (RENDER[name]) { armed = true; activate(name); } };
  CS.onLang(function () { rendered = {}; if (armed) render(active); });
  // Lazy: only load Chart.js when the dashboards approach the viewport
  new IntersectionObserver(function (en, io) { if (en[0].isIntersecting) { armed = true; render(active); io.disconnect(); } }, { rootMargin: '400px 0px' }).observe(CS.$('#dash'));
})();

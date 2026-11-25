/* ==========================================================================
   CogniSteed — Floating guide (RULE-BASED, not AI)
   Matches the visitor's words against fixed keyword rules and answers with
   pre-written content from the website. Nothing is sent anywhere.
   ========================================================================== */
(function () {
  'use strict';
  var CS = window.CS; if (!CS) return;
  var fab = CS.$('#assistant-fab'), panel = CS.$('#assistant-panel'), log = CS.$('#assistant-log'), chipsBox = CS.$('#assistant-chips'),
    formEl = CS.$('#assistant-form'), input = CS.$('#assistant-input'), closeBtn = CS.$('#assistant-close');

  function norm(s) {
    return String(s).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[^\p{L}\p{N}\s]/gu, ' ');
  }
  function svcName(i) { return CS.L(CS.data.services[i]); }
  function svcList(i) { return CS.$$('[data-i18n^="svc.' + (i + 1) + '."]').filter(function (el) { return /\.(a|b|c|d)$/.test(el.getAttribute('data-i18n')); }).map(function (el) { return el.textContent; }); }
  function act(label, a) { return { label: label, a: a }; }

  /* Intents: k = keywords (both languages, normalized at load), r = reply builder */
  var I = [
    { id: 'ai', k: ['هل انت', 'ذكاء اصطناعي حقيقي', 'روبوت', 'بوت', 'are you ai', 'are you a bot', 'bot', 'chatbot', 'chatgpt', 'gpt', 'real person', 'human', 'انت ذكاء', 'live ai'], w: 6,
      r: function (L) { return { t: L === 'ar' ? 'أنا دليل إرشادي قائم على قواعد ثابتة، ولست ذكاءً اصطناعيًا مباشرًا. أطابق كلماتك مع موضوعات معدّة مسبقًا من محتوى الموقع، ولا أرسل أي بيانات خارج متصفحك. المساعد الاستشاري الرقمي مخطط له في المرحلة الثانية.' : "I'm a rule-based guide, not live AI. I match your words to pre-written topics from this website and send nothing outside your browser. A Digital Advisory Assistant is planned for phase two.",
        a: [act(L === 'ar' ? 'تحدث مع مستشار' : 'Talk to a consultant', 'go:#contact')] }; } },
    { id: 'greet', k: ['مرحبا', 'السلام', 'اهلا', 'هلا', 'صباح', 'مساء', 'hello', 'hi', 'hey', 'good morning'], w: 1,
      r: function (L) { return { t: L === 'ar' ? 'أهلًا بك! كيف يمكنني مساعدتك؟ يمكنك السؤال عن خدماتنا، أو منهجيتنا، أو تجربة التشخيص الاستراتيجي.' : 'Hello! How can I help? Ask about our services or methodology, or try the strategic diagnostic.' }; } },
    { id: 's0', svc: 0, k: ['استراتيج', 'خطه', 'حوكمه', 'مخاطر', 'مؤشرات', 'kpi', 'تغيير', 'هيكله', 'نموذج اعمال', 'strategy', 'strategic', 'governance', 'risk', 'change management', 'restructur', 'business model'], w: 2 },
    { id: 's1', svc: 1, k: ['مشروع', 'مشاريع', 'pmo', 'محفظه', 'محافظ', 'برامج', 'تاخر', 'متعثر', 'project', 'portfolio', 'program', 'delay', 'late'], w: 2 },
    { id: 's2', svc: 2, k: ['ذكاء', 'رقمي', 'تحول', 'اتمته', 'بيانات', 'ai ', ' ai', 'artificial', 'digital', 'automation', 'data', 'machine learning'], w: 2 },
    { id: 's3', svc: 3, k: ['جدوى', 'عمليات', 'اجراءات', 'تنظيمي', 'نضج', 'تشغيل', 'feasibility', 'process', 'procedure', 'organizational', 'operating model', 'maturity', 'manual'], w: 2 },
    { id: 's4', svc: 4, k: ['تدريب', 'تطوير', 'قدرات', 'قيادات', 'اكاديميه', 'مهارات', 'كيركباتريك', 'training', 'learning', 'leadership', 'academy', 'skills', 'capability', 'kirkpatrick'], w: 2 },
    { id: 's5', svc: 5, k: ['دراس', 'بحوث', 'بحث', 'سوق', 'استثمار', 'معياري', 'عائد', 'research', 'study', 'market', 'investment', 'benchmark', 'roi', 'evaluation'], w: 2 },
    { id: 'services', k: ['خدمات', 'خدماتكم', 'ماذا تقدم', 'وش تقدم', 'services', 'what do you do', 'offer'], w: 1.5,
      r: function (L) { return { t: (L === 'ar' ? 'نقدّم ست ركائز تغطي رحلة المؤسسة من الاستراتيجية إلى الأثر:' : 'We offer six pillars covering the journey from strategy to impact:'), list: CS.data.services.map(function (s, i) { return '0' + (i + 1) + ' · ' + CS.L(s); }),
        a: [act(L === 'ar' ? 'استعرض الخدمات' : 'View services', 'go:#services'), act(L === 'ar' ? 'أيها يناسبني؟' : 'Which fits me?', 'diag')] }; } },
    { id: 'diag', k: ['تشخيص', 'تقييم', 'استبيان', 'يناسبني', 'ابدا', 'diagnos', 'assess', 'which service', 'fit me', 'recommend'], w: 2,
      r: function (L) { return { t: L === 'ar' ? 'التشخيص الاستراتيجي الذكي يتكون من خمس خطوات قصيرة، ويقيس نضج مؤسستك في ست ركائز، ثم يقترح الخدمات الأنسب مع رسم راداري وتقرير قابل للطباعة. يعمل بالكامل داخل متصفحك.' : 'The Smart Strategic Diagnostic is five short steps. It measures maturity across six pillars and suggests the best-fit services, with a radar chart and a printable report. It runs entirely in your browser.',
        a: [act(L === 'ar' ? 'ابدأ التشخيص' : 'Start the diagnostic', 'go:#diagnostic')] }; } },
    { id: 'demo', k: ['لوحه', 'لوحات', 'عرض توضيحي', 'منصه', 'حلول ذكيه', 'insights', 'dashboard', 'demo', 'platform', 'smart solution', 'pmo platform'], w: 2.5,
      r: function (L) { return { t: L === 'ar' ? 'حلول CogniSteed الذكية (PMO وInsights وLearning وAI Advisory) قيد التطوير. يمكنك تجربة لوحات تفاعلية ببيانات تجريبية افتراضية — ليست بيانات عملاء.' : "CogniSteed's smart solutions (PMO, Insights, Learning, AI Advisory) are in development. You can explore interactive dashboards with fictional sample data — not client data.",
        a: [act('PMO', 'demo:pmo'), act('Insights', 'demo:insights'), act('Learning', 'demo:learning'), act('AI Advisory', 'demo:ai')] }; } },
    { id: 'method', k: ['منهجيه', 'مراحل', 'مرحله', 'طريقه عمل', 'كيف تعمل', 'methodolog', 'approach', 'phase', 'how do you work', 'process steps'], w: 2,
      r: function (L) { return { t: L === 'ar' ? 'نعمل وفق ست مراحل مترابطة:' : 'We work through six connected phases:', list: CS.data.phases.map(function (p, i) { return '0' + (i + 1) + ' · ' + CS.L(p).t; }),
        a: [act(L === 'ar' ? 'استعرض المنهجية' : 'View methodology', 'go:#methodology')] }; } },
    { id: 'ind', k: ['قطاع', 'قطاعات', 'حكومي', 'صحه', 'تعليم', 'sector', 'industr', 'government', 'health', 'education'], w: 1.5,
      r: function (L) { return { t: L === 'ar' ? 'نخدم عشرة قطاعات، منها:' : 'We serve ten sectors, including:', list: CS.data.sectors.map(function (s) { return CS.L(s); }),
        a: [act(L === 'ar' ? 'اختر قطاعك' : 'Pick your sector', 'go:#industries')] }; } },
    { id: 'price', k: ['سعر', 'اسعار', 'تكلفه', 'عرض سعر', 'ميزانيه', 'price', 'pricing', 'cost', 'quote', 'fee', 'budget', 'how much'], w: 4,
      r: function (L) { return { t: L === 'ar' ? 'لا نعرض أسعارًا ثابتة؛ يُعد العرض الفني والمالي بعد فهم النطاق. شاركنا احتياجك عبر نموذج الطلب وسيتواصل معك أحد مستشارينا.' : "We don't publish fixed prices; a technical and financial proposal is prepared once we understand the scope. Share your needs in the request form and a consultant will contact you.",
        a: [act(L === 'ar' ? 'اطلب استشارة' : 'Request a consultation', 'go:#contact')] }; } },
    { id: 'contact', k: ['تواصل', 'اتصال', 'هاتف', 'جوال', 'رقم', 'بريد', 'ايميل', 'عنوان', 'موقعكم', 'وين', 'contact', 'phone', 'call', 'email', 'mail', 'address', 'where', 'location', 'riyadh'], w: 2,
      r: function (L) { return { t: L === 'ar' ? 'يسعدنا تواصلك:' : "We'd be glad to hear from you:", list: ['info@cognisteed.com', '+966 58 127 7111', L === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'],
        a: [act(L === 'ar' ? 'نموذج الطلب' : 'Request form', 'go:#contact'), act(L === 'ar' ? 'أرسل بريدًا' : 'Send email', 'mail')] }; } },
    { id: 'about', k: ['من انتم', 'عنكم', 'الشركه', 'رؤيه', 'رساله', 'قيم', 'اسم', 'cognisteed', 'about', 'who are you', 'vision', 'mission', 'values', 'name', 'company'], w: 1.5,
      r: function (L) { return { t: L === 'ar' ? 'CogniSteed شركة متخصصة في الاستشارات وحلول الأعمال وإدارة المشاريع الذكية. رؤيتنا: أن نكون شريكًا استراتيجيًا رائدًا في صناعة التحول المؤسسي وإدارة المشاريع الذكية. واسمنا يجمع Cogni (الإدراك) وSteed (الجواد): قوة الإدراك التي تقود إلى الأمام.' : 'CogniSteed specializes in consulting, business solutions and intelligent project management. Our vision: to be a leading strategic partner in organizational transformation and intelligent project management. Our name joins Cogni (insight) and Steed (momentum): the power of insight that drives forward.',
        a: [act(L === 'ar' ? 'من نحن' : 'About us', 'go:#about'), act(L === 'ar' ? 'قصة الاسم' : 'Name story', 'go:#story')] }; } },
    { id: 'careers', k: ['وظيفه', 'وظائف', 'توظيف', 'career', 'job', 'hiring', 'vacanc'], w: 2,
      r: function (L) { return { t: L === 'ar' ? 'لا تُعرض وظائف على الموقع حاليًا. يمكنك مراسلتنا على info@cognisteed.com بعنوان «الوظائف».' : 'No vacancies are listed on the site at the moment. You can write to info@cognisteed.com with the subject “Careers”.', a: [act(L === 'ar' ? 'أرسل بريدًا' : 'Send email', 'mail:Careers')] }; } },
    { id: 'privacy', k: ['خصوصيه', 'بياناتي', 'حمايه البيانات', 'privacy', 'my data', 'gdpr', 'pdpl', 'cookie'], w: 2,
      r: function (L) { return { t: L === 'ar' ? 'هذا الدليل يعمل داخل متصفحك ولا يرسل أي بيانات. ولا يستخدم الموقع ملفات تتبع أو أدوات تحليلات.' : 'This guide runs in your browser and sends no data. The site uses no tracking cookies or analytics.', a: [act(L === 'ar' ? 'إشعار الخصوصية' : 'Privacy notice', 'privacy')] }; } },
    { id: 'thanks', k: ['شكرا', 'يعطيك', 'thanks', 'thank you', 'great'], w: 1,
      r: function (L) { return { t: L === 'ar' ? 'العفو! إن احتجت شيئًا آخر فأنا هنا.' : "You're welcome! I'm here if you need anything else." }; } }
  ];
  I.forEach(function (it) { it.nk = it.k.map(norm); });

  function svcReply(i, L) {
    return { t: (L === 'ar' ? 'خدمة «' + svcName(i) + '» تشمل:' : '“' + svcName(i) + '” covers:'), list: svcList(i),
      a: [act(L === 'ar' ? 'اطلب هذه الخدمة' : 'Request this service', 'form:' + i), act(L === 'ar' ? 'تفاصيل الخدمة' : 'Service details', 'svc:' + i)] };
  }
  function answer(q) {
    var s = ' ' + norm(q) + ' ', best = null, bestScore = 0;
    I.forEach(function (it) {
      var sc = 0; it.nk.forEach(function (k) { var kk = k.trim(); if (!kk) return; var latin = /^[a-z0-9 ]+$/.test(kk); if (latin ? s.indexOf(' ' + kk) > -1 : s.indexOf(kk) > -1) sc += it.w; });
      if (sc > bestScore) { bestScore = sc; best = it; }
    });
    var L = CS.lang;
    if (!best) return { t: L === 'ar' ? 'لم أجد إجابة محددة لسؤالك ضمن الموضوعات المتاحة لدي. يمكنك اختيار أحد الموضوعات أدناه، أو التواصل مباشرة مع مستشار.' : "I couldn't find a specific answer among my available topics. Choose one of the topics below, or contact a consultant directly.",
      a: [act(L === 'ar' ? 'تواصل معنا' : 'Contact us', 'go:#contact'), act(L === 'ar' ? 'ابدأ التشخيص' : 'Start diagnostic', 'go:#diagnostic')] };
    return best.svc != null ? svcReply(best.svc, L) : best.r(L);
  }

  /* ---------------- UI ---------------- */
  function add(role, msg) {
    var d = document.createElement('div'); d.className = 'msg msg--' + role;
    if (typeof msg === 'string') d.textContent = msg;
    else {
      var p = document.createElement('p'); p.textContent = msg.t; d.appendChild(p);
      if (msg.list) { var ul = document.createElement('ul'); msg.list.forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li); }); d.appendChild(ul); }
      if (msg.a) { var w = document.createElement('div'); w.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:10px'; msg.a.forEach(function (x) { var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.style.minHeight = '32px'; b.style.fontSize = '13px'; b.textContent = x.label; b.dataset.act = x.a; w.appendChild(b); }); d.appendChild(w); }
    }
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  function chips() {
    var L = CS.lang, list = L === 'ar'
      ? [['ما خدماتكم؟', 'خدمات'], ['أي خدمة تناسبني؟', 'تشخيص'], ['العروض التوضيحية', 'لوحة'], ['منهجية العمل', 'منهجية'], ['كيف أتواصل معكم؟', 'تواصل'], ['هل أنت ذكاء اصطناعي؟', 'هل انت']]
      : [['Your services', 'services'], ['Which service fits me?', 'diagnostic'], ['Demo dashboards', 'dashboard'], ['Methodology', 'methodology'], ['How to contact you', 'contact'], ['Are you AI?', 'are you ai']];
    chipsBox.innerHTML = list.map(function (c) { return '<button type="button" class="chip" data-q="' + CS.esc(c[1]) + '">' + CS.esc(c[0]) + '</button>'; }).join('');
  }
  function welcome() {
    log.innerHTML = '';
    add('bot', { t: CS.lang === 'ar' ? 'مرحبًا بك في CogniSteed. أنا دليل إرشادي قائم على قواعد محددة (لست ذكاءً اصطناعيًا مباشرًا)، أساعدك في الوصول إلى الخدمة أو المعلومة المناسبة.' : "Welcome to CogniSteed. I'm a rule-based guide (not live AI) that helps you find the right service or information." });
    chips();
  }
  function ask(q, shown) { add('user', shown || q); add('bot', answer(q)); }
  function open() { panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); if (!log.children.length) welcome(); setTimeout(function () { input.focus(); }, 50); }
  function close() { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }
  function doAct(a) {
    var p = a.split(':'), L = CS.lang;
    if (p[0] === 'go') { var el = CS.$(p[1]); if (el) el.scrollIntoView({ behavior: CS.reduced ? 'auto' : 'smooth' }); if (window.innerWidth < 700) close(); }
    else if (p[0] === 'diag') ask(L === 'ar' ? 'تشخيص' : 'diagnostic', L === 'ar' ? 'أي خدمة تناسبني؟' : 'Which service fits me?');
    else if (p[0] === 'demo') { CS.showDemo && CS.showDemo(p[1]); CS.$('#solutions').scrollIntoView({ behavior: CS.reduced ? 'auto' : 'smooth' }); if (window.innerWidth < 700) close(); }
    else if (p[0] === 'form') { CS.prefill({ service: +p[1], toast: CS.ui('prefilledService') }); CS.$('#contact').scrollIntoView({ behavior: CS.reduced ? 'auto' : 'smooth' }); if (window.innerWidth < 700) close(); }
    else if (p[0] === 'svc') { var art = CS.$('[data-svc="' + p[1] + '"]'); if (art) { var b = CS.$('.svc__more', art); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); art.scrollIntoView({ behavior: CS.reduced ? 'auto' : 'smooth', block: 'center' }); } if (window.innerWidth < 700) close(); }
    else if (p[0] === 'mail') { location.href = 'mailto:info@cognisteed.com' + (p[1] ? '?subject=' + encodeURIComponent(p[1]) : ''); }
    else if (p[0] === 'privacy') { var o = document.createElement('button'); o.setAttribute('data-open-privacy', ''); o.hidden = true; document.body.appendChild(o); o.click(); o.remove(); }
  }

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  formEl.addEventListener('submit', function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; input.value = ''; ask(q); });
  chipsBox.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) ask(b.dataset.q, b.textContent); });
  log.addEventListener('click', function (e) { var b = e.target.closest('[data-act]'); if (b) doAct(b.dataset.act); });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-open-assistant]')) { e.preventDefault(); open(); } });
  CS.onLang(function () { if (log.children.length) welcome(); else chips(); });
})();

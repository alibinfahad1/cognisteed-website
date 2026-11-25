/* ==========================================================================
   CogniSteed — Consultation form
   • Client-side validation with accessible inline errors.
   • Submits ONLY to CS_CONFIG.FORM_ENDPOINT when configured; success is shown
     only for a real HTTP 2xx response.
   • Without an endpoint it states plainly that nothing was sent and offers an
     honest fallback: open the visitor's email app or copy the request.
   ========================================================================== */
(function () {
  'use strict';
  var CS = window.CS, CFG = window.CS_CONFIG || {};
  var form = document.getElementById('consult-form'); if (!form || !CS) return;
  var statusEl = document.getElementById('form-status'), submitBtn = document.getElementById('f-submit');
  var EMAIL = CFG.CONTACT_EMAIL || 'info@cognisteed.com', MAX_MB = CFG.MAX_FILE_MB || 10;
  var EXT = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

  var M = {
    ar: {
      required: 'هذا الحقل مطلوب.', name: 'يُرجى إدخال الاسم (حرفان على الأقل).', email: 'يُرجى إدخال بريد إلكتروني صحيح، مثل name@company.com',
      phone: 'يُرجى إدخال رقم جوال صحيح (9 إلى 15 رقمًا، ويمكن أن يبدأ بـ +).', service: 'يُرجى اختيار الخدمة المطلوبة.',
      msg: 'يُرجى وصف التحدي أو المشروع في 20 حرفًا على الأقل.', consent: 'يلزم الموافقة على إشعار الخصوصية لإرسال الطلب.',
      fileSize: 'حجم الملف أكبر من ' + MAX_MB + ' ميجابايت.', fileType: 'نوع الملف غير مدعوم. الأنواع المسموحة: PDF وWord وPowerPoint وExcel.',
      summary: 'يُرجى تصحيح الحقول المظللة.', sending: 'جارٍ الإرسال…',
      offT: 'لم يُرسَل طلبك بعد', offD: 'استقبال الطلبات عبر الموقع غير مفعّل حاليًا، ولذلك لم يُرسل أي شيء. يمكنك إرسال الطلب الآن عبر بريدك الإلكتروني إلى ' + EMAIL + ' — جهّزنا الرسالة لك:',
      mail: 'افتح تطبيق البريد برسالة جاهزة', copy: 'انسخ نص الطلب', attachNote: 'ملاحظة: لا يمكن إرفاق الملف تلقائيًا عبر البريد؛ يُرجى إرفاقه يدويًا.',
      okT: 'تم استلام طلبك', okD: 'أكّد الخادم استلام طلبك. سيتواصل معك أحد مستشارينا.', ref: 'رقم الطلب:',
      errT: 'تعذّر إرسال الطلب', errD: 'لم يُحفظ طلبك. يمكنك المحاولة مجددًا أو إرسال الطلب عبر البريد الإلكتروني:', retry: 'إعادة المحاولة',
      subject: 'طلب استشارة — ', labels: { name: 'الاسم', org: 'الجهة', title: 'المسمى الوظيفي', email: 'البريد', phone: 'الجوال', sector: 'القطاع', service: 'الخدمة', time: 'المدة المتوقعة', budget: 'الميزانية التقديرية', file: 'ملف مرفق', msg: 'وصف الاحتياج' },
      truncated: '[اختُصر النص لطول الرسالة — يُرجى استكماله]'
    },
    en: {
      required: 'This field is required.', name: 'Please enter your name (at least 2 characters).', email: 'Please enter a valid email, e.g. name@company.com',
      phone: 'Please enter a valid mobile number (9–15 digits, may start with +).', service: 'Please select the service you need.',
      msg: 'Please describe your challenge or project in at least 20 characters.', consent: 'You need to accept the privacy notice to submit.',
      fileSize: 'The file is larger than ' + MAX_MB + ' MB.', fileType: 'Unsupported file type. Allowed: PDF, Word, PowerPoint, Excel.',
      summary: 'Please correct the highlighted fields.', sending: 'Sending…',
      offT: 'Your request has not been sent yet', offD: 'Online submission is not active yet, so nothing was sent. You can send your request now by email to ' + EMAIL + ' — we have prepared the message for you:',
      mail: 'Open my email app with the message', copy: 'Copy request text', attachNote: 'Note: files cannot be attached automatically by email; please attach yours manually.',
      okT: 'Request received', okD: 'The server confirmed receipt of your request. One of our consultants will contact you.', ref: 'Request number:',
      errT: "Your request couldn't be sent", errD: 'Your request was not saved. You can try again or send it by email:', retry: 'Try again',
      subject: 'Consultation request — ', labels: { name: 'Name', org: 'Organization', title: 'Job title', email: 'Email', phone: 'Mobile', sector: 'Sector', service: 'Service', time: 'Expected timeframe', budget: 'Estimated budget', file: 'Attached file', msg: 'Description' },
      truncated: '[Text shortened for email length — please complete it]'
    }
  };
  function m(k) { return M[CS.lang][k]; }
  var F = {
    name: form.querySelector('#f-name'), org: form.querySelector('#f-org'), title: form.querySelector('#f-title'), email: form.querySelector('#f-email'),
    phone: form.querySelector('#f-phone'), sector: form.querySelector('#f-sector'), service: form.querySelector('#f-service'), time: form.querySelector('#f-time'),
    msg: form.querySelector('#f-msg'), budget: form.querySelector('#f-budget'), file: form.querySelector('#f-file'), consent: form.querySelector('#f-consent'), hp: form.querySelector('#f-company-site')
  };
  var ERR = { name: 'e-name', org: 'e-org', email: 'e-email', phone: 'e-phone', service: 'e-service', msg: 'e-msg', file: 'e-file', consent: 'e-consent' };

  function normDigits(s) { return s.replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 0x0660; }).replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 0x06F0; }); }
  function check(k) {
    var v = F[k].type === 'checkbox' ? F[k].checked : (F[k].value || '').trim();
    switch (k) {
      case 'name': return v.length >= 2 ? '' : (v ? m('name') : m('required'));
      case 'org': return v.length >= 2 ? '' : m('required');
      case 'email': return !v ? m('required') : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : m('email');
      case 'phone': { if (!v) return m('required'); var d = normDigits(v); if (!/^\+?[\d\s\-()]+$/.test(d)) return m('phone'); var c = d.replace(/\D/g, '').length; return c >= 9 && c <= 15 ? '' : m('phone'); }
      case 'service': return v !== '' ? '' : m('service');
      case 'msg': return v.length >= 20 ? '' : (v ? m('msg') : m('required'));
      case 'consent': return v ? '' : m('consent');
      case 'file': {
        var f = F.file.files && F.file.files[0]; if (!f) return '';
        var ext = (f.name.split('.').pop() || '').toLowerCase();
        if (EXT.indexOf(ext) < 0) return m('fileType');
        return f.size > MAX_MB * 1024 * 1024 ? m('fileSize') : '';
      }
    }
    return '';
  }
  function show(k, msg) {
    var el = F[k], e = document.getElementById(ERR[k]);
    if (msg) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', ERR[k]); } else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
    if (e) e.textContent = msg;
  }
  var touched = {};
  Object.keys(ERR).forEach(function (k) {
    var ev = (k === 'consent' || k === 'service' || k === 'file') ? 'change' : 'blur';
    F[k].addEventListener(ev, function () { touched[k] = 1; show(k, check(k)); });
    F[k].addEventListener('input', function () { if (touched[k] || F[k].getAttribute('aria-invalid')) show(k, check(k)); });
  });
  F.service.addEventListener('change', function () { if (F.service.value) show('service', ''); });
  var counter = document.getElementById('msg-count');
  F.msg.addEventListener('input', function () { counter.textContent = CS.num(F.msg.value.length); if (F.msg.dataset.prefilled === '1' && !F.msg.value) F.msg.dataset.prefilled = ''; });

  function label(sel) { return sel.value !== '' ? sel.options[sel.selectedIndex].textContent : ''; }
  function buildText(limit) {
    var L = m('labels'), rows = [
      [L.name, F.name.value], [L.org, F.org.value], [L.title, F.title.value], [L.email, F.email.value], [L.phone, F.phone.value],
      [L.sector, label(F.sector)], [L.service, label(F.service)], [L.time, label(F.time)], [L.budget, F.budget.value],
      [L.file, F.file.files && F.file.files[0] ? F.file.files[0].name : '']
    ].filter(function (r) { return String(r[1]).trim(); }).map(function (r) { return r[0] + ': ' + String(r[1]).trim(); });
    var msg = F.msg.value.trim();
    if (limit && msg.length > limit) msg = msg.slice(0, limit) + '… ' + m('truncated');
    return rows.join('\n') + '\n\n' + L.msg + ':\n' + msg;
  }
  function mailtoHref() {
    var subj = m('subject') + (F.org.value.trim() || F.name.value.trim());
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(buildText(1200));
  }
  function setStatus(kind, html) {
    statusEl.className = 'form__status form__status--' + kind; statusEl.innerHTML = html; statusEl.hidden = false;
    statusEl.focus({ preventScroll: true });
    statusEl.scrollIntoView({ behavior: CS.reduced ? 'auto' : 'smooth', block: 'nearest' });
  }
  function fallbackButtons() {
    return '<a class="btn btn--navy btn--sm" href="' + mailtoHref() + '"><svg class="ico" aria-hidden="true"><use href="#i-mail"/></svg>' + CS.esc(m('mail')) + '</a>' +
      '<button type="button" class="btn btn--line btn--sm" data-copy-request><svg class="ico" aria-hidden="true"><use href="#i-copy"/></svg>' + CS.esc(m('copy')) + '</button>' +
      (F.file.files && F.file.files[0] ? '<p style="margin-top:10px;font-size:13.5px">' + CS.esc(m('attachNote')) + '</p>' : '');
  }
  statusEl.addEventListener('click', function (e) {
    if (e.target.closest('[data-copy-request]')) {
      var txt = buildText(0);
      (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(txt) : Promise.reject())
        .then(function () { CS.toast(CS.ui('toastCopied')); })
        .catch(function () {
          var ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
          var ok = false; try { ok = document.execCommand('copy'); } catch (er) {} ta.remove(); CS.toast(CS.ui(ok ? 'toastCopied' : 'toastCopyFail'));
        });
    }
    if (e.target.closest('[data-retry]')) form.requestSubmit ? form.requestSubmit() : submitBtn.click();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null, bad = 0;
    Object.keys(ERR).forEach(function (k) { touched[k] = 1; var msg = check(k); show(k, msg); if (msg) { bad++; if (!first) first = F[k]; } });
    if (bad) { statusEl.hidden = true; CS.toast(m('summary')); first.focus(); return; }
    if (F.hp.value) { setStatus('err', '<h3>' + CS.esc(m('errT')) + '</h3>'); return; }   // bot trap: never report success

    var endpoint = (CFG.FORM_ENDPOINT || '').trim();
    if (!endpoint) {
      setStatus('info', '<h3>' + CS.esc(m('offT')) + '</h3><p>' + CS.esc(m('offD')) + '</p>' + fallbackButtons());
      return;
    }
    var fd = new FormData();
    fd.append('name', F.name.value.trim()); fd.append('organization', F.org.value.trim()); fd.append('job_title', F.title.value.trim());
    fd.append('email', F.email.value.trim()); fd.append('mobile', F.phone.value.trim()); fd.append('sector', label(F.sector));
    fd.append('service', label(F.service)); fd.append('timeframe', label(F.time)); fd.append('budget', F.budget.value.trim());
    fd.append('message', F.msg.value.trim()); fd.append('language', CS.lang); fd.append('consent', 'yes'); fd.append('_subject', m('subject') + F.org.value.trim());
    if (CFG.FORM_SEND_FILE !== false && F.file.files && F.file.files[0]) fd.append('attachment', F.file.files[0]);

    var lbl = submitBtn.querySelector('span'), orig = lbl.textContent; submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); lbl.textContent = m('sending');
    var ctrl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { ctrl && ctrl.abort(); }, 30000);
    fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' }, signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) {
        return res.text().then(function (body) { var j = null; try { j = JSON.parse(body); } catch (er) {} return { ok: res.ok, status: res.status, json: j }; });
      })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        var ref = r.json && (r.json.reference || r.json.id || r.json.request_id);
        setStatus('ok', '<h3>' + CS.esc(m('okT')) + '</h3><p>' + CS.esc(m('okD')) + '</p>' + (ref ? '<p><strong>' + CS.esc(m('ref')) + '</strong> <span dir="ltr">' + CS.esc(ref) + '</span></p>' : ''));
        form.reset(); counter.textContent = '0'; var d = document.getElementById('form-diag'); if (d) d.hidden = true;
        Object.keys(ERR).forEach(function (k) { show(k, ''); }); touched = {};
      })
      .catch(function () {
        setStatus('err', '<h3>' + CS.esc(m('errT')) + '</h3><p>' + CS.esc(m('errD')) + '</p><button type="button" class="btn btn--gold btn--sm" data-retry>' + CS.esc(m('retry')) + '</button>' + fallbackButtons());
      })
      .then(function () { clearTimeout(to); submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); lbl.textContent = orig; });
  });

  CS.onLang(function () {
    Object.keys(ERR).forEach(function (k) { if (F[k].getAttribute('aria-invalid')) show(k, check(k)); });
    if (!statusEl.hidden) statusEl.hidden = true;
    counter.textContent = CS.num(F.msg.value.length);
  });
})();

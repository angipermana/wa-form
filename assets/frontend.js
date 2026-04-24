/* ── WA Floating Form – Frontend JS v1.1 ── */
(function () {
  'use strict';

  const cfg = window.waffData;
  if (!cfg || !cfg.wa_number) return;

  const shape    = cfg.btn_shape    || 'bar';
  const position = cfg.btn_position || 'bottom-right';
  const label    = cfg.button_label || 'Chat via WhatsApp';

  const waIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  /* ── Build FAB HTML per shape ── */
  function buildFab() {
    const fab = document.createElement('button');
    fab.id = 'waff-fab';
    fab.setAttribute('aria-label', label);
    fab.classList.add('waff-shape-' + shape);

    // Position classes
    const [v, h] = position.split('-');
    fab.style[v]    = '24px';
    fab.style[h]    = '24px';

    if (shape === 'bar') {
      fab.innerHTML = `${waIcon} <span>${esc(label)}</span>`;

    } else if (shape === 'round') {
      fab.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

    } else if (shape === 'round-avatar') {
      const avName = cfg.avatar_name || 'Admin';
      const avUrl  = cfg.avatar_url  || '';
      const initials = avName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const avInner = avUrl
        ? `<img src="${esc(avUrl)}" alt="${esc(avName)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
        : `<span class="waff-avatar-initials">${esc(initials)}</span>`;
      fab.innerHTML = `
        <div class="waff-avatar-wrap">${avInner}</div>
        <div class="waff-avatar-label">${esc(avName)}</div>`;
    }

    return fab;
  }

  /* ── Build form fields ── */
  function buildFields() {
    return (cfg.fields || []).map(f => {
      const req = f.required ? '<span class="waff-req">*</span>' : '';
      if (f.type === 'short_answer') {
        return `<div class="waff-form-field">
          <label>${esc(f.label)}${req}</label>
          <input type="text" data-field-id="${esc(f.id)}" data-label="${esc(f.label)}" placeholder="${esc(f.placeholder||'')}" />
        </div>`;
      }
      if (f.type === 'choice' || f.type === 'checkbox') {
        const type = f.type === 'checkbox' ? 'checkbox' : 'radio';
        const opts = (f.options||[]).map(o => `
          <label class="waff-choice-label">
            <input type="${type}" name="waff-${esc(f.id)}" value="${esc(o)}" data-field-id="${esc(f.id)}" data-label="${esc(f.label)}" />${esc(o)}
          </label>`).join('');
        return `<div class="waff-form-field"><label>${esc(f.label)}${req}</label><div class="waff-choices">${opts}</div></div>`;
      }
      if (f.type === 'buttons') {
        const opts = (f.options||[]).map(o => `
          <button type="button" class="waff-btn-choice" data-field-id="${esc(f.id)}" data-label="${esc(f.label)}" data-value="${esc(o)}">${esc(o)}</button>`).join('');
        return `<div class="waff-form-field"><label>${esc(f.label)}${req}</label><div class="waff-buttons">${opts}</div></div>`;
      }
      return '';
    }).join('');
  }

  /* ── Init on DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', function () {

    /* Overlay */
    const overlay = document.createElement('div');
    overlay.id = 'waff-overlay';

    // Popup alignment: mirror FAB position
    const [v, h] = position.split('-');
    overlay.style.alignItems    = v === 'bottom' ? 'flex-end' : 'flex-start';
    overlay.style.justifyContent= h === 'right'  ? 'flex-end' : 'flex-start';
    const popupPad = {};
    popupPad[v] = '90px';
    popupPad[h] = '24px';
    overlay.style.padding = `${popupPad.top||0} ${popupPad.right||0} ${popupPad.bottom||0} ${popupPad.left||0}`;

    overlay.innerHTML = `
      <div id="waff-popup" role="dialog" aria-modal="true" aria-label="Form WhatsApp">
        <div class="waff-popup-header">
          <div style="display:flex;align-items:center;gap:10px;">${waIcon}
            <div class="waff-popup-header-text">
              <p class="waff-popup-title">${esc(label)}</p>
              <p class="waff-popup-intro">${esc(cfg.intro_text||'Isi form di bawah ya.')}</p>
            </div>
          </div>
          <button class="waff-popup-close" id="waff-close" aria-label="Tutup">×</button>
        </div>
        <div class="waff-popup-body">${buildFields()}</div>
        <div id="waff-msg-preview"><strong>Preview pesan kamu:</strong><span id="waff-msg-text"></span></div>
        <button id="waff-submit" disabled>${waIcon} Chat Sekarang</button>
      </div>`;
    document.body.appendChild(overlay);

    /* FAB */
    const fab = buildFab();
    document.body.appendChild(fab);

    /* Open/close */
    fab.addEventListener('click', () => { overlay.classList.add('open'); fab.style.display = 'none'; });
    document.getElementById('waff-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    function close() { overlay.classList.remove('open'); fab.style.display = ''; }

    /* Collect answers */
    function getAnswers() {
      const a = {};
      overlay.querySelectorAll('input[type=text][data-field-id]').forEach(el => { a[(el.dataset.label||'').trim()] = el.value.trim(); });
      overlay.querySelectorAll('input[type=radio]:checked').forEach(el => { a[(el.dataset.label||'').trim()] = el.value; });
      overlay.querySelectorAll('input[type=checkbox]:checked').forEach(el => {
        const key = (el.dataset.label||'').trim();
        if (!a[key]) a[key] = [];
        a[key].push(el.value);
      });
      overlay.querySelectorAll('.waff-btn-choice.selected').forEach(el => { a[(el.dataset.label||'').trim()] = el.dataset.value; });

      // Join array values (checkboxes) with comma
      Object.keys(a).forEach(k => { if (Array.isArray(a[k])) a[k] = a[k].join(', '); });
      return a;
    }

    function buildMsg(answers) {
      let msg = cfg.message_template || '';
      Object.entries(answers).forEach(([k, v]) => {
        // Escape special regex chars in key and use case-insensitive replacement
        const safeK = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('{' + safeK + '}', 'gi');
        msg = msg.replace(regex, v);
      });
      return msg;
    }

    function isValid(answers) {
      return (cfg.fields||[]).every(f => !f.required || (answers[f.label] && answers[f.label].trim() !== ''));
    }

    function onChange() {
      const answers = getAnswers();
      const valid   = isValid(answers);
      document.getElementById('waff-submit').disabled = !valid;
      const preview = document.getElementById('waff-msg-preview');
      const txt     = document.getElementById('waff-msg-text');
      if (Object.values(answers).some(v => v)) {
        txt.textContent = buildMsg(answers);
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
      }
    }

    overlay.addEventListener('input', e => { if (e.target.matches('input[type=text]')) onChange(); });
    overlay.addEventListener('change', e => {
      if (e.target.matches('input[type=radio], input[type=checkbox]')) {
        if (e.target.type === 'radio') {
          overlay.querySelectorAll(`input[name="${e.target.name}"]`).forEach(r =>
            r.closest('.waff-choice-label').classList.toggle('selected', r.checked));
        } else {
          e.target.closest('.waff-choice-label').classList.toggle('selected', e.target.checked);
        }
        onChange();
      }
    });
    overlay.addEventListener('click', e => {
      if (e.target.matches('.waff-btn-choice')) {
        overlay.querySelectorAll(`.waff-btn-choice[data-field-id="${e.target.dataset.fieldId}"]`).forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        onChange();
      }
    });

    document.getElementById('waff-submit').addEventListener('click', () => {
      const answers = getAnswers();
      if (!isValid(answers)) return;
      window.open('https://wa.me/' + cfg.wa_number.replace(/\D/g,'') + '?text=' + encodeURIComponent(buildMsg(answers)), '_blank');
    });
  });

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();

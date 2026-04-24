/* ── WA Floating Form – Admin JS v1.1 ── */
(function () {
  'use strict';

  const root = document.getElementById('waff-admin-root');
  if (!root) return;

  let settings = JSON.parse(root.dataset.settings || '{}');
  const nonce  = root.dataset.nonce;

  const uid = () => 'f' + Math.random().toString(36).slice(2,7);
  const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const waIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  /* ─────────────────────────────────────────
     RENDER MAIN UI
  ───────────────────────────────────────── */
  function render() {
    const pos   = settings.btn_position || 'bottom-right';
    const shape = settings.btn_shape    || 'bar';

    root.innerHTML = `
    <div id="waff-wrap">
      <h1>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WA Floating Form <span class="waff-badge">v1.1</span>
      </h1>
      <p class="waff-subtitle">Atur tombol WhatsApp + form di semua halaman website kamu.</p>

      <div class="waff-grid">

        <!-- ① Pengaturan Dasar -->
        <div class="waff-card">
          <h2>${iconSettings()} Pengaturan Dasar</h2>
          <div class="waff-field">
            <label>Nomor WhatsApp</label>
            <input type="tel" id="waff-number" value="${esc(settings.wa_number||'')}" placeholder="628123456789 (tanpa + atau spasi)" />
            <div class="waff-hint">Awali dengan kode negara. Indonesia: 628xxx</div>
          </div>
          <div class="waff-field">
            <label>Label Tombol</label>
            <input type="text" id="waff-btn-label" value="${esc(settings.button_label||'Chat via WhatsApp')}" />
          </div>
          <div class="waff-field">
            <label>Teks Intro Popup</label>
            <input type="text" id="waff-intro" value="${esc(settings.intro_text||'')}" placeholder="Halo! Isi form di bawah ya." />
          </div>
        </div>

        <!-- ⑤ Integrasi Data -->
        <div class="waff-card">
          <h2>${iconZap()} Integrasi Data (Sheets/Notion)</h2>
          <div class="waff-field">
            <label>Google Sheets Webhook URL</label>
            <input type="text" id="waff-webhook" value="${esc(settings.webhook_url||'')}" placeholder="https://script.google.com/macros/s/..." />
            <div class="waff-hint">Gunakan script doPost (link langsung ke G-Sheets).</div>
          </div>
          <div style="border-top:1px solid #eee; margin:15px 0;"></div>
          <div class="waff-field">
            <label>Notion API Token (Internal Integration)</label>
            <input type="text" id="waff-notion-token" value="${esc(settings.notion_token||'')}" placeholder="secret_..." />
          </div>
          <div class="waff-field" style="margin-bottom:0;">
            <label>Notion Database ID</label>
            <input type="text" id="waff-notion-db" value="${esc(settings.notion_db_id||'')}" placeholder="db id..." />
            <div class="waff-hint">Data dikirim langsung via API Notion (Tanpa Zapier).</div>
          </div>
        </div>

        <!-- ② Tampilan Tombol -->
        <div class="waff-card">
          <h2>${iconPalette()} Tampilan Tombol</h2>

          <div class="waff-field">
            <label>Posisi Tombol</label>
            <div class="waff-position-grid">
              ${['top-left','top-right','bottom-left','bottom-right'].map(p => `
                <div class="waff-pos-cell waff-pos-${p} ${pos===p?'active':''}" onclick="waffSetPosition('${p}')" title="${p}">
                  <div class="waff-pos-dot"></div>
                </div>`).join('')}
            </div>
            <div class="waff-hint">Posisi aktif: <strong id="waff-pos-label">${pos}</strong></div>
          </div>

          <div class="waff-field">
            <label>Warna Utama</label>
            <div style="display:flex;align-items:center;gap:10px;">
              <input type="color" id="waff-primary-color" value="${settings.primary_color||'#25d366'}" style="width:45px;height:45px;border:none;padding:0;background:none;cursor:pointer;" />
              <input type="text" id="waff-primary-hex" value="${settings.primary_color||'#25d366'}" style="width:100px;" oninput="document.getElementById('waff-primary-color').value=this.value; waffSaveTemp();" />
            </div>
            <div class="waff-hint">Warna untuk tombol, header popup, dan aksen form.</div>
          </div>

          <div class="waff-field">
            <label>Bentuk Tombol</label>
            <div class="waff-shape-picker">
              ${shapeOpt('bar',   shape, shapeBarDemo())}
              ${shapeOpt('round', shape, shapeRoundDemo())}
              ${shapeOpt('round-avatar', shape, shapeAvatarDemo())}
            </div>
          </div>

          <div id="waff-avatar-settings" style="${shape==='round-avatar'?'':'display:none'}; margin-top:10px; padding:12px; background:#f9f9f9; border-radius:8px; border:1px solid #eee;">
            <div class="waff-field">
              <label>Nama Admin</label>
              <input type="text" id="waff-avatar-name" value="${esc(settings.avatar_name||'Admin')}" placeholder="Nama yang tampil" />
            </div>
            <div class="waff-field" style="margin-bottom:0;">
              <label>URL Foto Avatar</label>
              <input type="text" id="waff-avatar-url" value="${esc(settings.avatar_url||'')}" placeholder="https://domain.com/foto.jpg" />
              <div class="waff-hint">URL foto profil admin (opsional)</div>
            </div>
          </div>
        </div>

        <!-- ③ Template Pesan – full width -->
        <div class="waff-card waff-builder-full">
          <h2>${iconMsg()} Template Pesan WA</h2>
          <div class="waff-field">
            <label>Template</label>
            <textarea id="waff-template">${esc(settings.message_template||'')}</textarea>
            <div class="waff-hint">Gunakan {Label Field} untuk menyisipkan jawaban user. Contoh: {Nama lengkap}, {Asal kota}</div>
          </div>
          <div id="waff-vars-hint" style="font-size:11px;color:#646970;margin-top:6px;"></div>
          <div class="waff-preview-wrap" style="margin-top:16px;">
            <span class="waff-preview-label">Preview popup</span>
            <div id="waff-mini-preview"></div>
          </div>
        </div>

        <!-- ④ Form Builder – full width -->
        <div class="waff-card waff-builder-full">
          <h2>${iconForm()} Form Builder</h2>
          <ul class="waff-fields-list" id="waff-fields-list"></ul>
          <div class="waff-add-field-row">
            <button class="waff-add-btn short"  onclick="waffAddField('short_answer')">＋ Short Answer</button>
            <button class="waff-add-btn choice" onclick="waffAddField('choice')">＋ Pilihan (Radio)</button>
            <button class="waff-add-btn buttons" onclick="waffAddField('buttons')">＋ Button Choice</button>
            <button class="waff-add-btn choice" style="border-color:#722ed1;color:#722ed1;" onclick="waffAddField('checkbox')">＋ Checkbox</button>
          </div>
        </div>

      </div>

      <div class="waff-save-row">
        <button id="waff-save-btn" onclick="waffSave()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Simpan Pengaturan
        </button>
        <span id="waff-save-status"></span>
      </div>
    </div>`;

    renderFields();
    updateVarsHint();
    updatePreview();
    bindLiveSync();
  }

  /* ── Icon helpers ── */
  function iconSettings() { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`; }
  function iconPalette() { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.69 0 3-.76 3-2 0-.54-.2-1.03-.52-1.42-.28-.35-.44-.79-.44-1.24C14 16.26 14.74 15.5 16 15.5H18c2.76 0 4-1.24 4-3.5C22 6.81 17.52 2 12 2z"/></svg>`; }
  function iconMsg()     { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`; }
  function iconForm()    { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`; }
  function iconZap()     { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`; }

  /* ── Shape picker helpers ── */
  function shapeOpt(val, current, demoHTML) {
    const labels = { bar: 'Bar', round: 'Round', 'round-avatar': 'Avatar' };
    return `
      <div class="waff-shape-opt ${current===val?'active':''}" onclick="waffSetShape('${val}')">
        ${demoHTML}
        <div class="waff-shape-name">${labels[val]||val}</div>
      </div>`;
  }
  function shapeBarDemo() {
    return `<div class="waff-shape-demo shape-bar">${waIcon}<span style="font-size:11px;font-weight:600;">Chat WA</span></div>`;
  }
  function shapeRoundDemo() {
    return `<div class="waff-shape-demo shape-round">${waIcon.replace('18','22').replace('18','22')}</div>`;
  }
  function shapeAvatarDemo() {
    const av = settings.avatar_url ? `<img src="${esc(settings.avatar_url)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : `<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    return `<div class="waff-shape-demo shape-round-avatar"><div style="width:38px;height:38px;border-radius:50%;border:2.5px solid white;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1da851;">${av}</div></div>`;
  }

  /* ── Position picker ── */
  window.waffSetPosition = function(pos) {
    settings.btn_position = pos;
    document.querySelectorAll('.waff-pos-cell').forEach(el => el.classList.remove('active'));
    document.querySelector('.waff-pos-' + pos)?.classList.add('active');
    const lbl = document.getElementById('waff-pos-label');
    if (lbl) lbl.textContent = pos;
    updatePreview();
  };

  /* ── Shape picker ── */
  window.waffSetShape = function(shape) {
    settings.btn_shape = shape;
    document.querySelectorAll('.waff-shape-opt').forEach(el => el.classList.remove('active'));
    event?.currentTarget?.classList.add('active');
    // re-render shape picker to update active state cleanly
    document.querySelectorAll('.waff-shape-opt').forEach((el, i) => {
      const vals = ['bar','round','round-avatar'];
      el.classList.toggle('active', vals[i] === shape);
    });
    const avatarSettings = document.getElementById('waff-avatar-settings');
    if (avatarSettings) avatarSettings.style.display = shape === 'round-avatar' ? '' : 'none';
    updatePreview();
  };

  /* ── Field rendering ── */
  function renderFields() {
    const list = document.getElementById('waff-fields-list');
    if (!list) return;
    list.innerHTML = (settings.fields || []).map((f, i) => fieldHTML(f, i)).join('');
  }

  function fieldHTML(f, i) {
    const badgeLabel = { short_answer: 'Short Answer', choice: 'Pilihan', buttons: 'Button', checkbox: 'Checkbox' }[f.type] || f.type;
    let bodyHTML = '';

    if (f.type === 'short_answer') {
      bodyHTML = `
        <div class="waff-field"><label>Label Field</label>
          <input type="text" value="${esc(f.label)}" onchange="waffUpdateField(${i},'label',this.value)" /></div>
        <div class="waff-field"><label>Placeholder</label>
          <input type="text" value="${esc(f.placeholder||'')}" onchange="waffUpdateField(${i},'placeholder',this.value)" /></div>`;
    }
    if (f.type === 'choice' || f.type === 'buttons' || f.type === 'checkbox') {
      const opts = (f.options||[]).map((o,oi) => `
        <li class="waff-option-row">
          <input type="text" value="${esc(o)}" onchange="waffUpdateOption(${i},${oi},this.value)" placeholder="Opsi ${oi+1}" />
          <button class="waff-btn-icon danger" onclick="waffRemoveOption(${i},${oi})">×</button>
        </li>`).join('');
      bodyHTML = `
        <div class="waff-field"><label>Label Field</label>
          <input type="text" value="${esc(f.label)}" onchange="waffUpdateField(${i},'label',this.value)" /></div>
        <div class="waff-field"><label>Pilihan</label>
          <ul class="waff-options-list">${opts}</ul>
          <button class="waff-add-btn choice" style="font-size:11px;padding:4px 10px;" onclick="waffAddOption(${i})">＋ Tambah opsi</button>
        </div>`;
    }

    return `
    <li class="waff-field-item" data-index="${i}">
      <div class="waff-field-header">
        <span class="waff-field-drag">⠿</span>
        <span class="waff-field-title">${esc(f.label)||'(tanpa label)'}</span>
        <span class="waff-field-type-badge badge-${f.type}">${badgeLabel}</span>
      </div>
      <div class="waff-field-body">
        ${bodyHTML}
        <div class="waff-field-actions">
          <label class="waff-required-toggle">
            <input type="checkbox" ${f.required?'checked':''} onchange="waffUpdateField(${i},'required',this.checked)" /> Wajib diisi
          </label>
          <button class="waff-btn-icon danger" onclick="waffRemoveField(${i})">🗑</button>
        </div>
      </div>
    </li>`;
  }

  /* ── Field mutations ── */
  window.waffAddField = function(type) {
    const f = { id: uid(), type, label: '', required: false };
    if (type === 'short_answer') f.placeholder = '';
    if (type === 'choice' || type === 'buttons' || type === 'checkbox') f.options = ['Opsi 1', 'Opsi 2'];
    settings.fields = settings.fields || [];
    settings.fields.push(f);
    renderFields(); updateVarsHint(); updatePreview();
  };
  window.waffRemoveField = function(i) {
    settings.fields.splice(i, 1);
    renderFields(); updateVarsHint(); updatePreview();
  };
  window.waffUpdateField = function(i, key, val) {
    if (key === 'label') val = val.trim();
    settings.fields[i][key] = val;
    const item = document.querySelectorAll('.waff-field-item')[i];
    if (item && key === 'label') item.querySelector('.waff-field-title').textContent = val || '(tanpa label)';
    updateVarsHint(); updatePreview();
  };
  window.waffAddOption = function(i) {
    settings.fields[i].options = settings.fields[i].options || [];
    settings.fields[i].options.push('Opsi ' + (settings.fields[i].options.length + 1));
    renderFields();
  };
  window.waffRemoveOption = function(i, oi) { settings.fields[i].options.splice(oi, 1); renderFields(); };
  window.waffUpdateOption = function(i, oi, val) { settings.fields[i].options[oi] = val; };

  /* ── Sync DOM → settings ── */
  function syncFromDOM() {
    settings.wa_number        = document.getElementById('waff-number')?.value || '';
    settings.button_label     = document.getElementById('waff-btn-label')?.value || '';
    settings.intro_text       = document.getElementById('waff-intro')?.value || '';
    settings.message_template = document.getElementById('waff-template')?.value || '';
    settings.avatar_name      = document.getElementById('waff-avatar-name')?.value || 'Admin';
    settings.webhook_url      = document.getElementById('waff-webhook')?.value || '';
    settings.notion_token     = document.getElementById('waff-notion-token')?.value || '';
    settings.notion_db_id     = document.getElementById('waff-notion-db')?.value || '';
  }

  function bindLiveSync() {
    ['waff-number','waff-btn-label','waff-intro','waff-template','waff-avatar-name','waff-avatar-url','waff-webhook','waff-notion-token','waff-notion-db','waff-primary-color','waff-primary-hex'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => { 
        if (id === 'waff-primary-color') document.getElementById('waff-primary-hex').value = e.target.value;
        if (id === 'waff-primary-hex')   document.getElementById('waff-primary-color').value = e.target.value;
        syncFromDOM(); updatePreview(); updateVarsHint(); 
      });
    });
  }

  /* ── Vars hint ── */
  function updateVarsHint() {
    const el = document.getElementById('waff-vars-hint');
    if (!el) return;
    const vars = (settings.fields||[]).map(f => `<code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;font-size:11px;">{${f.label||'?'}}</code>`).join(' ');
    el.innerHTML = vars ? '📌 Variabel tersedia: ' + vars : '';
  }

  /* ── Mini preview (popup + tombol) ── */
  function updatePreview() {
    const el = document.getElementById('waff-mini-preview');
    if (!el) return;
    syncFromDOM();

    const pos    = settings.btn_position || 'bottom-right';
    const shape  = settings.btn_shape || 'bar';
    const color  = settings.primary_color || '#25d366';
    const label  = settings.button_label || 'Chat via WhatsApp';
    const intro  = settings.intro_text || 'Isi form di bawah ya.';
    const fields = (settings.fields||[]).slice(0,3);

    // Dynamic style for mini preview
    let style = document.getElementById('waff-preview-style');
    if (!style) { style = document.createElement('style'); style.id = 'waff-preview-style'; document.head.appendChild(style); }
    style.innerHTML = `
      .waff-preview-popup .pp-title, .pp-btn-wa { background: ${color} !important; }
      .waff-preview-popup { border-top: 4px solid ${color}; }
      .pp-option { border: 1px solid ${color} !important; color: ${color}; }
    `;

    const fieldsHTML = fields.map(f => {
      if (f.type === 'short_answer') return `<div class="pp-field"><div class="pp-label">${esc(f.label)}</div><div class="pp-input">${esc(f.placeholder||'')}</div></div>`;
      if (f.type === 'choice' || f.type === 'checkbox') {
        const char = f.type === 'checkbox' ? '☐' : '○';
        return `<div class="pp-field"><div class="pp-label">${esc(f.label)}</div><div class="pp-options">${(f.options||[]).map(o=>`<span class="pp-option">${char} ${esc(o)}</span>`).join('')}</div></div>`;
      }
      if (f.type === 'buttons') {
        return `<div class="pp-field"><div class="pp-label">${esc(f.label)}</div><div class="pp-options">${(f.options||[]).map(o=>`<span class="pp-option" style="background:#25d366;color:#fff;border-color:#25d366;">${esc(o)}</span>`).join('')}</div></div>`;
      }
      return '';
    }).join('');

    /* Tombol preview */
    let btnHTML = '';
    if (shape === 'bar') {
      btnHTML = `<div style="display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;padding:10px 16px;border-radius:50px;font-size:13px;font-weight:600;">${waIcon} ${esc(label)}</div>`;
    } else if (shape === 'round') {
      btnHTML = `<div style="width:52px;height:52px;border-radius:50%;background:#25d366;color:#fff;display:flex;align-items:center;justify-content:center;">${waIcon.replace('18','24').replace('18','24')}</div>`;
    } else {
      const avUrl = settings.avatar_url;
      const avName = settings.avatar_name || 'Admin';
      const initials = avName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const avInner = avUrl
        ? `<img src="${esc(avUrl)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
        : `<span style="font-size:14px;font-weight:700;color:#fff;">${esc(initials)}</span>`;
      btnHTML = `
        <div style="display:flex;align-items:flex-end;gap:0;">
          <div style="width:56px;height:56px;border-radius:50%;border:3px solid #25d366;background:#1da851;display:flex;align-items:center;justify-content:center;overflow:hidden;">${avInner}</div>
          <div style="background:#25d366;color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:10px;margin-left:-4px;margin-bottom:4px;">${esc(avName)}</div>
        </div>`;
    }

    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="font-size:11px;color:#8c8f94;text-transform:uppercase;letter-spacing:.5px;">Preview Tombol</div>
        ${btnHTML}
        <div style="font-size:11px;color:#8c8f94;">↓ Popup yang muncul setelah klik</div>
        <div class="waff-preview-popup">
          <button class="pp-btn-wa" style="background:${color};">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat Sekarang
          </button>
        </div>
      </div>`;
  }

  /* ── Save ── */
  window.waffSave = function() {
    syncFromDOM();
    const btn    = document.getElementById('waff-save-btn');
    const status = document.getElementById('waff-save-status');
    btn.disabled = true;
    status.textContent = 'Menyimpan...';
    status.className   = '';

    const fd = new FormData();
    fd.append('action',   'waff_save_settings');
    fd.append('nonce',    nonce);
    fd.append('settings', JSON.stringify(settings));

    fetch(ajaxurl, { method: 'POST', body: fd })
      .then(r => r.json())
      .then(data => {
        status.textContent = data.success ? '✓ Tersimpan!' : '✗ Gagal: ' + (data.data||'error');
        status.className   = data.success ? 'success' : 'error';
      })
      .catch(() => { status.textContent = '✗ Network error'; status.className = 'error'; })
      .finally(() => { btn.disabled = false; setTimeout(() => { status.textContent = ''; }, 4000); });
  };

  render();
})();

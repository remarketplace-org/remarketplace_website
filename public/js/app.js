(function () {
  const { EXTRA, CATALOG, SORTS, LANGUAGES, EXPERTS, SLOTS, FAQS } = window.RM;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slugOf = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const days = s => (parseInt(s, 10) || 0) * (s.includes('week') ? 7 : 1);

  const ITEMS = CATALOG.map(p => {
    const x = EXTRA[p.name] || { rating: 4.5, reviews: 20, price: 'on request', deploy: '2 weeks', demo: 'demo.remarketplace.io' };
    const slug = slugOf(p.name);
    return Object.assign({}, p, x, {
      slug,
      creds: [
        ['Demo URL', 'https://' + x.demo],
        ['Test email', 'demo.' + slug.split('-')[0] + '@remarketplace.io'],
        ['Password', 'Sandbox2026!'],
        ['Sandbox API key', 'rm_test_' + slug.replace(/-/g, '').slice(0, 10) + '_9f4c21'],
        ['Tenant ID', 'sandbox-' + slug.split('-')[0]]
      ]
    });
  });

  const stars = r => [0, 1, 2, 3, 4].map(i =>
    `<i class="${r >= i + 0.75 ? 'full' : r >= i + 0.25 ? 'half' : ''}">★</i>`).join('');
  const mark = p => `<span class="mark t-${p.tone}">${esc(p.mark)}</span>`;

  /* ---------- Catalog ---------- */
  const st = { q: '', cat: 'All', sort: 'Top rated', faq: 0 };
  const cats = ['All', ...new Set(ITEMS.map(p => p.category))];

  function renderChips() {
    $('#cats').innerHTML = cats.map(c => `<button class="chip${c === st.cat ? ' on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    $('#sorts').innerHTML = SORTS.map(s => `<button class="chip${s === st.sort ? ' on' : ''}" data-sort="${esc(s)}">${esc(s)}</button>`).join('');
  }

  function renderGrid() {
    const q = st.q.trim().toLowerCase();
    let list = ITEMS.filter(p => (st.cat === 'All' || p.category === st.cat) &&
      (!q || (p.name + ' ' + p.category + ' ' + p.blurb).toLowerCase().includes(q)));
    list.sort((a, b) => st.sort === 'Most reviewed' ? b.reviews - a.reviews :
      st.sort === 'Fastest to deploy' ? days(a.deploy) - days(b.deploy) :
      st.sort === 'A–Z' ? a.name.localeCompare(b.name) : b.rating - a.rating);
    $('#count').textContent = `${list.length} of ${ITEMS.length} products`;
    $('#empty').hidden = list.length > 0;
    $('#grid').innerHTML = list.map((p, i) => `
      <article class="card" style="animation-delay:${i * 45}ms" data-open="${ITEMS.indexOf(p)}" tabindex="0">
        <div class="card-top">${mark(p)}<span class="cat-tag">${esc(p.category)}</span></div>
        <h3>${esc(p.name)}</h3>
        <div class="rating"><span class="stars">${stars(p.rating)}</span><b>${p.rating.toFixed(1)}</b><span>${p.reviews} reviews</span></div>
        <p>${esc(p.blurb)}</p>
        <div class="card-foot"><span>Live in ${esc(p.deploy)} · ${esc(p.price)}</span><span class="view">View →</span></div>
      </article>`).join('');
  }

  function renderFaq() {
    $('#faqs').innerHTML = FAQS.map((f, i) => `
      <div class="faq-item${st.faq === i ? ' open' : ''}">
        <button class="faq-q" data-faq="${i}" aria-expanded="${st.faq === i}">
          <span class="num">${String(i + 1).padStart(2, '0')}</span><span class="qt">${esc(f.q)}</span><span class="sign">${st.faq === i ? '–' : '+'}</span>
        </button>
        <div class="faq-a"><p>${esc(f.a)}</p></div>
      </div>`).join('');
  }

  /* ---------- Overlays ---------- */
  function openOv(id) { $(id).hidden = false; document.body.classList.add('lock'); }
  function closeOv(id) { $(id).hidden = true; if ($('#prodOv').hidden && $('#bookOv').hidden) document.body.classList.remove('lock'); }

  let sel = null;
  function openProduct(i) {
    sel = ITEMS[i];
    $('#prodBody').innerHTML = `
      <div class="d-head">${mark(sel)}<div><span class="cat-tag">${esc(sel.category)} · ${esc(sel.meta)}</span><h3 id="pName">${esc(sel.name)}</h3></div></div>
      <div class="rating"><span class="stars">${stars(sel.rating)}</span><b>${sel.rating.toFixed(1)}</b><span>${sel.reviews} reviews</span></div>
      <p class="d-blurb">${esc(sel.blurb)}</p>
      <div class="d-facts"><div><span>Go-live</span><b>${esc(sel.deploy)}</b></div><div><span>Pricing</span><b>${esc(sel.price)}</b></div></div>
      <h4>What's included</h4>
      <ul class="incl">${sel.includes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <h4>Sandbox credentials</h4>
      <p class="muted small">Placeholder test data for evaluation only.</p>
      <div class="creds">${sel.creds.map(([l, v]) => `
        <div class="cred"><div><span>${esc(l)}</span><code>${esc(v)}</code></div><button class="copy" data-copy="${esc(v)}">Copy</button></div>`).join('')}</div>
      <button class="btn btn-accent block" data-book-sel>Book a demo for ${esc(sel.name)}</button>`;
    openOv('#prodOv');
  }

  /* ---------- Booking ---------- */
  const LABELS = ['Products', 'Date & time', 'Language & specialist', 'Your details', 'Review'];
  let b;
  function dayOptions() {
    const out = [], d = new Date(); d.setDate(d.getDate() + 1);
    while (out.length < 12) {
      if (d.getDay() % 6 !== 0) out.push({
        key: d.toISOString().slice(0, 10),
        dow: d.toLocaleDateString('en-GB', { weekday: 'short' }), day: d.getDate(),
        month: d.toLocaleDateString('en-GB', { month: 'short' }),
        full: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }
  const DAYS = dayOptions();

  function openBooking(pre) {
    b = { step: 1, done: false, picked: pre ? [pre] : [], date: '', time: '', lang: '', expert: '', name: (me && me.name) || '', email: (me && me.email) || '', company: '', notes: '' };
    closeOv('#prodOv'); openOv('#bookOv'); renderBooking();
  }
  function valid(s) {
    if (s === 1) return b.picked.length > 0;
    if (s === 2) return !!b.date && !!b.time;
    if (s === 3) return !!b.lang && !!b.expert;
    if (s === 4) return b.name.trim().length > 1 && /.+@.+\..+/.test(b.email) && b.company.trim().length > 1;
    return true;
  }
  const pill = (on, attr, val, label) => `<button class="pill${on ? ' on' : ''}" ${attr}="${esc(val)}">${esc(label)}</button>`;
  const refOf = () => 'RMK-' + (b.date ? b.date.replace(/-/g, '').slice(2) : '000000') + '-' + Math.max(1, b.picked.length) + 'P';

  function renderBooking() {
    const body = $('#bBody');
    $('#bCounter').textContent = b.done ? 'Confirmed' : `Step ${b.step} of 5`;
    $('#bTitle').textContent = b.done ? 'You’re booked in' : LABELS[b.step - 1];
    $('#bProg').style.width = (b.done ? 100 : b.step * 20) + '%';
    $('#bFoot').hidden = b.done;
    $('#bBack').hidden = b.step === 1;
    $('#bNext').textContent = b.step === 5 ? 'Confirm booking' : 'Continue';
    $('#bNext').disabled = !valid(b.step);
    const expert = EXPERTS.find(e => e.name === b.expert);
    const day = DAYS.find(d => d.key === b.date);

    if (b.done) {
      body.innerHTML = `<div class="done"><div class="tick">✓</div>
        <p>A calendar invite is on its way to <b>${esc(b.email)}</b>.</p>
        <div class="summary"><div><span>Reference</span><b>${refOf()}</b></div><div><span>When</span><b>${esc(day.full)}, ${esc(b.time)} ${esc(expert.tz)}</b></div>
        <div><span>With</span><b>${esc(expert.name)}</b></div><div><span>Duration</span><b>${b.picked.length > 2 ? '45' : '30'} minutes</b></div></div>
        <button class="btn btn-dark block" data-close>Done</button></div>`;
      return;
    }
    if (b.step === 1) {
      body.innerHTML = `<p class="muted small">${b.picked.length} product${b.picked.length === 1 ? '' : 's'} selected</p><div class="rows">` +
        ITEMS.map(p => { const on = b.picked.includes(p.name); return `
          <button class="row${on ? ' on' : ''}" data-pick="${esc(p.name)}"><span class="box">${on ? '✓' : ''}</span>${mark(p)}
          <span class="row-t"><b>${esc(p.name)}</b><span>${esc(p.category)}</span></span></button>`; }).join('') + '</div>';
    } else if (b.step === 2) {
      body.innerHTML = `<h5>Pick a day</h5><div class="days">` + DAYS.map(d => `
        <button class="day${b.date === d.key ? ' on' : ''}" data-date="${d.key}"><span>${d.dow}</span><b>${d.day}</b><span>${d.month}</span></button>`).join('') +
        `</div><h5>Pick a time</h5><div class="pills">` + SLOTS.map(t => pill(b.time === t, 'data-time', t, t)).join('') + '</div>';
    } else if (b.step === 3) {
      const list = EXPERTS.filter(e => !b.lang || e.langs.includes(b.lang));
      body.innerHTML = `<h5>Call language</h5><div class="pills">` + LANGUAGES.map(l => pill(b.lang === l, 'data-lang', l, l)).join('') + '</div>' +
        (b.lang ? `<h5>Specialist</h5><div class="rows">` + list.map(e => `
          <button class="row${b.expert === e.name ? ' on' : ''}" data-expert="${esc(e.name)}"><span class="mark t-a">${e.mark}</span>
          <span class="row-t"><b>${esc(e.name)}</b><span>${esc(e.role)}</span><span>${esc(e.langs.join(' · '))} · ${esc(e.tz)}</span></span></button>`).join('') + '</div>'
          : '<p class="muted small">Choose a language to see available specialists.</p>');
    } else if (b.step === 4) {
      body.innerHTML = `<div class="form">
        <label>Full name<input data-f="name" value="${esc(b.name)}" placeholder="Jane Doe" autocomplete="name"></label>
        <label>Work email<input data-f="email" type="email" value="${esc(b.email)}" placeholder="jane@company.com" autocomplete="email"></label>
        <label>Company<input data-f="company" value="${esc(b.company)}" placeholder="Company name" autocomplete="organization"></label>
        <label>Notes (optional)<textarea data-f="notes" rows="3" placeholder="What would you like to cover?">${esc(b.notes)}</textarea></label></div>`;
    } else {
      body.innerHTML = `<div class="summary">
        <div><span>Products</span><b>${b.picked.map(esc).join(', ')}</b></div>
        <div><span>Date</span><b>${esc(day.full)}</b></div><div><span>Time</span><b>${esc(b.time)} ${esc(expert.tz)}</b></div>
        <div><span>Language</span><b>${esc(b.lang)}</b></div><div><span>Specialist</span><b>${esc(expert.name)}</b><small>${esc(expert.role)}</small></div>
        <div><span>Name</span><b>${esc(b.name)}</b></div><div><span>Email</span><b>${esc(b.email)}</b></div><div><span>Company</span><b>${esc(b.company)}</b></div>
        <div><span>Notes</span><b>${esc(b.notes || 'No additional notes.')}</b></div></div>`;
    }
  }

  async function submitBooking() {
    const btn = $('#bNext'); btn.disabled = true; btn.textContent = 'Booking…';
    try {
      const r = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: refOf(), products: b.picked, date: b.date, time: b.time, lang: b.lang, expert: b.expert, name: b.name, email: b.email, company: b.company, notes: b.notes }) });
      if (!r.ok) throw new Error();
      b.done = true;
    } catch (_) { alert('Could not save the booking. Please try again.'); }
    renderBooking();
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, [data-open], a, .overlay');
    if (!t) return;
    const d = t.dataset;
    if (t.classList.contains('overlay') && e.target === t) return closeOv('#' + t.id);
    if ('book' in d) return openBooking(null);
    if ('bookSel' in d) return openBooking(sel && sel.name);
    if ('close' in d) return closeOv('#' + t.closest('.overlay').id);
    if (d.cat) { st.cat = d.cat; renderChips(); return renderGrid(); }
    if (d.sort) { st.sort = d.sort; renderChips(); return renderGrid(); }
    if (d.open) return openProduct(+d.open);
    if (d.faq) { st.faq = st.faq === +d.faq ? -1 : +d.faq; return renderFaq(); }
    if (d.copy) {
      try { navigator.clipboard.writeText(d.copy); } catch (_) {}
      t.textContent = 'Copied'; t.classList.add('ok');
      return setTimeout(() => { t.textContent = 'Copy'; t.classList.remove('ok'); }, 1400);
    }
    if (d.pick) { const i = b.picked.indexOf(d.pick); i > -1 ? b.picked.splice(i, 1) : b.picked.push(d.pick); return renderBooking(); }
    if (d.date) { b.date = d.date; return renderBooking(); }
    if (d.time) { b.time = d.time; return renderBooking(); }
    if (d.lang) { b.lang = d.lang; b.expert = ''; return renderBooking(); }
    if (d.expert) { b.expert = d.expert; return renderBooking(); }
    if (t.id === 'bBack') { b.step = Math.max(1, b.step - 1); return renderBooking(); }
    if (t.id === 'bNext' && valid(b.step)) { if (b.step === 5) return submitBooking(); b.step++; return renderBooking(); }
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'q') { st.q = e.target.value; return renderGrid(); }
    const f = e.target.dataset.f;
    if (f) { b[f] = e.target.value; $('#bNext').disabled = !valid(b.step); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeOv('#prodOv'); closeOv('#bookOv'); }
    if (e.key === 'Enter' && e.target.dataset && e.target.dataset.open) openProduct(+e.target.dataset.open);
  });

  /* ---------- reID session ---------- */
  let me = null;
  const ERR = { access_denied: 'Sign-in was cancelled.', not_configured: 'reID sign-in is not configured yet.',
    invalid_or_expired_request: 'Sign-in expired. Please try again.', sign_in_failed: 'reID sign-in failed. Please try again.', reid_error: 'reID returned an error.' };
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; setTimeout(() => { t.hidden = true; }, 4000); }
  async function loadMe() {
    try { me = (await fetch('/api/me').then(r => r.json())).user; } catch (_) { me = null; }
    $('#signin').hidden = !!me; $('#user').hidden = !me;
    if (me) {
      const n = me.name || 'reID user';
      $('#uName').textContent = n;
      $('#uAv').textContent = n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
      $('#user').title = me.wallet ? 'Wallet ' + me.wallet : '';
    }
  }
  $('#signout').addEventListener('click', async () => { await fetch('/api/auth/logout', { method: 'POST' }); me = null; loadMe(); toast('Signed out.'); });
  const qs = new URLSearchParams(location.search);
  if (qs.get('reidError')) toast(ERR[qs.get('reidError')] || ERR.reid_error);
  if (qs.has('reidError') || qs.has('signedIn')) history.replaceState(null, '', location.pathname + location.hash);
  loadMe().then(() => { if (me && qs.has('signedIn')) toast('Signed in as ' + (me.name || 'reID user') + '.'); });

  $('#yr').textContent = new Date().getFullYear();
  renderChips(); renderGrid(); renderFaq();
})();

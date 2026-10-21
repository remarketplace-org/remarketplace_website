const path = require('node:path');
const { timingSafeEqual } = require('node:crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('./session');

let sdk; // fpreid-connect-sdk is ESM-first; load lazily via its CJS build
const reid = () => (sdk ||= require('fpreid-connect-sdk'));

const PUBLIC_URL = (process.env.APP_PUBLIC_URL || 'https://remarketplace.store').replace(/\/$/, '');
const SCOPES = (process.env.REID_SCOPES || 'profile wallet:read').split(/[\s,]+/).filter(Boolean);

function reidConfig() {
  const c = {
    clientId: process.env.REID_CLIENT_ID,
    redirectUri: process.env.REID_REDIRECT_URI || `${PUBLIC_URL}/api/auth/reid/callback`,
  };
  if (process.env.REID_CLIENT_SECRET) c.clientSecret = process.env.REID_CLIENT_SECRET;
  if (process.env.REID_API_URL) c.baseUrl = process.env.REID_API_URL;
  if (process.env.REID_APP_URL) c.appUrl = process.env.REID_APP_URL;
  return c;
}
const configured = () => !!process.env.REID_CLIENT_ID && !!process.env.SESSION_SECRET;

const app = express();
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json({ limit: '20kb' }));

const FLOW = () => ({ httpOnly: true, secure: session.secure(), sameSite: 'lax', path: '/api/auth/reid', maxAge: 600_000 });
const clearFlow = res => { res.clearCookie('reid_verifier', FLOW()); res.clearCookie('reid_state', FLOW()); };

/* ---------- reID sign-in ---------- */
app.get('/api/auth/reid/start', async (_req, res) => {
  if (!configured()) return res.redirect('/?reidError=not_configured');
  const { generatePkcePair, generateState, buildAuthorizeUrl } = reid();
  const { verifier, challenge } = await generatePkcePair();
  const state = await generateState();
  res.cookie('reid_verifier', verifier, FLOW());
  res.cookie('reid_state', state, FLOW());
  res.redirect(buildAuthorizeUrl(reidConfig(), { codeChallenge: challenge, state, scope: SCOPES }));
});

app.get('/api/auth/reid/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const verifier = req.cookies.reid_verifier;
  const saved = req.cookies.reid_state;
  const fail = reason => { clearFlow(res); res.redirect(`/?reidError=${reason}`); };

  if (error) return fail(error === 'access_denied' ? 'access_denied' : 'reid_error');
  const a = Buffer.from(String(state || '')), b = Buffer.from(String(saved || ''));
  if (!code || !verifier || !saved || a.length !== b.length || !timingSafeEqual(a, b)) return fail('invalid_or_expired_request');
  if (!configured()) return fail('not_configured');

  try {
    const { exchangeCodeForToken } = reid();
    const t = await exchangeCodeForToken(reidConfig(), { code: String(code), codeVerifier: verifier });
    const p = t.profile || {};
    clearFlow(res);
    session.set(res, {
      user: {
        id: t.user_id,
        name: p.name || p.username || null,
        username: p.username || null,
        email: p.email || null,
        image: p.profile_image_url || null,
        wallet: (p.wallet && p.wallet.wallet_address) || null,
      },
      scope: t.scope,
    });
    res.redirect('/?signedIn=1');
  } catch (err) {
    console.error('reID sign-in failed', err && err.status, err && err.message);
    fail('sign_in_failed');
  }
});

app.post('/api/auth/logout', (_req, res) => { session.clear(res); res.json({ ok: true }); });

app.get('/api/me', (req, res) => {
  res.set('Cache-Control', 'no-store');
  let s = null;
  try { s = session.get(req); } catch (_) {}
  res.json({ user: s ? s.user : null, reidEnabled: configured() });
});

/* ---------- Demo bookings ---------- */
const str = (v, n) => typeof v === 'string' && v.trim().length > 0 && v.length <= n;
app.post('/api/bookings', async (req, res) => {
  const b = req.body || {};
  if (!Array.isArray(b.products) || !b.products.length || b.products.length > 20 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.date || '') || !/^\d{2}:\d{2}$/.test(b.time || '') ||
      !str(b.name, 120) || !str(b.company, 160) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || '') ||
      !str(b.lang, 40) || !str(b.expert, 80)) {
    return res.status(400).json({ ok: false, error: 'invalid_booking' });
  }
  let user = null;
  try { const s = session.get(req); user = s && s.user ? s.user.id : null; } catch (_) {}
  const booking = { ref: String(b.ref || '').slice(0, 40), products: b.products.map(String), date: b.date, time: b.time,
    lang: b.lang, expert: b.expert, name: b.name, email: b.email, company: b.company,
    notes: String(b.notes || '').slice(0, 2000), reidUser: user, at: new Date().toISOString() };
  console.log('booking', JSON.stringify(booking));
  // Optional: forward to a CRM / Slack / email webhook
  if (process.env.BOOKING_WEBHOOK_URL) {
    try { await fetch(process.env.BOOKING_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) }); }
    catch (e) { console.error('booking webhook failed', e.message); }
  }
  res.json({ ok: true, ref: booking.ref });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

/* ---------- Static site (local dev; Vercel serves /public from its CDN) ---------- */
app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

module.exports = app;

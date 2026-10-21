// Encrypted-cookie sessions (AES-256-GCM). No server-side store, so it runs on Vercel serverless.
const crypto = require('node:crypto');

const NAME = 'rm_session';
const MAX_AGE = 7 * 24 * 3600 * 1000; // 7 days

function key() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set (32+ chars)');
  return crypto.createHash('sha256').update(s).digest();
}

function seal(obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), data]).toString('base64url');
}

function unseal(token) {
  try {
    const buf = Buffer.from(token, 'base64url');
    const d = crypto.createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    const obj = JSON.parse(Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8'));
    return obj.exp && obj.exp > Date.now() ? obj : null;
  } catch (_) { return null; }
}

const secure = () => process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const opts = () => ({ httpOnly: true, secure: secure(), sameSite: 'lax', path: '/' });

module.exports = {
  seal, unseal, secure,
  get: req => (req.cookies && req.cookies[NAME] ? unseal(req.cookies[NAME]) : null),
  set: (res, data) => res.cookie(NAME, seal({ ...data, exp: Date.now() + MAX_AGE }), { ...opts(), maxAge: MAX_AGE }),
  clear: res => res.clearCookie(NAME, opts()),
};

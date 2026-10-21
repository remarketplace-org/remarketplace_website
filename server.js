// Local / traditional hosting entry.
try { process.loadEnvFile && process.loadEnvFile('.env'); } catch (_) {}
const app = require('./lib/app');
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`reMarketplace running on http://localhost:${port}`));

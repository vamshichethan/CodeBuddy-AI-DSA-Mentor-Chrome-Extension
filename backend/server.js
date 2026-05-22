// ====================================================
// CodeBuddy AI — Express Server
// ====================================================

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const mongoose   = require('mongoose');

const hintRoute       = require('./routes/hint');
const debugRoute      = require('./routes/debug');
const patternRoute    = require('./routes/pattern');
const dryRunRoute     = require('./routes/dryrun');
const complexityRoute = require('./routes/complexity');
const edgeCaseRoute   = require('./routes/edgecase');
const interviewRoute  = require('./routes/interview');
const progressRoute   = require('./routes/progress');
const roadmapRoute    = require('./routes/roadmap');
const notesRoute      = require('./routes/notes');
const reviewRoute     = require('./routes/review');

const app  = express();
const PORT = process.env.PORT || 3001;
const isServerless = process.env.VERCEL === '1';

// ── Middleware ────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('chrome-extension://')) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50kb' }));

// Global rate limiter: 60 requests / 1 min
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please slow down.' },
});
app.use('/api/', limiter);

// ── Routes ────────────────────────────────────────
app.use('/api/hint',       hintRoute);
app.use('/api/debug',      debugRoute);
app.use('/api/pattern',    patternRoute);
app.use('/api/dryrun',     dryRunRoute);
app.use('/api/complexity', complexityRoute);
app.use('/api/edgecase',   edgeCaseRoute);
app.use('/api/interview',  interviewRoute);
app.use('/api/progress',   progressRoute);
app.use('/api/roadmap',    roadmapRoute);
app.use('/api/notes',      notesRoute);
app.use('/api/review',     reviewRoute);

// ── Health Check ──────────────────────────────────
function sendHealth(req, res) {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
}

app.get('/health', sendHealth);
app.get('/api/health', sendHealth);

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ── MongoDB Connection ────────────────────────────
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codebuddy', {
      serverSelectionTimeoutMS: isServerless ? 3000 : 30000,
    })
    .then(() => console.log('[MongoDB] Connected'))
    .catch((err) => console.warn('[MongoDB] Not connected (progress features disabled):', err.message));
}

// ── Start Server ──────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\nCodeBuddy AI Backend running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health\n`);
  });
}

module.exports = app;

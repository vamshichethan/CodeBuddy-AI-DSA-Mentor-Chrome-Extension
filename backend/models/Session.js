// ── MongoDB Session Model ──────────────────────────
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true, index: true },
    title:     { type: String, required: true },
    pattern:   { type: String, default: '' },
    language:  { type: String, default: 'Unknown' },
    hintsUsed: { type: Number, default: 0, min: 0, max: 5 },
    solved:    { type: Boolean, default: false },
    bugsFound: { type: [String], default: [] },
    notes:     { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);

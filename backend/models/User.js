// ── MongoDB User Model ─────────────────────────────
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true, lowercase: true },
    name:         { type: String, required: true },
    passwordHash: { type: String, required: true },
    totalSolved:  { type: Number, default: 0 },
    streak:       { type: Number, default: 0 },
    lastActive:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

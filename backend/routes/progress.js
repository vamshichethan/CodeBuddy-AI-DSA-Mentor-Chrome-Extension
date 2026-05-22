// ── /api/progress ─────────────────────────────────
const express = require('express');
const Session = require('../models/Session');

const router = express.Router();

// GET /api/progress/:userId — Get user's full progress
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 }).limit(100);

    // Aggregate stats
    const totalAttempts  = sessions.length;
    const solved         = sessions.filter((s) => s.solved).length;
    const totalHints     = sessions.reduce((sum, s) => sum + s.hintsUsed, 0);
    const avgHints       = totalAttempts ? (totalHints / totalAttempts).toFixed(1) : 0;

    // Pattern frequency
    const patternCount = {};
    sessions.forEach((s) => {
      if (s.pattern) patternCount[s.pattern] = (patternCount[s.pattern] || 0) + 1;
    });

    // Bug frequency
    const bugCount = {};
    sessions.forEach((s) => {
      (s.bugsFound || []).forEach((bug) => {
        bugCount[bug] = (bugCount[bug] || 0) + 1;
      });
    });

    // Weak areas: patterns with < 60% solve rate
    const patternStats = {};
    sessions.forEach((s) => {
      if (!s.pattern) return;
      if (!patternStats[s.pattern]) patternStats[s.pattern] = { total: 0, solved: 0 };
      patternStats[s.pattern].total++;
      if (s.solved) patternStats[s.pattern].solved++;
    });
    const weakAreas = Object.entries(patternStats)
      .map(([pattern, stat]) => ({
        pattern,
        successRate: Math.round((stat.solved / stat.total) * 100),
        total: stat.total,
      }))
      .filter((a) => a.successRate < 60)
      .sort((a, b) => a.successRate - b.successRate);

    res.json({
      totalAttempts,
      solved,
      solveRate: totalAttempts ? Math.round((solved / totalAttempts) * 100) : 0,
      avgHintsPerProblem: avgHints,
      patternCount,
      bugCount,
      weakAreas,
      recentSessions: sessions.slice(0, 10),
    });
  } catch (err) {
    console.error('[/api/progress]', err.message);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/progress — Log a problem session
router.post('/', async (req, res) => {
  try {
    const { userId, title, pattern, hintsUsed, solved, bugsFound, language } = req.body;
    if (!userId || !title) return res.status(400).json({ error: 'userId and title required' });

    const session = new Session({ userId, title, pattern, hintsUsed, solved, bugsFound, language });
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (err) {
    console.error('[POST /api/progress]', err.message);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

module.exports = router;

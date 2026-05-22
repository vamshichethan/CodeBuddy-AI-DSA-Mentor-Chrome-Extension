// ── /api/progress ─────────────────────────────────
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Session = require('../models/Session');

const router = express.Router();
const LOCAL_STORE_PATH = path.join(__dirname, '../progress_store.json');

// Helper to generate mock data if DB and local store are empty/unavailable
const getMockData = () => ({
  totalAttempts: 47,
  solved: 31,
  solveRate: 66,
  avgHintsPerProblem: 2.3,
  patternCount: {
    'Two Pointer': 12,
    'Sliding Window': 8,
    'Dynamic Programming': 10,
    'Graph BFS': 5,
    'Binary Search': 12
  },
  bugCount: {
    'Off-by-one error': 12,
    'Missing base case': 8,
    'Integer overflow': 5,
    'Infinite loop': 3
  },
  weakAreas: [
    { pattern: 'Dynamic Programming', successRate: 34, total: 10 },
    { pattern: 'Graph BFS', successRate: 41, total: 5 },
    { pattern: 'Sliding Window', successRate: 58, total: 8 }
  ],
  recentSessions: [
    { title: 'Two Sum', pattern: 'Two Pointer', hintsUsed: 0, solved: true, createdAt: new Date().toISOString() },
    { title: 'Coin Change', pattern: 'Dynamic Programming', hintsUsed: 4, solved: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { title: 'Number of Islands', pattern: 'Graph BFS', hintsUsed: 3, solved: true, createdAt: new Date(Date.now() - 172800000).toISOString() }
  ]
});

// Read sessions from local JSON store
const getLocalSessions = (userId) => {
  try {
    if (!fs.existsSync(LOCAL_STORE_PATH)) {
      return [];
    }
    const data = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
    return data.filter(s => s.userId === userId);
  } catch (err) {
    console.error('[Local Store Read Error]', err.message);
    return [];
  }
};

// Save session to local JSON store
const saveLocalSession = (sessionData) => {
  try {
    let data = [];
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      data = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'));
    }

    // Find if session already exists for this userId and title
    const index = data.findIndex(s => s.userId === sessionData.userId && s.title === sessionData.title);

    const timestamp = new Date().toISOString();
    let result = null;
    if (index > -1) {
      // Update existing
      const existing = data[index];
      const mergedBugs = Array.from(new Set([...(existing.bugsFound || []), ...(sessionData.bugsFound || [])]));
      data[index] = {
        ...existing,
        pattern: sessionData.pattern !== undefined ? sessionData.pattern : existing.pattern,
        hintsUsed: sessionData.hintsUsed !== undefined ? sessionData.hintsUsed : existing.hintsUsed,
        solved: sessionData.solved !== undefined ? sessionData.solved : existing.solved,
        language: sessionData.language !== undefined ? sessionData.language : existing.language,
        bugsFound: mergedBugs,
        updatedAt: timestamp
      };
      result = data[index];
    } else {
      // Create new
      const newSession = {
        ...sessionData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      data.push(newSession);
      result = newSession;
    }

    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return result;
  } catch (err) {
    console.error('[Local Store Write Error]', err.message);
    return null;
  }
};

// GET /api/progress/:userId — Get user's full progress
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let sessions = [];
    let fallbackUsed = false;

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        sessions = await Session.find({ userId }).sort({ createdAt: -1 }).limit(100);
      } catch (dbErr) {
        console.warn('[/api/progress GET DB Error, falling back to local file]', dbErr.message);
        fallbackUsed = true;
      }
    } else {
      fallbackUsed = true;
    }

    if (fallbackUsed) {
      sessions = getLocalSessions(userId);
    }

    if (sessions.length === 0) {
       return res.json(getMockData()); // Return mock data for new users to see the UI
    }

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

    let savedSession = null;
    let fallbackUsed = false;

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        // Upsert session (update if exists, create if not)
        savedSession = await Session.findOneAndUpdate(
          { userId, title },
          { pattern, hintsUsed, solved, language, $addToSet: { bugsFound: { $each: bugsFound || [] } } },
          { new: true, upsert: true }
        );
      } catch (dbErr) {
        console.warn('[POST /api/progress DB Error, falling back to local file]', dbErr.message);
        fallbackUsed = true;
      }
    } else {
      fallbackUsed = true;
    }

    if (fallbackUsed) {
      savedSession = saveLocalSession({ userId, title, pattern, hintsUsed, solved, bugsFound, language });
    }

    res.status(201).json({ success: true, session: savedSession });
  } catch (err) {
    console.error('[POST /api/progress handler error]', err.message);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

module.exports = router;

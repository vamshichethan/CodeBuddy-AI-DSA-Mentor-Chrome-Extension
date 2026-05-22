// ── /api/roadmap ───────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { roadmapPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user's progress data from our own endpoint
    const baseUrl = process.env.INTERNAL_API_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const progressRes = await fetch(`${baseUrl}/api/progress/${encodeURIComponent(userId)}`);
    if (!progressRes.ok) throw new Error('Failed to fetch user progress');
    
    const progressData = await progressRes.json();
    const { weakAreas, recentSessions } = progressData;

    const model  = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = roadmapPrompt({ weakAreas, recentSessions });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ roadmap: text });
  } catch (err) {
    console.error('[/api/roadmap]', err.message);
    res.status(500).json({ error: 'Failed to generate roadmap', details: err.message });
  }
});

module.exports = router;

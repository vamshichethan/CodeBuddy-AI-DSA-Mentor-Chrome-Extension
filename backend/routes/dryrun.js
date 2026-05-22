// ── /api/dryrun ───────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { dryRunPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { title, description, userCode, language } = req.body;

  if (!title || !description)
    return res.status(400).json({ error: 'title and description are required' });

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = dryRunPrompt({ title, description, userCode, language });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ dryRun: text });
  } catch (err) {
    console.error('[/api/dryrun]', err.message);
    res.status(500).json({ error: 'Failed to generate dry run', details: err.message });
  }
});

module.exports = router;

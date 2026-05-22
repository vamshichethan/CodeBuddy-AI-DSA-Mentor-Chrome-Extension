// ── /api/pattern ──────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { patternPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description)
    return res.status(400).json({ error: 'title and description are required' });

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = patternPrompt({ title, description });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ pattern: text });
  } catch (err) {
    console.error('[/api/pattern]', err.message);
    res.status(500).json({ error: 'Failed to detect pattern', details: err.message });
  }
});

module.exports = router;

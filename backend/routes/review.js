// ── /api/review ────────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { reviewPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { title, userCode, language } = req.body;

  if (!title || !userCode)
    return res.status(400).json({ error: 'title and userCode are required' });

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = reviewPrompt({ title, userCode, language: language || 'code' });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ review: text });
  } catch (err) {
    console.error('[/api/review]', err.message);
    res.status(500).json({ error: 'Failed to generate review', details: err.message });
  }
});

module.exports = router;

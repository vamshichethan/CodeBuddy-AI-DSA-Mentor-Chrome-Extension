// ── /api/notes ─────────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { notesPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { title, description, pattern, language, userCode } = req.body;

  if (!title || !description)
    return res.status(400).json({ error: 'title and description are required' });

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = notesPrompt({ title, description, pattern: pattern || 'Unknown', language: language || 'code', userCode: userCode || '' });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ notes: text, title });
  } catch (err) {
    console.error('[/api/notes]', err.message);
    res.status(500).json({ error: 'Failed to generate notes', details: err.message });
  }
});

module.exports = router;

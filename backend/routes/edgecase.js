// ── /api/edgecase ─────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { edgeCasePrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { title, description, language } = req.body;

  if (!title || !description)
    return res.status(400).json({ error: 'title and description are required' });

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = edgeCasePrompt({ title, description, language });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ edgeCases: text });
  } catch (err) {
    console.error('[/api/edgecase]', err.message);
    res.status(500).json({ error: 'Failed to generate edge cases', details: err.message });
  }
});

module.exports = router;

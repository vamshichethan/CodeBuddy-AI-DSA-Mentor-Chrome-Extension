// ── /api/hint ─────────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { hintPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { title, description, userCode, language, level } = req.body;

  if (!title || !description)
    return res.status(400).json({ error: 'title and description are required' });
  if (!level || level < 1 || level > 5)
    return res.status(400).json({ error: 'level must be between 1 and 5' });

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = hintPrompt({ title, description, userCode, language, level });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ hint: text, level });
  } catch (err) {
    console.error('[/api/hint]', err.message);
    res.status(500).json({ error: 'Failed to generate hint', details: err.message });
  }
});

module.exports = router;

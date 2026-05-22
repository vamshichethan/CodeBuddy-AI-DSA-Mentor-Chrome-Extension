// ── /api/interview ────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { interviewPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { title, description, history = [], userMessage } = req.body;

  if (!title || !userMessage)
    return res.status(400).json({ error: 'title and userMessage are required' });

  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = interviewPrompt({ title, description, history, userMessage });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ response: text });
  } catch (err) {
    console.error('[/api/interview]', err.message);
    res.status(500).json({ error: 'Failed to generate interview response', details: err.message });
  }
});

module.exports = router;

// ── /api/notes ─────────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { notesPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildFallbackNotes({ title, pattern, language }) {
  return `
**Pattern:** ${pattern || 'Identify after solving'}

**Key Trick/Insight:** For "${title}", write the smallest brute-force idea first, then look for repeated work. Convert repeated lookups, scans, or state transitions into the right DSA structure.

**Complexity:** Time depends on your final approach | Space depends on extra data structures used.

**Edge Cases to Remember:**
- Empty or minimum-size input
- Duplicate values / repeated states
- Maximum constraints that can cause TLE

**Revision Prompt:** Re-solve this in ${language || 'your chosen language'} without looking at the final code, then explain the pattern in 2 sentences.

AI notes generation is temporarily unavailable, so this fallback note keeps your revision flow unblocked.
`.trim();
}

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
    res.json({
      notes: buildFallbackNotes({ title, pattern, language }),
      title,
      fallback: true,
      warning: 'AI notes generation is temporarily unavailable. Showing fallback notes instead.',
    });
  }
});

module.exports = router;

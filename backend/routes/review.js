// ── /api/review ────────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { reviewPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildFallbackReview({ title, language }) {
  return `
**Code Review for ${title}**

**Correctness Checklist**
- Confirm the code handles minimum-size inputs.
- Check duplicate values, negative values, and repeated states where relevant.
- Add at least one test that targets the main edge case.

**Complexity Checklist**
- Look for nested loops over the same input.
- If constraints are large, prefer hash maps, two pointers, stacks, queues, heaps, or DP state instead of repeated scanning.

**Clean Code Checklist**
- Use descriptive variable names.
- Keep the core loop easy to trace.
- Avoid mutating input unless the approach requires it.

**${language || 'Language'} Tip**
Use the standard library data structure that best matches the operation you need most: lookup, ordering, queueing, or stack behavior.

AI code review is temporarily unavailable, so this fallback review keeps the workflow unblocked.
`.trim();
}

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
    res.json({
      review: buildFallbackReview({ title, language }),
      fallback: true,
      warning: 'AI code review is temporarily unavailable. Showing fallback review instead.',
    });
  }
});

module.exports = router;

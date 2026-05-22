// ── /api/roadmap ───────────────────────────────────
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { roadmapPrompt } = require('../prompts/templates');

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildFallbackRoadmap(weakAreas = [], recentSessions = []) {
  const priorities = weakAreas.length
    ? weakAreas.slice(0, 3).map((area) => area.pattern)
    : ['Hash Map', 'Two Pointer', 'Dynamic Programming'];

  const recentList = recentSessions.slice(0, 3)
    .map((session) => `- ${session.title || 'Recent problem'} (${session.pattern || 'Uncategorized'}, ${session.hintsUsed || 0} hints)`)
    .join('\n') || '- No recent sessions yet';

  return `
**1-Week DSA Roadmap**

**Recent Activity**
${recentList}

**Priority Patterns**
${priorities.map((pattern, index) => `${index + 1}. **${pattern}** — review the core template, then solve 2 focused problems.`).join('\n')}

**Day Plan**
1. Day 1: Re-solve one recent problem without hints and write down the key observation.
2. Day 2: Practice ${priorities[0]} with an easy problem, then one medium problem.
3. Day 3: Practice ${priorities[1] || priorities[0]} and compare brute force vs optimized complexity.
4. Day 4: Do a dry run by hand for the hardest recent problem.
5. Day 5: Practice ${priorities[2] || priorities[0]} with one pattern-recognition problem.
6. Day 6: Mock interview mode for 30 minutes.
7. Day 7: Review notes, edge cases, and mistakes.

**Recommended Problems**
- Two Sum
- Valid Parentheses
- Container With Most Water
- Coin Change

AI roadmap generation is temporarily unavailable, so this fallback plan is generated from your progress data.
`.trim();
}

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  let progressData = { weakAreas: [], recentSessions: [] };

  try {
    // Fetch user's progress data from our own endpoint
    const baseUrl = process.env.INTERNAL_API_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const progressRes = await fetch(`${baseUrl}/api/progress/${encodeURIComponent(userId)}`);
    if (!progressRes.ok) throw new Error('Failed to fetch user progress');

    progressData = await progressRes.json();
    const { weakAreas, recentSessions } = progressData;

    const model  = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = roadmapPrompt({ weakAreas, recentSessions });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    res.json({ roadmap: text });
  } catch (err) {
    console.error('[/api/roadmap]', err.message);
    res.json({
      roadmap: buildFallbackRoadmap(progressData.weakAreas, progressData.recentSessions),
      fallback: true,
      warning: 'AI roadmap generation is temporarily unavailable. Showing a deterministic study plan instead.',
    });
  }
});

module.exports = router;

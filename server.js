const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/quiz', async (req, res) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY in Replit Secrets.' });
  }

  const { category = 'ALL', difficulty = 'VP' } = req.body || {};

  const diffMap = {
    ANALYST: 'conceptual and educational — suitable for a junior analyst. Test understanding of market mechanics, definitions, and general direction of moves. Avoid exact basis-point figures.',
    VP:      'specific and data-driven — suitable for a VP-level sales or trading professional. Reference exact figures, rate decisions, named instruments, and specific market moves.',
    MD:      'expert and granular — suitable for a Managing Director or portfolio manager. Test precise levels, relative value relationships, cross-asset correlations, and multi-factor reasoning.'
  };

  const catNote = category === 'ALL'
    ? 'distributed evenly across Macro, FX, Rates, Equity, and Commodities (2 each)'
    : `focused exclusively on ${category} (all 10 questions)`;

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 5000,
        system: `You are a senior market intelligence officer at a tier-1 investment bank. Today is ${today}. You generate rigorous, factual quiz questions based strictly on real financial market news from the past 24 hours. Always search the web before generating questions.`,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Search Bloomberg, Reuters, Financial Times, and WSJ for the most significant financial market news from today.

Focus: central bank decisions, FX rate moves, bond yield changes, equity index moves, commodity price shifts, macro data releases (CPI, PMI, GDP, payrolls), geopolitical market impacts.

Generate exactly 10 multiple-choice questions ${catNote}.
Difficulty: ${diffMap[difficulty] || diffMap['VP']}

RULES:
- Every question must cite a specific real event or number from today's news
- All 4 answer options must be plausible to a market professional
- No trick questions

Return ONLY a raw JSON array — zero prose, zero markdown, zero code fences. Each element:
{
  "question": "specific factual question tied to today's news",
  "options": ["A","B","C","D"],
  "answer": 0,
  "explanation": "2-3 sentences with market context",
  "category": "MACRO|FX|RATES|EQUITY|COMMODITIES",
  "source": "Publication, ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}",
  "headline": "the actual news headline this question is based on"
}`
        }]
      })
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      let msg = `Anthropic API error ${anthropicRes.status}`;
      try { msg = JSON.parse(err).error?.message || msg; } catch (_) {}
      return res.status(502).json({ error: msg });
    }

    const data = await anthropicRes.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('['), end = clean.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error('Could not parse questions from AI response.');
    const questions = JSON.parse(clean.slice(start, end + 1));
    if (!Array.isArray(questions) || questions.length < 4) throw new Error('Not enough questions returned.');

    res.json({ questions, generatedAt: new Date().toISOString() });

  } catch (e) {
    res.status(500).json({ error: e.message || 'Unknown server error.' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Market Quiz running on port ${PORT}`);
});

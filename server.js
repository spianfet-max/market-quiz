const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/quiz', async (req, res) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY.' });

  const { category = 'ALL', difficulty = 'VP' } = req.body || {};

  const diffNote = { ANALYST: 'conceptual, no exact figures needed', VP: 'specific figures, named instruments, exact moves', MD: 'precise levels, cross-asset, multi-factor' }[difficulty] || 'specific figures and moves';
  const catNote = category === 'ALL' ? '2 each: Macro, FX, Rates, Equity, Commodities' : `all 10 on ${category}`;
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: `Market quiz generator. Today: ${date}. Search news first, then generate questions from real events only.`,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Search for today's top financial market news (central banks, FX, yields, equities, commodities, macro data).

Generate 10 quiz questions: ${catNote}. Level: ${diffNote}.

Rules: real events only, all 4 options plausible, no tricks.

Return ONLY a JSON array, no markdown:
[{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"1-2 sentences","category":"MACRO|FX|RATES|EQUITY|COMMODITIES","source":"Source, ${date}","headline":"..."}]`
        }]
      })
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      let msg = `API error ${anthropicRes.status}`;
      try { msg = JSON.parse(err).error?.message || msg; } catch (_) {}
      return res.status(502).json({ error: msg });
    }

    const data = await anthropicRes.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('['), end = clean.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error('Could not parse questions. Please retry.');
    const questions = JSON.parse(clean.slice(start, end + 1));
    if (!Array.isArray(questions) || questions.length < 4) throw new Error('Not enough questions returned.');

    res.json({ questions, generatedAt: new Date().toISOString() });

  } catch (e) {
    res.status(500).json({ error: e.message || 'Unknown server error.' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Market Quiz running on port ${PORT}`));

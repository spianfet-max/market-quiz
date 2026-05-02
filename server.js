const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/quiz', async (req, res) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY.' });

  const { category = 'ALL', difficulty = 'VP' } = req.body || {};

  const diffNote = {
    ANALYST: 'conceptual — test definitions, directional logic, basic mechanics. E.g. "what happens to bond prices when yields rise", "which currency is a safe haven". No exact figures required.',
    VP:      'specific — reference real recent moves, named instruments, exact levels and dates. E.g. "BOJ hiked by X bps in month Y", "EURUSD broke X level after Z event". Mix data, causality and relative value.',
    MD:      'expert — cross-asset, multi-factor, relative value. E.g. correlation breaks, basis trades, convexity, skew, curve dynamics, vol regime shifts, macro regime identification. Assume deep practitioner knowledge.'
  }[difficulty] || 'specific figures and moves';

  const catNote = category === 'ALL'
    ? '2 questions each on: Macro, FX, Rates, Equity, Commodities'
    : `all 10 questions on ${category}`;

  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const month = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // Randomise question type pool so each session feels different
  const questionTypes = [
    'data release interpretation (what does this print imply for policy)',
    'central bank decision and market reaction',
    'relative value (which asset outperformed and why)',
    'causality chain (event A caused move B via mechanism C)',
    'historical analogy (this setup resembles which prior episode)',
    'instrument mechanics (how does this product behave in this scenario)',
    'cross-asset correlation (how did X affect Y)',
    'positioning and flows (who is buying/selling and why)',
    'regime identification (what macro regime are we in)',
    'risk scenario (what is the key tail risk for this asset)',
    'valuation (is this asset cheap or rich vs history)',
    'policy divergence (compare two central banks trajectory)',
    'curve dynamics (what shape is the yield curve and what does it signal)',
    'volatility and options (implied vs realised, skew, term structure)',
    'geopolitical market impact (how does this event affect asset prices)'
  ];

  // Pick 10 random types without repeats for this session
  const shuffled = questionTypes.sort(() => Math.random() - 0.5).slice(0, 10);
  const typeInstructions = shuffled.map((t, i) => `Q${i + 1}: ${t}`).join('\n');

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
        max_tokens: 3500,
        system: `You are a market intelligence quiz generator for senior finance professionals. Generate questions grounded in real recent market events, data, and decisions from the past few months. Every question must feel specific, current, and intellectually challenging. Never repeat the same question format twice in one session. Vary your language, structure and topic angle constantly.`,
        messages: [{
          role: 'user',
          content: `Generate 10 multiple-choice quiz questions about financial markets (${month}).
${catNote}. Difficulty: ${diffNote}.

Each question must follow a DIFFERENT format as assigned below — this ensures maximum variety:
${typeInstructions}

Additional rules:
- Use real instruments, real events, real levels from recent months
- Never ask the same type of question twice (no two "what did X central bank do" questions)
- Distractors must be genuinely plausible — wrong answers should reflect common misconceptions or close alternatives, not obvious nonsense
- Never say "according to reports", "search results", "recently" without a timeframe — be specific
- Vary sentence structure: use "Which...", "What...", "Why did...", "How did...", "An investor who...", "If...", "Compare..." etc.
- At MD level: include at least 2 questions requiring multi-step reasoning

Return ONLY a JSON array, no markdown, no prose:
[{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"2 sentences — state the correct fact AND the market mechanism behind it","category":"MACRO|FX|RATES|EQUITY|COMMODITIES","source":"Market Intelligence, ${date}","headline":"one-line description of the real event or concept this question tests"}]`
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

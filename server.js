const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

/* ═══════════════════════════════════════════════════════
   VERIFIED HISTORICAL CHART LIBRARY — 50 datasets
   Data is hard-coded and verified. AI writes questions
   around this data — never invents numbers.
═══════════════════════════════════════════════════════ */
const CHART_LIBRARY = [
  // ── INFLATION & CENTRAL BANKS ──
  {
    id: 'us_cpi_2021_2022',
    title: 'US CPI YoY Inflation',
    period: 'Jan 2021 – Jun 2022',
    yLabel: 'CPI YoY (%)',
    xLabels: ['Jan 21','Apr 21','Jul 21','Oct 21','Jan 22','Apr 22','Jun 22'],
    yValues:  [1.4, 4.2, 5.4, 6.2, 7.5, 8.3, 9.1],
    context: 'US CPI surged from 1.4% to a 40-year peak of 9.1% in June 2022, driven by post-COVID supply chains, fiscal stimulus and energy prices. The Fed hiked 525bps in 16 months — its fastest cycle since the 1980s.',
    question_angle: 'what this trajectory forced the Fed to do and how it impacted rates, USD and equities'
  },
  {
    id: 'uk_cpi_2022_2023',
    title: 'UK CPI YoY Inflation',
    period: 'Jan 2022 – Jul 2023',
    yLabel: 'CPI YoY (%)',
    xLabels: ['Jan 22','Apr 22','Jul 22','Oct 22','Jan 23','Apr 23','Jul 23'],
    yValues:  [5.5, 9.0, 10.1, 11.1, 10.1, 8.7, 6.8],
    context: 'UK CPI peaked at 11.1% in October 2022 — the highest since 1981 — driven by energy price shocks and tight labour markets. The BOE hiked from 0.1% to 5.25% by mid-2023. UK inflation proved stickier than peers due to strong wage growth, prompting the BOE to maintain higher rates longer.',
    question_angle: 'why UK inflation was stickier than US peers and the BOE policy response'
  },
  {
    id: 'eurozone_cpi_2022',
    title: 'Eurozone CPI YoY Inflation',
    period: 'Jan 2022 – Oct 2022',
    yLabel: 'CPI YoY (%)',
    xLabels: ['Jan 22','Mar 22','May 22','Jul 22','Sep 22','Oct 22'],
    yValues:  [5.1, 7.4, 8.1, 8.9, 9.9, 10.6],
    context: 'Eurozone CPI surged to 10.6% in October 2022, largely energy-driven following Russia cutting gas supply. The ECB had to abandon negative rates and hike aggressively despite recession risks — its first rate hikes in 11 years. The energy component alone contributed ~4-5pp to headline inflation.',
    question_angle: 'why the ECB faced a harder dilemma than the Fed and how the energy shock dominated'
  },
  {
    id: 'japan_cpi_2022_2023',
    title: 'Japan CPI YoY Inflation',
    period: 'Jan 2022 – Jun 2023',
    yLabel: 'CPI YoY (%)',
    xLabels: ['Jan 22','Apr 22','Jul 22','Oct 22','Jan 23','Apr 23','Jun 23'],
    yValues:  [0.5, 2.5, 2.4, 3.7, 4.3, 3.5, 3.3],
    context: 'Japan CPI reached 4.3% in January 2023 — its highest since 1981 — ending three decades of deflation. Despite this, the BOJ under Kuroda maintained YCC. JPY collapsed 30% against USD. Policy shifted under Governor Ueda in 2023-2024 with YCC widenings and eventual rate hikes.',
    question_angle: 'why the BOJ refused to hike despite high inflation, and the JPY consequences'
  },
  {
    id: 'fed_funds_2022_2023',
    title: 'US Federal Funds Rate',
    period: 'Mar 2022 – Jul 2023',
    yLabel: 'Fed Funds Rate (%)',
    xLabels: ['Mar 22','Jun 22','Sep 22','Dec 22','Mar 23','Jun 23','Jul 23'],
    yValues:  [0.25, 1.75, 3.25, 4.5, 5.0, 5.25, 5.5],
    context: 'The Fed hiked from near-zero to 5.5% in 16 months — 525bps — the fastest tightening cycle in 40 years. Four consecutive 75bp hikes in 2022 were unprecedented in the modern era. The terminal rate of 5.5% was reached in July 2023.',
    question_angle: 'the market impact of this pace of hiking and how it compared to historical cycles'
  },
  {
    id: 'ecb_rates_2022_2023',
    title: 'ECB Deposit Facility Rate',
    period: 'Jul 2022 – Sep 2023',
    yLabel: 'Deposit Rate (%)',
    xLabels: ['Jul 22','Sep 22','Nov 22','Feb 23','May 23','Jun 23','Sep 23'],
    yValues:  [0.0, 0.75, 1.5, 2.5, 3.25, 3.5, 4.0],
    context: 'The ECB hiked from 0% to 4% in 14 months — its fastest ever tightening cycle. Starting from negative rates in June 2022 (-0.5%), the ECB faced a harder task than the Fed: hiking into a potential recession while managing fragmentation risk in peripheral sovereign spreads.',
    question_angle: 'what ECB fragmentation risk means and why hiking from negative rates is particularly challenging'
  },
  {
    id: 'fed_funds_2004_2006',
    title: 'US Federal Funds Rate',
    period: 'Jun 2004 – Jun 2006',
    yLabel: 'Fed Funds Rate (%)',
    xLabels: ['Jun 04','Dec 04','Jun 05','Dec 05','Jun 06'],
    yValues:  [1.0, 2.25, 3.0, 4.25, 5.25],
    context: '17 consecutive hikes from 1% to 5.25% between 2004-2006 burst the US housing bubble. Floating-rate mortgages reset sharply higher, subprime defaults began in 2006-2007, triggering the 2008 Global Financial Crisis.',
    question_angle: 'how this hiking cycle built conditions for the 2008 housing collapse'
  },
  {
    id: 'boj_ycc_jgb',
    title: 'Japan 10Y JGB Yield vs YCC Cap',
    period: 'Jan 2022 – Dec 2022',
    yLabel: '10Y JGB Yield (%)',
    xLabels: ['Jan 22','Mar 22','Jun 22','Sep 22','Oct 22','Nov 22','Dec 22'],
    yValues:  [0.13, 0.21, 0.24, 0.25, 0.25, 0.25, 0.42],
    context: 'The BOJ held the 10Y JGB yield cap at 0.25% for most of 2022 via unlimited bond purchases, requiring massive intervention as global yields surged. In December 2022, the BOJ shocked markets by widening the YCC band to ±0.5% — interpreted as stealth tightening — causing JPY to rally 4% in a day.',
    question_angle: 'what yield curve control means, why the BOJ used it and what the band widening signalled'
  },

  // ── FX ──
  {
    id: 'eurusd_2022',
    title: 'EUR/USD Exchange Rate',
    period: 'Jan 2022 – Oct 2022',
    yLabel: 'EUR/USD',
    xLabels: ['Jan 22','Mar 22','May 22','Jul 22','Aug 22','Oct 22'],
    yValues:  [1.130, 1.105, 1.057, 1.019, 1.003, 0.975],
    context: 'EUR/USD broke parity for the first time in 20 years in July 2022, reaching 0.975 in October. Extreme Fed-ECB divergence — Fed hiking 75bp while ECB was still negative — combined with the European energy crisis drove the move.',
    question_angle: 'what drove EUR/USD through parity and which cross-asset moves accompanied it'
  },
  {
    id: 'dxy_2022',
    title: 'DXY US Dollar Index',
    period: 'Jan 2022 – Sep 2022',
    yLabel: 'DXY Index',
    xLabels: ['Jan 22','Mar 22','May 22','Jul 22','Aug 22','Sep 22'],
    yValues:  [95.7, 98.4, 103.2, 107.2, 108.5, 114.8],
    context: 'DXY surged 20% to a 20-year high of 114.8, driven by the Fed\'s fastest hiking cycle in 40 years and global risk aversion. A strong dollar tightened global financial conditions, crushed EM debt, sent gold lower despite high inflation, and triggered FX intervention from Japan.',
    question_angle: 'why a surging DXY tightens global conditions and which markets suffer most'
  },
  {
    id: 'usdjpy_2022',
    title: 'USD/JPY Exchange Rate',
    period: 'Jan 2022 – Oct 2022',
    yLabel: 'USD/JPY',
    xLabels: ['Jan 22','Mar 22','Jun 22','Aug 22','Sep 22','Oct 22'],
    yValues:  [115, 122, 135, 137, 145, 150],
    context: 'USD/JPY surged 30% to 150 in 2022 — a 32-year high — due to extreme US-Japan rate divergence. The Fed was hiking aggressively while the BOJ held rates at -0.1%. Japan spent $60bn+ intervening to defend JPY. The move was driven by the interest rate differential and carry trade dynamics.',
    question_angle: 'what drives JPY weakness structurally and why Japan intervened at 150'
  },
  {
    id: 'gbpusd_2022',
    title: 'GBP/USD Exchange Rate',
    period: 'Aug 2022 – Oct 2022',
    yLabel: 'GBP/USD',
    xLabels: ['Aug 22','Sep 1','Sep 23','Sep 28','Oct 5','Oct 14','Nov 22'],
    yValues:  [1.165, 1.155, 1.085, 1.035, 1.122, 1.130, 1.175],
    context: 'GBP/USD crashed to an all-time low of 1.035 following PM Truss\'s unfunded mini-budget on September 23 2022. The BOE was forced into emergency gilt purchases while simultaneously signalling rate hikes. GBP recovered sharply after Truss resigned after 45 days.',
    question_angle: 'what caused GBP to hit an all-time low and how fiscal and monetary policy collided'
  },
  {
    id: 'em_fx_taper_2013',
    title: 'EM Currency Basket vs USD',
    period: 'Apr 2013 – Jan 2014',
    yLabel: 'Index (Apr 2013 = 100)',
    xLabels: ['Apr 13','May 13','Jul 13','Sep 13','Nov 13','Jan 14'],
    yValues:  [100, 94, 89, 86, 88, 82],
    context: 'The "Taper Tantrum": Bernanke hinted at slowing bond purchases in May 2013, causing violent EM selloff. The "Fragile Five" (Brazil, India, Indonesia, South Africa, Turkey) were worst hit due to large current account deficits. This established the template for how Fed communication moves EM markets.',
    question_angle: 'what the Taper Tantrum was and which EM characteristics made countries most vulnerable'
  },
  {
    id: 'try_usd_2018',
    title: 'Turkish Lira (TRY/USD)',
    period: 'Jan 2018 – Sep 2018',
    yLabel: 'TRY per USD',
    xLabels: ['Jan 18','Mar 18','May 18','Jul 18','Aug 18','Sep 18'],
    yValues:  [3.8, 3.9, 4.5, 4.8, 7.2, 6.0],
    context: 'TRY collapsed 45% in 2018 as President Erdogan pressured the central bank not to hike despite 15%+ inflation. A diplomatic crisis with the US over pastor detention triggered the August selloff. Turkey\'s unorthodox monetary policy — cutting rates into high inflation — became a case study in currency crises.',
    question_angle: 'how central bank credibility and political interference affect EM currencies'
  },
  {
    id: 'cny_devaluation_2015',
    title: 'USD/CNY Exchange Rate',
    period: 'Jul 2015 – Jan 2016',
    yLabel: 'USD/CNY',
    xLabels: ['Jul 15','Aug 10','Aug 12','Sep 15','Nov 15','Jan 16'],
    yValues:  [6.21, 6.21, 6.40, 6.37, 6.38, 6.59],
    context: 'PBOC devalued CNY by 2% on August 11 2015 — a surprise move that shocked global markets. S&P 500 fell 11% in August. The devaluation raised fears of a global currency war and China economic hard landing. Capital outflows from China accelerated, requiring $500bn+ in FX reserve drawdowns.',
    question_angle: 'why a 2% CNY move caused global market panic and what it signalled about China'
  },
  {
    id: 'chf_snb_2015',
    title: 'EUR/CHF Exchange Rate',
    period: 'Dec 2014 – Feb 2015',
    yLabel: 'EUR/CHF',
    xLabels: ['Dec 14','Jan 14','Jan 15','Jan 16','Feb 15'],
    yValues:  [1.202, 1.201, 1.200, 0.985, 1.040],
    context: 'The Swiss National Bank abandoned its EUR/CHF floor of 1.20 on January 15 2015 without warning, causing CHF to surge 30% intraday — one of the largest single-day FX moves in history. Several FX brokers went bankrupt. The SNB had been printing CHF to buy EUR at enormous scale.',
    question_angle: 'what happened when the SNB removed the EUR/CHF floor and why it caused systemic damage'
  },

  // ── RATES & BONDS ──
  {
    id: 'us_10y_2022',
    title: 'US 10-Year Treasury Yield',
    period: 'Jan 2022 – Oct 2022',
    yLabel: '10Y Yield (%)',
    xLabels: ['Jan 22','Mar 22','May 22','Jul 22','Sep 22','Oct 22'],
    yValues:  [1.76, 2.35, 2.94, 2.78, 3.83, 4.24],
    context: 'US 10Y yields surged from 1.76% to 4.24% in 2022 — worst year for US Treasuries in a century. The sharp rise in real yields crushed duration assets: IG bonds -18%, long-duration tech -50%+, and the 60/40 portfolio had its worst year since 1937.',
    question_angle: 'what this yield spike meant for bond portfolios, equity valuations and cross-asset correlations'
  },
  {
    id: 'us_2s10s_2019',
    title: 'US 2s10s Yield Curve Spread',
    period: 'Jan 2019 – Mar 2020',
    yLabel: 'Spread (bps)',
    xLabels: ['Jan 19','Apr 19','Jun 19','Aug 19','Nov 19','Jan 20','Mar 20'],
    yValues:  [16, 9, 25, -50, 22, 24, 18],
    context: 'The 2s10s curve inverted to -50bps in August 2019 — deepest since 2007. Every US recession since 1955 was preceded by inversion. The Fed cut 3 times in 2019. COVID recession arrived Feb 2020, compressing the lead time.',
    question_angle: 'what yield curve inversion historically signals and why the 2019 inversion was significant'
  },
  {
    id: 'us_2s10s_2022_2023',
    title: 'US 2s10s Yield Curve',
    period: 'Jan 2022 – Dec 2023',
    yLabel: 'Spread (bps)',
    xLabels: ['Jan 22','Jun 22','Dec 22','Mar 23','Jun 23','Oct 23','Dec 23'],
    yValues:  [40, -10, -70, -89, -108, -50, -40],
    context: 'The 2s10s curve inverted to -108bps in July 2023 — deepest inversion in 40 years — reflecting the most aggressive Fed hiking cycle since Volcker. The protracted inversion raised questions about whether "this time is different" given the lag between inversion and recession.',
    question_angle: 'why the deepest inversion in 40 years occurred and what it implied for recession timing'
  },
  {
    id: 'uk_gilts_2022',
    title: 'UK 10-Year Gilt Yield',
    period: 'Aug 2022 – Nov 2022',
    yLabel: '10Y Gilt Yield (%)',
    xLabels: ['Aug 22','Sep 1','Sep 23','Sep 28','Oct 5','Oct 14','Nov 22'],
    yValues:  [2.1, 3.1, 3.5, 4.5, 4.1, 4.0, 3.1],
    context: 'UK gilt yields spiked from 3.1% to 4.5% in 5 days following Truss\'s unfunded £45bn mini-budget. Pension funds using LDI strategies faced margin calls, threatening a doom loop. The BOE intervened with emergency purchases. Truss resigned after 45 days.',
    question_angle: 'what triggered the gilt crisis, what LDI is, and how it became systemic'
  },
  {
    id: 'bund_yield_2022',
    title: 'German 10Y Bund Yield',
    period: 'Jan 2022 – Oct 2022',
    yLabel: '10Y Bund Yield (%)',
    xLabels: ['Jan 22','Mar 22','May 22','Jul 22','Sep 22','Oct 22'],
    yValues:  [-0.12, 0.35, 1.14, 0.97, 2.11, 2.40],
    context: 'German 10Y Bund yields surged from -0.12% to 2.40% in 2022 — the fastest move from negative to positive in history. The move reflected the ECB\'s belated but aggressive tightening response to 10%+ inflation. Negative-yielding debt globally fell from $18tn to near zero.',
    question_angle: 'what the end of negative yields in Europe meant for fixed income investors and bank profitability'
  },
  {
    id: 'italy_spread_2022',
    title: 'Italy-Germany 10Y Spread (BTP-Bund)',
    period: 'Jan 2022 – Jun 2022',
    yLabel: 'Spread (bps)',
    xLabels: ['Jan 22','Mar 22','Apr 22','May 22','Jun 22'],
    yValues:  [135, 153, 170, 193, 241],
    context: 'Italy-Germany 10Y spreads widened sharply as ECB signalled rate hikes, raising fears of Eurozone fragmentation. The ECB announced TPI (Transmission Protection Instrument) in July 2022 — an unlimited bond-buying tool — to prevent peripheral spreads from spiralling. This was the ECB\'s "whatever it takes" moment 2.0.',
    question_angle: 'what BTP-Bund spread widening signals about Eurozone cohesion and what TPI is'
  },
  {
    id: 'us_tips_real_yields',
    title: 'US 10Y Real Yield (TIPS)',
    period: 'Jan 2022 – Oct 2022',
    yLabel: 'Real Yield (%)',
    xLabels: ['Jan 22','Mar 22','May 22','Jul 22','Sep 22','Oct 22'],
    yValues:  [-1.05, -0.62, 0.19, 0.31, 1.35, 1.72],
    context: 'US 10Y real yields surged from -1.05% to +1.72% in 2022 — a 277bp swing that drove cross-asset pain. Real yield is the key driver of gold (inverse), equity valuations (via discount rate), and USD strength. When real yields are deeply negative, financial conditions are ultra-loose; when they surge, everything reprices.',
    question_angle: 'why real yields matter more than nominal yields for asset pricing across gold, equities and FX'
  },
  {
    id: 'svb_collapse_2023',
    title: 'US 2-Year Treasury Yield',
    period: 'Jan 2023 – Apr 2023',
    yLabel: '2Y Yield (%)',
    xLabels: ['Jan 23','Feb 23','Mar 8','Mar 13','Mar 20','Apr 23'],
    yValues:  [4.42, 4.89, 5.07, 4.53, 4.18, 4.34],
    context: 'SVB collapsed on March 10 2023, triggering the largest US bank failure since 2008. 2Y yields fell 54bps in a single day — the largest move since 1987 — as markets priced emergency Fed cuts. SVB had invested depositor funds in long-duration bonds that lost value as rates rose. The Fed created the Bank Term Funding Program (BTFP) as an emergency backstop.',
    question_angle: 'why SVB failed, what duration risk is, and how the 2Y yield spike was the mechanism'
  },

  // ── EQUITIES ──
  {
    id: 'sp500_2008',
    title: 'S&P 500 Index',
    period: 'Oct 2007 – Mar 2009',
    yLabel: 'S&P 500 Level',
    xLabels: ['Oct 07','Jan 08','Apr 08','Jul 08','Sep 08','Jan 09','Mar 09'],
    yValues:  [1565, 1378, 1385, 1260, 1166, 825, 666],
    context: 'S&P 500 fell 57% from peak to trough — worst bear market since the Great Depression. Lehman filed for bankruptcy September 2008. The Fed cut to zero, launched QE1, and $700bn TARP was enacted. The 666 trough on March 9 2009 was the exact bottom.',
    question_angle: 'what the Lehman moment meant for markets, policy response and how 2008 compares to other crises'
  },
  {
    id: 'sp500_covid_2020',
    title: 'S&P 500 Index — COVID Crash',
    period: 'Jan 2020 – Aug 2020',
    yLabel: 'S&P 500 Level',
    xLabels: ['Jan 20','Feb 20','Mar 23','Apr 20','Jun 20','Aug 20'],
    yValues:  [3230, 2954, 2237, 2912, 3100, 3500],
    context: 'S&P 500 fell 34% in 33 days — the fastest bear market in history — then recovered all losses in 5 months: the fastest recovery ever. The Fed cut to zero and launched unlimited QE within weeks. $5 trillion of fiscal stimulus globally created a V-shaped recovery that confounded most analysts.',
    question_angle: 'why the COVID recovery was so fast and what policy mechanisms drove the V-shape'
  },
  {
    id: 'nasdaq_2022',
    title: 'NASDAQ Composite Index',
    period: 'Jan 2022 – Dec 2022',
    yLabel: 'NASDAQ Level',
    xLabels: ['Jan 22','Mar 22','Jun 22','Aug 22','Oct 22','Dec 22'],
    yValues:  [15630, 14262, 10645, 12390, 10971, 10940],
    context: 'NASDAQ fell 33% in 2022 — its worst year since 2008 — as rising real yields crushed long-duration growth stocks. High-multiple tech companies are like long-duration bonds: small changes in discount rates have outsized valuation impacts. Cathie Wood\'s ARK Innovation ETF fell 67%.',
    question_angle: 'why tech/growth stocks are particularly sensitive to rising real yields — the duration analogy'
  },
  {
    id: 'vix_2008',
    title: 'VIX Volatility Index — GFC',
    period: 'Jan 2008 – Mar 2009',
    yLabel: 'VIX Level',
    xLabels: ['Jan 08','Mar 08','Jun 08','Sep 08','Oct 08','Dec 08','Mar 09'],
    yValues:  [24, 26, 23, 33, 80, 55, 49],
    context: 'VIX hit 80 in October 2008 following Lehman\'s collapse — its highest level at that time. The spike reflected complete breakdown of interbank lending, credit freezing globally, and systemic counterparty risk. Unlike COVID (VIX 82 for days), the 2008 spike remained elevated for months.',
    question_angle: 'what sustained high VIX means for market functioning vs brief spikes'
  },
  {
    id: 'vix_2020',
    title: 'VIX Volatility Index — COVID',
    period: 'Jan 2020 – Sep 2020',
    yLabel: 'VIX Level',
    xLabels: ['Jan 20','Feb 20','Mar 20','Apr 20','Jun 20','Sep 20'],
    yValues:  [14, 19, 82, 41, 31, 26],
    context: 'VIX spiked to 82 in March 2020 — its all-time high. COVID caused simultaneous collapse across all asset classes. The Fed cut to zero, launched unlimited QE and 9 emergency facilities. The subsequent recovery was the fastest in history, fuelled by $5 trillion fiscal stimulus.',
    question_angle: 'what the VIX spike signalled and how the policy response shaped the recovery'
  },
  {
    id: 'nikkei_1989_1992',
    title: 'Nikkei 225 Index',
    period: 'Jan 1989 – Dec 1992',
    yLabel: 'Nikkei Level',
    xLabels: ['Jan 89','Jun 89','Dec 89','Jun 90','Dec 90','Dec 91','Dec 92'],
    yValues:  [30159, 33000, 38915, 31940, 23849, 22984, 16925],
    context: 'Nikkei peaked at 38,915 on December 29 1989 then lost 56% by 1992. The collapse of Japan\'s asset price bubble — inflated by loose monetary policy and land speculation — led to two "lost decades" of deflation, zombie banks and stagnation. Japan\'s experience became the definitive case study for liquidity traps.',
    question_angle: 'why Japan\'s bubble burst was so damaging and what lessons it holds for central banks'
  },
  {
    id: 'dotcom_nasdaq_2000',
    title: 'NASDAQ Composite — Dot-com Crash',
    period: 'Jan 2000 – Oct 2002',
    yLabel: 'NASDAQ Level',
    xLabels: ['Jan 00','Mar 00','Dec 00','Jun 01','Dec 01','Jun 02','Oct 02'],
    yValues:  [4069, 5048, 2471, 2161, 1987, 1464, 1114],
    context: 'NASDAQ fell 78% from its March 2000 peak to its October 2002 trough — losing $5 trillion in market cap. Hundreds of dot-com companies with no profits or revenue collapsed. The Fed had raised rates 175bps in 1999-2000 to cool the bubble. The bust led to the 2001 recession.',
    question_angle: 'what drove the dot-com bubble and how it compares to modern tech valuations'
  },
  {
    id: 'china_a_shares_2015',
    title: 'Shanghai Composite Index',
    period: 'Jun 2014 – Sep 2015',
    yLabel: 'Shanghai Composite',
    xLabels: ['Jun 14','Dec 14','Mar 15','Jun 15','Jul 15','Sep 15'],
    yValues:  [2050, 3235, 3747, 5178, 3686, 3052],
    context: 'Shanghai Composite doubled in 12 months driven by retail investor leverage (margin lending), then fell 40% in 3 months. The CSRC halted IPOs, directed state funds to buy shares, and restricted short selling. Circuit breakers introduced in January 2016 paradoxically accelerated selling.',
    question_angle: 'how retail margin lending inflated China\'s 2015 bubble and why the circuit breakers backfired'
  },

  // ── COMMODITIES ──
  {
    id: 'brent_oil_2014_2016',
    title: 'Brent Crude Oil Price',
    period: 'Jun 2014 – Jan 2016',
    yLabel: 'USD per barrel',
    xLabels: ['Jun 14','Sep 14','Dec 14','Mar 15','Jun 15','Sep 15','Jan 16'],
    yValues:  [112, 97, 62, 55, 63, 48, 31],
    context: 'Brent collapsed 72% as OPEC refused to cut production to defend market share against US shale. Caused major EM and commodity currency selloff, fiscal crises in oil-dependent sovereigns, and a global high-yield credit event.',
    question_angle: 'what caused this collapse and how it cascaded into credit markets and EM currencies'
  },
  {
    id: 'oil_negative_2020',
    title: 'WTI Crude Oil Price',
    period: 'Jan 2020 – Jun 2020',
    yLabel: 'USD per barrel',
    xLabels: ['Jan 20','Feb 20','Mar 20','Apr 20 (low)','May 20','Jun 20'],
    yValues:  [63, 50, 20, -37, 33, 40],
    context: 'WTI crude went negative to -$37/bbl on April 20 2020 — the first time in history. COVID destroyed 30% of global oil demand while storage was full. Holders of May futures contracts had to pay others to take delivery. OPEC+ subsequently cut 10m bpd in the largest production cut ever.',
    question_angle: 'why oil prices went negative in 2020 and the futures/storage mechanics behind it'
  },
  {
    id: 'eu_natgas_2022',
    title: 'European Natural Gas (TTF)',
    period: 'Jan 2022 – Dec 2022',
    yLabel: 'EUR/MWh',
    xLabels: ['Jan 22','Mar 22','May 22','Jul 22','Aug 22','Sep 22','Dec 22'],
    yValues:  [72, 195, 95, 170, 340, 220, 80],
    context: 'TTF gas spiked to €340/MWh — 10x pre-crisis levels — as Russia cut pipeline flows. Europe scrambled to fill storage and import LNG. The energy crisis drove eurozone CPI above 10%, forced industrial shutdowns, and triggered €500bn+ of government energy support packages.',
    question_angle: 'how the energy shock transmitted into European CPI, industrial production and ECB policy'
  },
  {
    id: 'gold_2020',
    title: 'Gold Spot Price',
    period: 'Jan 2020 – Dec 2020',
    yLabel: 'USD per troy oz',
    xLabels: ['Jan 20','Mar 20','May 20','Jul 20','Aug 20','Oct 20','Dec 20'],
    yValues:  [1580, 1470, 1700, 1800, 2075, 1900, 1890],
    context: 'Gold fell initially in March 2020 as investors sold everything for cash, then surged 40% to $2,075 all-time high in August 2020 — exactly when the Fed announced Average Inflation Targeting. Zero real yields and massive monetary expansion drove the rally.',
    question_angle: 'why gold initially fell then surged, and what role real yields played'
  },
  {
    id: 'gold_2011',
    title: 'Gold Spot Price',
    period: 'Jan 2010 – Dec 2012',
    yLabel: 'USD per troy oz',
    xLabels: ['Jan 10','Jun 10','Jan 11','Jun 11','Sep 11','Dec 11','Dec 12'],
    yValues:  [1120, 1245, 1370, 1510, 1920, 1565, 1675],
    context: 'Gold hit $1,920/oz in September 2011 — then its all-time high — driven by post-GFC QE, the European sovereign debt crisis, and US credit rating downgrade. The subsequent fall was sharp as the Eurozone crisis stabilised and risk appetite recovered.',
    question_angle: 'what drove gold to its 2011 peak and why it subsequently fell despite continued QE'
  },
  {
    id: 'copper_china_2011',
    title: 'Copper Price (LME)',
    period: 'Jan 2010 – Dec 2012',
    yLabel: 'USD per tonne',
    xLabels: ['Jan 10','Jun 10','Feb 11','Jun 11','Dec 11','Jun 12','Dec 12'],
    yValues:  [7165, 6700, 10190, 9000, 7600, 7700, 7910],
    context: 'Copper peaked at $10,190/t in February 2011 — its all-time high — driven by China\'s massive infrastructure stimulus post-GFC. Known as "Dr Copper" for its economic forecasting ability, the subsequent fall tracked China\'s growth slowdown and declining credit impulse.',
    question_angle: 'why copper is called "Dr Copper" and how it acts as a leading indicator for global growth'
  },
  {
    id: 'iron_ore_2021_2022',
    title: 'Iron Ore Price (62% Fe CFR China)',
    period: 'Jan 2021 – Dec 2022',
    yLabel: 'USD per tonne',
    xLabels: ['Jan 21','May 21','Aug 21','Dec 21','Mar 22','Jun 22','Dec 22'],
    yValues:  [170, 230, 160, 115, 160, 110, 105],
    context: 'Iron ore peaked at $230/t in May 2021 driven by Brazilian supply disruptions and Chinese steel demand, then fell 55% as China enforced steel production cuts to reduce emissions and its property market slowed sharply. The Evergrande crisis, starting in mid-2021, signalled China property stress.',
    question_angle: 'how China\'s property crisis and steel production cuts transmitted into iron ore prices'
  },
  {
    id: 'wheat_ukraine_2022',
    title: 'CBOT Wheat Futures',
    period: 'Dec 2021 – Aug 2022',
    yLabel: 'USD per bushel',
    xLabels: ['Dec 21','Feb 22','Mar 22','May 22','Jun 22','Aug 22'],
    yValues:  [7.7, 8.9, 13.0, 12.5, 10.2, 7.9],
    context: 'Wheat surged 70% to $13/bushel following Russia\'s invasion of Ukraine in February 2022. Russia and Ukraine together account for ~30% of global wheat exports. The move contributed to a global food crisis, with the UN warning of widespread famine in import-dependent nations across MENA and Sub-Saharan Africa.',
    question_angle: 'how geopolitical events transmit into agricultural commodity prices and food security risks'
  },

  // ── MACRO & CREDIT ──
  {
    id: 'china_pmi_2015',
    title: 'China Manufacturing PMI',
    period: 'Jan 2015 – Dec 2015',
    yLabel: 'PMI Index',
    xLabels: ['Jan 15','Mar 15','May 15','Jul 15','Aug 15','Oct 15','Dec 15'],
    yValues:  [49.8, 50.1, 50.2, 50.0, 47.3, 49.8, 48.2],
    context: 'China PMI collapsed to 47.3 in August 2015, triggering a global risk-off shock. The PBOC surprised markets with a 2% CNY devaluation. Commodity prices tanked, EM currencies sold off, and the S&P 500 fell 11% in August.',
    question_angle: 'what the PMI drop triggered in global markets, CNY and commodities'
  },
  {
    id: 'us_pmi_2022_2023',
    title: 'US ISM Manufacturing PMI',
    period: 'Jan 2022 – Dec 2023',
    yLabel: 'PMI Index',
    xLabels: ['Jan 22','Jun 22','Dec 22','Mar 23','Jun 23','Sep 23','Dec 23'],
    yValues:  [57.6, 53.0, 48.4, 46.3, 46.0, 49.0, 47.4],
    context: 'US ISM Manufacturing fell below 50 (contraction) in November 2022 and remained there for 16 consecutive months — the longest contraction since 2000-2001. Yet employment remained robust and services stayed expansionary, creating the "two-speed" economy that complicated Fed rate decisions.',
    question_angle: 'why manufacturing contraction coexisted with labour strength and what it meant for Fed policy'
  },
  {
    id: 'us_unemployment_2020',
    title: 'US Unemployment Rate',
    period: 'Jan 2020 – Dec 2020',
    yLabel: 'Unemployment Rate (%)',
    xLabels: ['Jan 20','Feb 20','Mar 20','Apr 20','Jun 20','Sep 20','Dec 20'],
    yValues:  [3.5, 3.5, 4.4, 14.7, 11.1, 7.9, 6.7],
    context: 'US unemployment spiked from 3.5% to 14.7% in April 2020 — the highest since the Great Depression — in just 2 months. 22 million jobs were lost. The speed and scale were unprecedented; the subsequent recovery, driven by fiscal transfers and vaccine rollout, was equally unprecedented, with unemployment back below 4% by 2021.',
    question_angle: 'why the COVID unemployment spike was unique in history and how the recovery happened so fast'
  },
  {
    id: 'us_credit_spreads_2008',
    title: 'US Investment Grade Credit Spreads (OAS)',
    period: 'Jan 2008 – Mar 2009',
    yLabel: 'OAS (bps)',
    xLabels: ['Jan 08','Mar 08','Jun 08','Sep 08','Oct 08','Dec 08','Mar 09'],
    yValues:  [160, 192, 218, 280, 508, 589, 608],
    context: 'US IG credit spreads widened from 160bps to 608bps — nearly 4x — as the GFC froze credit markets. The move reflected loss of confidence in counterparty solvency. Investment grade spreads at these levels implied severe recession and systemic bank stress.',
    question_angle: 'what credit spread widening signals and how it creates a self-reinforcing tightening cycle'
  },
  {
    id: 'hy_spreads_2020',
    title: 'US High Yield Credit Spreads (OAS)',
    period: 'Jan 2020 – Dec 2020',
    yLabel: 'OAS (bps)',
    xLabels: ['Jan 20','Feb 20','Mar 20','Apr 20','Jun 20','Sep 20','Dec 20'],
    yValues:  [338, 372, 1100, 788, 607, 467, 360],
    context: 'US HY spreads spiked to 1100bps in March 2020 as COVID hit. The Fed\'s announcement on March 23 that it would buy corporate bonds (including fallen angels) for the first time in history caused an immediate rally. HY spreads compressed back to 338bps by year-end.',
    question_angle: 'what the Fed\'s corporate bond purchases in 2020 were and why they were unprecedented'
  },
  {
    id: 'greece_spreads_2012',
    title: 'Greece-Germany 10Y Spread',
    period: 'Jan 2010 – Jun 2012',
    yLabel: 'Spread (bps)',
    xLabels: ['Jan 10','Jun 10','Jan 11','Jun 11','Jan 12','Jun 12'],
    yValues:  [300, 700, 850, 1500, 3300, 2700],
    context: 'Greek-German spreads reached 3300bps in early 2012 as Greece restructured its debt in the largest sovereign default in history (€107bn haircut). The crisis threatened Eurozone breakup. Draghi\'s "whatever it takes" speech in July 2012 — without using a single euro — halted contagion to Italy and Spain.',
    question_angle: 'why Draghi\'s speech worked without spending money and what OMT actually is'
  },
  {
    id: 'china_credit_impulse',
    title: 'China Credit Impulse',
    period: 'Jan 2015 – Dec 2017',
    yLabel: 'Credit Impulse (% of GDP)',
    xLabels: ['Jan 15','Jul 15','Jan 16','Jul 16','Jan 17','Jul 17','Dec 17'],
    yValues:  [3.2, 1.8, 5.5, 7.2, 4.1, 1.8, 0.5],
    context: 'China\'s credit impulse — the change in new credit as % of GDP — is the world\'s leading macro indicator, leading global growth by 9-12 months. The 2016 surge drove commodity price recovery, EM outperformance and the global reflation trade of 2016-2017. The subsequent decline warned of 2018 EM weakness.',
    question_angle: 'what the China credit impulse is, why it leads global growth, and how to trade it'
  },
  {
    id: 'us_gdp_2020',
    title: 'US GDP Growth QoQ Annualised',
    period: 'Q4 2019 – Q4 2020',
    yLabel: 'GDP Growth (% QoQ ann.)',
    xLabels: ['Q4 19','Q1 20','Q2 20','Q3 20','Q4 20'],
    yValues:  [2.4, -5.0, -31.4, 33.4, 4.0],
    context: 'US GDP contracted 31.4% annualised in Q2 2020 — the deepest contraction in modern history — then rebounded 33.4% in Q3, the sharpest recovery ever. The unprecedented V-shape reflected the speed of policy response rather than genuine economic normalisation; many sectors remained severely impaired.',
    question_angle: 'why the GDP V-shape was misleading and which sectors drove the apparent recovery'
  },
  {
    id: 'china_gdp_2020_2021',
    title: 'China GDP Growth QoQ',
    period: 'Q4 2019 – Q4 2021',
    yLabel: 'GDP Growth (% QoQ)',
    xLabels: ['Q4 19','Q1 20','Q2 20','Q3 20','Q4 20','Q2 21','Q4 21'],
    yValues:  [6.0, -6.8, 3.2, 4.9, 6.5, 7.9, 4.0],
    context: 'China contracted 6.8% in Q1 2020 — its first quarterly contraction since 1992 — but recovered quickly due to aggressive fiscal stimulus and effective COVID suppression. China was the only major economy to grow in 2020 (+2.3% full year). By 2021, growth had normalised back to trend.',
    question_angle: 'why China recovered faster from COVID than Western economies and the implications for EM'
  },

  // ── STRUCTURAL / LONG-TERM ──
  {
    id: 'us_10y_secular_decline',
    title: 'US 10-Year Treasury Yield',
    period: '1981 – 2020',
    yLabel: '10Y Yield (%)',
    xLabels: ['1981','1985','1990','1995','2000','2005','2010','2015','2020'],
    yValues:  [15.8, 11.4, 8.9, 6.3, 5.1, 4.3, 3.3, 2.2, 0.9],
    context: 'The 40-year secular bull market in US Treasuries: yields fell from 15.8% in 1981 to 0.9% in 2020. This drove the greatest bond bull market in history and massively supported equity valuations via the discount rate effect. The 2022 reversal marked potentially the end of this 40-year trend.',
    question_angle: 'what caused the 40-year bond bull market and what ending it means for the 60/40 portfolio'
  },
  {
    id: 'global_debt_gdp',
    title: 'Global Debt-to-GDP Ratio',
    period: '2000 – 2021',
    yLabel: 'Debt/GDP (%)',
    xLabels: ['2000','2005','2008','2010','2015','2019','2020','2021'],
    yValues:  [195, 212, 250, 268, 280, 320, 355, 340],
    context: 'Global debt-to-GDP rose from 195% to 355% between 2000-2020, with the sharpest jump during COVID fiscal expansion. High debt constrains central bank ability to raise rates (debt sustainability) and governments\' ability to tighten fiscal policy. Japan\'s 260% government debt-to-GDP is the extreme case.',
    question_angle: 'why high debt-to-GDP constrains monetary and fiscal policy and creates a "debt trap"'
  },
  {
    id: 'usd_reserve_share',
    title: 'USD Share of Global FX Reserves',
    period: '2000 – 2022',
    yLabel: 'USD Share (%)',
    xLabels: ['2000','2004','2008','2012','2016','2020','2022'],
    yValues:  [71, 66, 64, 61, 65, 59, 58],
    context: 'USD\'s share of global FX reserves has declined from 71% in 2000 to 58% in 2022 — its lowest since the late 1990s. The decline reflects diversification into EUR, JPY, GBP, CNY and gold. This is a slow structural shift, not de-dollarisation, but relevant for long-term reserve management.',
    question_angle: 'why the USD remains dominant despite declining share and what would accelerate de-dollarisation'
  },
  {
    id: 'japan_debt_gdp',
    title: 'Japan Government Debt-to-GDP',
    period: '1990 – 2022',
    yLabel: 'Debt/GDP (%)',
    xLabels: ['1990','1995','2000','2005','2010','2015','2020','2022'],
    yValues:  [67, 94, 135, 175, 195, 229, 256, 261],
    context: 'Japan\'s government debt-to-GDP of 261% is the highest of any major economy — nearly double the US level. Yet Japan has low inflation, low yields and a stable yen (until 2022), challenging conventional debt sustainability models. Japan holds most of its debt domestically in JPY, making it structurally different from EM sovereign debt crises.',
    question_angle: 'why Japan can sustain 260% debt while EM countries face crises at far lower levels'
  },
  {
    id: 'us_10y_volcker_1980',
    title: 'US 10-Year Yield — Volcker Era',
    period: 'Jan 1978 – Dec 1983',
    yLabel: '10Y Yield (%)',
    xLabels: ['Jan 78','Jan 79','Jan 80','Oct 81','Jan 82','Jan 83'],
    yValues:  [7.9, 9.4, 12.4, 15.8, 14.8, 10.9],
    context: 'Volcker raised the Fed Funds Rate to 20% in 1981 to crush 14% inflation inherited from the 1970s oil shocks. Two recessions were deliberately induced. This remains the defining example of credible central bank inflation-fighting — at enormous short-term economic cost — and is cited by modern central bankers to justify aggressive hiking.',
    question_angle: 'what the Volcker disinflation achieved and at what economic cost, and how it shapes modern CB thinking'
  },
];

/* ═══════════════════════════════════════════════════════
   SERVER
═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   SERVER-SIDE QUESTION CACHE
   Questions are pre-generated and stored in memory.
   Refreshed every 4 hours automatically.
   Result: instant response when user clicks Begin.
═══════════════════════════════════════════════════════ */
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const questionCache = {}; // key: "CAT_DIFF" -> { questions, generatedAt }

function getCacheKey(cat, diff) { return `${cat}_${diff}`; }

function isCacheValid(key) {
  const c = questionCache[key];
  return c && c.questions && c.questions.length >= 4 && (Date.now() - c.ts) < CACHE_TTL_MS;
}

async function generateAndCache(cat, diff) {
  try {
    console.log(`[Cache] Generating questions for ${cat}/${diff}...`);
    const qs = await generateQuestions(cat, diff);
    if (qs && qs.length >= 4) {
      questionCache[getCacheKey(cat, diff)] = { questions: qs, ts: Date.now() };
      console.log(`[Cache] ✓ ${cat}/${diff} — ${qs.length} questions cached`);
    }
  } catch (e) {
    console.log(`[Cache] ✗ ${cat}/${diff} failed: ${e.message}`);
  }
}

// Pre-warm the most common combinations on startup
async function warmCache() {
  console.log('[Cache] Warming cache on startup...');
  const combos = [
    ['ALL','VP'], ['ALL','ANALYST'], ['ALL','MD'],
    ['FX','VP'], ['RATES','VP'], ['MACRO','VP'],
    ['EQUITY','VP'], ['COMMODITIES','VP']
  ];
  // Stagger to avoid rate limits — one every 12 seconds
  for (let i = 0; i < combos.length; i++) {
    setTimeout(() => generateAndCache(combos[i][0], combos[i][1]), i * 12000);
  }
}

// Refresh cache every 4 hours
setInterval(() => {
  console.log('[Cache] Scheduled refresh...');
  const keys = Object.keys(questionCache);
  keys.forEach((key, i) => {
    const [cat, diff] = key.split('_');
    setTimeout(() => generateAndCache(cat, diff), i * 12000);
  });
}, CACHE_TTL_MS);

async function generateQuestions(category, difficulty) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) throw new Error('Missing ANTHROPIC_API_KEY.');

    const diffNote = {
    ANALYST: 'conceptual — directional logic, definitions, basic mechanisms. No exact figures required.',
    VP:      'specific — named instruments, exact moves, causal chains. Mix data literacy with market intuition.',
    MD:      'expert — cross-asset, multi-factor, relative value. Assume deep practitioner knowledge.'
  }[difficulty] || 'specific figures and moves';

  const catNote = category === 'ALL'
    ? '2 questions each on: Macro, FX, Rates, Equity, Commodities'
    : `all 10 questions on ${category}`;

  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Filter charts by category if not ALL
  const eligibleCharts = category === 'ALL'
    ? CHART_LIBRARY
    : CHART_LIBRARY.filter(c => {
        const catMap = {
          FX: ['eurusd_2022','dxy_2022','usdjpy_2022','gbpusd_2022','em_fx_taper_2013','try_usd_2018','cny_devaluation_2015','chf_snb_2015'],
          RATES: ['us_10y_2022','us_2s10s_2019','us_2s10s_2022_2023','uk_gilts_2022','bund_yield_2022','italy_spread_2022','us_tips_real_yields','svb_collapse_2023','fed_funds_2022_2023','ecb_rates_2022_2023','fed_funds_2004_2006','boj_ycc_jgb','us_10y_secular_decline','us_10y_volcker_1980'],
          EQUITY: ['sp500_2008','sp500_covid_2020','nasdaq_2022','vix_2008','vix_2020','nikkei_1989_1992','dotcom_nasdaq_2000','china_a_shares_2015'],
          COMMODITIES: ['brent_oil_2014_2016','oil_negative_2020','eu_natgas_2022','gold_2020','gold_2011','copper_china_2011','iron_ore_2021_2022','wheat_ukraine_2022'],
          MACRO: ['us_cpi_2021_2022','uk_cpi_2022_2023','eurozone_cpi_2022','japan_cpi_2022_2023','china_pmi_2015','us_pmi_2022_2023','us_unemployment_2020','us_credit_spreads_2008','hy_spreads_2020','greece_spreads_2012','china_credit_impulse','us_gdp_2020','china_gdp_2020_2021','global_debt_gdp','usd_reserve_share','japan_debt_gdp']
        };
        return (catMap[category] || []).includes(c.id);
      });

  const poolToUse = eligibleCharts.length >= 3 ? eligibleCharts : CHART_LIBRARY;
  const shuffledCharts = [...poolToUse].sort(() => Math.random() - 0.5).slice(0, 3);

  const questionTypes = [
    'instrument mechanics — how does this product behave in this rate/vol environment',
    'policy divergence — compare two central banks direction and market impact',
    'cross-asset correlation — how did X move affect Y asset class',
    'regime identification — what macro regime are we in and which assets benefit',
    'risk scenario — what is the primary tail risk for this asset and why',
    'valuation — is this asset cheap or rich vs historical context',
    'positioning and flows — who is positioned where and what does it mean for price action',
    'causality chain — event A caused move B via mechanism C',
    'curve dynamics — what yield curve shape implies about growth and policy expectations',
    'geopolitical market impact — how does this event transmit into asset prices',
    'structural shift — what long-term trend is changing and why it matters',
    'credit mechanics — how does spread widening or tightening affect the real economy'
  ].sort(() => Math.random() - 0.5).slice(0, 7);

  const chartInstructions = shuffledCharts.map((c, i) => `
CHART QUESTION ${i + 1}:
Chart: "${c.title}" — ${c.period}
Data: ${c.xLabels.map((x, j) => `${x}: ${c.yValues[j]}`).join(', ')}
Context: ${c.context}
Ask about: ${c.question_angle}
Set "chart_id" to "${c.id}"`).join('\n');

  const regularInstructions = questionTypes.map((t, i) => `Regular Q${i + 1}: ${t}`).join('\n');

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
        max_tokens: 4000,
        system: `You are a market intelligence quiz generator for senior finance professionals. Chart data is always provided — never invent or modify numbers. Write incisive, educational questions that teach real market mechanics. Accuracy first.`,
        messages: [{
          role: 'user',
          content: `Generate exactly 10 quiz questions. ${catNote}. Difficulty: ${diffNote}.

3 questions are CHART-BASED (use the provided data exactly):
${chartInstructions}

7 questions are REGULAR (no chart), each a different type:
${regularInstructions}

Mix chart and regular questions naturally across all 10 slots.

RULES:
- Chart questions: test WHY the pattern occurred and WHAT HAPPENED NEXT. All 4 options must be plausible to a practitioner.
- Regular questions: mechanisms, causality, relative value. Ask about direction/logic, not specific current rate levels.
- Never mention "search results" or "reports". State facts directly.
- Distractors must reflect real market misconceptions.
- Vary question structure throughout.

Return ONLY a JSON array, no markdown:
[{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"2-3 sentences — correct fact plus the market mechanism","category":"MACRO|FX|RATES|EQUITY|COMMODITIES","source":"Market Intelligence, ${date}","headline":"one-line description of the event or concept","chart_id":null}]
(set chart_id to the provided id string for chart questions, null for regular ones)`
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

    const chartMap = Object.fromEntries(CHART_LIBRARY.map(c => [c.id, c]));
    questions.forEach(q => {
      if (q.chart_id && chartMap[q.chart_id]) {
        const c = chartMap[q.chart_id];
        q.chart = { title: c.title, period: c.period, yLabel: c.yLabel, xLabels: c.xLabels, yValues: c.yValues };
      }
      delete q.chart_id;
    });

    return questions;
  } catch (e) {
    throw new Error(e.message || 'Unknown error generating questions.');
  }
}

app.post('/api/quiz', async (req, res) => {
  const { category = 'ALL', difficulty = 'VP' } = req.body || {};
  const key = getCacheKey(category, difficulty);

  // Serve instantly from server-side cache
  if (isCacheValid(key)) {
    console.log(`[Cache] HIT — ${category}/${difficulty}`);
    const shuffled = [...questionCache[key].questions].sort(() => Math.random() - 0.5);
    // Background refresh when cache is 75% expired
    if ((Date.now() - questionCache[key].ts) > CACHE_TTL_MS * 0.75) {
      setTimeout(() => generateAndCache(category, difficulty), 100);
    }
    return res.json({ questions: shuffled, generatedAt: questionCache[key].ts, cached: true });
  }

  // Cache miss — generate now, cache result
  console.log(`[Cache] MISS — ${category}/${difficulty}, generating live...`);
  try {
    const questions = await generateQuestions(category, difficulty);
    questionCache[key] = { questions, ts: Date.now() };
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    res.json({ questions: shuffled, generatedAt: new Date().toISOString(), cached: false });
    // Pre-warm related combos in background
    setTimeout(() => generateAndCache(category, difficulty), 1000);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Unknown server error.' });
  }
});


const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>MARKET QUIZ — Daily Intelligence</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Source Serif 4',Georgia,serif;background:#fff;color:#000;min-height:100vh;-webkit-font-smoothing:antialiased}
.app{max-width:840px;margin:0 auto;padding:2rem 2rem 5rem}
.display{font-family:'Playfair Display',serif}
.mono{font-family:'JetBrains Mono',monospace;letter-spacing:0.08em}
.header{border-bottom:4px solid #000;padding-bottom:1.5rem;margin-bottom:2.5rem;display:flex;justify-content:space-between;align-items:flex-end;gap:1rem}
.header-title{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;letter-spacing:-0.04em;line-height:1}
.header-meta{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;color:#525252;text-align:right;flex-shrink:0}
.header-meta span{display:block;line-height:2}
.filter-section{margin-bottom:2rem}
.filter-label{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;color:#aaa;margin-bottom:0.5rem}
.chip-row{display:flex;flex-wrap:wrap;gap:0.45rem;margin-bottom:1rem}
.chip{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.38rem 0.9rem;border:1px solid #000;background:#fff;cursor:pointer;transition:all 80ms;user-select:none}
.chip:hover,.chip.active{background:#000;color:#fff}
.screen{display:none}.screen.active{display:block}
.start-hero{border:4px solid #000;padding:3rem 2.5rem;margin-bottom:2rem;position:relative;overflow:hidden}
.start-hero::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.012) 3px,rgba(0,0,0,0.012) 4px);pointer-events:none}
.hero-eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;color:#525252;margin-bottom:1rem}
.hero-headline{font-family:'Playfair Display',serif;font-size:4rem;font-weight:900;line-height:0.93;letter-spacing:-0.04em;margin-bottom:1.5rem}
.hero-headline em{font-style:italic;font-weight:400}
.hero-sub{font-size:0.98rem;color:#525252;line-height:1.65;max-width:500px;margin-bottom:2.5rem}
.btn-primary{font-family:'JetBrains Mono',monospace;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;padding:1rem 2rem;background:#000;color:#fff;border:2px solid #000;cursor:pointer;transition:all 80ms}
.btn-primary:hover{background:#fff;color:#000}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #000;padding-top:1.5rem;margin-top:2.5rem}
.stat-item{padding-right:1.25rem}
.stat-item+.stat-item{border-left:1px solid #e5e5e5;padding-left:1.25rem;padding-right:0}
.stat-num{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;line-height:1}
.stat-label{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.1em;text-transform:uppercase;color:#525252;margin-top:0.2rem}
.prefetch-indicator{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.1em;text-transform:uppercase;color:#aaa;margin-top:1rem;display:flex;align-items:center;gap:0.5rem;min-height:1.2rem}
.prefetch-dot{width:6px;height:6px;background:#000;animation:blink 1s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
.history-panel{margin-top:2rem;border-top:1px solid #e5e5e5;padding-top:1.5rem}
.history-label{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#aaa;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center}
.history-clear{background:none;border:none;font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.1em;text-decoration:underline;cursor:pointer;color:#aaa}
.history-clear:hover{color:#000}
.history-row{display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:1rem;padding:0.6rem 0;border-bottom:1px solid #f0f0f0;font-family:'JetBrains Mono',monospace;font-size:0.65rem}
.h-date{color:#aaa;white-space:nowrap}
.h-cat{padding:0.15rem 0.5rem;border:1px solid #e5e5e5;color:#525252;font-size:0.58rem}
.h-grade{font-family:'Playfair Display',serif;font-weight:700;font-size:1rem}
.wrong-bank-btn{width:100%;text-align:left;padding:1rem 1.25rem;background:#f5f5f5;border:1px solid #e5e5e5;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;transition:all 80ms}
.wrong-bank-btn:hover{background:#000;color:#fff;border-color:#000}
.wrong-bank-count{background:#000;color:#fff;padding:0.2rem 0.6rem;font-size:0.6rem}
.wrong-bank-btn:hover .wrong-bank-count{background:#fff;color:#000}
.loading-wrap{padding:5rem 0;text-align:center}
.loading-label{font-family:'JetBrains Mono',monospace;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;color:#525252;margin-bottom:1.25rem}
.loading-bar{width:100%;height:2px;background:#e5e5e5;margin-bottom:2rem;overflow:hidden}
.loading-bar::after{content:'';display:block;height:100%;width:40%;background:#000;animation:loadslide 1.1s ease-in-out infinite}
@keyframes loadslide{0%{margin-left:-40%}100%{margin-left:140%}}
.loading-msg{font-family:'Playfair Display',serif;font-style:italic;font-size:1.2rem;color:#525252;min-height:2rem}
.loading-step{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;color:#bbb;margin-top:0.75rem}
.quiz-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;gap:1rem;flex-wrap:wrap}
.q-counter{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:#525252}
.streak-badge{font-family:'JetBrains Mono',monospace;font-size:0.62rem;padding:0.25rem 0.6rem;border:1px solid #000;background:#000;color:#fff;display:none}
.q-score-badge{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.12em;padding:0.3rem 0.8rem;border:1px solid #000}
.timer-row{margin-bottom:1.25rem}
.timer-track{width:100%;height:4px;background:#e5e5e5}
.timer-fill{height:100%;background:#000;transition:width 1s linear;width:100%}
.timer-fill.warning{background:#525252}
.timer-fill.danger{background:#000;animation:pulse 0.5s ease-in-out infinite alternate}
@keyframes pulse{0%{opacity:1}100%{opacity:0.3}}
.timer-label{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.1em;color:#aaa;margin-top:0.3rem;text-align:right}
.chart-block{border:1px solid #000;margin-bottom:1.5rem;background:#fff;position:relative}
.chart-header{border-bottom:2px solid #000;padding:0.9rem 1.25rem;display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:0.5rem}
.chart-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
.chart-period{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.08em;color:#525252}
.chart-badge{font-family:'JetBrains Mono',monospace;font-size:0.55rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.2rem 0.55rem;border:1px solid #000;background:#000;color:#fff}
.chart-canvas-wrap{padding:1.25rem 1.25rem 0.75rem}
.chart-canvas-wrap canvas{display:block;width:100%!important}
.q-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.9rem;flex-wrap:wrap;gap:0.5rem}
.q-cat-tag{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.25rem 0.65rem;border:1px solid #000}
.q-diff-tag{font-family:'JetBrains Mono',monospace;font-size:0.55rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.2rem 0.55rem;border:1px solid #e5e5e5;color:#aaa}
.q-source-tag{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.06em;color:#aaa}
.question-card{border:2px solid #000;padding:2rem 2rem 1.75rem;margin-bottom:1.5rem;position:relative}
.q-num-badge{position:absolute;top:-1px;right:-1px;background:#000;color:#fff;font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.1em;padding:0.28rem 0.6rem}
.question-text{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:600;line-height:1.4;letter-spacing:-0.02em}
.options-list{display:flex;flex-direction:column;gap:0.65rem;margin-bottom:1.25rem}
.opt-btn{text-align:left;padding:0.95rem 1.2rem;background:#fff;border:1px solid #000;cursor:pointer;font-family:'Source Serif 4',serif;font-size:0.93rem;line-height:1.45;transition:background 80ms,color 80ms;display:flex;align-items:flex-start;gap:0.85rem;width:100%}
.opt-btn:hover:not([disabled]){background:#000;color:#fff}
.opt-letter{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;margin-top:0.18rem;flex-shrink:0;font-weight:500}
.opt-btn.correct{background:#000;color:#fff;border-color:#000}
.opt-btn.wrong{background:#525252;color:#fff;border-color:#525252}
.opt-btn.timed-out{background:#f5f5f5;color:#ccc;border-color:#e5e5e5}
.opt-btn[disabled]{cursor:default}
.headline-reveal{background:#000;color:#fff;padding:1rem 1.25rem;display:flex;gap:1rem;align-items:flex-start}
.headline-tag{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;flex-shrink:0;opacity:0.6;margin-top:0.1rem}
.headline-text{font-family:'Playfair Display',serif;font-style:italic;font-size:0.95rem;line-height:1.4}
.explanation{border-left:4px solid #000;padding:1.1rem 1.4rem;background:#f5f5f5;margin-bottom:1.5rem}
.exp-label{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:#525252;margin-bottom:0.45rem}
.exp-text{font-size:0.88rem;line-height:1.7}
.quiz-footer{display:flex;justify-content:flex-end;margin-top:0.5rem}
.btn-next{font-family:'JetBrains Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.75rem 1.75rem;background:#fff;color:#000;border:2px solid #000;cursor:pointer;transition:all 80ms}
.btn-next:hover{background:#000;color:#fff}
.result-card{border:4px solid #000;padding:3rem 2.5rem;margin-bottom:2rem;position:relative;overflow:hidden}
.result-card.inverted{background:#000;color:#fff}
.result-card::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.025) 3px,rgba(255,255,255,0.025) 4px);pointer-events:none}
.result-grade{font-family:'Playfair Display',serif;font-size:7rem;font-weight:900;line-height:0.85;letter-spacing:-0.05em;margin-bottom:0.5rem}
.result-tagline{font-family:'Playfair Display',serif;font-style:italic;font-size:1.3rem;margin-bottom:2rem;opacity:0.85}
.result-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,0.2);padding-top:1.5rem}
.result-stats.light{border-top-color:#e5e5e5}
.rs-item{padding-right:1.25rem}
.rs-item+.rs-item{border-left:1px solid rgba(255,255,255,0.15);padding-left:1.25rem;padding-right:0}
.rs-item.light+.rs-item.light{border-left-color:#e5e5e5}
.rs-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;line-height:1}
.rs-label{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.1em;text-transform:uppercase;opacity:0.6;margin-top:0.2rem}
.action-row{display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:3rem}
.btn-secondary{font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.75rem 1.4rem;background:#fff;color:#000;border:2px solid #000;cursor:pointer;transition:all 80ms}
.btn-secondary:hover{background:#000;color:#fff}
.btn-share{font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.75rem 1.4rem;background:#fff;color:#000;border:1px solid #e5e5e5;cursor:pointer;transition:all 80ms}
.btn-share:hover{border-color:#000}
.share-confirm{font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:#525252;padding:0.75rem 0;display:none;align-items:center}
.breakdown-section{margin-bottom:3rem}
.section-title{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;color:#525252;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid #e5e5e5}
.cat-bars{display:flex;flex-direction:column;gap:0.85rem}
.cat-bar-row{display:grid;grid-template-columns:100px 1fr 55px;align-items:center;gap:1rem}
.cat-bar-label{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;color:#525252}
.cat-bar-track{height:6px;background:#e5e5e5}
.cat-bar-fill{height:100%;background:#000;transition:width 600ms ease}
.cat-bar-pct{font-family:'JetBrains Mono',monospace;font-size:0.65rem;font-weight:500;text-align:right}
.review-section{border-top:4px solid #000;padding-top:2rem}
.review-header{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;color:#525252;margin-bottom:1.5rem}
.review-item{padding:1.2rem 0;border-bottom:1px solid #e5e5e5}
.ri-q{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;line-height:1.35;margin-bottom:0.55rem}
.ri-ans-row{font-size:0.83rem;display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.25rem;flex-wrap:wrap}
.ri-marker{font-family:'JetBrains Mono',monospace;font-size:0.58rem;padding:0.15rem 0.45rem;flex-shrink:0}
.ri-marker.ok{background:#000;color:#fff}
.ri-marker.no{background:#e5e5e5;color:#525252}
.ri-exp{font-size:0.8rem;color:#525252;line-height:1.55;margin-top:0.4rem}
.ri-headline{font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:#aaa;margin-top:0.3rem;font-style:italic}
.ri-chart-tag{font-family:'JetBrains Mono',monospace;font-size:0.55rem;letter-spacing:0.1em;padding:0.15rem 0.45rem;border:1px solid #e5e5e5;color:#aaa;margin-left:0.5rem}
.error-box{border:2px solid #000;padding:2rem;margin:1.5rem 0}
.error-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;margin-bottom:0.6rem}
.error-msg{font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#525252;line-height:1.6;margin-bottom:1.25rem}
@media(max-width:580px){
  .hero-headline{font-size:2.8rem}
  .result-grade{font-size:5rem}
  .stats-row,.result-stats{grid-template-columns:1fr 1fr;gap:1rem;row-gap:1.25rem}
  .stat-item+.stat-item,.rs-item+.rs-item,.rs-item.light+.rs-item.light{border-left:none;padding-left:0}
  .start-hero{padding:2rem 1.5rem}
  .cat-bar-row{grid-template-columns:70px 1fr 40px}
  .chart-canvas-wrap{padding:1rem 0.75rem 0.5rem}
}
</style>
</head>
<body>
<div class="app">
  <header class="header">
    <div class="header-title display">MARKET<br>QUIZ</div>
    <div class="header-meta mono">
      <span id="todayDate">—</span>
      <span id="headerDiff">VP LEVEL</span>
    </div>
  </header>

  <div class="filter-section">
    <div class="filter-label mono">CATEGORY</div>
    <div class="chip-row" id="catRow">
      <button class="chip active" onclick="selectCat(this,'ALL')">ALL MARKETS</button>
      <button class="chip" onclick="selectCat(this,'MACRO')">MACRO</button>
      <button class="chip" onclick="selectCat(this,'FX')">FX</button>
      <button class="chip" onclick="selectCat(this,'RATES')">RATES</button>
      <button class="chip" onclick="selectCat(this,'EQUITY')">EQUITY</button>
      <button class="chip" onclick="selectCat(this,'COMMODITIES')">COMMODITIES</button>
    </div>
    <div class="filter-label mono">DIFFICULTY</div>
    <div class="chip-row">
      <button class="chip" onclick="selectDiff(this,'ANALYST')">ANALYST</button>
      <button class="chip active" onclick="selectDiff(this,'VP')">VP</button>
      <button class="chip" onclick="selectDiff(this,'MD')">MD ↑</button>
    </div>
  </div>

  <div class="screen active" id="screenStart">
    <div class="start-hero">
      <p class="hero-eyebrow mono">Daily Intelligence Briefing</p>
      <h1 class="hero-headline display">Test Your<br><em>Market</em><br>Edge.</h1>
      <p class="hero-sub">10 questions grounded in real market history — mechanisms, causality, cross-asset logic. Charts included. Every session is unique.</p>
      <button class="btn-primary" onclick="startQuiz()">BEGIN TODAY'S QUIZ →</button>
      <div class="prefetch-indicator" id="prefetchIndicator"></div>
      <div class="stats-row">
        <div class="stat-item"><div class="stat-num display" id="statSessions">0</div><div class="stat-label mono">Sessions</div></div>
        <div class="stat-item"><div class="stat-num display" id="statBest">—</div><div class="stat-label mono">Best score</div></div>
        <div class="stat-item"><div class="stat-num display" id="statStreak">0</div><div class="stat-label mono">Day streak</div></div>
        <div class="stat-item"><div class="stat-num display" id="statWrong">0</div><div class="stat-label mono">Wrong bank</div></div>
      </div>
    </div>
    <div id="wrongBankBlock" style="display:none;margin-top:1.5rem">
      <button class="wrong-bank-btn" onclick="startWrongBank()">
        <span>PRACTICE WRONG ANSWERS</span>
        <span class="wrong-bank-count mono" id="wrongBankCount">0</span>
      </button>
    </div>
    <div id="historyBlock"></div>
    <div id="errorBlock"></div>
  </div>

  <div class="screen" id="screenLoading">
    <div class="loading-wrap">
      <div class="loading-label mono">Building your quiz</div>
      <div class="loading-bar"></div>
      <div class="loading-msg display" id="loadMsg">Selecting historical market events…</div>
      <div class="loading-step mono" id="loadStep">GENERATING QUESTIONS</div>
    </div>
  </div>

  <div class="screen" id="screenQuiz">
    <div class="quiz-top">
      <div style="display:flex;align-items:center;gap:1rem">
        <div class="q-counter mono" id="qCounter">Q 1/10</div>
        <div class="streak-badge mono" id="streakBadge">🔥 0</div>
      </div>
      <div class="q-score-badge mono" id="qScore">0 / 0</div>
    </div>
    <div class="timer-row">
      <div class="timer-track"><div class="timer-fill" id="timerFill"></div></div>
      <div class="timer-label mono" id="timerLabel">30s</div>
    </div>
    <div id="chartArea"></div>
    <div class="q-meta">
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        <span class="q-cat-tag mono" id="qCatTag">MACRO</span>
        <span class="q-diff-tag mono" id="qDiffTag">VP</span>
      </div>
      <span class="q-source-tag mono" id="qSource"></span>
    </div>
    <div class="question-card">
      <span class="q-num-badge mono" id="qNumBadge">01</span>
      <p class="question-text display" id="questionText">Loading…</p>
    </div>
    <div class="options-list" id="optionsList"></div>
    <div id="postAnswerArea"></div>
    <div class="quiz-footer"><button class="btn-next" id="nextBtn" style="display:none" onclick="nextQuestion()">NEXT →</button></div>
  </div>

  <div class="screen" id="screenResult">
    <div id="resultCard"></div>
    <div class="action-row" id="actionRow"></div>
    <div id="breakdownSection"></div>
    <div class="review-section">
      <div class="review-header">FULL REVIEW — ALL QUESTIONS</div>
      <div id="reviewList"></div>
    </div>
  </div>
</div>

<script>
const LETTERS=['A','B','C','D'];
const TIMER_SEC=30;
const CACHE_TTL=4*60*60*1000;
const LOAD_MSGS=['Selecting historical market events…','Calibrating difficulty level…','Preparing chart datasets…','Generating questions from real data…','Composing answer options…'];

let questions=[],currentQ=0,score=0,answers=[];
let selectedCat='ALL',selectedDiff='VP';
let sessionStreak=0,maxSessionStreak=0;
let timerInterval=null,timeLeft=TIMER_SEC;
let isWrongBankMode=false,activeChart=null;

/* INIT */
(function(){
  document.getElementById('todayDate').textContent=new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).toUpperCase();
  loadStats();renderHistory();renderWrongBank();
  setTimeout(()=>prefetch('ALL','VP'),800);
})();

/* PREFETCH & CACHE */
function getCacheKey(cat,diff){return \`mq_qcache_\${cat}_\${diff}\`;}
function getCached(cat,diff){
  try{const c=JSON.parse(localStorage.getItem(getCacheKey(cat,diff)));if(c&&Date.now()-c.ts<CACHE_TTL)return c.questions;}catch(e){}
  return null;
}
function setCache(cat,diff,qs){
  try{localStorage.setItem(getCacheKey(cat,diff),JSON.stringify({questions:qs,ts:Date.now()}));}catch(e){}
}
function clearCache(cat,diff){try{localStorage.removeItem(getCacheKey(cat,diff));}catch(e){}}

async function prefetch(cat,diff){
  if(getCached(cat,diff)){setPrefetchReady();return;}
  setPrefetchLoading();
  try{
    const data=await fetchQuestions(cat,diff);
    if(data.questions&&data.questions.length>=4){setCache(cat,diff,data.questions);setPrefetchReady();}
  }catch(e){setPrefetchIdle();}
}

function setPrefetchLoading(){
  const el=document.getElementById('prefetchIndicator');
  if(el) el.innerHTML='<div class="prefetch-dot"></div><span>Preparing questions in background…</span>';
}
function setPrefetchReady(){
  const el=document.getElementById('prefetchIndicator');
  if(el) el.innerHTML='<span style="color:#000">✓ Questions ready — instant start</span>';
}
function setPrefetchIdle(){
  const el=document.getElementById('prefetchIndicator');
  if(el) el.innerHTML='';
}

/* FILTERS */
function selectCat(el,cat){
  document.querySelectorAll('#catRow .chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');selectedCat=cat;
  setPrefetchIdle();
  setTimeout(()=>prefetch(cat,selectedDiff),300);
}
function selectDiff(el,diff){
  document.querySelectorAll('[onclick*="selectDiff"]').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');selectedDiff=diff;
  document.getElementById('headerDiff').textContent=diff+' LEVEL';
  setPrefetchIdle();
  setTimeout(()=>prefetch(selectedCat,diff),300);
}

/* STATS */
function getStats(){return JSON.parse(localStorage.getItem('mq_stats4')||'{"sessions":0,"best":null,"streak":0,"lastPlay":null}');}
function getHistory(){return JSON.parse(localStorage.getItem('mq_history3')||'[]');}
function getWrongBank(){return JSON.parse(localStorage.getItem('mq_wrong3')||'[]');}

function loadStats(){
  const s=getStats(),wb=getWrongBank();
  document.getElementById('statSessions').textContent=s.sessions||'0';
  document.getElementById('statBest').textContent=s.best!=null?s.best+'/10':'—';
  document.getElementById('statStreak').textContent=s.streak||'0';
  document.getElementById('statWrong').textContent=wb.length||'0';
  const wbb=document.getElementById('wrongBankBlock');
  document.getElementById('wrongBankCount').textContent=wb.length;
  wbb.style.display=wb.length>0?'block':'none';
}

function saveSession(sc){
  const s=getStats();
  s.sessions=(s.sessions||0)+1;
  s.best=s.best!=null?Math.max(s.best,sc):sc;
  const today=new Date().toDateString(),yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  if(s.lastPlay===today){}
  else if(s.lastPlay===yesterday.toDateString())s.streak=(s.streak||0)+1;
  else s.streak=1;
  s.lastPlay=today;
  localStorage.setItem('mq_stats4',JSON.stringify(s));
  const h=getHistory();
  h.unshift({date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),score:sc,total:questions.length,cat:selectedCat,diff:selectedDiff,grade:calcGrade(sc,questions.length).grade});
  localStorage.setItem('mq_history3',JSON.stringify(h.slice(0,20)));
  if(!isWrongBankMode){
    const wb=getWrongBank();
    const existing=new Set(wb.map(w=>w.q.question));
    answers.filter(a=>!a.correct).forEach(a=>{if(!existing.has(a.q.question))wb.push({q:a.q});});
    const justRight=new Set(answers.filter(a=>a.correct).map(a=>a.q.question));
    localStorage.setItem('mq_wrong3',JSON.stringify(wb.filter(w=>!justRight.has(w.q.question)).slice(0,100)));
  }else{
    const wb=getWrongBank();
    const justRight=new Set(answers.filter(a=>a.correct).map(a=>a.q.question));
    localStorage.setItem('mq_wrong3',JSON.stringify(wb.filter(w=>!justRight.has(w.q.question))));
  }
}

function renderHistory(){
  const h=getHistory(),el=document.getElementById('historyBlock');
  if(!h.length){el.innerHTML='';return;}
  el.innerHTML=\`<div class="history-panel"><div class="history-label mono">RECENT SESSIONS<button class="history-clear" onclick="clearHistory()">CLEAR</button></div>\${h.slice(0,8).map(r=>\`<div class="history-row"><span class="h-date mono">\${r.date}</span><span class="h-cat mono">\${r.cat}·\${r.diff||'VP'}</span><span class="mono">\${r.score}/\${r.total}</span><span class="h-grade display">\${r.grade}</span></div>\`).join('')}</div>\`;
}
function renderWrongBank(){loadStats();}
function clearHistory(){localStorage.removeItem('mq_history3');document.getElementById('historyBlock').innerHTML='';}

/* NAVIGATION */
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function showStart(){stopTimer();destroyChart();showScreen('screenStart');loadStats();renderHistory();renderWrongBank();}

/* START */
async function startQuiz(){
  isWrongBankMode=false;
  document.getElementById('errorBlock').innerHTML='';

  const cached=getCached(selectedCat,selectedDiff);
  if(cached){
    questions=cached;
    currentQ=0;score=0;answers=[];sessionStreak=0;maxSessionStreak=0;
    clearCache(selectedCat,selectedDiff);
    renderQuestion();showScreen('screenQuiz');
    setTimeout(()=>prefetch(selectedCat,selectedDiff),3000);
    return;
  }

  showScreen('screenLoading');
  let mi=0;
  const iv=setInterval(()=>{document.getElementById('loadMsg').textContent=LOAD_MSGS[mi%LOAD_MSGS.length];mi++;},1600);
  try{
    const data=await fetchQuestions(selectedCat,selectedDiff);
    clearInterval(iv);
    questions=data.questions;
    if(!questions||questions.length<4)throw new Error('Too few questions returned. Please retry.');
    currentQ=0;score=0;answers=[];sessionStreak=0;maxSessionStreak=0;
    renderQuestion();showScreen('screenQuiz');
    setTimeout(()=>prefetch(selectedCat,selectedDiff),5000);
  }catch(e){
    clearInterval(iv);showStart();
    document.getElementById('errorBlock').innerHTML=\`<div class="error-box"><div class="error-title display">Failed to load questions</div><div class="error-msg">\${safe(e.message)}</div><button class="btn-secondary" onclick="startQuiz()">RETRY →</button></div>\`;
  }
}

async function startWrongBank(){
  const wb=getWrongBank();if(!wb.length)return;
  isWrongBankMode=true;
  questions=[...wb].sort(()=>Math.random()-0.5).slice(0,10).map(w=>w.q);
  currentQ=0;score=0;answers=[];sessionStreak=0;maxSessionStreak=0;
  document.getElementById('errorBlock').innerHTML='';
  renderQuestion();showScreen('screenQuiz');
}

async function fetchQuestions(cat,diff){
  const res=await fetch('/api/quiz',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:cat,difficulty:diff})});
  if(!res.ok){const j=await res.json().catch(()=>({}));throw new Error(j.error||\`Server error \${res.status}\`);}
  return res.json();
}

/* CHART */
function destroyChart(){if(activeChart){activeChart.destroy();activeChart=null;}}
function renderChart(chartData){
  destroyChart();
  const area=document.getElementById('chartArea');
  if(!chartData||!chartData.xLabels||!chartData.yValues){area.innerHTML='';return;}
  area.innerHTML=\`<div class="chart-block"><div class="chart-header"><div><div class="chart-title display">\${safe(chartData.title)}</div><div class="chart-period mono">\${safe(chartData.period)}</div></div><span class="chart-badge mono">CHART QUESTION</span></div><div class="chart-canvas-wrap"><canvas id="quizChart" height="200"></canvas></div></div>\`;
  const ctx=document.getElementById('quizChart').getContext('2d');
  activeChart=new Chart(ctx,{
    type:'line',
    data:{labels:chartData.xLabels,datasets:[{data:chartData.yValues,borderColor:'#000',borderWidth:2,pointBackgroundColor:'#000',pointBorderColor:'#000',pointRadius:4,pointHoverRadius:6,fill:false,tension:0.3}]},
    options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false},tooltip:{backgroundColor:'#000',titleColor:'#fff',bodyColor:'#fff',titleFont:{family:"'JetBrains Mono',monospace",size:10},bodyFont:{family:"'JetBrains Mono',monospace",size:11},padding:10,displayColors:false,callbacks:{label:ctx=>\`\${ctx.parsed.y} \${chartData.yLabel||''}\`}}},scales:{x:{grid:{color:'#e5e5e5',lineWidth:1},border:{color:'#000',width:1},ticks:{font:{family:"'JetBrains Mono',monospace",size:9},color:'#525252',maxRotation:45}},y:{grid:{color:'#e5e5e5',lineWidth:1},border:{color:'#000',width:1},ticks:{font:{family:"'JetBrains Mono',monospace",size:9},color:'#525252'},title:{display:true,text:chartData.yLabel||'',font:{family:"'JetBrains Mono',monospace",size:9},color:'#aaa'}}}}
  });
}

/* TIMER */
function startTimer(){stopTimer();timeLeft=TIMER_SEC;updateTimerUI();timerInterval=setInterval(()=>{timeLeft--;updateTimerUI();if(timeLeft<=0){stopTimer();handleTimeout();}},1000);}
function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}}
function updateTimerUI(){const pct=(timeLeft/TIMER_SEC*100).toFixed(1);const f=document.getElementById('timerFill');f.style.width=pct+'%';f.className='timer-fill'+(timeLeft<=10?' danger':timeLeft<=20?' warning':'');document.getElementById('timerLabel').textContent=timeLeft+'s';}
function handleTimeout(){
  const btns=document.querySelectorAll('.opt-btn');
  btns.forEach(b=>{b.setAttribute('disabled','');b.onclick=null;b.classList.add('timed-out');});
  btns[questions[currentQ].answer].classList.remove('timed-out');btns[questions[currentQ].answer].classList.add('correct');
  answers.push({q:questions[currentQ],chosen:-1,correct:false,timedOut:true});
  sessionStreak=0;updateStreakBadge();showPostAnswer(questions[currentQ],false,true);
  const nb=document.getElementById('nextBtn');nb.style.display='inline-block';nb.textContent=currentQ<questions.length-1?'NEXT →':'SEE RESULTS →';
}

/* RENDER */
function renderQuestion(){
  const q=questions[currentQ];
  destroyChart();
  document.getElementById('qCounter').textContent=\`Q \${currentQ+1}/\${questions.length}\`;
  document.getElementById('qScore').textContent=\`\${score} / \${currentQ}\`;
  document.getElementById('qCatTag').textContent=q.category||'MARKET';
  document.getElementById('qDiffTag').textContent=isWrongBankMode?'WRONG BANK':selectedDiff;
  document.getElementById('qSource').textContent=q.source||'';
  document.getElementById('qNumBadge').textContent=String(currentQ+1).padStart(2,'0');
  document.getElementById('questionText').textContent=q.question;
  document.getElementById('postAnswerArea').innerHTML='';
  document.getElementById('nextBtn').style.display='none';
  updateStreakBadge();
  renderChart(q.chart||null);
  const list=document.getElementById('optionsList');list.innerHTML='';
  q.options.forEach((opt,i)=>{
    const btn=document.createElement('button');btn.className='opt-btn';
    btn.innerHTML=\`<span class="opt-letter mono">\${LETTERS[i]}.</span><span>\${safe(opt)}</span>\`;
    btn.onclick=()=>selectAnswer(i,btn);list.appendChild(btn);
  });
  startTimer();
}

function updateStreakBadge(){const b=document.getElementById('streakBadge');if(sessionStreak>=3){b.style.display='inline-block';b.textContent=\`🔥 \${sessionStreak}\`;}else b.style.display='none';}

function selectAnswer(idx,clickedBtn){
  stopTimer();
  const q=questions[currentQ];
  const btns=document.querySelectorAll('.opt-btn');
  btns.forEach(b=>{b.setAttribute('disabled','');b.onclick=null;});
  const correct=idx===q.answer;
  if(correct){clickedBtn.classList.add('correct');score++;sessionStreak++;maxSessionStreak=Math.max(maxSessionStreak,sessionStreak);}
  else{clickedBtn.classList.add('wrong');btns[q.answer].classList.add('correct');sessionStreak=0;}
  answers.push({q,chosen:idx,correct,timedOut:false});
  document.getElementById('qScore').textContent=\`\${score} / \${currentQ+1}\`;
  updateStreakBadge();showPostAnswer(q,correct,false);
  const nb=document.getElementById('nextBtn');nb.style.display='inline-block';nb.textContent=currentQ<questions.length-1?'NEXT →':'SEE RESULTS →';
}

function showPostAnswer(q,correct,timedOut){
  const verb=timedOut?'⏱ TIME UP':correct?'✓ CORRECT':'✗ INCORRECT';
  const hl=q.headline?\`<div class="headline-reveal"><span class="headline-tag mono">EVENT</span><span class="headline-text">"\${safe(q.headline)}"</span></div>\`:'';
  document.getElementById('postAnswerArea').innerHTML=\`<div>\${hl}<div class="explanation"><div class="exp-label mono">\${verb} — ANALYSIS</div><div class="exp-text">\${safe(q.explanation||'')}</div></div></div>\`;
}

function nextQuestion(){currentQ++;if(currentQ>=questions.length){showResult();return;}renderQuestion();window.scrollTo({top:0,behavior:'smooth'});}

/* RESULT */
function calcGrade(sc,total){
  const p=Math.round(sc/total*100);
  if(p>=90)return{grade:'A+',tagline:'Exceptional market intelligence.',inv:true};
  if(p>=80)return{grade:'A',tagline:'You read the tape well.',inv:true};
  if(p>=70)return{grade:'B',tagline:'Solid. The desk would hire you.',inv:false};
  if(p>=60)return{grade:'C',tagline:'Good instincts. Study the macro.',inv:false};
  return{grade:'D',tagline:'More Bloomberg, less guessing.',inv:false};
}

function showResult(){
  stopTimer();destroyChart();saveSession(score);loadStats();renderHistory();
  const{grade,tagline,inv}=calcGrade(score,questions.length);
  const pct=Math.round(score/questions.length*100);const li=inv?'':' light';
  document.getElementById('resultCard').innerHTML=\`<div class="result-card\${inv?' inverted':''}"><div class="result-grade display">\${grade}</div><div class="result-tagline display">\${tagline}</div><div class="result-stats\${li}"><div class="rs-item\${li}"><div class="rs-num display">\${score}/\${questions.length}</div><div class="rs-label mono">Score</div></div><div class="rs-item\${li}"><div class="rs-num display">\${pct}%</div><div class="rs-label mono">Accuracy</div></div><div class="rs-item\${li}"><div class="rs-num display">\${maxSessionStreak}</div><div class="rs-label mono">Best streak</div></div><div class="rs-item\${li}"><div class="rs-num display">\${selectedDiff}</div><div class="rs-label mono">Level</div></div></div></div>\`;
  document.getElementById('actionRow').innerHTML=\`<button class="btn-primary" onclick="startQuiz()">PLAY AGAIN →</button><button class="btn-secondary" onclick="showStart()">CHANGE SETTINGS</button><button class="btn-share" onclick="shareResult('\${grade}',\${score},\${questions.length})">COPY SCORE CARD</button><div class="share-confirm mono" id="shareFeedback">✓ Copied to clipboard</div>\`;
  renderBreakdown();
  document.getElementById('reviewList').innerHTML=answers.map((a,i)=>\`<div class="review-item"><div class="ri-q display">\${i+1}. \${safe(a.q.question)}\${a.q.chart?'<span class="ri-chart-tag mono">CHART</span>':''}</div><div class="ri-ans-row"><span class="ri-marker \${a.timedOut?'no':a.correct?'ok':'no'} mono">\${a.timedOut?'TIMEOUT':a.correct?'CORRECT':'WRONG'}</span><span>\${safe(a.q.options[a.q.answer])}</span></div>\${!a.correct&&!a.timedOut?\`<div class="ri-ans-row"><span class="ri-marker no mono">YOUR ANSWER</span><span>\${safe(a.q.options[a.chosen])}</span></div>\`:''} \${a.q.headline?\`<div class="ri-headline">"\${safe(a.q.headline)}"</div>\`:''}<div class="ri-exp">\${safe(a.q.explanation||'')}</div></div>\`).join('');
  showScreen('screenResult');
}

function renderBreakdown(){
  const cats=['MACRO','FX','RATES','EQUITY','COMMODITIES'],stats={};
  cats.forEach(c=>{stats[c]={correct:0,total:0};});
  answers.forEach(a=>{const c=a.q.category||'OTHER';if(!stats[c])stats[c]={correct:0,total:0};stats[c].total++;if(a.correct)stats[c].correct++;});
  const rows=cats.filter(c=>stats[c]&&stats[c].total>0).map(c=>{const p=Math.round(stats[c].correct/stats[c].total*100);return\`<div class="cat-bar-row"><span class="cat-bar-label mono">\${c}</span><div class="cat-bar-track"><div class="cat-bar-fill" style="width:\${p}%"></div></div><span class="cat-bar-pct mono">\${stats[c].correct}/\${stats[c].total}</span></div>\`;}).join('');
  document.getElementById('breakdownSection').innerHTML=rows?\`<div class="breakdown-section"><div class="section-title">PERFORMANCE BY CATEGORY</div><div class="cat-bars">\${rows}</div></div>\`:'';
}

function shareResult(grade,sc,total){
  const pct=Math.round(sc/total*100);
  const date=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  const grid=answers.map(a=>a.timedOut?'🟥':a.correct?'🟩':'🟥').join('');
  const text=\`MARKET QUIZ — \${date}\\nGrade: \${grade} · \${sc}/\${total} (\${pct}%)\\n\${selectedCat} · \${selectedDiff}\\n\\n\${grid}\`;
  navigator.clipboard.writeText(text).then(()=>{const el=document.getElementById('shareFeedback');if(el){el.style.display='flex';setTimeout(()=>el.style.display='none',2500);}}).catch(()=>alert(text));
}

function safe(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
</script>
</body>
</html>
`;

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(INDEX_HTML);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Market Quiz running on port ${PORT}`);
  warmCache(); // Pre-generate questions on startup
});

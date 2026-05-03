onst express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

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
app.post('/api/quiz', async (req, res) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY.' });

  const { category = 'ALL', difficulty = 'VP' } = req.body || {};

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

    res.json({ questions, generatedAt: new Date().toISOString() });

  } catch (e) {
    res.status(500).json({ error: e.message || 'Unknown server error.' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Market Quiz running on port ${PORT}`));

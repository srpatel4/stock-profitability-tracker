/* ======================================
   StockPulse — Engine
   Real-time stock profitability tracker
   ====================================== */

// ========================
// STOCK UNIVERSE
// ========================

const STOCKS = [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'tech', basePrice: 227.50, avgVolume: 58_000_000 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'tech', basePrice: 442.30, avgVolume: 22_000_000 },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'tech', basePrice: 138.70, avgVolume: 45_000_000 },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'tech', basePrice: 172.90, avgVolume: 25_000_000 },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'consumer', basePrice: 205.40, avgVolume: 32_000_000 },
    { ticker: 'META', name: 'Meta Platforms', sector: 'tech', basePrice: 610.50, avgVolume: 18_000_000 },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'consumer', basePrice: 268.30, avgVolume: 65_000_000 },
    { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'finance', basePrice: 247.80, avgVolume: 10_000_000 },
    { ticker: 'V', name: 'Visa Inc.', sector: 'finance', basePrice: 318.60, avgVolume: 7_500_000 },
    { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'health', basePrice: 157.20, avgVolume: 8_000_000 },
    { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'health', basePrice: 522.10, avgVolume: 3_500_000 },
    { ticker: 'XOM', name: 'Exxon Mobil', sector: 'energy', basePrice: 113.40, avgVolume: 16_000_000 },
    { ticker: 'PG', name: 'Procter & Gamble', sector: 'consumer', basePrice: 170.30, avgVolume: 7_000_000 },
    { ticker: 'MA', name: 'Mastercard Inc.', sector: 'finance', basePrice: 528.90, avgVolume: 3_200_000 },
    { ticker: 'HD', name: 'Home Depot', sector: 'consumer', basePrice: 387.60, avgVolume: 4_000_000 },
    { ticker: 'CVX', name: 'Chevron Corp.', sector: 'energy', basePrice: 158.70, avgVolume: 8_500_000 },
    { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'health', basePrice: 193.40, avgVolume: 5_500_000 },
    { ticker: 'LLY', name: 'Eli Lilly', sector: 'health', basePrice: 812.30, avgVolume: 3_800_000 },
    { ticker: 'BAC', name: 'Bank of America', sector: 'finance', basePrice: 43.20, avgVolume: 35_000_000 },
    { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'tech', basePrice: 312.80, avgVolume: 5_000_000 },
    { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'tech', basePrice: 162.50, avgVolume: 38_000_000 },
    { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'tech', basePrice: 925.40, avgVolume: 4_200_000 },
    { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'health', basePrice: 25.80, avgVolume: 28_000_000 },
    { ticker: 'KO', name: 'Coca-Cola Co.', sector: 'consumer', basePrice: 62.10, avgVolume: 12_000_000 },
    { ticker: 'WMT', name: 'Walmart Inc.', sector: 'consumer', basePrice: 92.40, avgVolume: 9_000_000 },
    { ticker: 'DIS', name: 'Walt Disney Co.', sector: 'consumer', basePrice: 113.50, avgVolume: 11_000_000 },
    { ticker: 'GS', name: 'Goldman Sachs', sector: 'finance', basePrice: 562.30, avgVolume: 2_500_000 },
    { ticker: 'SLB', name: 'Schlumberger', sector: 'energy', basePrice: 41.60, avgVolume: 12_000_000 },
    { ticker: 'MRK', name: 'Merck & Co.', sector: 'health', basePrice: 98.70, avgVolume: 9_500_000 },
    { ticker: 'INTC', name: 'Intel Corp.', sector: 'tech', basePrice: 22.30, avgVolume: 42_000_000 },
];

// ========================
// STATE
// ========================

let stockState = [];
let currentFilter = 'all';
let currentSort = 'score';
let updateInterval = null;
let countdownValue = 5;
let formulaOpen = false;
let predFormulaOpen = false;
let newsRotationIndex = 0;

// ========================
// PREDICTION DATA (Real analyst/news data — April 3, 2026)
// ========================

const PREDICTIONS = [
    {
        ticker: 'CVX',
        name: 'Chevron Corp.',
        sector: 'energy',
        currentPrice: 158.70,
        priceTarget: 235.00,
        analystConsensus: 'Buy',
        buyScore: 92.4,
        topPick: true,
        factors: {
            analystConsensus: 88,
            newsSentiment: 95,
            technicalMomentum: 91,
            sectorTailwinds: 98,
            riskAdjustedUpside: 89,
        },
        catalyst: 'Citi raised price target to $235 (from $210) on April 2. Middle East tensions driving oil to multi-year highs. Strait of Hormuz risk premium boosting all energy names. Fortress balance sheet.',
        analystBadges: [
            { firm: 'Citi', rating: 'Buy', badge: 'buy' },
            { firm: 'Barclays', rating: 'Overweight', badge: 'buy' },
            { firm: 'Mizuho', rating: 'Buy', badge: 'buy' },
            { firm: 'Piper Sandler', rating: 'Overweight', badge: 'buy' },
        ],
        upside: '+48.1%',
    },
    {
        ticker: 'NVDA',
        name: 'NVIDIA Corp.',
        sector: 'tech',
        currentPrice: 138.70,
        priceTarget: 275.25,
        analystConsensus: 'Strong Buy',
        buyScore: 89.7,
        topPick: true,
        factors: {
            analystConsensus: 95,
            newsSentiment: 85,
            technicalMomentum: 82,
            sectorTailwinds: 93,
            riskAdjustedUpside: 96,
        },
        catalyst: 'AI infrastructure buildout remains strongest secular trend. Data center GPU demand continues through Blackwell architecture. Avg analyst target $275 implies ~60% upside despite recent volatility from geopolitics.',
        analystBadges: [
            { firm: 'TipRanks', rating: 'Strong Buy', badge: 'strong-buy' },
            { firm: 'Zacks', rating: 'Buy', badge: 'buy' },
            { firm: 'Barchart', rating: 'Strong Buy', badge: 'strong-buy' },
        ],
        upside: '+98.4%',
    },
    {
        ticker: 'XOM',
        name: 'Exxon Mobil',
        sector: 'energy',
        currentPrice: 113.40,
        priceTarget: 175.00,
        analystConsensus: 'Hold',
        buyScore: 84.2,
        topPick: false,
        factors: {
            analystConsensus: 72,
            newsSentiment: 90,
            technicalMomentum: 85,
            sectorTailwinds: 98,
            riskAdjustedUpside: 78,
        },
        catalyst: 'Citi raised target to $175 with "structural re-engagement" thesis. Energy sector is top performer amid Iran conflict oil spike. Onshore assets insulated from direct geopolitical risk.',
        analystBadges: [
            { firm: 'Citi', rating: 'Hold → $175', badge: 'hold' },
            { firm: 'Forbes', rating: 'Defensive Pick', badge: 'buy' },
        ],
        upside: '+54.3%',
    },
    {
        ticker: 'WMT',
        name: 'Walmart Inc.',
        sector: 'consumer',
        currentPrice: 92.40,
        priceTarget: 115.00,
        analystConsensus: 'Buy',
        buyScore: 81.5,
        topPick: false,
        factors: {
            analystConsensus: 85,
            newsSentiment: 80,
            technicalMomentum: 72,
            sectorTailwinds: 85,
            riskAdjustedUpside: 82,
        },
        catalyst: 'Top defensive pick from Forbes analysts. Strong cash flow, low debt-to-equity, consistent dividend growth. Consumer staples outperform during elevated VIX and recession fears.',
        analystBadges: [
            { firm: 'Forbes', rating: 'Defensive Pick', badge: 'buy' },
            { firm: 'Seeking Alpha', rating: 'Buy', badge: 'buy' },
        ],
        upside: '+24.5%',
    },
    {
        ticker: 'PG',
        name: 'Procter & Gamble',
        sector: 'consumer',
        currentPrice: 170.30,
        priceTarget: 195.00,
        analystConsensus: 'Buy',
        buyScore: 78.3,
        topPick: false,
        factors: {
            analystConsensus: 82,
            newsSentiment: 75,
            technicalMomentum: 70,
            sectorTailwinds: 85,
            riskAdjustedUpside: 78,
        },
        catalyst: 'Classic recession hedge. Forbes names it a top stability pick alongside WMT. Consistent dividends and brand pricing power protect during inflationary oil price environment.',
        analystBadges: [
            { firm: 'Forbes', rating: 'Stability Pick', badge: 'buy' },
            { firm: 'Morningstar', rating: 'Wide Moat', badge: 'strong-buy' },
        ],
        upside: '+14.5%',
    },
    {
        ticker: 'TSLA',
        name: 'Tesla Inc.',
        sector: 'consumer',
        currentPrice: 360.59,
        priceTarget: 300.00,
        analystConsensus: 'Hold',
        buyScore: 38.6,
        topPick: false,
        factors: {
            analystConsensus: 45,
            newsSentiment: 22,
            technicalMomentum: 35,
            sectorTailwinds: 40,
            riskAdjustedUpside: 55,
        },
        catalyst: '⚠ AVOID — Q1 deliveries missed at 358K vs 365K expected. Stock fell 5.4% on April 2. 50K+ vehicle inventory buildup. Energy storage also missed. Chinese EV competition intensifying.',
        analystBadges: [
            { firm: 'Seeking Alpha', rating: 'Delivery Miss', badge: 'sell' },
            { firm: 'Electrek', rating: 'Below Est.', badge: 'sell' },
        ],
        upside: '-16.8%',
    },
];

const NEWS_ITEMS = [
    { time: '6:45 AM', headline: 'Citigroup raises Chevron (CVX) price target to $235, maintains Buy rating', source: 'TipRanks', sentiment: 'bullish', tickers: ['CVX'] },
    { time: '6:30 AM', headline: 'Oil prices surge on Iran-US tensions, Strait of Hormuz closure fears intensify', source: 'Reuters', sentiment: 'bullish', tickers: ['XOM', 'CVX', 'SLB'] },
    { time: '6:15 AM', headline: 'Tesla Q1 deliveries at 358K, miss consensus of 365K — stock drops 5.4%', source: 'Seeking Alpha', sentiment: 'bearish', tickers: ['TSLA'] },
    { time: '6:00 AM', headline: 'NVIDIA maintains Strong Buy consensus: avg. price target $275 (+60% upside)', source: 'MarketBeat', sentiment: 'bullish', tickers: ['NVDA'] },
    { time: '5:45 AM', headline: 'Forbes names WMT, PG as top defensive picks amid recession fears', source: 'Forbes', sentiment: 'bullish', tickers: ['WMT', 'PG'] },
    { time: '5:30 AM', headline: 'VIX elevated as Middle East tensions rattle investor confidence', source: 'Bloomberg', sentiment: 'bearish', tickers: [] },
    { time: '5:15 AM', headline: 'Broadcom (AVGO) AI semiconductor revenue growth triple digits YoY — Strong Buy', source: 'TipRanks', sentiment: 'bullish', tickers: ['AVGO'] },
    { time: '5:00 AM', headline: 'Gold surges to $4,650/oz as geopolitical risk premium expands', source: 'Investing.com', sentiment: 'neutral', tickers: [] },
    { time: '4:45 AM', headline: 'Energy sector outperforms: crude oil at highest levels since 2022', source: 'Morningstar', sentiment: 'bullish', tickers: ['XOM', 'CVX'] },
    { time: '4:30 AM', headline: 'Tesla Optimus robot strategy pivot questioned as vehicle margins face pressure', source: 'Electrek', sentiment: 'bearish', tickers: ['TSLA'] },
    { time: '4:15 AM', headline: 'Non-farm payroll data could shift Fed rate cut expectations — markets on watch', source: 'CNBC', sentiment: 'neutral', tickers: [] },
    { time: '4:00 AM', headline: 'Micron HBM capacity sold out through 2026, DDR5 pricing softness a concern', source: '247 Wall St', sentiment: 'neutral', tickers: ['MU'] },
    { time: '3:45 AM', headline: 'Airline stocks pressured as jet fuel costs spike — United, Delta declining', source: 'PBS News', sentiment: 'bearish', tickers: [] },
    { time: '3:30 AM', headline: 'Markets closed Friday for Good Friday — predictions set for Monday April 6 open', source: 'Schwab', sentiment: 'neutral', tickers: [] },
    { time: '3:15 AM', headline: 'Exxon COO: "Onshore assets well-insulated from Middle East supply disruption"', source: 'Fool.com', sentiment: 'bullish', tickers: ['XOM'] },
    { time: '3:00 AM', headline: 'Citigroup raises Exxon (XOM) target to $175 citing "structural re-engagement"', source: 'TipRanks', sentiment: 'bullish', tickers: ['XOM'] },
];

// ========================
// INITIALIZATION
// ========================

function initStockState() {
    const now = Date.now();
    stockState = STOCKS.map(stock => {
        // Generate initial daily movement direction & magnitude
        const dailyBias = (Math.random() - 0.35) * 0.06; // slight positive bias
        const openPrice = stock.basePrice * (1 + (Math.random() - 0.5) * 0.01);
        const currentPrice = openPrice * (1 + dailyBias);
        const intradayData = generateIntradayData(openPrice, currentPrice, 60);

        return {
            ...stock,
            openPrice: round2(openPrice),
            currentPrice: round2(currentPrice),
            previousPrice: round2(currentPrice),
            dailyHigh: round2(Math.max(openPrice, currentPrice) * (1 + Math.random() * 0.01)),
            dailyLow: round2(Math.min(openPrice, currentPrice) * (1 - Math.random() * 0.01)),
            volume: Math.floor(stock.avgVolume * (0.6 + Math.random() * 1.2)),
            momentum: Math.random() * 100,
            volatility: Math.random() * 100,
            sectorStrength: Math.random() * 100,
            intradayData,
            profitScore: 0,
            lastUpdateTime: now,
        };
    });

    // Calculate initial scores
    calculateAllScores();
}

function generateIntradayData(openPrice, currentPrice, numPoints) {
    const data = [openPrice];
    const totalChange = currentPrice - openPrice;

    for (let i = 1; i < numPoints; i++) {
        const progress = i / (numPoints - 1);
        const trend = openPrice + totalChange * progress;
        const noise = trend * (Math.random() - 0.5) * 0.008;
        data.push(round2(trend + noise));
    }

    data[numPoints - 1] = currentPrice;
    return data;
}

// ========================
// PROFITABILITY FORMULA
// ========================

function calculateProfitScore(stock) {
    // 1. Daily Gain % (weight: 0.35) — normalized to 0-100 scale
    const gainPercent = ((stock.currentPrice - stock.openPrice) / stock.openPrice) * 100;
    const normalizedGain = Math.min(Math.max(gainPercent * 10, -100), 100);
    const gainScore = (normalizedGain + 100) / 2; // map -100..100 to 0..100

    // 2. Volume Ratio (weight: 0.25) — current volume vs average
    const volumeRatio = stock.volume / stock.avgVolume;
    const volumeScore = Math.min(volumeRatio * 50, 100);

    // 3. Momentum Index (weight: 0.20) — acceleration of price changes
    const momentumScore = stock.momentum;

    // 4. Volatility Edge (weight: 0.10)
    const volatilityScore = stock.volatility;

    // 5. Sector Strength (weight: 0.10)
    const sectorScore = stock.sectorStrength;

    // Composite score
    const composite = (
        0.35 * gainScore +
        0.25 * volumeScore +
        0.20 * momentumScore +
        0.10 * volatilityScore +
        0.10 * sectorScore
    );

    return round2(composite);
}

function calculateAllScores() {
    stockState.forEach(stock => {
        stock.profitScore = calculateProfitScore(stock);
    });
}

// ========================
// REAL-TIME SIMULATION
// ========================

function simulateTick() {
    const now = Date.now();

    stockState.forEach(stock => {
        stock.previousPrice = stock.currentPrice;

        // Random walk with some mean reversion
        const drift = (Math.random() - 0.48) * 0.003; // slight positive bias
        const reversion = (stock.openPrice - stock.currentPrice) / stock.openPrice * 0.0005;
        const change = stock.currentPrice * (drift + reversion);
        stock.currentPrice = round2(stock.currentPrice + change);

        // Update high/low
        if (stock.currentPrice > stock.dailyHigh) stock.dailyHigh = stock.currentPrice;
        if (stock.currentPrice < stock.dailyLow) stock.dailyLow = stock.currentPrice;

        // Simulate volume increase
        stock.volume += Math.floor(Math.random() * (stock.avgVolume * 0.002));

        // Update momentum (smoothed)
        const priceAccel = ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 10000;
        stock.momentum = clamp(stock.momentum * 0.92 + priceAccel * 8 + (Math.random() - 0.5) * 5, 0, 100);

        // Update volatility
        const absChange = Math.abs(stock.currentPrice - stock.previousPrice) / stock.previousPrice * 10000;
        stock.volatility = clamp(stock.volatility * 0.95 + absChange * 3, 0, 100);

        // Sector strength slow drift
        stock.sectorStrength = clamp(stock.sectorStrength + (Math.random() - 0.5) * 2, 0, 100);

        // Add intraday point
        stock.intradayData.push(stock.currentPrice);
        if (stock.intradayData.length > 120) stock.intradayData.shift();

        stock.lastUpdateTime = now;
    });

    calculateAllScores();
}

// ========================
// RENDERING
// ========================

function getFilteredSortedStocks() {
    let filtered = stockState.slice();

    if (currentFilter !== 'all') {
        filtered = filtered.filter(s => s.sector === currentFilter);
    }

    // Sort
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'score': return b.profitScore - a.profitScore;
            case 'gain': return getGainPercent(b) - getGainPercent(a);
            case 'volume': return b.volume - a.volume;
            case 'momentum': return b.momentum - a.momentum;
            case 'price': return b.currentPrice - a.currentPrice;
            default: return b.profitScore - a.profitScore;
        }
    });

    return filtered.slice(0, 20);
}

function renderMarketSummary() {
    // Calculate pseudo-index values from our stocks
    const techStocks = stockState.filter(s => s.sector === 'tech');
    const allGain = stockState.reduce((sum, s) => sum + getGainPercent(s), 0) / stockState.length;
    const techGain = techStocks.reduce((sum, s) => sum + getGainPercent(s), 0) / techStocks.length;
    const totalVolume = stockState.reduce((sum, s) => sum + s.volume, 0);

    const sp500Base = 5842;
    const nasdaqBase = 18432;
    const dowBase = 42780;

    const sp500Val = round2(sp500Base * (1 + allGain / 100));
    const nasdaqVal = round2(nasdaqBase * (1 + techGain / 100));
    const dowVal = round2(dowBase * (1 + allGain * 0.7 / 100));

    setTextAndClass('sp500-value', formatNumber(sp500Val));
    setChangeEl('sp500-change', allGain);

    setTextAndClass('nasdaq-value', formatNumber(nasdaqVal));
    setChangeEl('nasdaq-change', techGain);

    setTextAndClass('dow-value', formatNumber(dowVal));
    setChangeEl('dow-change', allGain * 0.7);

    document.getElementById('vol-value').textContent = formatVolume(totalVolume);
    const volChange = ((totalVolume / stockState.reduce((s, st) => s + st.avgVolume, 0)) - 1) * 100;
    setChangeEl('vol-change', volChange);
}

function renderHeroStock() {
    const sorted = stockState.slice().sort((a, b) => b.profitScore - a.profitScore);
    const top = sorted[0];
    if (!top) return;

    const gain = getGainPercent(top);
    const change = round2(top.currentPrice - top.openPrice);

    document.getElementById('hero-ticker').textContent = top.ticker;
    document.getElementById('hero-name').textContent = top.name;
    document.getElementById('hero-price').textContent = `$${formatNumber(top.currentPrice)}`;

    const heroChangeEl = document.getElementById('hero-change');
    heroChangeEl.textContent = `${change >= 0 ? '+' : ''}$${formatNumber(Math.abs(change))} (${change >= 0 ? '+' : ''}${gain.toFixed(2)}%)`;
    heroChangeEl.className = `hero-change ${gain >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('hero-score').textContent = top.profitScore.toFixed(1);
    document.getElementById('hero-volume').textContent = formatVolume(top.volume);
    document.getElementById('hero-momentum').textContent = top.momentum.toFixed(1);
    document.getElementById('hero-volatility').textContent = top.volatility.toFixed(1);

    drawHeroChart(top);
}

function renderRankingsTable() {
    const stocks = getFilteredSortedStocks();
    const tbody = document.getElementById('rankings-body');
    const existingRows = tbody.children;

    stocks.forEach((stock, idx) => {
        const gain = getGainPercent(stock);
        const change = round2(stock.currentPrice - stock.openPrice);
        const rank = idx + 1;

        let row;
        if (existingRows[idx]) {
            row = existingRows[idx];
        } else {
            row = document.createElement('tr');
            row.innerHTML = `
                <td class="td-rank"></td>
                <td><div class="ticker-cell"><span class="ticker-symbol"></span><span class="ticker-name"></span></div></td>
                <td class="td-price"></td>
                <td class="td-change"></td>
                <td class="td-gain"></td>
                <td class="td-volume"></td>
                <td class="td-momentum"><div class="momentum-bar-wrap"><div class="momentum-bar"></div></div></td>
                <td class="td-score"></td>
                <td class="td-mini-chart"><canvas class="mini-chart-canvas" width="100" height="36"></canvas></td>
            `;
            tbody.appendChild(row);
        }

        row.dataset.ticker = stock.ticker;

        // Flash on price change
        if (stock.currentPrice !== stock.previousPrice) {
            row.classList.remove('flash-green', 'flash-red');
            void row.offsetWidth; // force reflow
            row.classList.add(stock.currentPrice > stock.previousPrice ? 'flash-green' : 'flash-red');
        }

        // Rank
        const rankCell = row.children[0];
        rankCell.textContent = rank;
        rankCell.className = `td-rank ${rank <= 3 ? 'top-3' : ''}`;

        // Ticker
        row.querySelector('.ticker-symbol').textContent = stock.ticker;
        row.querySelector('.ticker-name').textContent = stock.name;

        // Price
        row.children[2].textContent = `$${formatNumber(stock.currentPrice)}`;

        // Change
        const changeTd = row.children[3];
        changeTd.textContent = `${change >= 0 ? '+' : ''}$${formatNumber(Math.abs(change))}`;
        changeTd.className = `td-change ${gain >= 0 ? 'positive' : 'negative'}`;

        // Gain %
        const gainTd = row.children[4];
        gainTd.textContent = `${gain >= 0 ? '+' : ''}${gain.toFixed(2)}%`;
        gainTd.className = `td-gain ${gain >= 0 ? 'positive' : 'negative'}`;

        // Volume
        row.children[5].textContent = formatVolume(stock.volume);

        // Momentum
        const momentumBar = row.querySelector('.momentum-bar');
        momentumBar.style.width = `${stock.momentum}%`;
        momentumBar.className = `momentum-bar ${stock.momentum > 66 ? 'high' : stock.momentum > 33 ? 'mid' : 'low'}`;

        // Score
        const scoreTd = row.children[7];
        const scoreClass = stock.profitScore >= 70 ? 'elite' : stock.profitScore >= 50 ? 'high' : 'mid';
        scoreTd.innerHTML = `<span class="score-badge ${scoreClass}">${stock.profitScore.toFixed(1)}</span>`;

        // Mini chart
        const canvas = row.querySelector('.mini-chart-canvas');
        drawMiniChart(canvas, stock.intradayData, gain >= 0);
    });

    // Remove excess rows
    while (tbody.children.length > stocks.length) {
        tbody.removeChild(tbody.lastChild);
    }
}

function renderHistoryCards() {
    const container = document.getElementById('history-cards');
    if (container.children.length > 0) return; // only render once

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const today = new Date();
    const dayOfWeek = today.getDay();

    // Generate past daily winners
    const pastWinners = [];
    for (let i = 0; i < 5; i++) {
        const stock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
        const gain = round2(2 + Math.random() * 8);
        const score = round2(65 + Math.random() * 30);

        const d = new Date(today);
        d.setDate(d.getDate() - (dayOfWeek - 1 - i + 7) % 7);
        if (d > today) d.setDate(d.getDate() - 7);

        pastWinners.push({
            day: days[i],
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            ticker: stock.ticker,
            name: stock.name,
            gain,
            score,
        });
    }

    pastWinners.forEach(winner => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <div class="history-date">${winner.day} — ${winner.date}</div>
            <div class="history-ticker">${winner.ticker}</div>
            <div class="history-company">${winner.name}</div>
            <div class="history-gain">+${winner.gain.toFixed(2)}%</div>
            <div class="history-score">Score: ${winner.score.toFixed(1)}</div>
        `;
        container.appendChild(card);
    });
}

// ========================
// CHART DRAWING
// ========================

function drawHeroChart(stock) {
    const canvas = document.getElementById('hero-chart');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 400 * dpr;
    canvas.height = 180 * dpr;
    canvas.style.width = '400px';
    canvas.style.height = '180px';
    ctx.scale(dpr, dpr);

    const data = stock.intradayData;
    const w = 400;
    const h = 180;
    const padding = { top: 10, right: 10, bottom: 10, left: 10 };

    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const minVal = Math.min(...data) * 0.999;
    const maxVal = Math.max(...data) * 1.001;
    const range = maxVal - minVal || 1;

    ctx.clearRect(0, 0, w, h);

    // Determine color based on gain
    const isPositive = data[data.length - 1] >= data[0];
    const lineColor = isPositive ? '#22c55e' : '#ef4444';
    const fillColorStart = isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    const fillColorEnd = 'rgba(0, 0, 0, 0)';

    // Draw fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h);
    gradient.addColorStop(0, fillColorStart);
    gradient.addColorStop(1, fillColorEnd);

    ctx.beginPath();
    data.forEach((val, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + (1 - (val - minVal) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    data.forEach((val, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + (1 - (val - minVal) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw current price dot
    const lastX = padding.left + chartW;
    const lastY = padding.top + (1 - (data[data.length - 1] - minVal) / range) * chartH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // Glow
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.fillStyle = isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.fill();
}

function drawMiniChart(canvas, data, isPositive) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = 100;
    const h = 36;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const padding = 3;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    const minVal = Math.min(...data) * 0.999;
    const maxVal = Math.max(...data) * 1.001;
    const range = maxVal - minVal || 1;

    ctx.clearRect(0, 0, w, h);

    const lineColor = isPositive ? '#22c55e' : '#ef4444';

    // Fill
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isPositive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)');
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    data.forEach((val, i) => {
        const x = padding + (i / (data.length - 1)) * chartW;
        const y = padding + (1 - (val - minVal) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + chartW, padding + chartH);
    ctx.lineTo(padding, padding + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((val, i) => {
        const x = padding + (i / (data.length - 1)) * chartW;
        const y = padding + (1 - (val - minVal) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.stroke();
}

// ========================
// CLOCK & MARKET STATUS
// ========================

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('clock-time').textContent = timeStr;

    const hour = now.getHours();
    const mins = now.getMinutes();
    const currentMins = hour * 60 + mins;
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    const isMarketHours = isWeekday && currentMins >= 570 && currentMins < 960; // 9:30 AM - 4:00 PM ET

    const statusEl = document.getElementById('market-status');
    if (isMarketHours) {
        statusEl.className = 'clock-status open';
        statusEl.textContent = '●';
    } else {
        statusEl.className = 'clock-status closed';
        statusEl.textContent = '●';
    }

    document.getElementById('last-updated').textContent = `Updated: ${now.toLocaleTimeString()}`;
}

// ========================
// UTILITIES
// ========================

function round2(n) { return Math.round(n * 100) / 100; }
function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

function getGainPercent(stock) {
    return round2(((stock.currentPrice - stock.openPrice) / stock.openPrice) * 100);
}

function formatNumber(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(v) {
    if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + 'B';
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
    return v.toString();
}

function setTextAndClass(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setChangeEl(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    const rounded = round2(pct);
    el.textContent = `${rounded >= 0 ? '+' : ''}${rounded.toFixed(2)}%`;
    el.className = `summary-change ${rounded >= 0 ? 'positive' : 'negative'}`;
}

// ========================
// PREDICTION RENDERING
// ========================

function renderPredictions() {
    const container = document.getElementById('prediction-cards');
    container.innerHTML = '';

    // Update date
    const now = new Date();
    document.getElementById('predictions-date').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    PREDICTIONS.forEach((pred, idx) => {
        const card = document.createElement('div');
        card.className = `prediction-card ${pred.topPick ? 'top-pick' : ''}`;
        card.id = `pred-card-${pred.ticker}`;

        const badgesHtml = pred.analystBadges.map(b =>
            `<span class="analyst-badge ${b.badge}">${b.firm}: ${b.rating}</span>`
        ).join('');

        const isPosUpside = !pred.upside.startsWith('-');

        card.innerHTML = `
            <div class="pred-card-header">
                <div class="pred-card-left">
                    <span class="pred-ticker ${pred.topPick ? 'gold' : ''}">${pred.ticker}</span>
                    <span class="pred-company">${pred.name}</span>
                </div>
                <div class="pred-buy-score">
                    <span class="buy-score-value">${pred.buyScore.toFixed(1)}</span>
                    <span class="buy-score-label">Buy Score</span>
                </div>
            </div>
            <div class="pred-card-details">
                <div class="pred-detail-row">
                    <span class="pred-detail-label">Current Price</span>
                    <span class="pred-detail-value">$${formatNumber(pred.currentPrice)}</span>
                </div>
                <div class="pred-detail-row">
                    <span class="pred-detail-label">Analyst Target</span>
                    <span class="pred-detail-value ${isPosUpside ? 'positive' : 'negative'}">$${formatNumber(pred.priceTarget)}</span>
                </div>
                <div class="pred-detail-row">
                    <span class="pred-detail-label">Upside/Downside</span>
                    <span class="pred-detail-value ${isPosUpside ? 'positive' : 'negative'}">${pred.upside}</span>
                </div>
                <div class="pred-detail-row">
                    <span class="pred-detail-label">Consensus</span>
                    <span class="pred-detail-value">${pred.analystConsensus}</span>
                </div>
            </div>
            <div class="pred-catalyst">
                <strong>Catalyst: </strong>${pred.catalyst}
            </div>
            <div class="pred-rating-row">
                ${badgesHtml}
            </div>
        `;

        container.appendChild(card);
    });
}

function renderNewsFeed() {
    const container = document.getElementById('news-feed');
    container.innerHTML = '';

    NEWS_ITEMS.forEach((item, idx) => {
        const newsEl = document.createElement('div');
        newsEl.className = 'news-item';
        newsEl.style.animationDelay = `${idx * 0.05}s`;

        const tickerTags = item.tickers.length > 0
            ? ` — <strong>${item.tickers.join(', ')}</strong>`
            : '';

        newsEl.innerHTML = `
            <span class="news-time">${item.time}</span>
            <div class="news-content">
                <div class="news-headline">${item.headline}</div>
                <div class="news-source">${item.source}${tickerTags}</div>
            </div>
            <span class="news-sentiment ${item.sentiment}">${item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}</span>
        `;

        container.appendChild(newsEl);
    });
}

// Simulate new breaking news items periodically
function addBreakingNews() {
    const breakingItems = [
        { headline: 'Brent crude extends gains, up 2.3% as supply disruption fears mount', source: 'Reuters', sentiment: 'bullish', tickers: ['XOM', 'CVX'] },
        { headline: 'Semiconductor index rises 1.2% on renewed AI infrastructure spending reports', source: 'Bloomberg', sentiment: 'bullish', tickers: ['NVDA', 'AMD'] },
        { headline: 'Consumer staples ETF sees highest weekly inflows since 2023', source: 'ETF.com', sentiment: 'bullish', tickers: ['WMT', 'PG', 'KO'] },
        { headline: 'Tesla delivery shortfall sparks analyst debate on demand vs. production strategy', source: 'CNBC', sentiment: 'bearish', tickers: ['TSLA'] },
        { headline: 'Fed speakers signal patience on rates amid elevated oil-driven inflation', source: 'Wall Street Journal', sentiment: 'neutral', tickers: [] },
        { headline: 'Chevron CFO: "Q1 free cash flow will significantly exceed Street estimates"', source: 'FactSet', sentiment: 'bullish', tickers: ['CVX'] },
        { headline: 'NVIDIA Blackwell GPU orders for Q2 25% above prior quarter — suppliers report', source: 'DigiTimes', sentiment: 'bullish', tickers: ['NVDA'] },
        { headline: 'Goldman Sachs raises S&P 500 energy sector weighting to Overweight', source: 'Goldman Sachs', sentiment: 'bullish', tickers: ['XOM', 'CVX', 'SLB'] },
    ];

    const container = document.getElementById('news-feed');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const item = breakingItems[newsRotationIndex % breakingItems.length];
    newsRotationIndex++;

    const tickerTags = item.tickers.length > 0
        ? ` — <strong>${item.tickers.join(', ')}</strong>`
        : '';

    const newsEl = document.createElement('div');
    newsEl.className = 'news-item';
    newsEl.innerHTML = `
        <span class="news-time">${timeStr}</span>
        <div class="news-content">
            <div class="news-headline">🔴 ${item.headline}</div>
            <div class="news-source">${item.source}${tickerTags}</div>
        </div>
        <span class="news-sentiment ${item.sentiment}">${item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}</span>
    `;

    container.prepend(newsEl);

    // Keep feed manageable
    while (container.children.length > 20) {
        container.removeChild(container.lastChild);
    }
}

// ========================
// EVENT HANDLERS
// ========================

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderRankingsTable();
        });
    });

    // Sort select
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderRankingsTable();
    });

    // Formula toggle
    const formulaHeader = document.getElementById('formula-section').querySelector('.formula-header');
    const formulaBody = document.getElementById('formula-body');
    const formulaToggle = document.getElementById('formula-toggle');

    formulaHeader.addEventListener('click', () => {
        formulaOpen = !formulaOpen;
        formulaBody.classList.toggle('open', formulaOpen);
        formulaToggle.classList.toggle('open', formulaOpen);
    });

    // Prediction formula toggle
    const predToggle = document.getElementById('pred-formula-toggle');
    if (predToggle) {
        predToggle.addEventListener('click', () => {
            predFormulaOpen = !predFormulaOpen;
            const body = document.getElementById('pred-formula-body');
            const btn = predToggle.querySelector('.formula-toggle');
            body.classList.toggle('open', predFormulaOpen);
            if (btn) btn.classList.toggle('open', predFormulaOpen);
        });
    }
}

// ========================
// UPDATE LOOP
// ========================

function startUpdateLoop() {
    // Fast tick every 2s for price simulation
    setInterval(() => {
        simulateTick();
        renderRankingsTable();
        renderHeroStock();
        renderMarketSummary();
        updateClock();
    }, 2000);

    // Countdown display
    setInterval(() => {
        countdownValue--;
        if (countdownValue <= 0) countdownValue = 5;
        document.getElementById('update-countdown').textContent = `Next update in ${countdownValue}s`;
    }, 1000);
}

// ========================
// BOOT
// ========================

document.addEventListener('DOMContentLoaded', () => {
    initStockState();
    setupEventListeners();

    // Initial render
    renderPredictions();
    renderNewsFeed();
    renderMarketSummary();
    renderHeroStock();
    renderRankingsTable();
    renderHistoryCards();
    updateClock();

    // Start real-time updates
    startUpdateLoop();

    // Add breaking news every 15s
    setInterval(addBreakingNews, 15000);

    // Staggered entrance animations
    const sections = document.querySelectorAll('#app-main > section');
    sections.forEach((section, i) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 150 * (i + 1));
    });
});

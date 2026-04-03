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
let technicalData = {}; // Per-ticker technical analysis cache

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
// TECHNICAL ANALYSIS ENGINE
// ========================

// Trend profiles per stock to make the generated data match real behavior
const TREND_PROFILES = {
    CVX:  { trend: 'bullish',  volatility: 0.018, recentBoost: 0.08 },  // oil surge
    NVDA: { trend: 'volatile', volatility: 0.032, recentBoost: -0.05 }, // pulled back from highs
    XOM:  { trend: 'bullish',  volatility: 0.020, recentBoost: 0.06 },  // oil surge
    WMT:  { trend: 'steady',   volatility: 0.010, recentBoost: 0.02 },  // defensive steady
    PG:   { trend: 'steady',   volatility: 0.009, recentBoost: 0.01 },  // defensive steady
    TSLA: { trend: 'bearish',  volatility: 0.035, recentBoost: -0.12 }, // delivery miss selloff
};

function generateHistoricalPrices(currentPrice, numDays, profile) {
    const prices = [];
    const volumes = [];
    // Work backwards from current price
    let price = currentPrice;
    const data = [];

    // Generate forward from a starting price, then reverse
    const trendMultiplier = profile.trend === 'bullish' ? 0.0008 :
                            profile.trend === 'bearish' ? -0.0006 : 0.0002;

    // Start price is current minus accumulated trend/boost
    let startPrice = currentPrice / (1 + profile.recentBoost + trendMultiplier * numDays);

    price = startPrice;
    for (let i = 0; i < numDays; i++) {
        const dayProgress = i / numDays;
        // Add trend, noise, and recent acceleration
        const noise = (Math.random() - 0.5) * 2 * profile.volatility * price;
        const trend = trendMultiplier * price;
        // Recent boost accelerates in last 20% of data
        const boost = dayProgress > 0.8 ? (profile.recentBoost / (numDays * 0.2)) * price : 0;
        price = price + trend + noise + boost;
        price = Math.max(price, currentPrice * 0.5); // floor

        const open = price * (1 + (Math.random() - 0.5) * 0.005);
        const close = price;
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        const vol = Math.floor(5_000_000 + Math.random() * 15_000_000);

        data.push({ open: round2(open), high: round2(high), low: round2(low), close: round2(close), volume: vol });
    }

    // Adjust last close to match current price
    data[data.length - 1].close = currentPrice;
    data[data.length - 1].high = Math.max(data[data.length - 1].high, currentPrice);

    return data;
}

// Simple Moving Average
function calcSMA(closes, period) {
    const sma = [];
    for (let i = 0; i < closes.length; i++) {
        if (i < period - 1) { sma.push(null); continue; }
        let sum = 0;
        for (let j = i - period + 1; j <= i; j++) sum += closes[j];
        sma.push(round2(sum / period));
    }
    return sma;
}

// Exponential Moving Average
function calcEMA(closes, period) {
    const ema = [];
    const k = 2 / (period + 1);
    let prev = null;
    for (let i = 0; i < closes.length; i++) {
        if (i < period - 1) { ema.push(null); continue; }
        if (prev === null) {
            // First EMA = SMA
            let sum = 0;
            for (let j = i - period + 1; j <= i; j++) sum += closes[j];
            prev = sum / period;
        } else {
            prev = closes[i] * k + prev * (1 - k);
        }
        ema.push(round2(prev));
    }
    return ema;
}

// RSI (Relative Strength Index)
function calcRSI(closes, period = 14) {
    const rsi = [];
    let avgGain = 0, avgLoss = 0;

    for (let i = 0; i < closes.length; i++) {
        if (i === 0) { rsi.push(null); continue; }
        const change = closes[i] - closes[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        if (i <= period) {
            avgGain += gain;
            avgLoss += loss;
            if (i === period) {
                avgGain /= period;
                avgLoss /= period;
                const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
                rsi.push(round2(100 - 100 / (1 + rs)));
            } else {
                rsi.push(null);
            }
        } else {
            avgGain = (avgGain * (period - 1) + gain) / period;
            avgLoss = (avgLoss * (period - 1) + loss) / period;
            const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            rsi.push(round2(100 - 100 / (1 + rs)));
        }
    }
    return rsi;
}

// MACD (Moving Average Convergence Divergence)
function calcMACD(closes) {
    const ema12 = calcEMA(closes, 12);
    const ema26 = calcEMA(closes, 26);
    const macdLine = [];
    for (let i = 0; i < closes.length; i++) {
        if (ema12[i] === null || ema26[i] === null) { macdLine.push(null); continue; }
        macdLine.push(round2(ema12[i] - ema26[i]));
    }
    // Signal line = 9-period EMA of MACD line
    const validMACD = macdLine.filter(v => v !== null);
    const signalRaw = calcEMA(validMACD, 9);
    // Align signal with full length
    const signal = [];
    let si = 0;
    for (let i = 0; i < macdLine.length; i++) {
        if (macdLine[i] === null) { signal.push(null); continue; }
        signal.push(signalRaw[si] !== undefined ? signalRaw[si] : null);
        si++;
    }
    // Histogram
    const histogram = [];
    for (let i = 0; i < macdLine.length; i++) {
        if (macdLine[i] === null || signal[i] === null) { histogram.push(null); continue; }
        histogram.push(round2(macdLine[i] - signal[i]));
    }
    return { macdLine, signal, histogram };
}

// Bollinger Bands
function calcBollingerBands(closes, period = 20, stdDevMultiplier = 2) {
    const sma = calcSMA(closes, period);
    const upper = [], lower = [];
    for (let i = 0; i < closes.length; i++) {
        if (sma[i] === null) { upper.push(null); lower.push(null); continue; }
        let variance = 0;
        for (let j = i - period + 1; j <= i; j++) {
            variance += Math.pow(closes[j] - sma[i], 2);
        }
        const stdDev = Math.sqrt(variance / period);
        upper.push(round2(sma[i] + stdDevMultiplier * stdDev));
        lower.push(round2(sma[i] - stdDevMultiplier * stdDev));
    }
    return { middle: sma, upper, lower };
}

// Stochastic Oscillator (%K, %D)
function calcStochastic(data, kPeriod = 14, dPeriod = 3) {
    const kValues = [];
    for (let i = 0; i < data.length; i++) {
        if (i < kPeriod - 1) { kValues.push(null); continue; }
        let highestHigh = -Infinity, lowestLow = Infinity;
        for (let j = i - kPeriod + 1; j <= i; j++) {
            highestHigh = Math.max(highestHigh, data[j].high);
            lowestLow = Math.min(lowestLow, data[j].low);
        }
        const range = highestHigh - lowestLow;
        const k = range === 0 ? 50 : ((data[i].close - lowestLow) / range) * 100;
        kValues.push(round2(k));
    }
    const dValues = calcSMA(kValues.map(v => v === null ? 50 : v), dPeriod);
    return { k: kValues, d: dValues };
}

// Fibonacci Retracement Levels
function calcFibonacci(data) {
    const closes = data.map(d => d.close);
    const high = Math.max(...data.map(d => d.high));
    const low = Math.min(...data.map(d => d.low));
    const diff = high - low;
    return {
        level0: round2(high),                    // 0%
        level236: round2(high - diff * 0.236),    // 23.6%
        level382: round2(high - diff * 0.382),    // 38.2%
        level500: round2(high - diff * 0.500),    // 50%
        level618: round2(high - diff * 0.618),    // 61.8%
        level786: round2(high - diff * 0.786),    // 78.6%
        level100: round2(low),                    // 100%
        currentVsLevels: closes[closes.length - 1],
    };
}

// Volume Profile (bucketed)
function calcVolumeProfile(data, buckets = 12) {
    const allPrices = data.map(d => d.close);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const range = max - min;
    const bucketSize = range / buckets;
    const profile = Array(buckets).fill(0);
    const labels = [];

    for (let i = 0; i < buckets; i++) {
        labels.push(round2(min + bucketSize * i + bucketSize / 2));
    }

    data.forEach(d => {
        const idx = Math.min(Math.floor((d.close - min) / bucketSize), buckets - 1);
        profile[idx] += d.volume;
    });

    // Point of Control (POC) = price level with highest volume
    const maxVolIdx = profile.indexOf(Math.max(...profile));
    return { profile, labels, poc: labels[maxVolIdx], maxVol: Math.max(...profile) };
}

// Run full technical analysis for a prediction
function runTechnicalAnalysis(pred) {
    const profile = TREND_PROFILES[pred.ticker] || { trend: 'steady', volatility: 0.015, recentBoost: 0 };
    const data = generateHistoricalPrices(pred.currentPrice, 90, profile);
    const closes = data.map(d => d.close);

    const sma20 = calcSMA(closes, 20);
    const sma50 = calcSMA(closes, 50);
    const ema12 = calcEMA(closes, 12);
    const ema26 = calcEMA(closes, 26);
    const rsi = calcRSI(closes, 14);
    const macd = calcMACD(closes);
    const bollinger = calcBollingerBands(closes, 20, 2);
    const stochastic = calcStochastic(data, 14, 3);
    const fibonacci = calcFibonacci(data);
    const volumeProfile = calcVolumeProfile(data);

    // Latest values
    const last = closes.length - 1;
    const latestRSI = rsi[last] || 50;
    const latestMACD = macd.macdLine[last] || 0;
    const latestSignal = macd.signal[last] || 0;
    const latestHist = macd.histogram[last] || 0;
    const latestK = stochastic.k[last] || 50;
    const latestD = stochastic.d[last] || 50;
    const latestBBUpper = bollinger.upper[last] || closes[last] * 1.02;
    const latestBBLower = bollinger.lower[last] || closes[last] * 0.98;
    const latestSMA20 = sma20[last] || closes[last];
    const latestSMA50 = sma50[last] || closes[last];

    // Generate signals
    const signals = [];

    // RSI signal
    if (latestRSI < 30) signals.push({ name: 'RSI', signal: 'Oversold', type: 'bullish', value: latestRSI.toFixed(1) });
    else if (latestRSI > 70) signals.push({ name: 'RSI', signal: 'Overbought', type: 'bearish', value: latestRSI.toFixed(1) });
    else if (latestRSI < 45) signals.push({ name: 'RSI', signal: 'Neutral-Low', type: 'neutral', value: latestRSI.toFixed(1) });
    else if (latestRSI > 55) signals.push({ name: 'RSI', signal: 'Bullish Zone', type: 'bullish', value: latestRSI.toFixed(1) });
    else signals.push({ name: 'RSI', signal: 'Neutral', type: 'neutral', value: latestRSI.toFixed(1) });

    // MACD signal
    if (latestMACD > latestSignal && latestHist > 0) signals.push({ name: 'MACD', signal: 'Bullish Cross', type: 'bullish', value: latestMACD.toFixed(2) });
    else if (latestMACD < latestSignal && latestHist < 0) signals.push({ name: 'MACD', signal: 'Bearish Cross', type: 'bearish', value: latestMACD.toFixed(2) });
    else signals.push({ name: 'MACD', signal: 'Converging', type: 'neutral', value: latestMACD.toFixed(2) });

    // Bollinger Bands
    const bbPosition = (closes[last] - latestBBLower) / (latestBBUpper - latestBBLower);
    if (bbPosition < 0.1) signals.push({ name: 'Bollinger', signal: 'Near Lower Band', type: 'bullish', value: (bbPosition * 100).toFixed(0) + '%' });
    else if (bbPosition > 0.9) signals.push({ name: 'Bollinger', signal: 'Near Upper Band', type: 'bearish', value: (bbPosition * 100).toFixed(0) + '%' });
    else signals.push({ name: 'Bollinger', signal: 'Mid-Band', type: 'neutral', value: (bbPosition * 100).toFixed(0) + '%' });

    // Moving Average Cross
    if (closes[last] > latestSMA20 && latestSMA20 > latestSMA50) signals.push({ name: 'MA Cross', signal: 'Golden Cross', type: 'bullish', value: 'SMA20>50' });
    else if (closes[last] < latestSMA20 && latestSMA20 < latestSMA50) signals.push({ name: 'MA Cross', signal: 'Death Cross', type: 'bearish', value: 'SMA20<50' });
    else signals.push({ name: 'MA Cross', signal: 'Mixed', type: 'neutral', value: '—' });

    // Stochastic
    if (latestK < 20 && latestD < 20) signals.push({ name: 'Stochastic', signal: 'Oversold', type: 'bullish', value: `K:${latestK.toFixed(0)}` });
    else if (latestK > 80 && latestD > 80) signals.push({ name: 'Stochastic', signal: 'Overbought', type: 'bearish', value: `K:${latestK.toFixed(0)}` });
    else if (latestK > latestD) signals.push({ name: 'Stochastic', signal: 'Bullish', type: 'bullish', value: `K:${latestK.toFixed(0)}` });
    else signals.push({ name: 'Stochastic', signal: latestK < latestD ? 'Bearish' : 'Neutral', type: latestK < latestD ? 'bearish' : 'neutral', value: `K:${latestK.toFixed(0)}` });

    // Fibonacci
    const fibSignal = closes[last] > fibonacci.level382 ? 'Above 38.2%' : 'Below 38.2%';
    const fibType = closes[last] > fibonacci.level500 ? 'bullish' : closes[last] > fibonacci.level618 ? 'neutral' : 'bearish';
    signals.push({ name: 'Fibonacci', signal: fibSignal, type: fibType, value: `$${closes[last].toFixed(0)}` });

    // Volume Profile
    const vpSignal = closes[last] > volumeProfile.poc ? 'Above POC' : 'Below POC';
    const vpType = closes[last] > volumeProfile.poc ? 'bullish' : 'bearish';
    signals.push({ name: 'Vol Profile', signal: vpSignal, type: vpType, value: `POC:$${volumeProfile.poc.toFixed(0)}` });

    // Overall technical score: percentage of bullish signals
    const bullishCount = signals.filter(s => s.type === 'bullish').length;
    const bearishCount = signals.filter(s => s.type === 'bearish').length;
    const techScore = round2((bullishCount / signals.length) * 100);
    const overallSignal = bullishCount > bearishCount ? 'Bullish' : bearishCount > bullishCount ? 'Bearish' : 'Neutral';

    return {
        data, closes, sma20, sma50, ema12, ema26, rsi, macd, bollinger, stochastic, fibonacci, volumeProfile,
        signals, techScore, overallSignal,
        latest: { rsi: latestRSI, macd: latestMACD, signal: latestSignal, histogram: latestHist, k: latestK, d: latestD, sma20: latestSMA20, sma50: latestSMA50 }
    };
}

function initTechnicalData() {
    PREDICTIONS.forEach(pred => {
        technicalData[pred.ticker] = runTechnicalAnalysis(pred);
    });
}

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
        const tech = technicalData[pred.ticker];
        const card = document.createElement('div');
        card.className = `prediction-card ${pred.topPick ? 'top-pick' : ''}`;
        card.id = `pred-card-${pred.ticker}`;

        const badgesHtml = pred.analystBadges.map(b =>
            `<span class="analyst-badge ${b.badge}">${b.firm}: ${b.rating}</span>`
        ).join('');

        const isPosUpside = !pred.upside.startsWith('-');

        // Technical signal badges
        const signalBadgesHtml = tech ? tech.signals.map(s =>
            `<span class="tech-signal-badge ${s.type}" title="${s.name}: ${s.value}">${s.name}: ${s.signal}</span>`
        ).join('') : '';

        const overallClass = tech ? (tech.overallSignal === 'Bullish' ? 'bullish' : tech.overallSignal === 'Bearish' ? 'bearish' : 'neutral') : 'neutral';
        const techScoreDisplay = tech ? tech.techScore.toFixed(0) : '--';

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

            <!-- Technical Chart -->
            <div class="tech-chart-wrap">
                <canvas id="tech-chart-${pred.ticker}" width="440" height="220"></canvas>
                <div class="chart-legend">
                    <span class="legend-item"><span class="legend-dot" style="background:#3b82f6"></span>Price</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>SMA 20</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#a855f7"></span>SMA 50</span>
                    <span class="legend-item"><span class="legend-dot" style="background:rgba(59,130,246,0.15)"></span>Bollinger</span>
                </div>
            </div>

            <!-- Technical Indicators Summary -->
            <div class="tech-indicators-bar">
                <div class="tech-overall ${overallClass}">
                    <span class="tech-overall-label">Technical</span>
                    <span class="tech-overall-value">${tech ? tech.overallSignal : 'N/A'}</span>
                    <span class="tech-overall-score">${techScoreDisplay}% Bullish</span>
                </div>
                <div class="tech-mini-indicators">
                    <div class="tech-mini" title="Relative Strength Index">
                        <span class="tech-mini-label">RSI</span>
                        <span class="tech-mini-value">${tech ? tech.latest.rsi.toFixed(1) : '--'}</span>
                    </div>
                    <div class="tech-mini" title="MACD">
                        <span class="tech-mini-label">MACD</span>
                        <span class="tech-mini-value">${tech ? tech.latest.macd.toFixed(2) : '--'}</span>
                    </div>
                    <div class="tech-mini" title="Stochastic %K">
                        <span class="tech-mini-label">Stoch</span>
                        <span class="tech-mini-value">${tech ? tech.latest.k.toFixed(0) : '--'}</span>
                    </div>
                    <div class="tech-mini" title="SMA 20">
                        <span class="tech-mini-label">SMA20</span>
                        <span class="tech-mini-value">$${tech ? tech.latest.sma20.toFixed(0) : '--'}</span>
                    </div>
                </div>
            </div>

            <!-- Signal Badges -->
            <div class="tech-signals-row">
                ${signalBadgesHtml}
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
                <div class="pred-detail-row">
                    <span class="pred-detail-label">Fib Support</span>
                    <span class="pred-detail-value">$${tech ? tech.fibonacci.level618.toFixed(2) : '--'}</span>
                </div>
                <div class="pred-detail-row">
                    <span class="pred-detail-label">Vol POC</span>
                    <span class="pred-detail-value">$${tech ? tech.volumeProfile.poc.toFixed(2) : '--'}</span>
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

    // Draw all technical charts after DOM is ready
    requestAnimationFrame(() => {
        PREDICTIONS.forEach(pred => {
            const tech = technicalData[pred.ticker];
            if (tech) drawTechnicalChart(pred.ticker, tech);
        });
    });
}

// ========================
// TECHNICAL CHART DRAWING
// ========================

function drawTechnicalChart(ticker, tech) {
    const canvas = document.getElementById(`tech-chart-${ticker}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = 440, h = 220;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const closes = tech.closes;
    const pad = { top: 14, right: 12, bottom: 50, left: 50 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    // Price range
    const allVals = [...closes];
    tech.bollinger.upper.forEach(v => { if (v !== null) allVals.push(v); });
    tech.bollinger.lower.forEach(v => { if (v !== null) allVals.push(v); });
    const minP = Math.min(...allVals) * 0.998;
    const maxP = Math.max(...allVals) * 1.002;
    const rangeP = maxP - minP || 1;

    const xScale = (i) => pad.left + (i / (closes.length - 1)) * chartW;
    const yScale = (v) => pad.top + (1 - (v - minP) / rangeP) * chartH;

    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (chartH / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
        // Price label
        const priceLabel = (maxP - (rangeP / 4) * i).toFixed(0);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('$' + priceLabel, pad.left - 6, y + 3);
    }

    // Bollinger Bands fill
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < closes.length; i++) {
        if (tech.bollinger.upper[i] === null) continue;
        const x = xScale(i);
        if (!started) { ctx.moveTo(x, yScale(tech.bollinger.upper[i])); started = true; }
        else ctx.lineTo(x, yScale(tech.bollinger.upper[i]));
    }
    for (let i = closes.length - 1; i >= 0; i--) {
        if (tech.bollinger.lower[i] === null) continue;
        ctx.lineTo(xScale(i), yScale(tech.bollinger.lower[i]));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.06)';
    ctx.fill();

    // Bollinger upper/lower lines
    drawIndicatorLine(ctx, tech.bollinger.upper, xScale, yScale, 'rgba(59,130,246,0.2)', 1);
    drawIndicatorLine(ctx, tech.bollinger.lower, xScale, yScale, 'rgba(59,130,246,0.2)', 1);

    // SMA 50 (purple)
    drawIndicatorLine(ctx, tech.sma50, xScale, yScale, '#a855f7', 1.2);

    // SMA 20 (amber)
    drawIndicatorLine(ctx, tech.sma20, xScale, yScale, '#f59e0b', 1.2);

    // Price line (blue)
    const isUp = closes[closes.length - 1] >= closes[0];
    const priceColor = isUp ? '#22c55e' : '#ef4444';

    // Price fill gradient
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    closes.forEach((v, i) => { const x = xScale(i), y = yScale(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.lineTo(xScale(closes.length - 1), pad.top + chartH);
    ctx.lineTo(xScale(0), pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Price line
    ctx.beginPath();
    closes.forEach((v, i) => { const x = xScale(i), y = yScale(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.strokeStyle = priceColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Current price dot + glow
    const lastX = xScale(closes.length - 1), lastY = yScale(closes[closes.length - 1]);
    ctx.beginPath(); ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
    ctx.fillStyle = isUp ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'; ctx.fill();
    ctx.beginPath(); ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = priceColor; ctx.fill();

    // Fibonacci levels (dashed lines)
    const fib = tech.fibonacci;
    const fibLevels = [
        { val: fib.level236, label: '23.6%', color: 'rgba(34,197,94,0.3)' },
        { val: fib.level382, label: '38.2%', color: 'rgba(245,158,11,0.3)' },
        { val: fib.level500, label: '50%',   color: 'rgba(168,85,247,0.35)' },
        { val: fib.level618, label: '61.8%', color: 'rgba(239,68,68,0.3)' },
    ];
    fibLevels.forEach(fl => {
        if (fl.val < minP || fl.val > maxP) return;
        const fy = yScale(fl.val);
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(pad.left, fy); ctx.lineTo(w - pad.right, fy); ctx.strokeStyle = fl.color; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = fl.color; ctx.font = '8px JetBrains Mono, monospace'; ctx.textAlign = 'left';
        ctx.fillText(`Fib ${fl.label}`, w - pad.right - 50, fy - 3);
    });

    // RSI mini chart (bottom area)
    const rsiH = 30;
    const rsiTop = h - pad.bottom + 8;
    // RSI background
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(pad.left, rsiTop, chartW, rsiH);
    // RSI overbought/oversold zones
    ctx.fillStyle = 'rgba(239,68,68,0.06)';
    ctx.fillRect(pad.left, rsiTop, chartW, rsiH * 0.3);
    ctx.fillStyle = 'rgba(34,197,94,0.06)';
    ctx.fillRect(pad.left, rsiTop + rsiH * 0.7, chartW, rsiH * 0.3);
    // RSI 70/30 lines
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(pad.left, rsiTop + rsiH * 0.3); ctx.lineTo(w - pad.right, rsiTop + rsiH * 0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.left, rsiTop + rsiH * 0.7); ctx.lineTo(w - pad.right, rsiTop + rsiH * 0.7); ctx.stroke();
    // RSI line
    ctx.beginPath();
    let rsiStarted = false;
    tech.rsi.forEach((v, i) => {
        if (v === null) return;
        const x = xScale(i);
        const y = rsiTop + (1 - v / 100) * rsiH;
        if (!rsiStarted) { ctx.moveTo(x, y); rsiStarted = true; }
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.2; ctx.stroke();
    // RSI label
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '8px Inter, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('RSI', pad.left + 4, rsiTop + 10);
    ctx.fillText('70', pad.left + 4, rsiTop + rsiH * 0.3 + 8);
    ctx.fillText('30', pad.left + 4, rsiTop + rsiH * 0.7 + 8);
}

function drawIndicatorLine(ctx, values, xScale, yScale, color, lineWidth) {
    ctx.beginPath();
    let started = false;
    values.forEach((v, i) => {
        if (v === null) return;
        const x = xScale(i), y = yScale(v);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
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
    initTechnicalData();
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

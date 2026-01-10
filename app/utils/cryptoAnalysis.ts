import axios from "axios";
import { RSI, SMA, MACD, BollingerBands } from "technicalindicators";

// =====================
// COIN LIST (BINANCE)
// =====================
export const COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin", category: "Major Assets" },
  { symbol: "ETHUSDT", name: "Ethereum", category: "Major Assets" },
  { symbol: "SOLUSDT", name: "Solana", category: "Major Assets" },
  { symbol: "BNBUSDT", name: "BNB", category: "Major Assets" },
  { symbol: "TONUSDT", name: "Toncoin", category: "Major Assets" },

  { symbol: "SUIUSDT", name: "Sui", category: "New & Trending" },
  { symbol: "SEIUSDT", name: "Sei", category: "New & Trending" },
  { symbol: "TIAUSDT", name: "Celestia", category: "New & Trending" },
  { symbol: "KASUSDT", name: "Kaspa", category: "New & Trending" },

  { symbol: "RNDRUSDT", name: "Render", category: "AI & DePIN" },
  { symbol: "FETUSDT", name: "Fetch", category: "AI & DePIN" },
  { symbol: "NEARUSDT", name: "NEAR", category: "AI & DePIN" },
  { symbol: "ICPUSDT", name: "ICP", category: "AI & DePIN" },

  { symbol: "ONDOUSDT", name: "Ondo", category: "RWA & DeFi" },
  { symbol: "INJUSDT", name: "Injective", category: "RWA & DeFi" },
  { symbol: "LINKUSDT", name: "Chainlink", category: "Oracle / Infra" },
  { symbol: "UNIUSDT", name: "Uniswap", category: "RWA & DeFi" },

  { symbol: "XRPUSDT", name: "XRP", category: "Infrastructure" },
  { symbol: "ADAUSDT", name: "Cardano", category: "Infrastructure" },
  { symbol: "AVAXUSDT", name: "Avalanche", category: "Infrastructure" },
  { symbol: "DOTUSDT", name: "Polkadot", category: "Infrastructure" },
  { symbol: "POLUSDT", name: "Polygon", category: "Infrastructure" },
  { symbol: "ARBUSDT", name: "Arbitrum", category: "Layer 2" },
  { symbol: "OPUSDT", name: "Optimism", category: "Layer 2" },

  { symbol: "DOGEUSDT", name: "Dogecoin", category: "Meme" },
  { symbol: "SHIBUSDT", name: "Shiba Inu", category: "Meme" },
  { symbol: "PEPEUSDT", name: "Pepe", category: "Meme" },
  { symbol: "WIFUSDT", name: "WIF", category: "Meme" },
  { symbol: "BONKUSDT", name: "Bonk", category: "Meme" },
];

export type Timeframe = "SHORT" | "MEDIUM" | "LONG";

export interface CryptoAnalysisResult {
  price: number;
  chartData: any[];
  rsi: string;
  sma: string;
  macd: {
    val: string;
    signal: string;
    histogram: string;
  };
  bb: {
    upper: number;
    middle: number;
    lower: number;
  };
  signal: string;
  sentiment: string;
  color: string;
  borderColor: string;
  lastUpdated: string;
  sentimentScore: number;
}

// =====================
// MAIN FUNCTION
// =====================
export async function getCryptoAnalysis(symbol: string, timeframe: Timeframe = "MEDIUM"): Promise<CryptoAnalysisResult | null> {
  try {
    let interval = "1d";
    let limit = 100;

    if (timeframe === "SHORT") {
      interval = "15m";
      limit = 96;
    }
    if (timeframe === "LONG") {
      interval = "1d";
      limit = 365;
    }

    // =====================
    // BINANCE API
    // =====================
    const priceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
    const klineUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const [priceRes, klineRes] = await Promise.all([axios.get(priceUrl), axios.get(klineUrl)]);

    const currentPrice = parseFloat(priceRes.data.price);
    const rawData = klineRes.data;

    if (!rawData || rawData.length < 50) return null;

    const closePrices = rawData.map((k: any) => parseFloat(k[4]));

    const chartData = rawData.map((k: any) => ({
      time: k[0] / 1000,
      open: +k[1],
      high: +k[2],
      low: +k[3],
      close: +k[4],
    }));

    // =====================
    // INDICATORS
    // =====================
    const rsiVal = RSI.calculate({ values: closePrices, period: 14 }).pop() ?? 50;
    const smaVal = SMA.calculate({ values: closePrices, period: 50 }).pop() ?? currentPrice;

    const macdRaw = MACD.calculate({
      values: closePrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    }).pop();

    // 🔒 FIX TS ERROR HERE
    const macdVal = {
      MACD: macdRaw?.MACD ?? 0,
      signal: macdRaw?.signal ?? 0,
      histogram: macdRaw?.histogram ?? 0,
    };

    const bbRaw = BollingerBands.calculate({
      values: closePrices,
      period: 20,
      stdDev: 2,
    }).pop() ?? { upper: 0, middle: 0, lower: 0 };

    // =====================
    // SCORING SYSTEM
    // =====================
    let score = 0;

    if (rsiVal < 30) score += 2;
    else if (rsiVal < 45) score += 1;
    else if (rsiVal > 70) score -= 2;
    else if (rsiVal > 55) score -= 1;

    score += macdVal.histogram > 0 ? 1 : -1;
    score += currentPrice > smaVal ? 1 : -1;

    if (currentPrice <= bbRaw.lower) score += 2;
    else if (currentPrice >= bbRaw.upper) score -= 2;

    let signal = "WAIT / HOLD";
    let sentiment = "Indecisive";
    let color = "text-gray-400";
    let borderColor = "border-gray-500";

    if (score >= 3) {
      signal = "STRONG BUY";
      sentiment = "Bullish Extreme";
      color = "text-emerald-400";
      borderColor = "border-emerald-500";
    } else if (score >= 1) {
      signal = "BUY";
      sentiment = "Bullish";
      color = "text-green-400";
      borderColor = "border-green-500";
    } else if (score <= -3) {
      signal = "STRONG SELL";
      sentiment = "Bearish Extreme";
      color = "text-red-500";
      borderColor = "border-red-500";
    } else if (score <= -1) {
      signal = "SELL";
      sentiment = "Bearish";
      color = "text-red-400";
      borderColor = "border-red-400";
    }

    const timeString = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return {
      price: currentPrice,
      chartData,
      rsi: rsiVal.toFixed(2),
      sma: smaVal.toFixed(2),
      macd: {
        val: macdVal.MACD.toFixed(2),
        signal: macdVal.signal.toFixed(2),
        histogram: macdVal.histogram.toFixed(2),
      },
      bb: bbRaw,
      signal,
      sentiment,
      color,
      borderColor,
      lastUpdated: timeString,
      sentimentScore: rsiVal,
    };
  } catch (err) {
    console.error("Analysis Error:", err);
    return null;
  }
}

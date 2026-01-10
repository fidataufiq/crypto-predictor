import axios from "axios";
// 1. IMPORT BOLLINGER BANDS dari library
import { RSI, SMA, MACD, BollingerBands } from "technicalindicators";

// --- DAFTAR KOIN LENGKAP (UPDATED) ---
export const COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { id: "solana", name: "Solana", symbol: "SOL", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { id: "binancecoin", name: "BNB", symbol: "BNB", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
  { id: "the-open-network", name: "Toncoin", symbol: "TON", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png" },

  { id: "hyperliquid", name: "Hyperliquid", symbol: "HYPE", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/35534/large/hyperliquid.png" },
  { id: "sui", name: "Sui", symbol: "SUI", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg" },
  { id: "sei-network", name: "Sei", symbol: "SEI", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_Full_Gradient.png" },
  { id: "celestia", name: "Celestia", symbol: "TIA", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/31967/large/tia.png" },
  { id: "kaspa", name: "Kaspa", symbol: "KAS", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/25751/large/kaspa.png" },

  { id: "render-token", name: "Render", symbol: "RNDR", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/11636/large/rndr.png" },
  { id: "fetch-ai", name: "Artificial Alliance", symbol: "FET", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/5624/large/fet.png" },
  { id: "near", name: "NEAR Protocol", symbol: "NEAR", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/10365/large/near.png" },
  { id: "internet-computer", name: "ICP", symbol: "ICP", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png" },

  { id: "ondo-finance", name: "Ondo", symbol: "ONDO", category: "RWA & DeFi", image: "https://assets.coingecko.com/coins/images/27525/large/ondo.png" },
  { id: "injective-protocol", name: "Injective", symbol: "INJ", category: "RWA & DeFi", image: "https://assets.coingecko.com/coins/images/12882/large/secondary_symbol.png" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", category: "Oracle / Infra", image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI", category: "RWA & DeFi", image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png" },

  { id: "ripple", name: "XRP", symbol: "XRP", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
  { id: "cardano", name: "Cardano", symbol: "ADA", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
  { id: "matic-network", name: "Polygon", symbol: "POL", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", category: "Layer 2", image: "https://assets.coingecko.com/coins/images/16547/large/arbitrum.png" },
  { id: "optimism", name: "Optimism", symbol: "OP", category: "Layer 2", image: "https://assets.coingecko.com/coins/images/25244/large/Optimism.png" },

  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
  { id: "pepe", name: "Pepe", symbol: "PEPE", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg" },
  { id: "dogwifcoin", name: "dogwifhat", symbol: "WIF", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/33566/large/dogwifhat.jpg" },
  { id: "bonk", name: "Bonk", symbol: "BONK", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/28600/large/bonk.jpg" },
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

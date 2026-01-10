import axios from "axios";
// 1. IMPORT BOLLINGER BANDS dari library
import { RSI, SMA, MACD, BollingerBands } from "technicalindicators";

// --- DAFTAR KOIN LENGKAP (BINANCE SYMBOL) ---
export const COINS = [
  // 💎 MAJOR ASSETS (Blue Chips)
  { id: "BTCUSDT", symbol: "BTCUSDT", name: "Bitcoin", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { id: "ETHUSDT", symbol: "ETHUSDT", name: "Ethereum", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { id: "SOLUSDT", symbol: "SOLUSDT", name: "Solana", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { id: "BNBUSDT", symbol: "BNBUSDT", name: "BNB", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
  { id: "TONUSDT", symbol: "TONUSDT", name: "Toncoin", category: "Major Assets", image: "https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png" },

  // 🔥 NEW & TRENDING
  { id: "HYPEUSDT", symbol: "HYPEUSDT", name: "Hyperliquid", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/35534/large/hyperliquid.png" },
  { id: "SUIUSDT", symbol: "SUIUSDT", name: "Sui", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg" },
  { id: "SEIUSDT", symbol: "SEIUSDT", name: "Sei", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_Full_Gradient.png" },
  { id: "TIAUSDT", symbol: "TIAUSDT", name: "Celestia", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/31967/large/tia.png" },
  { id: "KASUSDT", symbol: "KASUSDT", name: "Kaspa", category: "New & Trending", image: "https://assets.coingecko.com/coins/images/25751/large/kaspa.png" },

  // 🤖 AI & DePIN
  { id: "RNDRUSDT", symbol: "RNDRUSDT", name: "Render", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/11636/large/rndr.png" },
  { id: "FETUSDT", symbol: "FETUSDT", name: "Artificial Alliance", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/5624/large/fet.png" },
  { id: "NEARUSDT", symbol: "NEARUSDT", name: "NEAR Protocol", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/10365/large/near.png" },
  { id: "ICPUSDT", symbol: "ICPUSDT", name: "ICP", category: "AI & DePIN", image: "https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png" },

  // 🏦 RWA & DEFI
  { id: "ONDOUSDT", symbol: "ONDOUSDT", name: "Ondo", category: "RWA & DeFi", image: "https://assets.coingecko.com/coins/images/27525/large/ondo.png" },
  { id: "INJUSDT", symbol: "INJUSDT", name: "Injective", category: "RWA & DeFi", image: "https://assets.coingecko.com/coins/images/12882/large/secondary_symbol.png" },
  { id: "LINKUSDT", symbol: "LINKUSDT", name: "Chainlink", category: "Oracle / Infra", image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
  { id: "UNIUSDT", symbol: "UNIUSDT", name: "Uniswap", category: "RWA & DeFi", image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png" },

  // 🏗️ INFRA & LAYER 2
  { id: "XRPUSDT", symbol: "XRPUSDT", name: "XRP", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
  { id: "ADAUSDT", symbol: "ADAUSDT", name: "Cardano", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { id: "AVAXUSDT", symbol: "AVAXUSDT", name: "Avalanche", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png" },
  { id: "DOTUSDT", symbol: "DOTUSDT", name: "Polkadot", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
  { id: "MATICUSDT", symbol: "MATICUSDT", name: "Polygon", category: "Infrastructure", image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png" },
  { id: "ARBUSDT", symbol: "ARBUSDT", name: "Arbitrum", category: "Layer 2", image: "https://assets.coingecko.com/coins/images/16547/large/arbitrum.png" },
  { id: "OPUSDT", symbol: "OPUSDT", name: "Optimism", category: "Layer 2", image: "https://assets.coingecko.com/coins/images/25244/large/Optimism.png" },

  // 🚀 MEME COINS
  { id: "DOGEUSDT", symbol: "DOGEUSDT", name: "Dogecoin", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
  { id: "SHIBUSDT", symbol: "SHIBUSDT", name: "Shiba Inu", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
  { id: "PEPEUSDT", symbol: "PEPEUSDT", name: "Pepe", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg" },
  { id: "WIFUSDT", symbol: "WIFUSDT", name: "dogwifhat", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/33566/large/dogwifhat.jpg" },
  { id: "BONKUSDT", symbol: "BONKUSDT", name: "Bonk", category: "Meme Economy", image: "https://assets.coingecko.com/coins/images/28600/large/bonk.jpg" },
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

export async function getCryptoAnalysis(coinSymbol: string, timeframe: Timeframe = "MEDIUM"): Promise<CryptoAnalysisResult | null> {
  try {
    let limit = 1000; // Binance max
    if (timeframe === "SHORT") limit = 24; // 1 day hourly
    else if (timeframe === "MEDIUM") limit = 720; // 30 days hourly
    else if (timeframe === "LONG") limit = 8760; // 365 days hourly

    // --- REQUEST 1: HARGA REAL-TIME ---
    const priceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${coinSymbol}`;

    // --- REQUEST 2: DATA CHART (OHLC) ---
    // Binance Klines: interval 1h (hourly), limit = jumlah data
    const ohlcUrl = `https://api.binance.com/api/v3/klines?symbol=${coinSymbol}&interval=1h&limit=${limit}`;

    const [priceRes, ohlcRes] = await Promise.all([axios.get(priceUrl), axios.get(ohlcUrl)]);

    const currentPrice = parseFloat(priceRes.data.price);
    const rawData = ohlcRes.data;

    if (!rawData || rawData.length < 20) {
      console.warn(`Data chart ${coinSymbol} kurang untuk analisis.`);
      return null;
    }

    const closePrices = rawData.map((d: any) => parseFloat(d[4]));

    const chartData = rawData.map((d: any) => ({
      time: d[0] / 1000,
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    }));

    // --- HITUNG INDIKATOR ---
    const rsiValues = RSI.calculate({ values: closePrices, period: 14 });
    const currentRSI = rsiValues[rsiValues.length - 1] || 50;

    const smaValues = SMA.calculate({ values: closePrices, period: 50 } as any);
    const currentSMA = smaValues[smaValues.length - 1] || currentPrice;

    const macdValues = MACD.calculate({
      values: closePrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    } as any);
    const currentMACD = macdValues[macdValues.length - 1] || { MACD: 0, signal: 0, histogram: 0 };

    const bbValues = BollingerBands.calculate({ period: 20, values: closePrices, stdDev: 2 });
    const currentBB = bbValues[bbValues.length - 1] || { upper: 0, middle: 0, lower: 0 };

    // --- STRICT CONFLUENCE SCORE ---
    let score = 0;
    if (currentRSI < 30) score += 2;
    else if (currentRSI < 45) score += 1;
    else if (currentRSI > 70) score -= 2;
    else if (currentRSI > 55) score -= 1;

    if ((currentMACD.histogram ?? 0) > 0) score += 1;
    else score -= 1;

    if (currentPrice > currentSMA) score += 1;
    else score -= 1;

    if (currentPrice <= currentBB.lower) score += 2;
    else if (currentPrice >= currentBB.upper) score -= 2;

    let signal = "NEUTRAL";
    let sentiment = "Sideways";
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
    } else {
      signal = "WAIT / HOLD";
      sentiment = "Indecisive";
      color = "text-gray-400";
      borderColor = "border-gray-500";
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return {
      price: currentPrice,
      chartData,
      rsi: currentRSI.toFixed(2),
      sma: currentSMA.toFixed(2),
      macd: {
        val: currentMACD.MACD?.toFixed(2) || "0",
        signal: currentMACD.signal?.toFixed(2) || "0",
        histogram: currentMACD.histogram?.toFixed(2) || "0",
      },
      bb: {
        upper: currentBB.upper,
        middle: currentBB.middle,
        lower: currentBB.lower,
      },
      signal,
      sentiment,
      color,
      borderColor,
      lastUpdated: timeString,
      sentimentScore: currentRSI,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) console.error("⛔ API RATE LIMIT");
      else if (error.response?.status === 404) console.error(`⛔ Coin not found: ${coinSymbol}`);
    } else {
      console.error("Analysis Error:", error);
    }
    return null;
  }
}

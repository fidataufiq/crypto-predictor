import axios from "axios";
import { RSI, SMA, MACD } from "technicalindicators";

// --- DAFTAR KOIN LENGKAP ---
export const COINS = [
  // MAJOR
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { id: "solana", name: "Solana", symbol: "SOL", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { id: "binancecoin", name: "BNB", symbol: "BNB", image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },

  // NEW & HOT
  { id: "hyperliquid", name: "Hyperliquid", symbol: "HYPE", image: "https://assets.coingecko.com/coins/images/35534/large/hyperliquid.png" },
  { id: "aster-2", name: "Aster", symbol: "ASTER", image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png" },
  { id: "astar", name: "Astar", symbol: "ASTR", image: "https://assets.coingecko.com/coins/images/22617/large/astar.png" },

  // POPULAR ALTS
  { id: "ripple", name: "XRP", symbol: "XRP", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
  { id: "cardano", name: "Cardano", symbol: "ADA", image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX", image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
  { id: "matic-network", name: "Polygon", symbol: "MATIC", image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB", image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
  { id: "sui", name: "Sui", symbol: "SUI", image: "https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg" },
  { id: "render-token", name: "Render", symbol: "RNDR", image: "https://assets.coingecko.com/coins/images/11636/large/rndr.png" },
  { id: "pepe", name: "Pepe", symbol: "PEPE", image: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg" },
];

export type Timeframe = "SHORT" | "MEDIUM" | "LONG";

// Interface untuk Return Data agar TypeScript aman
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
  signal: string;
  sentiment: string;
  color: string;
  borderColor: string;
  lastUpdated: string;
  sentimentScore: number;
}

export async function getCryptoAnalysis(coinId: string, timeframe: Timeframe = "MEDIUM"): Promise<CryptoAnalysisResult | null> {
  try {
    // 1. Tentukan Durasi Chart (OHLC)
    let days = "30";
    if (timeframe === "SHORT") days = "1";
    if (timeframe === "LONG") days = "365";

    // --- REQUEST 1: HARGA REAL-TIME ---
    const priceUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;

    // --- REQUEST 2: DATA CHART (OHLC) ---
    const ohlcUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;

    const [priceRes, ohlcRes] = await Promise.all([axios.get(priceUrl), axios.get(ohlcUrl)]);

    // --- PROSES HARGA ---
    const marketData = priceRes.data[0];
    if (!marketData) throw new Error("NOT_FOUND");

    const currentPrice = marketData.current_price;
    // const priceChange24h = marketData.price_change_percentage_24h; // Tidak dipakai di logic baru

    // --- PROSES CHART (OHLC Data) ---
    const rawData = ohlcRes.data;

    // Validasi data chart
    if (!rawData || rawData.length < 10) {
      console.warn(`Data chart ${coinId} kurang.`);
      return null;
    }

    const closePrices = rawData.map((d: any) => d[4]);

    // Siapkan Data Chart untuk UI
    const chartData = rawData.map((d: any) => ({
      time: d[0] / 1000,
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }));

    // --- HITUNG INDIKATOR ---
    // 1. RSI
    const rsiValues = RSI.calculate({ values: closePrices, period: 14 });
    const currentRSI = rsiValues[rsiValues.length - 1] || 50;

    // 2. SMA
    const smaValues = SMA.calculate({ values: closePrices, period: 50, SimpleMovingAverage: [] } as any);
    const currentSMA = smaValues[smaValues.length - 1] || currentPrice;

    // 3. MACD
    const macdInput = {
      values: closePrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    } as any;
    const macdValues = MACD.calculate(macdInput);
    const currentMACD = macdValues[macdValues.length - 1] || { MACD: 0, signal: 0, histogram: 0 };

    // ==========================================
    // --- NEW LOGIC: STRICT CONFLUENCE SCORE ---
    // ==========================================

    let score = 0;
    const rsiVal = currentRSI;
    const macdHist = currentMACD.histogram || 0;
    const smaVal = currentSMA;

    // 1. ANALISA RSI (Momentum)
    // Poin Besar untuk kondisi Ekstrem
    if (rsiVal < 30) score += 2; // Oversold Parah (Diskon) -> Strong Buy
    else if (rsiVal < 45) score += 1; // Agak Murah -> Buy
    else if (rsiVal > 70) score -= 2; // Overbought Parah (Mahal) -> Strong Sell
    else if (rsiVal > 55) score -= 1; // Agak Mahal -> Sell

    // 2. ANALISA MACD (Trend Direction)
    if (macdHist > 0) score += 1; // Bullish
    else score -= 1; // Bearish

    // 3. ANALISA SMA (Trend Jangka Panjang)
    if (currentPrice > smaVal) score += 1; // Uptrend
    else score -= 1; // Downtrend

    // --- KEPUTUSAN FINAL BERDASARKAN SKOR ---
    let signal = "NEUTRAL";
    let sentiment = "Sideways";
    let color = "text-gray-400";
    let borderColor = "border-gray-500";

    if (score >= 3) {
      signal = "STRONG BUY";
      sentiment = "Bullish Extreme";
      color = "text-emerald-400"; // Hijau Neon Terang
      borderColor = "border-emerald-500";
    } else if (score >= 1) {
      signal = "BUY";
      sentiment = "Bullish";
      color = "text-green-400";
      borderColor = "border-green-500";
    } else if (score <= -3) {
      signal = "STRONG SELL";
      sentiment = "Bearish Extreme";
      color = "text-red-500"; // Merah Terang
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

    // Sentiment Score untuk Gauge (0-100)
    // Kita gunakan RSI sebagai representasi visual sentimen pasar yang paling umum
    const sentimentScore = currentRSI;

    const now = new Date();
    const timeString = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return {
      price: currentPrice,
      chartData: chartData,
      rsi: currentRSI.toFixed(2),
      sma: currentSMA.toFixed(2),
      macd: {
        val: currentMACD.MACD?.toFixed(2) || "0",
        signal: currentMACD.signal?.toFixed(2) || "0",
        histogram: currentMACD.histogram?.toFixed(2) || "0",
      },
      signal,
      sentiment,
      color,
      borderColor,
      lastUpdated: timeString,
      sentimentScore, // Mengembalikan nilai 0-100
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.error("⛔ API RATE LIMIT");
      } else if (error.response?.status === 404) {
        console.error(`⛔ Coin not found: ${coinId}`);
      }
    } else {
      console.error("Analysis Error:", error);
    }
    return null;
  }
}

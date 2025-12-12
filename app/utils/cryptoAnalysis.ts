// Lokasi: app/utils/cryptoAnalysis.ts

import axios from "axios";
import { RSI, SMA, MACD } from "technicalindicators";

// Lokasi: app/utils/cryptoAnalysis.ts

// ... imports tetap sama ...

export const COINS = [
  // --- MAJOR COINS ---
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { id: "solana", name: "Solana", symbol: "SOL", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { id: "binancecoin", name: "BNB", symbol: "BNB", image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },

  // --- REQUESTED NEW COINS (HOT 🔥) ---
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    symbol: "HYPE",
    image: "https://assets.coingecko.com/coins/images/35534/large/hyperliquid.png", // Pastikan ID ini valid di CG
  },
  {
    id: "aster-2", // ID CoinGecko untuk Aster (Rebranding dari APX)
    name: "Aster",
    symbol: "ASTER",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png", // Placeholder jika logo spesifik belum ke-load, atau gunakan logo APX
  },
  {
    id: "astar", // Sering tertukar dengan Aster, jadi kita masukkan juga
    name: "Astar",
    symbol: "ASTR",
    image: "https://assets.coingecko.com/coins/images/22617/large/astar.png",
  },

  // --- POPULAR ALTS ---
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

// ... (Sisa kode getCryptoAnalysis biarkan tetap sama) ...

// Type untuk Timeframe
export type Timeframe = "SHORT" | "MEDIUM" | "LONG";

// Lokasi: app/utils/cryptoAnalysis.ts (Partial Update fungsi saja)

// ... import dan COINS array biarkan tetap sama ...

export async function getCryptoAnalysis(coinId: string, timeframe: Timeframe = "MEDIUM") {
  try {
    let days = "30";
    if (timeframe === "SHORT") days = "2";
    if (timeframe === "LONG") days = "365";

    // REQUEST API
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;

    // Tambahkan header opsional jika punya API Key, kalau free biarkan kosong
    const response = await axios.get(url).catch((err) => {
      // Tangani error spesifik
      if (err.response && err.response.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      if (err.response && err.response.status === 404) {
        throw new Error("NOT_FOUND");
      }
      throw err;
    });

    const rawData = response.data;

    // --- VALIDASI DATA ---
    // SMA 50 butuh minimal 50 candle.
    // Jika 'days=2' (SHORT), maks candle adalah 96 (48 jam x 2).
    // Koin baru seringkali cuma punya < 50 candle di timeframe ini.
    if (!rawData || rawData.length < 52) {
      console.warn(`Data ${coinId} tidak cukup untuk analisis Short Term.`);

      // --- FALLBACK MECHANISM ---
      // Jika Short gagal (data dikit), kita paksa coba ambil Medium (30 hari)
      if (timeframe === "SHORT") {
        console.log("Mencoba mengambil data Medium sebagai fallback...");
        return getCryptoAnalysis(coinId, "MEDIUM");
      }
      return null;
    }

    const closePrices = rawData.map((d: any) => d[4]);
    const currentPrice = closePrices[closePrices.length - 1];

    // --- Siapkan Data Chart ---
    const chartData = rawData.map((d: any) => ({
      time: d[0] / 1000,
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }));

    // --- Hitung Indikator ---
    const rsiValues = RSI.calculate({ values: closePrices, period: 14 });
    const currentRSI = rsiValues[rsiValues.length - 1];

    const smaValues = SMA.calculate({ values: closePrices, period: 50, SimpleMovingAverage: [] } as any);
    const currentSMA = smaValues[smaValues.length - 1];

    const macdInput = {
      values: closePrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    } as any;
    const macdValues = MACD.calculate(macdInput);
    const currentMACD = macdValues[macdValues.length - 1];

    // --- Logika Sinyal ---
    let signal = "HOLD";
    let sentiment = "Neutral";
    let color = "text-gray-400";
    let borderColor = "border-gray-500";

    let bullishScore = 0;

    // Safety check kalau indikator belum ke-load (misal koin baru listing)
    if (currentRSI && currentRSI < 30) bullishScore++;
    if (currentSMA && currentPrice > currentSMA) bullishScore++;

    if (currentMACD && currentMACD.MACD !== undefined && currentMACD.signal !== undefined && currentMACD.MACD > currentMACD.signal) {
      bullishScore++;
    }

    if (bullishScore === 3) {
      signal = "STRONG BUY";
      sentiment = "Perfect Uptrend";
      color = "text-green-400";
      borderColor = "border-green-500";
    } else if (bullishScore === 2) {
      signal = "BUY";
      sentiment = "Good Potential";
      color = "text-green-400";
      borderColor = "border-green-500";
    } else if (currentRSI > 70) {
      signal = "SELL";
      sentiment = "Overbought";
      color = "text-red-500";
      borderColor = "border-red-500";
    } else {
      signal = "WAIT / HOLD";
      sentiment = "Market Indecisive";
      color = "text-gray-400";
      borderColor = "border-gray-500";
    }

    // Sentiment Score untuk Gauge
    let sentimentScore = currentRSI ? currentRSI / 100 : 0.5;
    if (isNaN(sentimentScore)) sentimentScore = 0.5;

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
      rsi: currentRSI ? currentRSI.toFixed(2) : "N/A",
      sma: currentSMA ? currentSMA.toFixed(2) : "N/A",
      macd: currentMACD
        ? {
            val: currentMACD.MACD?.toFixed(2),
            signal: currentMACD.signal?.toFixed(2),
            histogram: currentMACD.histogram?.toFixed(2),
          }
        : { val: 0, signal: 0, histogram: 0 },
      signal,
      sentiment,
      color,
      borderColor,
      lastUpdated: timeString,
      sentimentScore,
    };
  } catch (error: any) {
    // Log error di console biar tau kenapa
    if (error.message === "RATE_LIMIT") {
      console.error("⛔ API RATE LIMIT: Tunggu sebentar sebelum klik lagi.");
    } else if (error.message === "NOT_FOUND") {
      console.error("⛔ DATA TIDAK DITEMUKAN: Koin ini mungkin belum punya data OHLC di CG.");
    } else {
      console.error("Error fetching data:", error);
    }
    return null;
  }
}

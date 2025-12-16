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

export async function getCryptoAnalysis(coinId: string, timeframe: Timeframe = "MEDIUM") {
  try {
    // 1. Tentukan Durasi Chart (OHLC)
    let days = "30";
    if (timeframe === "SHORT") days = "1";
    if (timeframe === "LONG") days = "365";

    // --- REQUEST 1: HARGA REAL-TIME (The Fix!) ---
    // Kita panggil endpoint 'markets' untuk harga yang pasti akurat dan sama di semua timeframe
    const priceUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;

    // --- REQUEST 2: DATA CHART (OHLC) ---
    // Endpoint ini hanya untuk gambar grafik dan hitung indikator
    const ohlcUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;

    // Jalankan kedua request secara paralel (Promise.all) agar cepat
    const [priceRes, ohlcRes] = await Promise.all([axios.get(priceUrl), axios.get(ohlcUrl)]);

    // --- PROSES HARGA (Market Data) ---
    // Ambil harga dari request pertama. Ini harga "The Truth".
    const marketData = priceRes.data[0];
    if (!marketData) throw new Error("NOT_FOUND");

    const currentPrice = marketData.current_price;
    const priceChange24h = marketData.price_change_percentage_24h;

    // --- PROSES CHART (OHLC Data) ---
    const rawData = ohlcRes.data;

    // Validasi data chart
    if (!rawData || rawData.length < 10) {
      console.warn(`Data chart ${coinId} kurang.`);
      // Jika short chart gagal, bisa return null atau coba medium (opsional)
      // Disini kita return null dulu biar aman
      return null;
    }

    const closePrices = rawData.map((d: any) => d[4]);
    // Perhatikan: Kita TIDAK mengambil currentPrice dari closePrices lagi.

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
    const currentRSI = rsiValues[rsiValues.length - 1];

    // 2. SMA
    const smaValues = SMA.calculate({ values: closePrices, period: 50, SimpleMovingAverage: [] } as any);
    const currentSMA = smaValues[smaValues.length - 1];

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
    const currentMACD = macdValues[macdValues.length - 1];

    // --- LOGIKA SINYAL ---
    let signal = "HOLD";
    let sentiment = "Neutral";
    let color = "text-gray-400";
    let borderColor = "border-gray-500";
    let bullishScore = 0;

    // RSI Check
    if (currentRSI && currentRSI < 30) bullishScore++;

    // SMA Check (Harga Realtime vs SMA Chart)
    if (currentSMA && currentPrice > currentSMA) bullishScore++;

    // MACD Check
    if (currentMACD && currentMACD.MACD !== undefined && currentMACD.signal !== undefined && currentMACD.MACD > currentMACD.signal) {
      bullishScore++;
    }

    // Penentuan Label
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

    // Sentiment Score (Tambahan logika dari 24h change biar makin akurat)
    let sentimentScore = currentRSI ? currentRSI / 100 : 0.5;
    if (priceChange24h > 5) sentimentScore += 0.1; // Boost kalau lagi pump
    if (priceChange24h < -5) sentimentScore -= 0.1; // Kurangi kalau lagi dump

    // Clamp score 0-1
    sentimentScore = Math.max(0, Math.min(1, sentimentScore));

    const now = new Date();
    const timeString = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return {
      price: currentPrice, // <-- HARGA PASTI STABIL SEKARANG
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

// Lokasi: app/utils/cryptoAnalysis.ts

import axios from "axios";
import { RSI, SMA, MACD } from "technicalindicators";

export const COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
];

// Type untuk Timeframe
export type Timeframe = "SHORT" | "MEDIUM" | "LONG";

export async function getCryptoAnalysis(coinId: string, timeframe: Timeframe = "MEDIUM") {
  try {
    // 1. Tentukan durasi hari berdasarkan Timeframe
    let days = "30"; // Default Medium
    if (timeframe === "SHORT") days = "2";
    if (timeframe === "LONG") days = "365";

    // 2. Fetch Data
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`);

    const rawData = response.data;
    // Validasi data cukup
    if (!rawData || rawData.length < 52) {
      console.warn("Data tidak cukup untuk analisis teknikal");
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

    // --- 3. Hitung Indikator ---

    // RSI (14)
    const rsiValues = RSI.calculate({ values: closePrices, period: 14 });
    const currentRSI = rsiValues[rsiValues.length - 1];

    // SMA (50)
    const smaValues = SMA.calculate({ values: closePrices, period: 50, SimpleMovingAverage: [] } as any);
    const currentSMA = smaValues[smaValues.length - 1];

    // MACD (12, 26, 9)
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

    // --- 4. Logika Sinyal ---
    let signal = "HOLD";
    let sentiment = "Neutral";
    let color = "text-gray-400";
    let borderColor = "border-gray-500";

    let bullishScore = 0;
    if (currentRSI < 30) bullishScore++;
    if (currentPrice > currentSMA) bullishScore++;

    // --- PERBAIKAN DI SINI ---
    // Kita pastikan MACD dan signal TIDAK undefined sebelum membandingkan
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

    // --- 5. Siapkan Skor Sentiment (0 - 1) ---
    // RSI biasanya 0-100. Kita bagi 100 jadi 0-1 untuk Gauge.
    // Contoh: RSI 30 jadi 0.3 (Fear), RSI 70 jadi 0.7 (Greed).
    let sentimentScore = currentRSI / 100;

    // Safety check biar gak error kalau NaN
    if (isNaN(sentimentScore)) sentimentScore = 0.5;

    // --- 5. Waktu Update ---
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
      sentimentScore: sentimentScore, // <--- DATA BARU UNTUK GAUGE
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

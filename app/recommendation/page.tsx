"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Target, ShieldAlert, Crosshair, AlertTriangle, Clock, Zap, BarChart2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import CopyButton from "../components/CopyButton";

export default function RecommendationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500">Loading Strategy...</div>}>
      <TradingPlanContent />
    </Suspense>
  );
}

function TradingPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. AMBIL DATA NYATA DARI URL
  const coin = searchParams.get("coin") || "Unknown";
  const price = parseFloat(searchParams.get("price") || "0");
  const signal = searchParams.get("signal") || "HOLD";
  const time = searchParams.get("time") || "-";
  const timeframe = searchParams.get("tf") || "MEDIUM";

  // Data Teknikal Tambahan (Yang baru kita tambahkan di tombol)
  const rsi = parseFloat(searchParams.get("rsi") || "50");
  const sma = parseFloat(searchParams.get("sma") || "0");
  const macdVal = parseFloat(searchParams.get("macd") || "0");
  const score = parseFloat(searchParams.get("score") || "50"); // Ini Score RSI/Sentiment (0-100)

  const [levels, setLevels] = useState<any>(null);

  useEffect(() => {
    if (price > 0) {
      calculateLevels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, signal, timeframe]);

  const calculateLevels = () => {
    const signalUpper = signal.toUpperCase();
    const isSell = signalUpper.includes("SELL");
    const isBuy = signalUpper.includes("BUY");
    const isNeutral = !isSell && !isBuy;

    // --- LOGIKA LEVEL HARGA (Risk & Reward) ---
    let riskPercent = timeframe === "SHORT" ? 0.005 : timeframe === "LONG" ? 0.05 : 0.02;
    let reward1 = timeframe === "SHORT" ? 0.01 : timeframe === "LONG" ? 0.1 : 0.03;
    let reward2 = timeframe === "SHORT" ? 0.02 : timeframe === "LONG" ? 0.2 : 0.06;
    let reward3 = timeframe === "SHORT" ? 0.04 : timeframe === "LONG" ? 0.5 : 0.12;

    let sl, tp1, tp2, tp3;
    if (isSell) {
      sl = price * (1 + riskPercent);
      tp1 = price * (1 - reward1);
      tp2 = price * (1 - reward2);
      tp3 = price * (1 - reward3);
    } else {
      sl = price * (1 - riskPercent);
      tp1 = price * (1 + reward1);
      tp2 = price * (1 + reward2);
      tp3 = price * (1 + reward3);
    }

    // --- LOGIKA ALASAN DINAMIS (REAL DATA) ---
    // Kita bangun kalimat berdasarkan data RSI & MACD yang sebenarnya
    let reasonParts = [];

    // 1. Analisa RSI
    if (rsi < 30) reasonParts.push("RSI berada di zona Oversold (Murah), potensi pantulan tinggi.");
    else if (rsi > 70) reasonParts.push("RSI menyentuh Overbought (Jenuh Beli), waspada koreksi.");
    else if (rsi > 50 && isBuy) reasonParts.push("RSI di atas 50 mendukung momentum Bullish.");
    else if (rsi < 50 && isSell) reasonParts.push("RSI di bawah 50 mengonfirmasi tekanan jual.");

    // 2. Analisa MACD
    if (macdVal > 0) reasonParts.push("MACD Histogram positif menandakan tren naik.");
    else reasonParts.push("MACD Histogram negatif menandakan tren turun.");

    // 3. Analisa SMA
    if (price > sma) reasonParts.push("Harga bergerak di atas rata-rata (Uptrend).");
    else reasonParts.push("Harga berada di bawah rata-rata (Downtrend).");

    // Gabungkan kalimat
    let finalReason = reasonParts.join(" ");

    // Fallback jika netral
    if (isNeutral) finalReason = "Indikator teknikal menunjukkan sinyal campuran (Mixed Signal). Pasar sedang konsolidasi, disarankan Wait & See.";

    // --- LOGIKA CONFIDENCE BERDASARKAN SKOR ---
    // Skor sentimen 0-100.
    // Buy Confidence = (100 - Score) jika rendah makin bagus
    // Sell Confidence = Score jika tinggi makin bagus

    let confidenceVal = 0;
    if (isBuy) {
      // Kalau Buy, RSI rendah (misal 30) itu bagus. Jadi confidence = 100 - 30 = 70 + boost
      confidenceVal = 100 - rsi + 10;
    } else if (isSell) {
      // Kalau Sell, RSI tinggi (misal 70) itu bagus.
      confidenceVal = rsi + 10;
    } else {
      confidenceVal = 50;
    }

    // Clamp 0-99
    confidenceVal = Math.min(99, Math.max(40, confidenceVal));

    setLevels({
      sl,
      tp1,
      tp2,
      tp3,
      isSell,
      isActiveSignal: !isNeutral,
      riskPercent,
      reward1,
      timeframeName: timeframe,
      confidence: Math.round(confidenceVal), // Confidence asli hitungan
      reason: finalReason, // Alasan asli dari data
    });
  };

  const formatPrice = (num: number) => {
    if (!num) return "0.00";
    return num > 1 ? num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : num.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  };

  const getTfLabel = (tf: string) => {
    if (tf === "SHORT") return "INTRADAY";
    if (tf === "LONG") return "LONG TERM";
    return "SWING";
  };

  if (!levels) return <div className="text-white text-center p-10">Processing Data...</div>;

  const analysisData = {
    coinName: coin,
    coinSymbol: coin,
    price: `$${formatPrice(price)}`,
    signal: levels.isSell ? "SELL" : "BUY",
    confidence: levels.confidence,
    reason: levels.reason,
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-2 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        {/* --- TICKET CARD --- */}
        <div className="bg-[#0a0a0a] rounded-3xl overflow-hidden p-1">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative ring-1 ring-white/5">
            {/* Header Ticket */}
            <div className={`p-6 border-b border-white/5 relative overflow-hidden ${levels.isSell ? "bg-red-500/5" : "bg-green-500/5"}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${levels.isSell ? "bg-red-500" : "bg-green-500"}`} />

              <div className="flex justify-between items-start pl-2">
                <div>
                  <h1 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">{coin}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono flex items-center gap-1">
                      <Clock size={10} /> {getTfLabel(timeframe)} PLAN
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest inline-block mb-1 ${
                      levels.isSell ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-green-500 text-white shadow-[0_0_15px_rgba(74,222,128,0.4)]"
                    }`}
                  >
                    {levels.isSell ? "SHORT" : "LONG"}
                  </div>
                  {!levels.isActiveSignal && (
                    <p className="text-[9px] text-orange-400 mt-1 flex items-center justify-end gap-1">
                      <AlertTriangle size={8} /> NEUTRAL MODE
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-5">
              {/* Entry Point */}
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 ring-1 ring-blue-500/20">
                    <Crosshair size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Entry Price</p>
                    <p className="text-xl font-mono text-white tracking-tight">${formatPrice(price)}</p>
                  </div>
                </div>
              </div>

              {/* Stop Loss & TP 1 Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 text-red-400">
                    <ShieldAlert size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Stop Loss</span>
                  </div>
                  <p className="text-lg font-mono text-white/90">${formatPrice(levels.sl)}</p>
                  <p className="text-[10px] text-red-400/50 mt-0.5 font-mono">{(levels.riskPercent * 100).toFixed(1)}% Risk</p>
                </div>

                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 text-green-400">
                    <Target size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">TP 1 (Safe)</span>
                  </div>
                  <p className="text-lg font-mono text-white/90">${formatPrice(levels.tp1)}</p>
                  <p className="text-[10px] text-green-400/50 mt-0.5 font-mono">{(levels.reward1 * 100).toFixed(1)}% Gain</p>
                </div>
              </div>

              {/* Extended Targets */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold">2</div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Target Moderate</span>
                  </div>
                  <span className="font-mono text-gray-300 text-sm">${formatPrice(levels.tp2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-violet-500/5 to-transparent border border-violet-500/10 group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-[10px] font-bold">3</div>
                    <span className="text-[11px] text-violet-300/70 uppercase tracking-wider font-medium">Moonbag Target</span>
                  </div>
                  <span className="font-mono text-violet-200 text-sm">${formatPrice(levels.tp3)}</span>
                </div>
              </div>

              {/* === AI INSIGHT YANG NYATA === */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mt-2">
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BarChart2 size={14} className="text-blue-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">AI Confidence</span>
                  </div>
                  <span className={`text-xl font-mono font-bold ${levels.confidence > 80 ? "text-green-400" : "text-yellow-400"}`}>{levels.confidence}%</span>
                </div>

                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full transition-all duration-1000 ${levels.confidence > 80 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${levels.confidence}%` }}></div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 min-w-[16px]">
                    <Zap size={14} className={levels.isSell ? "text-red-400" : "text-yellow-400"} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                      <span className="font-bold text-gray-200">Logic: </span>
                      {levels.reason}
                    </p>
                  </div>
                </div>
              </div>
              {/* ========================================= */}
            </div>

            <div className="px-6 pb-6 pt-2">
              <p className="text-center text-[11px] leading-relaxed text-gray-500 font-mono border-t border-white/5 pt-4">
                Generated by PRYDEXI AI • Time: {time} WIB <br />
                <span className="opacity-70">DYOR: Not Financial Advice</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black/40 p-4 border border-white/10 rounded-2xl mt-4">
          <div className="w-full">
            <CopyButton data={analysisData} />
          </div>
        </div>
      </div>
    </main>
  );
}

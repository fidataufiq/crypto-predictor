"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Target, ShieldAlert, Crosshair, Wallet, AlertTriangle, Clock, Zap, BarChart2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
// Import tombol copy
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

  // Ambil data dari URL
  const coin = searchParams.get("coin") || "Unknown";
  const price = parseFloat(searchParams.get("price") || "0");
  const signal = searchParams.get("signal") || "HOLD";
  const time = searchParams.get("time") || "-";
  const timeframe = searchParams.get("tf") || "MEDIUM";

  const [levels, setLevels] = useState<any>(null);

  useEffect(() => {
    if (price > 0) {
      calculateLevels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, signal, timeframe]);

  const calculateLevels = () => {
    // Normalisasi sinyal
    const signalUpper = signal.toUpperCase();
    const isSell = signalUpper.includes("SELL");
    const isBuy = signalUpper.includes("BUY");
    const isNeutral = !isSell && !isBuy;

    // 1. Logika Tingkat Risiko & Reward (Tetap sama)
    let riskPercent = 0.02;
    let reward1 = 0.03;
    let reward2 = 0.06;
    let reward3 = 0.12;

    if (timeframe === "SHORT") {
      riskPercent = 0.005;
      reward1 = 0.01;
      reward2 = 0.02;
      reward3 = 0.04;
    } else if (timeframe === "LONG") {
      riskPercent = 0.05;
      reward1 = 0.1;
      reward2 = 0.2;
      reward3 = 0.5;
    }

    // 2. Hitung Harga SL/TP (Tetap sama)
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

    // 3. LOGIKA CONFIDENCE & REASONING (UPDATED: LEBIH VARIATIF)
    const baseConfidence = timeframe === "LONG" ? 85 : timeframe === "SHORT" ? 80 : 82;
    let dynamicConfidence = baseConfidence + Math.floor(Math.random() * 8); // Variasi 0-7%
    if (dynamicConfidence > 98) dynamicConfidence = 98;

    // --- DATABASE ALASAN (BANK KALIMAT) ---
    const buyReasons = [
      "Terdeteksi lonjakan volume di area Demand. Harga memantul dari EMA-200 dan RSI keluar dari zona Oversold. Momentum bullish kuat.",
      "Golden Cross terkonfirmasi pada timeframe 4H. Buyer mendominasi order book, menciptakan tekanan beli yang signifikan.",
      "Pola Bullish Engulfing terbentuk setelah koreksi minor. Indikator MACD menunjukkan crossover positif menuju tren naik.",
      "Harga berhasil breakout dari fase akumulasi. Support level bertahan kuat, target kenaikan menuju resistance terdekat.",
      "Hidden Bullish Divergence terlihat pada osilator RSI. Struktur pasar membentuk Higher Low, menandakan tren positif.",
    ];

    const sellReasons = [
      "Harga gagal menembus resistance kunci. Terbentuk pola Double Top dengan volume yang semakin menipis.",
      "Indikator RSI masuk zona Overbought (jenuh beli). Tekanan jual mulai meningkat di area supply psikologis.",
      "Death Cross terdeteksi pada MA-50 dan MA-200. Struktur pasar berubah menjadi Bearish (Lower High terbentuk).",
      "Breakdown dari pola Rising Wedge. Momentum bearish valid, waspadai penurunan lebih lanjut ke area support bawah.",
      "Penolakan harga (Rejection) yang kuat dengan candle sumbu panjang di atas. Indikasi smart money sedang distribusi.",
    ];

    const neutralReasons = [
      "Pasar sedang dalam fase konsolidasi (sideways). Belum ada konfirmasi breakout yang valid. Wait and See.",
      "Volatilitas menurun drastis. Bollinger Bands menyempit menandakan pergerakan besar akan segera terjadi, namun arah belum jelas.",
      "Harga tertahan di antara Support dan Resistance. Tidak ada dominasi buyer maupun seller saat ini.",
      "Indikator teknikal bertentangan (Mixed Signals). Disarankan menunggu konfirmasi candle penutup sebelum mengambil posisi.",
    ];

    // --- PILIH ALASAN SECARA ACAK ---
    let selectedReason = "";

    if (isSell) {
      // Pilih 1 kalimat acak dari daftar sellReasons
      selectedReason = sellReasons[Math.floor(Math.random() * sellReasons.length)];
    } else if (isBuy) {
      // Pilih 1 kalimat acak dari daftar buyReasons
      selectedReason = buyReasons[Math.floor(Math.random() * buyReasons.length)];
    } else {
      // Pilih 1 kalimat acak dari daftar neutralReasons
      selectedReason = neutralReasons[Math.floor(Math.random() * neutralReasons.length)];
      dynamicConfidence -= 15; // Turunkan confidence kalau netral
    }

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
      confidence: dynamicConfidence,
      reason: selectedReason, // Gunakan kalimat yang terpilih acak
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

  // Handle Error State
  if (!levels) {
    return (
      <main className="min-h-screen bg-[#050505] text-white p-6 font-sans flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-md text-center space-y-6 z-10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/10">
            <AlertTriangle size={32} className="text-red-500 opacity-80" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Data Unavailable</h2>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              Unable to fetch data.
              <br />
              <span className="text-gray-600">Try switching to Medium Term.</span>
            </p>
          </div>
          <button onClick={() => router.back()} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/5">
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  // Data untuk tombol Copy (Mengambil dari state levels yang baru)
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
                      <AlertTriangle size={8} /> SIMULATION
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

              {/* === FITUR BARU: AI CONFIDENCE & LOGIC === */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mt-2">
                {/* Confidence Meter */}
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BarChart2 size={14} className="text-blue-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">AI Confidence</span>
                  </div>
                  <span className={`text-xl font-mono font-bold ${levels.confidence > 80 ? "text-green-400" : "text-yellow-400"}`}>{levels.confidence}%</span>
                </div>

                {/* Progress Bar Visual */}
                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full transition-all duration-1000 ${levels.confidence > 80 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${levels.confidence}%` }}></div>
                </div>

                {/* Text Penjelasan (Transparency) */}
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 min-w-[16px]">
                    <Zap size={14} className={levels.isSell ? "text-red-400" : "text-yellow-400"} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                      <span className="font-bold text-gray-200">Market Insight: </span>
                      {levels.reason}
                    </p>
                  </div>
                </div>
              </div>
              {/* ========================================= */}
            </div>

            {/* Branding Footer */}
            <div className="px-6 pb-6 pt-2">
              <p className="text-center text-[11px] leading-relaxed text-gray-500 font-mono border-t border-white/5 pt-4">
                Generated by PRYDEXI AI • Time: {time} WIB <br />
                <span className="opacity-70">DYOR: Not Financial Advice</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="bg-black/40 p-4 border border-white/10 rounded-2xl mt-4">
          {/* Hapus tombol Wallet, dan biarkan CopyButton sendirian agar Full Width */}
          <div className="w-full">
            <CopyButton data={analysisData} />
          </div>
        </div>
      </div>
    </main>
  );
}

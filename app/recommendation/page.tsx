"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Target, ShieldAlert, Crosshair, AlertTriangle, Clock, Zap, BarChart2, ExternalLink, Coins, CheckCircle2, Info } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import CopyButton from "../components/CopyButton";

// --- KONFIGURASI LINK AFFILIATE ---
const EXCHANGES = [
  { name: "OKX", url: "https://okx.ac/join/91745600", color: "hover:border-white/40 hover:bg-white/5", label: "Global Pro" },
  { name: "BYBIT", url: "https://www.bybit.com/invite?ref=J5QYYX", color: "hover:border-yellow-500/40 hover:bg-yellow-500/5", label: "Futures King" },
  { name: "TRIV", url: "https://triv.co.id/", color: "hover:border-blue-500/40 hover:bg-blue-500/5", label: "Indonesian Reg" },
  { name: "FLOX", url: "#", color: "hover:border-violet-500/40 hover:bg-violet-500/5", label: "Referal : taqtrader07" },
];

export default function RecommendationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500 font-mono animate-pulse">Initializing Strategy Module...</div>}>
      <TradingPlanContent />
    </Suspense>
  );
}

function TradingPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // AMBIL DATA
  const coin = searchParams.get("coin") || "Unknown";
  const price = parseFloat(searchParams.get("price") || "0");
  const signal = searchParams.get("signal") || "HOLD";
  const time = searchParams.get("time") || "-";
  const timeframe = searchParams.get("tf") || "MEDIUM";

  const rsi = parseFloat(searchParams.get("rsi") || "50");
  const sma = parseFloat(searchParams.get("sma") || "0");
  const macdVal = parseFloat(searchParams.get("macd") || "0");

  const [levels, setLevels] = useState<any>(null);

  useEffect(() => {
    if (price > 0) calculateLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, signal, timeframe]);

  const calculateLevels = () => {
    const signalUpper = signal.toUpperCase();
    const isSell = signalUpper.includes("SELL");
    const isBuy = signalUpper.includes("BUY");
    const isNeutral = !isSell && !isBuy;

    // --- LOGIKA LEVEL HARGA ---
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

    // ===============================================
    // --- UPDATE: AI LOGIC NARRATIVE (LEBIH CERDAS) ---
    // ===============================================
    let reasonParts = [];

    // 1. ANALISIS RSI (Psychology)
    if (rsi < 30) {
      reasonParts.push("Indikator RSI mendeteksi kondisi Jenuh Jual (Oversold) ekstrem. Secara historis, harga aset sudah dinilai terlalu murah (Undervalued) dan pasar cenderung melakukan akumulasi ulang, memicu potensi pantulan harga.");
    } else if (rsi > 70) {
      reasonParts.push("Terjadi euforia pembelian berlebih (Overbought). RSI di atas 70 mengindikasikan harga naik terlalu cepat dan rentan terhadap aksi ambil untung (Profit Taking) massal yang menyebabkan koreksi.");
    } else if (rsi > 50 && isBuy) {
      reasonParts.push("RSI bergerak stabil di zona positif (>50). Ini menunjukkan minat beli (Buying Pressure) masih mendominasi pasar, menjaga momentum kenaikan tetap terjaga.");
    } else if (rsi < 50 && isSell) {
      reasonParts.push("RSI tertahan di zona negatif (<50). Hal ini mengonfirmasi bahwa para penjual (Sellers) masih memegang kendali penuh atas tren harga saat ini.");
    }

    // 2. ANALISIS MACD (Momentum)
    if (macdVal > 0) {
      reasonParts.push("Didukung oleh MACD Histogram positif, yang menandakan tren naik memiliki volume dan tenaga (Momentum) yang kuat, bukan sekadar kenaikan semu.");
    } else {
      reasonParts.push("MACD Histogram menunjukkan divergensi negatif, mengonfirmasi bahwa momentum penurunan masih sangat kuat dan belum ada tanda-tanda pelemahan tren jual.");
    }

    // 3. ANALISIS SMA (Trend Structure)
    if (price > sma) {
      reasonParts.push("Secara struktur, harga bertahan di atas garis rata-rata (SMA). Ini menjaga validitas fase Uptrend jangka menengah.");
    } else {
      reasonParts.push("Harga tertekan di bawah garis rata-rata (SMA), yang berfungsi sebagai resistensi dinamis dan mengonfirmasi fase Downtrend.");
    }

    let finalReason = reasonParts.join(" ");

    // Fallback jika Netral
    if (isNeutral) {
      finalReason = "Algoritma mendeteksi sinyal yang bertentangan (Mixed Signals). Volatilitas pasar menurun dan arah tren belum terbentuk jelas. Disarankan untuk 'Wait & See' hingga terjadi breakout valid.";
    }

    // --- LOGIKA CONFIDENCE ---
    let confidenceVal = 50;
    if (isBuy) confidenceVal = 100 - rsi + 10;
    else if (isSell) confidenceVal = rsi + 10;
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
      confidence: Math.round(confidenceVal),
      reason: finalReason,
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

  if (!levels) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500">Processing Data...</div>;

  const analysisData = {
    coinName: coin,
    coinSymbol: coin,
    price: `$${formatPrice(price)}`,
    signal: levels.isSell ? "SELL" : "BUY",
    confidence: levels.confidence,
    reason: levels.reason,
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* --- BACK BUTTON --- */}
      <div className="w-full max-w-5xl mb-6 z-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold group w-fit">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
      </div>

      {/* === BENTO GRID LAYOUT === */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 items-stretch">
        {/* --- LEFT COLUMN: STRATEGY (7/12) --- */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          {/* 1. TICKET HEADER */}
          <div className="bg-[#0a0a0a] rounded-3xl p-1 shadow-2xl shrink-0">
            <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-1.5 h-full ${levels.isSell ? "bg-red-500" : "bg-green-500"}`} />

              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-white">{coin}</h1>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${levels.isSell ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-green-500/30 text-green-400 bg-green-500/10"}`}>
                      {levels.isSell ? "SHORT" : "LONG"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <Clock size={12} />
                    <span className="text-xs font-mono">{getTfLabel(timeframe)} STRATEGY</span>
                  </div>
                </div>
                <div className="text-right">
                  {!levels.isActiveSignal ? (
                    <span className="text-orange-400 text-xs font-bold flex items-center gap-1">
                      <AlertTriangle size={12} /> NEUTRAL
                    </span>
                  ) : (
                    <span className="text-gray-500 text-[10px] font-mono">{time} WIB</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. NUMBERS GRID (Full Height & No Gaps) */}
          <div className="bg-[#0a0a0a] rounded-3xl p-1 shadow-xl flex-1 flex flex-col">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 flex flex-col gap-6">
              {/* Entry (Top) */}
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Crosshair size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Entry Zone</p>
                    <p className="text-2xl font-mono text-white tracking-tight">${formatPrice(price)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">Current</span>
                </div>
              </div>

              {/* SL & TP1 (Middle - SEKARANG MEMENUHI RUANG / FLEX-1) */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-colors h-full flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 text-red-400">
                    <ShieldAlert size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Stop Loss</span>
                  </div>
                  <p className="text-2xl font-mono text-white/90">${formatPrice(levels.sl)}</p>
                  <p className="text-[10px] text-red-400/50 mt-1 font-mono">-{(levels.riskPercent * 100).toFixed(1)}% Risk</p>
                </div>
                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl hover:bg-green-500/10 transition-colors h-full flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 text-green-400">
                    <Target size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">TP 1 (Safe)</span>
                  </div>
                  <p className="text-2xl font-mono text-white/90">${formatPrice(levels.tp1)}</p>
                  <p className="text-[10px] text-green-400/50 mt-1 font-mono">+{(levels.reward1 * 100).toFixed(1)}% Gain</p>
                </div>
              </div>

              {/* TP 2 & 3 (Bottom) */}
              <div className="space-y-3 shrink-0">
                {/* TP 2 */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold group-hover:bg-green-500/20 transition-colors">2</div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium group-hover:text-gray-300">TP Moderate</span>
                  </div>
                  <span className="font-mono text-gray-300 group-hover:text-white transition-colors">${formatPrice(levels.tp2)}</span>
                </div>

                {/* TP 3 */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-violet-500/[0.03] border border-violet-500/10 hover:bg-violet-500/[0.08] hover:border-violet-500/20 transition-all cursor-default group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-[10px] font-bold group-hover:bg-violet-500/20 transition-colors">3</div>
                    <span className="text-[11px] text-violet-300/70 uppercase tracking-wider font-medium group-hover:text-violet-300">TP Moonbag</span>
                  </div>
                  <span className="font-mono text-violet-200 group-hover:text-white transition-colors">${formatPrice(levels.tp3)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: INTEL & ACTION (5/12) --- */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          {/* 3. AI INTEL CARD */}
          <div className="bg-[#0a0a0a] rounded-3xl p-1 shadow-xl shrink-0">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={100} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <BarChart2 size={16} className="text-blue-400" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">AI Confidence</span>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <span className="text-4xl font-mono font-black text-white">{levels.confidence}%</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${levels.confidence > 80 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {levels.confidence > 80 ? "HIGH PROBABILITY" : "MODERATE POTENTIAL"}
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mb-6">
                  <div className={`h-full rounded-full transition-all duration-1000 ${levels.confidence > 80 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${levels.confidence}%` }}></div>
                </div>

                {/* AI Logic: DIPERJELAS & DESKRIPTIF */}
                <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10 shadow-inner">
                  <div className="flex gap-3 items-start">
                    <div className="mt-0.5 min-w-[16px]">
                      <Zap size={16} className={levels.isSell ? "text-red-400" : "text-yellow-400"} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-200 leading-relaxed font-light">
                        <span className="font-black text-white block mb-1 tracking-wide">AI ANALYSIS:</span>
                        {levels.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. EXECUTION HUB */}
          <div className="bg-[#0a0a0a] rounded-3xl p-1 shadow-xl flex-1 flex flex-col">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-full">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Share Signal</span>
                  </div>
                  <CopyButton data={analysisData} />
                </div>

                <div className="h-px bg-white/5 w-full" />

                <div className="w-full">
                  <div className="mb-3 flex items-center gap-2 text-gray-400">
                    <Coins size={14} className="text-violet-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Execute On</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {EXCHANGES.map((ex) => (
                      <a
                        key={ex.name}
                        href={ex.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 group ${ex.color}`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="font-black text-white text-sm tracking-wider group-hover:text-violet-200">{ex.name}</span>
                          <ExternalLink size={10} className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono mt-0.5 uppercase">{ex.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Disclaimer (Sharp & Clear) */}
              <div className="bg-white/[0.05] border border-white/10 rounded-xl p-4 text-center mt-6">
                <p className="text-[11px] text-gray-300 font-bold mb-1 flex items-center justify-center gap-1">
                  <AlertTriangle size={12} className="text-yellow-500" /> DISCLAIMER
                </p>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Not Financial Advice. Always Do Your Own Research (DYOR). <br />
                  Generated by <span className="text-violet-400 font-black">Prydexi AI System</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Target, ShieldAlert, Crosshair, Wallet, Share2, AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

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

  // Ambil data
  const coin = searchParams.get("coin") || "Unknown";
  const price = parseFloat(searchParams.get("price") || "0");
  const signal = searchParams.get("signal") || "HOLD";
  const time = searchParams.get("time") || "-";
  // Ambil timeframe (default MEDIUM jika tidak ada)
  const timeframe = searchParams.get("tf") || "MEDIUM";

  const [levels, setLevels] = useState<any>(null);

  useEffect(() => {
    if (price > 0) {
      calculateLevels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, signal, timeframe]);

  const calculateLevels = () => {
    const isSell = signal.toUpperCase().includes("SELL");
    const isActiveSignal = signal.toUpperCase().includes("BUY") || signal.toUpperCase().includes("SELL");

    // --- LOGIKA ADAPTIF BERDASARKAN TIMEFRAME ---
    let riskPercent = 0.02; // Default (Medium)
    let reward1 = 0.03;
    let reward2 = 0.06;
    let reward3 = 0.12;

    // Jika Scalping (1H) -> Target kecil & cepat
    if (timeframe === "SHORT") {
      riskPercent = 0.005; // SL 0.5% (Ketat)
      reward1 = 0.01; // TP 1%
      reward2 = 0.02; // TP 2%
      reward3 = 0.04; // TP 4% (Moonbag Scalp)
    }
    // Jika Invest (1D) -> Target lebar & santai
    else if (timeframe === "LONG") {
      riskPercent = 0.05; // SL 5% (Lebar biar gak gampang kena)
      reward1 = 0.1; // TP 10%
      reward2 = 0.2; // TP 20%
      reward3 = 0.5; // TP 50% (Long term hold)
    }

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

    setLevels({ sl, tp1, tp2, tp3, isSell, isActiveSignal, riskPercent, reward1, timeframeName: timeframe });
  };

  const formatPrice = (num: number) => {
    if (!num) return "0.00";
    return num > 1 ? num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : num.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  };

  // Helper untuk Label Timeframe
  const getTfLabel = (tf: string) => {
    if (tf === "SHORT") return "INTRADAY / SCALPING";
    if (tf === "LONG") return "LONG TERM INVEST";
    return "SWING TRADING";
  };

  if (!levels) return null;

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
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative ring-1 ring-white/5">
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
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-red-400">
                  <ShieldAlert size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Stop Loss</span>
                </div>
                <p className="text-lg font-mono text-white/90">${formatPrice(levels.sl)}</p>
                <p className="text-[10px] text-red-400/50 mt-0.5 font-mono">{(levels.riskPercent * 100).toFixed(1)}% Risk</p>
              </div>

              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl hover:bg-green-500/10 transition-colors">
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
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-green-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold group-hover:bg-green-500 group-hover:text-black transition-colors">2</div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium group-hover:text-green-400 transition-colors">Target Moderate</span>
                </div>
                <span className="font-mono text-gray-300 text-sm group-hover:text-white transition-colors">${formatPrice(levels.tp2)}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-violet-500/5 to-transparent border border-violet-500/10 hover:border-violet-500/40 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-[10px] font-bold group-hover:bg-violet-500 group-hover:text-white transition-colors">3</div>
                  <span className="text-[11px] text-violet-300/70 uppercase tracking-wider font-medium group-hover:text-violet-300 transition-colors">Moonbag Target</span>
                </div>
                <span className="font-mono text-violet-200 text-sm group-hover:text-white transition-colors shadow-violet-500/20">${formatPrice(levels.tp3)}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-black/40 p-4 border-t border-white/5 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-3 rounded-xl transition-all border border-white/5 hover:border-white/20 active:scale-95">
              <Wallet size={14} /> <span>Connect Wallet</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-3 rounded-xl transition-all border border-white/5 hover:border-white/20 active:scale-95">
              <Share2 size={14} /> <span>Save Plan</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-600 px-8 leading-relaxed">
          AI-generated plan for <strong>{getTfLabel(timeframe)}</strong>. <br />
          Based on current volatility & chart structure.
        </p>
      </div>
    </main>
  );
}

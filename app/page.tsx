"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCryptoAnalysis, COINS, Timeframe } from "./utils/cryptoAnalysis";
import AcademyTooltip from "./components/AcademyTooltip";
import CryptoChart from "./components/CryptoChart";
import SentimentGauge from "./components/SentimentGauge";
import CryptoSelector from "./components/CryptoSelector";
import MarketStats from "./components/MarketStats";
import InteractiveBackground from "./components/InteractiveBackground";
import Link from "next/link";
import SystemManual from "./components/SystemManual";
import { RefreshCw, TrendingUp, TrendingDown, Activity, BarChart3, Zap, Clock, ArrowRight, ArrowUpRight, ArrowDownRight, Layers, AlertCircle, Info } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [selectedCoin, setSelectedCoin] = useState(COINS[0].id);
  const [timeframe, setTimeframe] = useState<Timeframe>("MEDIUM");
  const [data, setData] = useState<any>(null);

  // State untuk Loading & Refetching
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  // === STATE BARU UNTUK DETEKSI MOUSE ===
  const [isCardHovered, setIsCardHovered] = useState(false);

  const fetchData = async () => {
    if (!data) setIsInitialLoad(true);
    else setIsRefetching(true);

    try {
      const [result] = await Promise.all([getCryptoAnalysis(selectedCoin, timeframe), new Promise((resolve) => setTimeout(resolve, 600))]);

      if (result) {
        setData(result);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setData(null);
    }

    setIsInitialLoad(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin, timeframe]);

  const LoadingOverlay = () => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]/60 backdrop-blur-md rounded-3xl transition-all duration-500">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap size={20} className="text-violet-400 animate-pulse" />
        </div>
      </div>
      <p className="text-xs text-violet-300 animate-pulse mt-4 tracking-widest uppercase font-bold">Scanning Asset Data...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* === BACKGROUND MENERIMA SINYAL DARI KARTU === */}
      {/* Jika isCardHovered = true, background akan mematikan lampunya */}
      <InteractiveBackground isHovering={isCardHovered} />

      <div className="z-10 w-full max-w-5xl space-y-4 flex flex-col items-center">
        {/* Header Title */}
        <div className="text-center space-y-1 w-full">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 drop-shadow-lg">PRYDEXI</h1>
          <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">AI-Driven Technical Analysis</p>
        </div>

        <div className="w-full">
          <MarketStats />
        </div>

        {/* --- MAIN GLASS CARD --- */}
        {/* Tambahkan Event Handler di sini untuk mendeteksi mouse */}
        <div
          className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative ring-1 ring-white/5 min-h-[800px] transition-all duration-500"
          onMouseEnter={() => setIsCardHovered(true)} // Mouse Masuk -> Lampu Mati
          onMouseLeave={() => setIsCardHovered(false)} // Mouse Keluar -> Lampu Nyala
        >
          {isInitialLoad && <LoadingOverlay />}
          {isRefetching && <LoadingOverlay />}

          <div className={`transition-opacity duration-500 ${isInitialLoad ? "opacity-0" : "opacity-100"}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 border-b border-white/5 pb-6">
              <div className="w-full sm:w-1/3">
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Asset Pair</label>
                <CryptoSelector coins={COINS} selectedId={selectedCoin} onSelect={setSelectedCoin} />
              </div>

              {data ? (
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Price</p>
                  <p className="text-3xl font-mono font-medium text-white tracking-tight drop-shadow-md">${data.price.toLocaleString()}</p>
                  <div className="flex items-center sm:justify-end gap-2 mt-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      <Clock size={10} />
                      <span>Updated: {data.lastUpdated} WIB</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-left sm:text-right mt-2 sm:mt-0 opacity-50">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Price</p>
                  <p className="text-3xl font-mono font-medium text-gray-500 tracking-tight">---</p>
                </div>
              )}
            </div>

            {data ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 pl-2">
                      <Layers size={14} className="text-gray-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:block">Timeframe</span>
                    </div>
                    <div className="flex gap-1">
                      {(["SHORT", "MEDIUM", "LONG"] as Timeframe[]).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                            timeframe === tf ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                          }`}
                        >
                          {tf === "SHORT" ? "1H" : tf === "MEDIUM" ? "4H" : "1D"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-[300px] bg-black/20 rounded-xl border border-white/5 overflow-hidden relative shadow-inner">
                    <div className="absolute top-2 left-3 z-10">
                      <span className="text-[10px] text-gray-500 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/5">Mode: {timeframe === "SHORT" ? "Intraday" : timeframe === "MEDIUM" ? "Swing" : "Long Term"}</span>
                    </div>
                    <div className="h-full w-full opacity-90 hover:opacity-100 transition-opacity">
                      <CryptoChart data={data.chartData} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white/5 to-transparent rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors cursor-default group">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold group-hover:text-violet-300 transition-colors">AI Recommendation</p>
                      <h2 className={`text-3xl font-black tracking-wider ${data.color} drop-shadow-lg mt-1`}>{data.signal}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Sentiment</p>
                      <p className="text-sm text-gray-200 mt-1">{data.sentiment}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 grid grid-cols-2 gap-3 content-start">
                  <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-between min-h-[190px] hover:border-violet-500/20 transition-colors">
                    <div className="flex items-center gap-2 w-full justify-center pt-1">
                      <Zap size={14} className="text-violet-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Psychology</span>
                      <AcademyTooltip text="Merah (Fear) = Waktunya Beli. Hijau (Greed) = Hati-hati Jual." />
                    </div>
                    <div className="flex-1 w-full flex items-center justify-center py-2">
                      <SentimentGauge score={data.sentimentScore} />
                    </div>
                    <div className="w-full flex justify-between px-4 text-[9px] text-gray-600 font-mono pt-3 border-t border-white/5">
                      <span>0 (Buy)</span>
                      <span>100 (Sell)</span>
                    </div>
                  </div>

                  <div className="col-span-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 relative hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-1 mb-1 text-gray-400">
                      <Activity size={12} />
                      <span className="text-[10px] font-bold uppercase">RSI</span>
                      <AcademyTooltip text="<30 = Oversold (Murah), >70 = Overbought (Mahal)." />
                    </div>
                    <p className={`text-lg font-mono font-medium ${Number(data.rsi) > 70 ? "text-red-400" : Number(data.rsi) < 30 ? "text-green-400" : "text-white"}`}>{data.rsi}</p>
                    <p className="text-[9px] text-gray-600">Relative Strength</p>
                  </div>

                  <div className="col-span-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 relative hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-1 mb-1 text-gray-400">
                      <BarChart3 size={12} />
                      <span className="text-[10px] font-bold uppercase">MACD</span>
                      <AcademyTooltip text="Jika Value > Signal, artinya Momentum Bullish (Naik)." />
                    </div>
                    <div className="flex flex-col">
                      <p className={`text-sm font-mono ${Number(data.macd.val) > Number(data.macd.signal) ? "text-green-400" : "text-red-400"}`}>
                        {data.macd.val} <span className="text-[9px] text-gray-500 ml-1">Val</span>
                      </p>
                      <p className="text-xs font-mono text-gray-400">
                        {data.macd.signal} <span className="text-[9px] text-gray-600 ml-1">Sig</span>
                      </p>
                    </div>
                  </div>

                  {/* === SMA TREND (FIXED TOOLTIP) === */}
                  {/* 1. HAPUS 'overflow-hidden' DI SINI AGAR TOOLTIP BISA MUNCUL KELUAR */}
                  <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 relative hover:bg-white/[0.05] transition-colors flex items-center justify-between group">
                    {/* 2. TAMBAHKAN 'rounded-xl' DI SINI AGAR GLOW TETAP RAPI (TIDAK BOCOR DI SUDUT) */}
                    <div className={`absolute inset-0 opacity-10 blur-none rounded-xl transition-colors duration-500 ${data.price > Number(data.sma) ? "bg-green-500" : "bg-red-500"}`} />

                    {/* Kiri: Label & Penjelasan */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1.5 rounded-md ${data.price > Number(data.sma) ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {data.price > Number(data.sma) ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Trend Arah Pasar</span>

                        {/* Tooltip sekarang aman karena parent tidak overflow-hidden */}
                        <AcademyTooltip text="Garis SMA 50 adalah 'Rata-rata Harga'. Jika harga sekarang di atas rata-rata, berarti pasar sedang SEMANGAT NAIK." />
                      </div>

                      {/* Status Besar & Jelas */}
                      <div className="flex flex-col">
                        <h3 className={`text-lg font-black tracking-wide ${data.price > Number(data.sma) ? "text-green-400" : "text-red-400"}`}>{data.price > Number(data.sma) ? "UPTREND (NAIK)" : "DOWNTREND (TURUN)"}</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          Harga saat ini <span className="text-white font-mono">${data.price.toLocaleString()}</span> berada
                          {data.price > Number(data.sma) ? " DI ATAS " : " DI BAWAH "}
                          rata-rata <span className="text-gray-400 font-mono">(${Number(data.sma).toLocaleString()})</span>.
                        </p>
                      </div>
                    </div>

                    {/* Kanan: Visual Indikator Simpel */}
                    <div className="relative z-10 hidden sm:block">
                      <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 ${data.price > Number(data.sma) ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}>
                        {data.price > Number(data.sma) ? <ArrowUpRight size={24} className="text-green-400" /> : <ArrowDownRight size={24} className="text-red-400" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-3 pt-2">
                  <button
                    onClick={() => {
                      if (!data) return;
                      const query = new URLSearchParams({
                        coin: selectedCoin,
                        price: data.price.toString(),
                        signal: data.signal,
                        sentiment: data.sentiment,
                        time: data.lastUpdated,
                        tf: timeframe,
                        // --- TAMBAHKAN DATA TEKNIKAL DI BAWAH INI BIAR LENGKAP ---
                        rsi: data.rsi,
                        sma: data.sma,
                        macd: data.macd.val, // Kirim nilai MACD
                        score: data.sentimentScore.toString(), // Kirim skor meteran
                      }).toString();
                      router.push(`/recommendation?${query}`);
                    }}
                    className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-violet-500/20"
                  >
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors" />
                    <div className="relative flex items-center justify-center gap-3 font-bold text-white tracking-wider text-sm">
                      <span>GET {timeframe} TRADING PLAN</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button onClick={fetchData} className="mt-4 text-[10px] text-gray-500 hover:text-violet-400 flex items-center justify-center gap-1 w-full transition-colors mx-auto">
                    <RefreshCw size={10} /> Refresh Data
                  </button>
                </div>
              </div>
            ) : (
              !isInitialLoad &&
              !isRefetching && (
                <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4 border border-red-500/10 bg-red-500/5 rounded-2xl">
                  <div className="bg-red-500/10 p-3 rounded-full">
                    <AlertCircle size={32} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Data Unavailable</p>
                    <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto">
                      Unable to fetch data for this asset/timeframe. <br />
                      Try switching to Medium Term or another coin.
                    </p>
                  </div>
                  <button onClick={fetchData} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">
                    Try Again
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer Credits & About Link */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-center text-[10px] text-gray-600 font-mono">Data provided by CoinGecko Public API</p>

          <Link href="/about" className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-95">
            <Info size={12} className="text-violet-400 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">About The Architect</span>
          </Link>
        </div>
      </div>
      <SystemManual />
    </main>
  );
}

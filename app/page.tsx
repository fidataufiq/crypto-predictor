// Lokasi: app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCryptoAnalysis, COINS, Timeframe } from "./utils/cryptoAnalysis";
import AcademyTooltip from "./components/AcademyTooltip";
import CryptoChart from "./components/CryptoChart";
import SentimentGauge from "./components/SentimentGauge";
import { RefreshCw, TrendingUp, Activity, BarChart3, Zap, Clock, ArrowRight, Layers } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [selectedCoin, setSelectedCoin] = useState(COINS[0].id);
  const [timeframe, setTimeframe] = useState<Timeframe>("MEDIUM");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getCryptoAnalysis(selectedCoin, timeframe);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin, timeframe]);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Container Utama */}
      <div className="z-10 w-full max-w-5xl space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">CRYPTO ORACLE</h1>
          <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">AI-Driven Technical Analysis</p>
        </div>

        {/* --- MAIN GLASS CARD --- */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative ring-1 ring-white/5">
          {/* 1. TOP SECTION: Dropdown & Price */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 border-b border-white/5 pb-6">
            <div className="w-full sm:w-1/3">
              <label htmlFor="coin-select" className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                Asset Pair
              </label>
              <div className="relative">
                <select
                  id="coin-select"
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-violet-500 outline-none cursor-pointer"
                >
                  {COINS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-gray-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {data && (
              <div className="text-left sm:text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Price</p>
                <p className="text-3xl font-mono font-medium text-white tracking-tight">${data.price.toLocaleString()}</p>
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
            )}
          </div>

          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              <p className="text-xs text-violet-300 animate-pulse">Analyzing Market Structure...</p>
            </div>
          ) : data ? (
            // --- LAYOUT GRID UTAMA ---
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {/* === KUBU A (KIRI - CHART & SIGNAL) === */}
              <div className="lg:col-span-2 space-y-4">
                {/* Timeframe Selector */}
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

                {/* Chart Section */}
                <div className="w-full h-[300px] bg-black/20 rounded-xl border border-white/5 overflow-hidden relative">
                  <div className="absolute top-2 left-3 z-10">
                    <span className="text-[10px] text-gray-500 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/5">Mode: {timeframe === "SHORT" ? "Intraday" : timeframe === "MEDIUM" ? "Swing" : "Long Term"}</span>
                  </div>
                  <div className="h-full w-full">
                    <CryptoChart data={data.chartData} />
                  </div>
                </div>

                {/* Signal Header */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white/5 to-transparent rounded-xl border border-white/5">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">AI Recommendation</p>
                    <h2 className={`text-3xl font-black tracking-wider ${data.color} drop-shadow-lg mt-1`}>{data.signal}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Sentiment</p>
                    <p className="text-sm text-gray-200 mt-1">{data.sentiment}</p>
                  </div>
                </div>
              </div>

              {/* === KUBU B (KANAN - INDICATORS) === */}
              <div className="lg:col-span-1 grid grid-cols-2 gap-3 content-start">
                {/* 1. Gauge Card */}
                <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={14} className="text-violet-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Psychology</span>
                    <AcademyTooltip text="Merah (Fear) = Waktunya Beli. Hijau (Greed) = Hati-hati Jual." />
                  </div>
                  <div className="flex-1 w-full flex items-center justify-center min-h-[120px]">
                    <SentimentGauge score={data.sentimentScore} />
                  </div>
                  <div className="w-full flex justify-between px-4 text-[9px] text-gray-600 font-mono pt-3 border-t border-white/5 mt-2">
                    <span>0 (Buy)</span>
                    <span>100 (Sell)</span>
                  </div>
                </div>

                {/* 2. RSI Card */}
                <div className="col-span-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 relative">
                  <div className="flex items-center gap-1 mb-1 text-gray-400">
                    <Activity size={12} />
                    <span className="text-[10px] font-bold uppercase">RSI</span>
                    <AcademyTooltip text="<30 = Oversold (Murah), >70 = Overbought (Mahal)." />
                  </div>
                  <p className={`text-lg font-mono font-medium ${Number(data.rsi) > 70 ? "text-red-400" : Number(data.rsi) < 30 ? "text-green-400" : "text-white"}`}>{data.rsi}</p>
                  <p className="text-[9px] text-gray-600">Relative Strength</p>
                </div>

                {/* 3. MACD Card */}
                <div className="col-span-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 relative">
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

                {/* 4. SMA Card */}
                <div className="col-span-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-gray-400">
                      <TrendingUp size={12} />
                      <span className="text-[10px] font-bold uppercase">SMA Trend</span>
                      <AcademyTooltip text="Jika Harga > SMA 50, tren sedang NAIK." />
                    </div>
                    <span className="text-xs font-mono text-gray-300">${data.sma}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden mt-1 flex">
                    <div className={`h-full ${data.price > Number(data.sma) ? "bg-violet-500 w-full" : "bg-gray-600 w-1/2"}`} />
                  </div>
                </div>
              </div>
              {/* End Kubu B */}

              {/* === ACTION BUTTONS (SEKARANG DI LUAR KUBU, PALING BAWAH) === */}
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
            <div className="text-center py-10 text-gray-500 text-xs">Failed to load data.</div>
          )}
        </div>
        <p className="text-center text-[10px] text-gray-600 font-mono">Data provided by CoinGecko Public API</p>
      </div>
    </main>
  );
}

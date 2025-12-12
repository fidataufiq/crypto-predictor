"use client";
import { TrendingUp, TrendingDown, Activity, PieChart, Zap } from "lucide-react";

export default function MarketStats() {
  const marketData = {
    btcDominance: "52.4%",
    fearGreed: 74,
    fearGreedText: "Greed",
    globalVolume: "$42.5B",
    marketTrend: "Bullish",
    topGainer: "SOL +8.2%",
  };

  const getSentimentColor = (value: number) => {
    if (value >= 75) return "text-green-400";
    if (value >= 50) return "text-blue-400";
    if (value >= 25) return "text-orange-400";
    return "text-red-500";
  };

  // PERUBAHAN DI SINI:
  // 1. Menghapus 'max-w-4xl' -> Agar lebar sama dengan kartu utama.
  // 2. Menghapus 'mb-8' -> Agar jarak ke bawah tidak kejauhan.
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {/* CARD 1: FEAR & GREED */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-yellow-400" />
          <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Sentiment</span>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-2xl font-black ${getSentimentColor(marketData.fearGreed)}`}>{marketData.fearGreed}</span>
          <span className="text-xs text-gray-400 mb-1 font-mono">/ 100</span>
        </div>
        <p className={`text-xs font-bold mt-1 ${getSentimentColor(marketData.fearGreed)}`}>{marketData.fearGreedText}</p>
      </div>

      {/* CARD 2: BTC DOMINANCE */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center gap-2 mb-2">
          <PieChart size={16} className="text-orange-400" />
          <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Dominance</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black text-white">{marketData.btcDominance}</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">BTC Market Share</p>
      </div>

      {/* CARD 3: VOLATILITY */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center gap-2 mb-2">
          <Activity size={16} className="text-purple-400" />
          <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Volatility</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black text-white">High</span>
        </div>
        <p className="text-[10px] text-purple-300/70 mt-1">High Risk Market</p>
      </div>

      {/* CARD 4: TREND */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center gap-2 mb-2">
          {marketData.marketTrend === "Bullish" ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />}
          <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Trend</span>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-2xl font-black ${marketData.marketTrend === "Bullish" ? "text-green-400" : "text-red-400"}`}>{marketData.marketTrend}</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          Top: <span className="text-white font-bold">{marketData.topGainer}</span>
        </p>
      </div>
    </div>
  );
}

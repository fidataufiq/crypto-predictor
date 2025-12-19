"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, Activity, Globe, PieChart, AlertTriangle } from "lucide-react";

export default function MarketStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlobalData() {
      try {
        // Ambil Data Global dari CoinGecko
        const res = await axios.get("https://api.coingecko.com/api/v3/global");
        const data = res.data.data;

        // Ambil Fear & Greed (Simulasi random karena API F&G butuh endpoint lain,
        // tapi biar cepat kita pakai data simulasi yang cerdas berbasis market change)
        const marketChange = data.market_cap_change_percentage_24h_usd;
        let fearGreedVal = 50;
        let fearGreedText = "Neutral";

        // Logika Simulasi F&G berdasarkan pergerakan pasar 24jam
        if (marketChange > 2) {
          fearGreedVal = 75;
          fearGreedText = "Greed";
        } else if (marketChange > 0) {
          fearGreedVal = 60;
          fearGreedText = "Neutral";
        } else if (marketChange > -2) {
          fearGreedVal = 40;
          fearGreedText = "Fear";
        } else {
          fearGreedVal = 20;
          fearGreedText = "Extreme Fear";
        }

        setStats({
          btcDom: data.market_cap_percentage.btc.toFixed(1),
          ethDom: data.market_cap_percentage.eth.toFixed(1),
          marketCapChange: marketChange.toFixed(2),
          activeCoins: data.active_cryptocurrencies,
          fearGreedVal,
          fearGreedText,
        });
      } catch (error) {
        console.error("Gagal ambil data global:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGlobalData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          // UPDATE LOADING SKELETON STYLE
          <div key={i} className="h-20 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  // STYLE CARD BARU (Glassmorphism Terang)
  const cardStyle = "bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:bg-white/10 transition-colors";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {/* 1. GLOBAL TREND */}
      <div className={cardStyle}>
        <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity ${Number(stats.marketCapChange) >= 0 ? "text-green-500" : "text-red-500"}`}>
          <TrendingUp size={40} />
        </div>
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <Globe size={14} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Global Trend</span>
        </div>
        <div>
          <span className={`text-xl font-mono font-bold ${Number(stats.marketCapChange) >= 0 ? "text-green-400" : "text-red-400"}`}>
            {Number(stats.marketCapChange) >= 0 ? "+" : ""}
            {stats.marketCapChange}%
          </span>
          <span className="text-[9px] text-gray-500 block">24h Market Cap Change</span>
        </div>
      </div>

      {/* 2. BTC DOMINANCE */}
      <div className={cardStyle}>
        <div className="absolute top-0 right-0 p-2 opacity-10 text-orange-500 group-hover:opacity-20 transition-opacity">
          <PieChart size={40} />
        </div>
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <PieChart size={14} className="text-orange-400" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Dominance</span>
        </div>
        <div>
          <span className="text-xl font-mono font-bold text-white">{stats.btcDom}%</span>
          <div className="w-full bg-white/10 h-1 mt-1 rounded-full overflow-hidden">
            {" "}
            {/* Update bg track */}
            <div className="bg-orange-500 h-full" style={{ width: `${stats.btcDom}%` }}></div>
          </div>
          <span className="text-[9px] text-gray-500 block mt-1">Bitcoin Market Share</span>
        </div>
      </div>

      {/* 3. FEAR & GREED (SIMULATED) */}
      <div className={cardStyle}>
        <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity ${stats.fearGreedVal > 50 ? "text-green-500" : "text-red-500"}`}>
          <Activity size={40} />
        </div>
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <Activity size={14} className={stats.fearGreedVal > 50 ? "text-green-400" : "text-red-400"} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Sentiment</span>
        </div>
        <div>
          <span className={`text-lg font-bold uppercase ${stats.fearGreedVal > 50 ? "text-green-400" : "text-red-400"}`}>{stats.fearGreedText}</span>
          <span className="text-[9px] text-gray-500 block">Market Emotion Index</span>
        </div>
      </div>

      {/* 4. ACTIVE ASSETS */}
      <div className={cardStyle}>
        <div className="absolute top-0 right-0 p-2 opacity-10 text-violet-500 group-hover:opacity-20 transition-opacity">
          <AlertTriangle size={40} />
        </div>
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <Globe size={14} className="text-violet-400" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Active Assets</span>
        </div>
        <div>
          <span className="text-xl font-mono font-bold text-white">{stats.activeCoins?.toLocaleString() || "10,000+"}</span>
          <span className="text-[9px] text-gray-500 block">Total Crypto Coins</span>
        </div>
      </div>
    </div>
  );
}

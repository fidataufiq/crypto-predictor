"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, memo } from "react"; // 1. Import memo

const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false }) as any;

interface GaugeProps {
  score: number; // 0 - 100
}

function SentimentGauge({ score }: GaugeProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const percentForChart = Math.min(Math.max(score / 100, 0), 1);

  // --- LOGIKA WARNA STANDAR (FEAR = MERAH, GREED = HIJAU) ---
  let statusText = "NEUTRAL";
  let statusColor = "text-gray-400";
  let glowColor = "bg-gray-500";

  if (score <= 30) {
    statusText = "EXTREME FEAR";
    statusColor = "text-red-500";
    glowColor = "bg-red-500";
  } else if (score <= 45) {
    statusText = "FEAR";
    statusColor = "text-orange-400";
    glowColor = "bg-orange-500";
  } else if (score >= 75) {
    statusText = "EXTREME GREED";
    statusColor = "text-emerald-400";
    glowColor = "bg-emerald-500";
  } else if (score >= 55) {
    statusText = "GREED";
    statusColor = "text-green-400";
    glowColor = "bg-green-500";
  } else {
    statusText = "NEUTRAL";
    statusColor = "text-yellow-400";
    glowColor = "bg-yellow-500";
  }

  if (!mounted) return <div className="h-[100px] w-full animate-pulse bg-white/5 rounded-full" />;

  return (
    <div className="flex flex-col items-center justify-center w-full relative group">
      {/* Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full ${glowColor} blur-[60px] opacity-20 pointer-events-none transition-colors duration-1000`} />

      {/* Wrapper Gauge */}
      <div className="w-full max-w-[220px] px-2 flex justify-center relative z-10">
        <GaugeChart
          id="gauge-chart-1"
          nrOfLevels={30}
          colors={["#ef4444", "#f59e0b", "#10b981"]}
          arcWidth={0.12}
          arcPadding={0.02}
          cornerRadius={3}
          percent={percentForChart}
          textColor="#ffffff"
          needleColor="#ffffff"
          needleBaseColor="#1f2937"
          hideText={true}
          animate={true} // Animasi tetap hidup, tapi hanya jalan saat skor berubah
          animDelay={0}
          animateDuration={1000}
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Label Typography */}
      <div className="text-center mt-[-10px] z-20 relative">
        <div className="flex flex-col items-center">
          <p className={`text-4xl font-mono font-bold leading-none tracking-tighter drop-shadow-lg ${statusColor}`}>{score.toFixed(0)}</p>
          <div className={`mt-2 px-3 py-1 rounded-full border border-white/5 bg-[#050505]/80 backdrop-blur-sm ${statusColor}`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]">{statusText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Bungkus export dengan memo()
// Ini mencegah re-render jika props 'score' tidak berubah
export default memo(SentimentGauge);

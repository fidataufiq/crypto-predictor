// Lokasi: app/components/SentimentGauge.tsx
"use client";

import dynamic from "next/dynamic";

const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false }) as any;

interface GaugeProps {
  score: number;
}

export default function SentimentGauge({ score }: GaugeProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      {/* Wrapper Gauge */}
      <div className="w-full max-w-[200px] px-2 flex justify-center">
        <GaugeChart
          id="gauge-chart-1"
          nrOfLevels={3}
          colors={["#ef4444", "#eab308", "#22c55e"]}
          arcWidth={0.3}
          percent={score}
          textColor="#ffffff"
          needleColor="#a78bfa"
          needleBaseColor="#a78bfa"
          hideText={true}
          animate={true}
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Label Kustom: PERBAIKAN DI SINI */}
      {/* Saya hapus margin negatif (-mt) dan ganti jadi margin positif kecil (mt-1) */}
      {/* Jarum tidak akan menabrak angka lagi */}
      <div className="text-center mt-1 z-10 relative">
        <p className="text-2xl font-black text-white leading-none">{(score * 100).toFixed(0)}</p>
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${score < 0.4 ? "text-red-400" : score > 0.6 ? "text-green-400" : "text-yellow-400"}`}>{score < 0.4 ? "FEAR" : score > 0.6 ? "GREED" : "NEUTRAL"}</p>
      </div>
    </div>
  );
}

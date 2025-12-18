// Lokasi: app/components/SentimentGauge.tsx
"use client";

import dynamic from "next/dynamic";

const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false }) as any;

interface GaugeProps {
  score: number; // Menerima angka 0 - 100 (misal: 45.5)
}

export default function SentimentGauge({ score }: GaugeProps) {
  // 1. NORMALISASI UNTUK CHART (0 - 1)
  // Library butuh 0.0 sampai 1.0, jadi kita bagi 100.
  // Kita clamp (kunci) biar gak error kalau datanya aneh (misal -5 atau 120)
  const percentForChart = Math.min(Math.max(score / 100, 0), 1);

  // 2. LOGIKA TEKS & WARNA (Menggunakan Score Asli 0-100)
  let statusText = "NEUTRAL";
  let statusColor = "text-yellow-400";

  if (score <= 30) {
    statusText = "FEAR (BUY)";
    statusColor = "text-emerald-400"; // Hijau/Buy (Kiri)
  } else if (score <= 45) {
    statusText = "FEAR";
    statusColor = "text-green-400";
  } else if (score >= 70) {
    statusText = "EXTREME GREED (SELL)";
    statusColor = "text-red-500"; // Merah/Sell (Kanan)
  } else if (score >= 55) {
    statusText = "GREED";
    statusColor = "text-orange-400";
  }

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      {/* Wrapper Gauge */}
      <div className="w-full max-w-[200px] px-2 flex justify-center">
        <GaugeChart
          id="gauge-chart-1"
          nrOfLevels={3}
          // Urutan warna: Kiri (Hijau/Buy), Tengah (Kuning), Kanan (Merah/Sell)
          // Sesuai filosofi RSI: Rendah = Buy, Tinggi = Sell
          colors={["#10b981", "#fbbf24", "#ef4444"]}
          arcWidth={0.3}
          percent={percentForChart} // <--- SUDAH DIBAGI 100 (AMAN)
          textColor="#ffffff"
          needleColor="#a78bfa"
          needleBaseColor="#a78bfa"
          hideText={true}
          animate={true}
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Label Kustom */}
      <div className="text-center mt-1 z-10 relative">
        {/* Tampilkan angka asli (0-100), dibulatkan */}
        <p className={`text-2xl font-black leading-none ${statusColor}`}>{score.toFixed(0)}</p>

        {/* Status Teks */}
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${statusColor}`}>{statusText}</p>
      </div>
    </div>
  );
}

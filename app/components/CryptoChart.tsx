// Lokasi: app/components/CryptoChart.tsx
"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";

export default function CryptoChart({ data }: { data: any[] }) {
  // Kita gunakan ref untuk container
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // Kita simpan instance chart di ref agar tidak hilang saat re-render
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    // 1. Cek apakah container sudah siap
    if (!chartContainerRef.current) return;

    // 2. Bersihkan chart lama jika ada (Penting untuk React Strict Mode)
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // 3. Buat Chart Baru
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    });

    // Simpan instance ke ref
    chartRef.current = chart;

    // 4. Tambahkan Series (Gunakan try-catch untuk safety)
    try {
      const candleSeries = chart.addCandlestickSeries({
        upColor: "#4ade80", // Hijau Neon
        downColor: "#ef4444", // Merah Neon
        borderVisible: false,
        wickUpColor: "#4ade80",
        wickDownColor: "#ef4444",
      });

      // Masukkan data
      candleSeries.setData(data);

      // Fit konten agar grafik pas di tengah
      chart.timeScale().fitContent();
    } catch (error) {
      console.error("Gagal membuat series:", error);
    }

    // 5. Handle Resize Window
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // 6. Cleanup Function (Wajib)
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]); // Re-run effect jika data berubah

  return <div ref={chartContainerRef} className="w-full h-[250px]" />;
}

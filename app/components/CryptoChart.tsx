"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, CrosshairMode } from "lightweight-charts";
import { Activity, BarChart2 } from "lucide-react"; // Pastikan install lucide-react

type ChartType = "AREA" | "CANDLE";

export default function CryptoChart({ data }: { data: any[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Default ke AREA agar tampilan awal cantik & aman
  const [chartType, setChartType] = useState<ChartType>("AREA");

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    // 1. Reset Chart
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // 2. Setup Dasar Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#525252",
        fontFamily: "'Courier New', Courier, monospace",
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          width: 1,
          color: "rgba(139, 92, 246, 0.5)",
          style: 0,
          labelBackgroundColor: "#8b5cf6",
        },
        horzLine: {
          width: 1,
          color: "rgba(139, 92, 246, 0.5)",
          style: 0,
          labelBackgroundColor: "#8b5cf6",
        },
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        scaleMargins: {
          top: 0.2,
          bottom: 0.1,
        },
      },
      handleScale: { axisPressedMouseMove: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
    });

    chartRef.current = chart;

    // 3. Logika Pembuatan Series Berdasarkan Pilihan User
    if (chartType === "AREA") {
      // === MODE AREA (Default - Futuristic) ===
      const areaSeries = chart.addAreaSeries({
        topColor: "rgba(139, 92, 246, 0.4)",
        bottomColor: "rgba(139, 92, 246, 0.0)",
        lineColor: "#8b5cf6",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: "#fff",
        crosshairMarkerBackgroundColor: "#8b5cf6",
      });

      // Mapping data aman untuk Area
      const mappedData = data.map((item) => ({
        time: item.time,
        value: item.close || item.value || item.price || 0,
      }));

      // Sort ascending (wajib buat lightweight-charts)
      const sortedData = mappedData.sort((a, b) => (a.time > b.time ? 1 : -1));
      areaSeries.setData(sortedData);
    } else {
      // === MODE CANDLESTICK (Trader Style) ===
      const candleSeries = chart.addCandlestickSeries({
        upColor: "#4ade80",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#4ade80",
        wickDownColor: "#ef4444",
      });

      // SAFE MAPPING: Mengubah data garis menjadi data candle "palsu" jika OHLC tidak lengkap
      // Ini mencegah error "Data Unavailable" atau crash
      const mappedData = data.map((item) => {
        const val = item.close || item.value || item.price || 0;
        return {
          time: item.time,
          // Jika data open/high/low tidak ada, kita pakai value (jadi candle gepeng/flat line)
          // Ini trik biar chart tidak crash
          open: item.open || val,
          high: item.high || val,
          low: item.low || val,
          close: val,
        };
      });

      const sortedData = mappedData.sort((a, b) => (a.time > b.time ? 1 : -1));
      candleSeries.setData(sortedData);
    }

    chart.timeScale().fitContent();

    // 4. Handle Resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, chartType]); // Re-render saat data atau chartType berubah

  return (
    <div className="relative w-full h-[300px] group">
      {/* === TOMBOL SWITCH CHART (Sekarang Selalu Muncul) === */}
      <div className="absolute top-2 right-2 z-20 flex gap-1 bg-black/40 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-lg">
        {/* Tombol Line/Area */}
        <button
          onClick={() => setChartType("AREA")}
          className={`p-1.5 rounded-md transition-all ${chartType === "AREA" ? "bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
          title="Line View"
        >
          <Activity size={14} />
        </button>

        {/* Tombol Candlestick */}
        <button
          onClick={() => setChartType("CANDLE")}
          className={`p-1.5 rounded-md transition-all ${chartType === "CANDLE" ? "bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
          title="Candle View"
        >
          <BarChart2 size={14} />
        </button>
      </div>

      {/* Container Grafik */}
      <div
        ref={chartContainerRef}
        className="w-full h-full transition-opacity duration-500 ease-in-out"
        style={{
          filter: "drop-shadow(0px 0px 20px rgba(139, 92, 246, 0.1))",
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { BookOpen, X, Activity, BarChart3, Target, Cpu, Globe, TrendingUp, Layers, Zap } from "lucide-react";

export default function SystemManual() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("logic"); // Default ke Logic biar langsung paham

  // Konten Manual
  const content = {
    logic: {
      title: "AI Logic Core",
      icon: <Cpu size={18} />,
      text: (
        <div className="space-y-5 text-sm text-gray-400">
          <p>
            <strong className="text-white">Bagaimana Keputusan Dibuat?</strong>
            <br />
            Sistem ini tidak menebak. Ia menggunakan metode <span className="text-violet-400 font-bold">"Strict Confluence Scoring"</span>. Setiap indikator memberikan poin untuk menghasilkan skor akhir (-4 hingga +4).
          </p>

          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2">Contoh Perhitungan Skor:</h4>
            <div className="flex justify-between items-center text-xs">
              <span>RSI Oversold {"(<30)"}</span>
              <span className="text-green-400 font-mono font-bold">+2 Poin</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>Harga Tembus Bawah Bollinger</span>
              <span className="text-green-400 font-mono font-bold">+2 Poin</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>Trend SMA Bullish</span>
              <span className="text-green-400 font-mono font-bold">+1 Poin</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between items-center">
              <strong className="text-white">TOTAL SKOR</strong>
              <strong className="text-violet-400 font-mono text-lg">+5 (STRONG BUY)</strong>
            </div>
          </div>

          <p>
            <strong className="text-white">Dampaknya:</strong> Sinyal hanya muncul jika <em className="text-gray-300">beberapa indikator setuju sekaligus</em> (Confluence). Jika indikator saling bertentangan, skor akan mendekati 0
            (Netral/Hold). Ini meminimalisir sinyal palsu.
          </p>
        </div>
      ),
    },
    indicators: {
      title: "Technical Indicators",
      icon: <BarChart3 size={18} />,
      text: (
        <div className="space-y-4 text-sm text-gray-400">
          <p>Sistem memantau 4 pilar utama data teknikal:</p>
          <ul className="space-y-4">
            <li className="bg-white/[0.03] p-3 rounded-lg border-l-2 border-violet-500">
              <strong className="text-white flex items-center gap-2">
                <Activity size={14} /> RSI (Momentum)
              </strong>
              <span className="text-xs text-gray-500 block mt-1">
                Mengukur kecepatan harga. <br />• {">"} 70 = Overbought (Mahal/Rawan Turun). <br />• {"<"} 30 = Oversold (Murah/Diskon).
              </span>
            </li>

            {/* INDIKATOR BARU: BOLLINGER BANDS */}
            <li className="bg-white/[0.03] p-3 rounded-lg border-l-2 border-blue-500">
              <strong className="text-white flex items-center gap-2">
                <Layers size={14} /> Bollinger Bands (Volatility)
              </strong>
              <span className="text-xs text-gray-500 block mt-1">
                Mengukur "kewajaran" harga dan volatilitas. <br />
                • Harga kena Pita Atas = Mahal. <br />
                • Harga kena Pita Bawah = Murah. <br />
              </span>
            </li>

            {/* INDIKATOR BARU: SMA */}
            <li className="bg-white/[0.03] p-3 rounded-lg border-l-2 border-yellow-500">
              <strong className="text-white flex items-center gap-2">
                <TrendingUp size={14} /> SMA 50 (Trend Filter)
              </strong>
              <span className="text-xs text-gray-500 block mt-1">
                Garis rata-rata 50 candle terakhir. <br />
                • Harga di ATAS garis = Uptrend (Aman untuk Buy). <br />• Harga di BAWAH garis = Downtrend (Hati-hati).
              </span>
            </li>

            <li className="bg-white/[0.03] p-3 rounded-lg border-l-2 border-fuchsia-500">
              <strong className="text-white flex items-center gap-2">
                <BarChart3 size={14} /> MACD (Confirmation)
              </strong>
              <span className="text-xs text-gray-500 block mt-1">Validasi kekuatan tren. Histogram hijau berarti pembeli sedang mendominasi.</span>
            </li>
          </ul>
        </div>
      ),
    },
    plan: {
      title: "Execution Plan",
      icon: <Target size={18} />,
      text: (
        <div className="space-y-4 text-sm text-gray-400">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-500/10 p-2 rounded border border-red-500/20 col-span-2">
              <strong className="text-red-400 text-xs uppercase">1. Stop Loss (Proteksi)</strong>
              <p className="text-xs mt-1">Jaring pengaman wajib. Jika harga menyentuh level ini, sistem menyarankan keluar untuk mencegah kerugian lebih dalam.</p>
            </div>
            <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
              <strong className="text-green-400 text-xs uppercase">2. Take Profit</strong>
              <p className="text-xs mt-1">Level harga optimal untuk mengambil keuntungan secara bertahap.</p>
            </div>
            <div className="bg-violet-500/10 p-2 rounded border border-violet-500/20">
              <strong className="text-violet-400 text-xs uppercase">3. Execute On</strong>
              <p className="text-xs mt-1">Jembatan langsung ke Bursa (Exchange). Analisis tanpa aksi adalah sia-sia. Tombol ini mempercepat Anda membuka posisi di broker terpercaya (OKX, Bybit, dll) sebelum momentum hilang.</p>
            </div>
          </div>
        </div>
      ),
    },
    macro: {
      title: "Global Dashboard",
      icon: <Globe size={18} />,
      text: (
        <div className="space-y-4 text-sm text-gray-400">
          <p>Halaman depan adalah ringkasan cuaca ekonomi kripto:</p>
          <ul className="list-disc pl-4 space-y-2 marker:text-gray-600">
            <li>
              <strong className="text-white">Fear & Greed Index:</strong> Psikologi massa. Beli saat orang takut (Fear), jual saat orang serakah (Greed).
            </li>
            <li>
              <strong className="text-white">BTC Dominance:</strong> Jika Dominance turun, biasanya uang mengalir ke Altcoins (Altseason).
            </li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <>
      {/* 1. FLOATING BUTTON (Pojok Kanan Bawah) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-bounce-slow"
        aria-label="Open System Manual"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-20 animate-ping"></span>
        <BookOpen size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
      </button>

      {/* 2. MODAL POPUP */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setIsOpen(false)}></div>

          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">SYSTEM ARCHITECT</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Manual & Logic Guide v1.5</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors" aria-label="Close Manual">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Sidebar Menu */}
              <div className="w-full md:w-1/3 bg-black/20 border-r border-white/5 p-2 overflow-y-auto">
                {Object.keys(content).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full text-left px-4 py-4 rounded-xl mb-1 flex items-center gap-3 transition-all ${activeTab === key ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}
                  >
                    {content[key as keyof typeof content].icon}
                    <span className="text-xs font-bold uppercase tracking-wider">{content[key as keyof typeof content].title}</span>
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-[#0a0a0a] to-[#111] custom-scrollbar">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                  {content[activeTab as keyof typeof content].icon}
                  {content[activeTab as keyof typeof content].title}
                </h3>
                <div className="leading-relaxed">{content[activeTab as keyof typeof content].text}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 text-center">
              <p className="text-[9px] text-gray-600 font-mono">PRYDEXI AI SYSTEM • ENCRYPTED PROTOCOL</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

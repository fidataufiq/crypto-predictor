"use client";

import { useState } from "react";
import { BookOpen, X, Activity, BarChart3, Target, Cpu, Globe, TrendingUp } from "lucide-react";

export default function SystemManual() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("workflow");

  // Konten Manual
  const content = {
    workflow: {
      title: "System Workflow",
      icon: <Globe size={18} />,
      text: (
        <div className="space-y-4 text-sm text-gray-400">
          <p>
            <strong className="text-white">Cara Kerja Algoritma:</strong> Sistem ini menggabungkan data makro global (Dashboard) dengan data teknikal spesifik aset (Chart Analysis).
          </p>
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong className="text-violet-400">Langkah 1:</strong> Pilih Aset (Koin) dan Timeframe (Short/Medium/Long).
            </li>
            <li>
              <strong className="text-violet-400">Langkah 2:</strong> AI akan memindai indikator teknikal (RSI, MACD, SMA) secara real-time.
            </li>
            <li>
              <strong className="text-violet-400">Langkah 3:</strong> Sistem menghasilkan "Trading Plan" berisi level Entry, Stop Loss, dan Target Profit berdasarkan volatilitas aset tersebut.
            </li>
          </ul>
        </div>
      ),
    },
    macro: {
      title: "Macro Dashboard",
      icon: <Activity size={18} />,
      text: (
        <div className="space-y-4 text-sm text-gray-400">
          <p>Data di halaman depan adalah "Cuaca Pasar Global". Inilah cara membacanya:</p>
          <div className="grid gap-3">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <strong className="text-yellow-400 block mb-1">Sentiment (Fear & Greed)</strong>
              Mengukur emosi massa. Saat "Extreme Fear", biasanya harga murah (diskon). Saat "Extreme Greed", pasar rawan koreksi (turun).
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <strong className="text-orange-400 block mb-1">BTC Dominance</strong>
              Persentase uang yang ada di Bitcoin dibanding Altcoin. Dominance tinggi = Altcoin cenderung lesu.
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <strong className="text-green-400 block mb-1">Market Trend</strong>
              Arah pergerakan mayoritas aset dalam 24 jam terakhir (Bullish/Bearish).
            </div>
          </div>
        </div>
      ),
    },
    indicators: {
      title: "Technical Core",
      icon: <BarChart3 size={18} />,
      text: (
        <div className="space-y-4 text-sm text-gray-400">
          <p>Mengapa indikator setiap koin berbeda? Karena likuiditas dan komunitas setiap koin membentuk pola psikologi yang unik.</p>
          <ul className="space-y-3">
            <li className="border-l-2 border-violet-500 pl-3">
              <strong className="text-white block">RSI (Relative Strength Index)</strong>
              Mengukur kecepatan perubahan harga. <br />
              <span className="text-xs text-gray-500">
                Logika: Jika {">"} 70 (Overbought), harga kemahalan. Jika {"<"} 30 (Oversold), harga murah.
              </span>
            </li>
            <li className="border-l-2 border-fuchsia-500 pl-3">
              <strong className="text-white block">MACD (Momentum)</strong>
              Mendeteksi perubahan momentum/kekuatan tren. <br />
              <span className="text-xs text-gray-500">Logika: Jika garis Value memotong ke atas garis Signal, itu sinyal awal Bullish (Naik).</span>
            </li>

            {/* --- TAMBAHAN PENJELASAN SMA --- */}
            <li className="border-l-2 border-yellow-500 pl-3">
              <strong className="text-white block">SMA Trend (Simple Moving Average)</strong>
              Garis rata-rata harga untuk melihat arah tren utama. <br />
              <span className="text-xs text-gray-500">Logika: Jika Harga saat ini DI ATAS garis SMA, tren sedang NAIK (Uptrend). Jika DI BAWAH, tren sedang TURUN (Downtrend).</span>
            </li>
            {/* ------------------------------- */}

            <li className="border-l-2 border-blue-500 pl-3">
              <strong className="text-white block">Market Psychology Gauge</strong>
              Skor khusus yang dihitung AI berdasarkan gabungan RSI + Volatilitas untuk menentukan apakah koin ini sedang "Panik" atau "FOMO".
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
          <p>Trading Plan disusun dengan Manajemen Risiko yang ketat:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 bg-red-500/10 p-2 rounded border border-red-500/20">
              <strong className="text-red-400 text-xs uppercase">Stop Loss (SL)</strong>
              <p className="text-xs">Titik keluar otomatis jika prediksi salah, untuk membatasi kerugian (Proteksi Modal).</p>
            </div>
            <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
              <strong className="text-green-400 text-xs uppercase">Target Safe</strong>
              <p className="text-xs">Titik ambil profit sebagian untuk mengamankan cuan.</p>
            </div>
            <div className="bg-violet-500/10 p-2 rounded border border-violet-500/20">
              <strong className="text-violet-400 text-xs uppercase">Moonbag</strong>
              <p className="text-xs">Menyisakan sedikit koin (5-10%) untuk target harga tertinggi (To The Moon).</p>
            </div>
            <div className="col-span-2 bg-white/5 p-2 rounded border border-white/10">
              <strong className="text-white text-xs uppercase">AI Confidence & Insight</strong>
              <p className="text-xs">Keyakinan AI (0-100%) berdasarkan seberapa banyak indikator yang "setuju" dengan sinyal tersebut.</p>
            </div>
          </div>
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

          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">SYSTEM MANUAL</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Operations & Logic Guide</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors" aria-label="Close Manual">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
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

              <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-[#0a0a0a] to-[#111]">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  {content[activeTab as keyof typeof content].icon}
                  {content[activeTab as keyof typeof content].title}
                </h3>
                <div className="leading-relaxed">{content[activeTab as keyof typeof content].text}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 text-center">
              <p className="text-[9px] text-gray-600 font-mono">READ-ONLY ACCESS • ENCRYPTED PROTOCOL</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

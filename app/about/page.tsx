"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Github, Instagram, Mail, Terminal, Database, Bot, Coffee, AlertCircle, History, X, GitCommit, ChevronRight, MessageSquarePlus } from "lucide-react";

// Pastikan file ini sudah Anda buat di folder src/data/changelogs.js
import { changelogData } from "../data/changelogs";

export default function AboutPage() {
  const router = useRouter();
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Helper warna badge
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Major":
        return "bg-violet-500/20 text-violet-300 border-violet-500/30";
      case "Improvement":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-500/30">
      {/* === BACKGROUND STATIC MATRIX === */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>

      {/* Main Card */}
      <div className="w-full max-w-2xl relative z-10">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-all hover:-translate-x-1 text-xs uppercase tracking-widest font-bold group">
          <ArrowLeft size={16} className="text-violet-500 group-hover:text-white transition-colors" />
          Return to Terminal
        </button>

        <div className="bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8 relative">
            <div className="absolute top-0 w-24 h-24 bg-violet-500/30 blur-[40px] rounded-full"></div>
            <div className="w-24 h-24 bg-[#0a0a0a] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative z-10">
              <Terminal size={36} className="text-violet-400" />
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 text-white drop-shadow-lg">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">ARCHITECT</span>
            </h1>
            <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-bold border-b border-white/10 pb-4">Human Vision • Machine Execution</p>
          </div>

          {/* Narasi Utama */}
          <div className="space-y-8 text-center max-w-lg mx-auto mb-12">
            {/* The Logic */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <Database size={12} className="text-blue-400" /> The Logic
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm">
                Pasar digerakkan oleh dua hal: <span className="text-gray-200">Momentum</span> dan <span className="text-gray-200">Emosi</span>. Sistem ini tidak menebak; ia membedah struktur pasar menggunakan indikator teruji (RSI, MACD,
                SMA) untuk memisahkan sinyal valid dari sekadar kebisingan (noise).
              </p>
            </div>

            {/* The Symbiosis */}
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <Bot size={12} className="text-fuchsia-400" /> The Symbiosis
              </h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm italic mb-4">
                "Karya ini adalah kolaborasi antara Logika Manusia dan Kecerdasan Buatan. Tanpa AI, visi arsitektural ini mungkin tak akan mencapai tingkat presisi dan estetika yang Anda lihat sekarang.
                <span className="text-violet-300 not-italic"> I code the logic, AI polishes the soul.</span>"
              </p>
            </div>

            {/* === ACTION BUTTONS (LOG & FEEDBACK) === */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {/* Button 1: System Log */}
              <button
                onClick={() => setIsLogOpen(true)}
                className="group relative flex items-center justify-center gap-3 px-5 py-2.5 bg-black hover:bg-zinc-900 border border-violet-500/30 hover:border-violet-400 rounded-lg transition-all duration-300 overflow-hidden shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                <History size={14} className="text-violet-400 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold text-gray-300 group-hover:text-white tracking-widest uppercase">System Log</span>
              </button>

              {/* Button 2: Feedback (BARU) */}
              <a
                href="https://forms.gle/YOUR_GOOGLE_FORM_ID_HERE" // Ganti dengan link Google Form asli nanti
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 overflow-hidden w-full sm:w-auto"
              >
                <MessageSquarePlus size={14} className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white tracking-widest uppercase">Feedback / Report</span>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-emerald-300 ml-1 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* === DEVELOPER'S NOTE === */}
          <div className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/10 text-left relative overflow-hidden">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
              <AlertCircle size={18} className="text-yellow-500/80" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Developer's Note</span>
            </div>

            {/* Isi Surat */}
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed font-light">
              <p>Halo, Sahabat Trader. Terima kasih sudah mampir dan mencoba alat analisis sederhana ini.</p>
              <p>
                Sebelum Anda melangkah lebih jauh, saya ingin menyampaikan <strong>permohonan maaf yang sebesar-besarnya</strong> apabila Anda menemukan adanya keterlambatan data, <em>loading</em> yang terkadang lama, atau selisih harga
                yang tidak 100% presisi dengan market real-time.
              </p>
              <p>
                Anda mungkin juga menyadari bahwa <strong>pilihan aset (koin) yang tersedia masih terbatas</strong>. Hal ini dikarenakan saya memprioritaskan stabilitas sistem pada koin-koin Top Tier terlebih dahulu, mengingat adanya
                batasan akses data pada API publik yang saya gunakan.
              </p>
              <p>
                Saat ini sistem ini memang berjalan murni menggunakan sumber daya gratisan tanpa server premium. Namun, percayalah bahwa logika di balik setiap sinyal trading plan dibuat dengan penuh perhitungan untuk membantu analisa Anda.
              </p>
              <p className="text-white pt-2 font-medium">Terima kasih telah memaklumi kekurangan ini. Dukungan dan kehadiran Anda di sini sudah menjadi motivasi terbesar bagi saya untuk terus berinovasi.</p>
            </div>

            {/* Tombol Donasi */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 pt-6 border-t border-white/5 border-dashed">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center mb-1">Bantu tambah fitur & unlock lebih banyak koin?</p>
              <a
                href="https://trakteer.id/thekreator"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-violet-900/20"
              >
                <Coffee size={18} className="group-hover:animate-bounce" />
                <span>Traktir Kopi untuk Developer</span>
              </a>
            </div>
          </div>

          {/* Contact Icons */}
          <div className="flex justify-center gap-8 border-t border-white/5 pt-8">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors hover:scale-110">
              <Github size={18} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors hover:scale-110">
              <Instagram size={18} />
            </a>
            <a href="mailto:nextlapstudio@gmail.com" className="text-gray-500 hover:text-white transition-colors hover:scale-110">
              <Mail size={18} />
            </a>
          </div>

          <p className="text-center text-[9px] text-gray-700 mt-8 font-mono tracking-wider">BUILT WITH PASSION & NEURAL NETWORKS</p>
        </div>
      </div>

      {/* === MODAL / POPUP CHANGELOG === */}
      {isLogOpen && (
        <div className="fixed inset-0 z-[999] flex justify-center items-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={() => setIsLogOpen(false)} />

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-[#050505] border border-violet-500/20 rounded-2xl shadow-2xl shadow-violet-900/20 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-300">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
                  <GitCommit className="text-violet-500" />
                  SYSTEM_LOG
                </h2>
                <p className="text-zinc-500 text-xs mt-1 tracking-wider uppercase">Architecture Revision History</p>
              </div>
              <button onClick={() => setIsLogOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition" aria-label="Close System Log">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {changelogData.map((item, index) => (
                <div key={index} className="relative pl-8 border-l border-white/10 last:border-0">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-violet-600 ring-4 ring-[#050505]" />

                  {/* Header Item */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-mono text-violet-400 font-bold text-sm">{item.version}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTypeColor(item.type)} uppercase tracking-wide font-medium`}>{item.type}</span>
                    <span className="text-zinc-600 text-xs ml-auto font-mono">{item.date}</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed font-light">{item.description}</p>

                  {/* Details */}
                  <ul className="space-y-1">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="text-zinc-500 text-sm flex items-start gap-2">
                        <span className="text-violet-500/50 mt-1.5">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="pt-4 text-center">
                <p className="text-zinc-800 text-[10px] font-mono uppercase tracking-widest">End of Record</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Github, Instagram, Mail, Terminal, Code2, Cpu, Database } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-500/30">
      {/* === BACKGROUND YANG BARU & WAH === */}

      {/* 1. Grid Pattern (Efek Lantai Digital/Matrix) */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* 2. Spotlight Atas (Efek Cahaya dari 'Langit') */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>

      {/* 3. Glowing Orbs (Efek Misterius di Pojok) */}
      <div className="absolute top-1/4 left-[-100px] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-[-100px] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* =================================== */}

      {/* Main Card */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Navigation Back */}
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-all hover:-translate-x-1 text-xs uppercase tracking-widest font-bold group">
          <ArrowLeft size={16} className="text-violet-500 group-hover:text-white transition-colors" />
          Return to Terminal
        </button>

        {/* Glass Card Container */}
        <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
          {/* Efek Garis Laser di atas Card */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>

          {/* Profile / Avatar Section */}
          <div className="flex flex-col items-center text-center mb-10 relative">
            {/* Avatar Glow Behind */}
            <div className="absolute top-0 w-24 h-24 bg-violet-500/30 blur-[40px] rounded-full"></div>

            <div className="w-24 h-24 bg-[#0a0a0a] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative z-10 transform rotate-3 hover:rotate-0 transition-all duration-500">
              <Terminal size={36} className="text-violet-400" />
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 text-white drop-shadow-lg">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">ARCHITECT</span>
            </h1>
            <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-bold border-b border-white/10 pb-4">System Creator & Logic Designer</p>
          </div>

          {/* The Narrative (Misterius tapi Wah) */}
          <div className="space-y-6 text-center max-w-lg mx-auto mb-12">
            <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base italic">"Data hanyalah kebisingan tanpa struktur. Di sini, saya membangun kerangka untuk melihat masa depan."</p>
            <p className="text-gray-400 leading-relaxed font-light text-sm">
              Platform ini adalah manifestasi dari obsesi terhadap pola matematika dan psikologi pasar. <br />
              <span className="text-violet-300">No signals provided by human emotion. Only pure code.</span>
            </p>
          </div>

          {/* Tech Stack Grid (Skills) */}
          <div className="grid grid-cols-3 gap-3 mb-12">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.08] transition-all group cursor-default">
              <Code2 size={18} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
              <span className="text-[9px] font-bold uppercase text-gray-500 group-hover:text-gray-300">Clean Arch</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.08] transition-all group cursor-default">
              <Cpu size={18} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
              <span className="text-[9px] font-bold uppercase text-gray-500 group-hover:text-gray-300">Algorithmic</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.08] transition-all group cursor-default">
              <Database size={18} className="text-gray-500 group-hover:text-fuchsia-400 transition-colors" />
              <span className="text-[9px] font-bold uppercase text-gray-500 group-hover:text-gray-300">Data Flow</span>
            </div>
          </div>

          {/* Contact / Connect */}
          <div className="flex justify-center gap-8 border-t border-white/5 pt-8">
            <a href="#" className="group flex flex-col items-center gap-1">
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors text-gray-400 group-hover:text-white">
                <Github size={18} />
              </div>
            </a>
            <a href="#" className="group flex flex-col items-center gap-1">
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors text-gray-400 group-hover:text-white">
                <Instagram size={18} />
              </div>
            </a>
            <a href="mailto:fidat@example.com" className="group flex flex-col items-center gap-1">
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors text-gray-400 group-hover:text-white">
                <Mail size={18} />
              </div>
            </a>
          </div>

          <p className="text-center text-[9px] text-gray-700 mt-8 font-mono tracking-wider">SYSTEM VERSION 1.0.4 • ACCESS GRANTED</p>
        </div>
      </div>
    </main>
  );
}

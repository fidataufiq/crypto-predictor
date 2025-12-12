"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

interface SelectorProps {
  coins: Coin[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CryptoSelector({ coins, selectedId, onSelect }: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cari data koin yang sedang dipilih untuk ditampilkan di tombol utama
  const selectedCoin = coins.find((c) => c.id === selectedId) || coins[0];

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 1. TRIGGER BUTTON (Tampilan Utama) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 transition-all duration-300 hover:border-violet-500/50 group ${
          isOpen ? "ring-2 ring-violet-500/20 border-violet-500" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Logo Koin Terpilih */}
          <div className="w-8 h-8 rounded-full bg-white/5 p-1 flex items-center justify-center overflow-hidden">
            <img src={selectedCoin.image} alt={selectedCoin.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold tracking-wide">{selectedCoin.name}</span>
            <span className="block text-[10px] text-gray-400 font-mono">{selectedCoin.symbol}/USD</span>
          </div>
        </div>
        <ChevronDown size={18} className={`text-gray-500 transition-transform duration-300 group-hover:text-violet-400 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 2. DROPDOWN MENU (Grid Layout) */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-[500px] z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Glassmorphism Panel */}
          <div className="bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-4">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Select Asset Pair</div>

            {/* GRID SYSTEM: 2 Kolom di HP, 4 Kolom di Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {coins.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => {
                    onSelect(coin.id);
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2 ${
                    selectedId === coin.id ? "bg-violet-600/20 border-violet-500/50" : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 object-contain" />
                  <div className="text-center">
                    <span className="block text-[10px] font-bold text-white">{coin.symbol}</span>
                    <span className="block text-[9px] text-gray-400 truncate w-16">{coin.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

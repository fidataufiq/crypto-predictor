"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Star, Layers } from "lucide-react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  category?: string;
}

interface SelectorProps {
  coins: Coin[];
  selectedId: string;
  onSelect: (id: string) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

export default function CryptoSelector({ coins, selectedId, onSelect, favorites = [], onToggleFavorite }: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cari data koin yang sedang dipilih
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

  // --- LOGIKA GROUPING (PENGELOMPOKAN) ---

  // 1. Ambil koin Favorit
  const favCoins = coins.filter((c) => favorites.includes(c.id));

  // 2. Ambil koin Sisa (Non-Favorit)
  const otherCoins = coins.filter((c) => !favorites.includes(c.id));

  // 3. Kelompokkan Non-Favorit berdasarkan Kategori
  const categorizedCoins: Record<string, Coin[]> = {};

  otherCoins.forEach((coin) => {
    const cat = coin.category || "Others";
    if (!categorizedCoins[cat]) {
      categorizedCoins[cat] = [];
    }
    categorizedCoins[cat].push(coin);
  });

  // Urutan Kategori
  const categoryOrder = ["Major Assets", "New & Trending", "Infrastructure", "Meme Economy", "AI & DePIN", "Oracle / Infra", "Others"];

  // --- COMPONENT RENDER ITEM (Untuk mengurangi duplikasi kode) ---
  const renderCoinItem = (coin: Coin) => {
    const isFav = favorites.includes(coin.id);
    return (
      <div
        key={coin.id}
        className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2 cursor-pointer group/item ${
          selectedId === coin.id ? "bg-violet-600/20 border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.1)]" : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
        }`}
        onClick={() => {
          onSelect(coin.id);
          setIsOpen(false);
        }}
        role="button"
        tabIndex={0}
      >
        {/* Tombol Bintang (Favorit) */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Mencegah dropdown tertutup saat klik bintang
              onToggleFavorite(coin.id);
            }}
            aria-label={isFav ? `Unfavorite ${coin.name}` : `Favorite ${coin.name}`}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-1 right-1 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <Star size={12} className={isFav ? "fill-yellow-400 text-yellow-400" : "text-gray-600 group-hover/item:text-gray-400"} />
          </button>
        )}

        {/* Gambar Koin */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coin.image} alt={coin.name} className="w-9 h-9 object-contain pointer-events-none mb-1" />

        {/* Teks Info */}
        <div className="text-center pointer-events-none">
          <div className="flex items-center justify-center gap-1">
            <span className="block text-[11px] font-bold text-white">{coin.symbol}</span>
          </div>
          <span className="block text-[10px] text-gray-400 truncate w-20">{coin.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 1. TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 transition-all duration-300 hover:border-violet-500/50 group ${
          isOpen ? "ring-2 ring-violet-500/20 border-violet-500" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/5 p-1 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedCoin.image} alt={selectedCoin.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold tracking-wide">{selectedCoin.name}</span>
            <div className="flex items-center gap-1.5">
              <span className="block text-[10px] text-gray-400 font-mono">{selectedCoin.symbol}/USD</span>
              {/* Badge Kategori Kecil */}
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5 hidden sm:inline-block">{favorites.includes(selectedCoin.id) ? "My Favorite" : selectedCoin.category}</span>
            </div>
          </div>
        </div>
        <ChevronDown size={18} className={`text-gray-500 transition-transform duration-300 group-hover:text-violet-400 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 2. DROPDOWN MENU */}
      {isOpen && (
        // RESPONSIVE WIDTH: w-full (HP) -> 450px (Tablet Kecil) -> 600px (Tablet) -> 720px (Desktop)
        <div className="absolute top-full left-0 mt-2 w-full sm:w-[450px] md:w-[600px] lg:w-[720px] z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[450px]">
            {/* Header Sticky */}
            <div className="p-3 border-b border-white/5 bg-[#0f0f0f] sticky top-0 z-20 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Asset Pair</span>
              <span className="text-[9px] text-gray-600 flex items-center gap-1">
                <Star size={10} /> Priority Access
              </span>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-5 space-y-6">
              {/* GRUP 1: FAVORITES (Jika ada) */}
              {favCoins.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest flex items-center gap-2 pl-1">
                    <Star size={12} fill="currentColor" /> My Favorites
                  </h3>
                  {/* Grid Responsif: 2 -> 3 -> 4 -> 5 kolom */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">{favCoins.map(renderCoinItem)}</div>
                </div>
              )}

              {/* GRUP 2: CATEGORIES */}
              {categoryOrder.map((category) => {
                const groupItems = categorizedCoins[category];
                if (!groupItems || groupItems.length === 0) return null;

                return (
                  <div key={category} className="space-y-3">
                    <div className="h-px bg-white/5 w-full my-2"></div>

                    <h3 className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest flex items-center gap-2 pl-1">
                      <Layers size={12} /> {category}
                    </h3>
                    {/* Grid Responsif: 2 -> 3 -> 4 -> 5 kolom */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">{groupItems.map(renderCoinItem)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

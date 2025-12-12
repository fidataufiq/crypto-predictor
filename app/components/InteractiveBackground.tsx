"use client";

import { useEffect, useState } from "react";

// Menerima props 'isHovering' dari induk
export default function InteractiveBackground({ isHovering }: { isHovering: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      {/* 1. Base Color */}
      <div className="absolute inset-0 bg-[#050505]"></div>

      {/* 2. Static Ambient Glow (Tetap nyala meski mouse di card, agar tidak gelap total) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] opacity-40"></div>

      {/* 3. Grid Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, 5%, white, 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, 5%, white, 95%, transparent)",
        }}
      ></div>

      {/* 4. MOUSE SPOTLIGHT (AKAN HILANG JIKA isHovering === true) */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isHovering ? "opacity-0" : "opacity-100"}`}
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      ></div>

      {/* 5. Highlight Grid (Juga ikut hilang agar bersih) */}
      <div
        className={`absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px] transition-opacity duration-700 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
        style={{
          maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      ></div>
    </div>
  );
}

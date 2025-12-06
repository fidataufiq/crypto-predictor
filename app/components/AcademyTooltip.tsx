// app/components/AcademyTooltip.tsx
import { Info } from "lucide-react";

interface TooltipProps {
  text: string;
}

export default function AcademyTooltip({ text }: TooltipProps) {
  return (
    <div className="group relative inline-block ml-1 align-middle z-50">
      <Info size={12} className="text-gray-500 hover:text-violet-400 cursor-help transition-colors" />

      {/* Tooltip Content */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900/95 backdrop-blur-md border border-violet-500/30 rounded-xl text-[10px] text-gray-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none transform group-hover:-translate-y-1">
        {text}
        {/* Panah kecil di bawah tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900/95" />
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

interface AnalysisData {
  coinName: string;
  coinSymbol: string;
  price: string;
  signal: string;
  confidence: number;
  reason: string;
}

export default function CopyButton({ data }: { data: AnalysisData }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    // 1. Siapkan Teks
    const textToCopy = `
🚀 *CRYPTO SIGNAL UPDATE* 🚀
---------------------------
🪙 Coin: *${data.coinName}* (${data.coinSymbol})
💰 Harga: ${data.price}
📊 Sinyal: *${data.signal}* ${data.signal === "BUY" ? "🟢" : "🔴"}
📈 Confidence: ${data.confidence}%

💡 *Analisa AI:*
"${data.reason}"

_Dibuat oleh CryptoPredict App_
    `.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback untuk browser yang memblokir clipboard
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!successful) throw new Error("Fallback copy failed");
      }

      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Gagal menyalin:", err);
      alert("Maaf, browser Anda memblokir fitur copy otomatis.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      // PERUBAHAN DI SINI:
      // 1. Saya tambahkan 'h-14' (Tinggi tetap) agar tidak naik turun.
      // 2. Saya hapus 'py-3' (karena sudah pakai h-14).
      // 3. Saya hapus 'scale-105' (agar tidak membesar/kaget).
      className={`
        h-14 w-full flex items-center justify-center gap-2 px-6 rounded-xl font-bold transition-colors duration-300
        ${
          isCopied
            ? "bg-green-500 text-white shadow-green-500/20 shadow-lg" // Hapus scale, sisakan warna
            : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600"
        }
      `}
    >
      {isCopied ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Berhasil Disalin!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            ></path>
          </svg>
          Salin Analisa
        </>
      )}
    </button>
  );
}

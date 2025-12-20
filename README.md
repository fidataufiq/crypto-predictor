# Crypto Prediction Dashboard 🚀

Ini adalah proyek **Crypto Prediction Dashboard** yang dibangun menggunakan [Next.js](https://nextjs.org) (App Router). Aplikasi ini bertujuan untuk memvisualisasikan data pasar cryptocurrency secara real-time dan menyajikan prediksi harga masa depan berdasarkan analisis data historis (atau model Machine Learning).

## 🌟 Fitur Utama

- **Real-time Data Tracking:** Memantau harga mata uang kripto terkini (Bitcoin, Ethereum, dll).
- **Price Prediction:** Visualisasi prediksi pergerakan harga untuk 7 hari atau 30 hari ke depan.
- **Interactive Charts:** Grafik interaktif menggunakan [Recharts/Chart.js] untuk analisis teknikal.
- **Market Sentiment:** (Opsional) Analisis sentimen pasar (Bearish/Bullish).
- **Responsive Design:** Tampilan optimal di desktop dan mobile.

## 🛠 Teknologi yang Digunakan

- **Framework:** [Next.js 16+](https://nextjs.org) (App Router & Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** [Recharts / Chart.js / TradingView Lightweight Charts]
- **Data Fetching:** [TanStack Query / Axios / Fetch API]
- **Crypto API:** [CoinGecko / Binance API / CoinMarketCap]
- **Font:** [Geist](https://vercel.com/font)

---

## ⚙️ Persiapan Awal (Prerequisites)

Sebelum menjalankan proyek, pastikan Anda memiliki API Key (jika menggunakan CoinMarketCap atau layanan berbayar lainnya).

1.  Duplikat file environment:
    ```bash
    cp .env.example .env.local
    ```
2.  Isi variabel environment di `.env.local`:
    ```env
    NEXT_PUBLIC_API_URL=[https://api.coingecko.com/api/v3](https://api.coingecko.com/api/v3)
    # NEXT_PUBLIC_API_KEY=your_api_key_here (jika diperlukan)
    ```

---

## 🚀 Cara Menjalankan (Getting Started)

Pertama, install dependency yang diperlukan:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Kemudian, jalankan development server:

npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev

Buka http://localhost:3000 di browser Anda untuk melihat hasilnya.

## 📂 Struktur Proyek

app/: Halaman dan routing aplikasi (App Router).

components/: Komponen UI yang dapat digunakan kembali (Charts, Cards, Tables).

lib/ atau utils/: Fungsi utilitas untuk memformat harga atau kalkulasi prediksi.

hooks/: Custom React Hooks untuk fetching data crypto.

types/: Definisi TypeScript interface untuk respon API.

"use client";

import Image from "next/image";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsView, { AnalysisResult } from "./components/ResultsView";

/* ──────────── Dummy Data ──────────── */
const MOCK_DATA: Record<string, AnalysisResult> = {
  default: {
    keyword: "",
    category: "Umum",
    opportunity_score: 50,
    opportunity_level: "niche",
    opportunity_label: "Niche",
    metrics: {
      predicted_demand: 500,
      competition_density: 0.5,
      competition_label: "Sedang",
      avg_price: 75000,
    },
    explanations: [
      {
        icon: "check",
        text: "Pasar masih memiliki ruang untuk pemain baru dengan diferensiasi yang tepat.",
      },
      {
        icon: "warning",
        text: "Kompetisi sedang, perlu strategi unik untuk menonjol di pasar.",
      },
      {
        icon: "warning",
        text: "Demand moderat, perlu riset lebih lanjut untuk validasi potensi pasar.",
      },
    ],
  },
  "frozen food dimsum": {
    keyword: "Frozen Food Dimsum",
    category: "Makanan",
    opportunity_score: 74,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 780,
      competition_density: 0.18,
      competition_label: "Rendah",
      avg_price: 89000,
    },
    explanations: [
      {
        icon: "check",
        text: "Persaingan rendah (0.18), belum banyak seller frozen dimsum yang konsisten di marketplace, hal ini paling berpengaruh.",
      },
      {
        icon: "check",
        text: "Demand tinggi (780 unit/bulan), tren frozen food naik pasca pandemi, dimsum jadi favorit.",
      },
      {
        icon: "warning",
        text: "Harga menengah sebesar Rp 45.000, margin cukup, tapi perlu volume untuk profit optimal.",
      },
    ],
  },
  "gamis syar'i premium": {
    keyword: "Gamis Syar'i Premium",
    category: "Fashion",
    opportunity_score: 81,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 1200,
      competition_density: 0.22,
      competition_label: "Rendah",
      avg_price: 350000,
    },
    explanations: [
      {
        icon: "check",
        text: "Demand sangat tinggi (1200 unit/bulan), pasar busana muslim terus berkembang pesat.",
      },
      {
        icon: "check",
        text: "Kompetisi masih rendah (0.22), banyak ruang untuk brand baru yang berkualitas.",
      },
      {
        icon: "check",
        text: "Harga premium (Rp 350.000), margin keuntungan besar untuk setiap unit terjual.",
      },
    ],
  },
  "kaos polos": {
    keyword: "Kaos Polos",
    category: "Fashion",
    opportunity_score: 18,
    opportunity_level: "red_ocean",
    opportunity_label: "Red Ocean",
    metrics: {
      predicted_demand: 5000,
      competition_density: 0.92,
      competition_label: "Sangat Tinggi",
      avg_price: 45000,
    },
    explanations: [
      {
        icon: "warning",
        text: "Kompetisi sangat tinggi (0.92), ribuan seller sudah bersaing ketat di marketplace.",
      },
      {
        icon: "warning",
        text: "Meskipun demand tinggi (5000 unit/bulan), pasar sudah sangat jenuh.",
      },
      {
        icon: "warning",
        text: "Harga rendah (Rp 45.000), margin tipis dan sulit bersaing tanpa skala besar.",
      },
    ],
  },
  "snack pedas kekinian": {
    keyword: "Snack Pedas Kekinian",
    category: "Makanan",
    opportunity_score: 48,
    opportunity_level: "niche",
    opportunity_label: "Niche",
    metrics: {
      predicted_demand: 620,
      competition_density: 0.45,
      competition_label: "Sedang",
      avg_price: 25000,
    },
    explanations: [
      {
        icon: "check",
        text: "Tren snack pedas masih tinggi di kalangan anak muda, potensi viral di media sosial.",
      },
      {
        icon: "warning",
        text: "Kompetisi sedang (0.45), perlu diferensiasi rasa atau packaging yang unik.",
      },
      {
        icon: "warning",
        text: "Harga rendah (Rp 25.000), butuh volume penjualan tinggi untuk profit optimal.",
      },
    ],
  },
};

function getMockResult(keyword: string): AnalysisResult {
  const key = keyword.toLowerCase().trim();
  if (MOCK_DATA[key]) {
    return MOCK_DATA[key];
  }
  // Return default with the user's keyword
  return {
    ...MOCK_DATA.default,
    keyword: keyword.trim(),
  };
}

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (submittedKeyword: string) => {
    if (!submittedKeyword.trim() || isLoading) return;
    setIsLoading(true);

    // Simulate API delay with loading screen
    setTimeout(() => {
      const mockResult = getMockResult(submittedKeyword);
      setResult(mockResult);
      setIsLoading(false);
    }, 2500);
  };

  /* ────────── LOADING VIEW ────────── */
  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Fixed Background Image */}
        <div
          className="fixed inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/bg-hero.png')",
            backgroundColor: "#f5e6f0",
          }}
        />

        {/* Content wrapper with z-index */}
        <div className="relative z-10 flex-grow flex flex-col min-h-screen">
          {/* Logo */}
          <header className="flex items-center h-[80px] px-8 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo Rintis"
              width={40}
              height={40}
              className="object-contain"
            />
          </header>

          {/* Loading content */}
          <div className="flex-grow flex flex-col justify-end px-12 md:px-24 pb-[220px]">
            <div className="flex items-center gap-3.5 max-w-[650px] animate-[fadeInUp_0.5s_ease_both]">
              <Image
                src="/logo.png"
                alt="Loading"
                width={32}
                height={32}
                className="object-contain animate-smooth-spin"
              />
              <span className="text-xl font-semibold text-gray-800">
                Menganalisis...
              </span>
            </div>
          </div>

          {/* Fixed Search Bar at the bottom */}
          <div className="fixed bottom-8 left-0 right-0 flex justify-center w-full z-40">
            <SearchBar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    );
  }

  /* ────────── RESULTS VIEW ────────── */
  if (result && !isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Fixed Background Image */}
        <div
          className="fixed inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none z-0"
          style={{
            backgroundImage: "url('/bg-hero.png')",
            backgroundColor: "#f5e6f0",
          }}
        />

        {/* Content wrapper with z-index */}
        <div className="relative z-10 flex-grow flex flex-col min-h-screen">
          {/* Logo */}
          <header className="flex items-center h-[80px] px-8 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo Rintis"
              width={40}
              height={40}
              className="object-contain"
            />
          </header>

          {/* Scrollable Results Area */}
          <div className="flex-1 overflow-y-auto px-6 pb-[200px]">
            <ResultsView result={result} />
          </div>
        </div>

        {/* Fixed Bottom Background Slice Overlay (in front of content, behind search bar) */}
        <div
          className="fixed inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none z-20"
          style={{
            backgroundImage: "url('/bg-hero.png')",
            clipPath: "inset(calc(100% - 220px) 0px 0px 0px)",
            opacity: 0.75,
          }}
        />

        {/* Fixed Search bar (in front of background slice overlay) */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center w-full z-30">
          <SearchBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>
    );
  }

  /* ────────── LANDING VIEW ────────── */
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: "url('/bg-hero.png')",
          backgroundColor: "#f5e6f0",
        }}
      />

      {/* Subtle animated glow */}
      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
              "radial-gradient(circle, rgba(58,123,213,0.15) 0%, transparent 70%)",
          animation: "heroGlow 6s ease-in-out infinite alternate",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Logo — top left */}
      <Image
        src="/logo.png"
        alt="Logo"
        width={70}
        height={70}
        className="absolute top-8 left-8 z-10 object-contain"
      />

      {/* Centered Slogan */}
      <div className="relative z-10 text-center max-w-[700px] px-6">
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-text-hero leading-tight tracking-tight">
          Peluang bisnis digital terbaik
          <br />
          berada di ujung jari Anda
        </h1>
      </div>

      {/* Search Bar — bottom */}
      <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex justify-center w-full z-20">
        <SearchBar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}

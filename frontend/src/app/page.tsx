"use client";

import Image from "next/image";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./components/SearchBar";
import { AnalysisResult } from "./components/ResultsView";

/* ──────────── Home Page ──────────── */


function HomeContent() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (submittedKeyword: string) => {
    if (!submittedKeyword.trim() || isLoading) return;
    setIsLoading(true);

    // Simulate API delay, then navigate directly to dedicated /result page route
    setTimeout(() => {
      router.push(`/result?keyword=${encodeURIComponent(submittedKeyword.trim())}`);
    }, 1000);
  };

  /* ────────── LOADING VIEW ────────── */
  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/bg-hero.png')",
            backgroundColor: "#f5e6f0",
          }}
        />

        <div className="relative z-10 flex-grow flex flex-col min-h-screen">
          <header className="flex items-center h-[80px] px-8 shrink-0">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo Rintis"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-bold text-gray-900 text-lg tracking-tight">Rintis AI</span>
            </div>
          </header>

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

  /* ────────── LANDING VIEW ────────── */
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: "url('/bg-hero.png')",
          backgroundColor: "#f5e6f0",
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(58,123,213,0.15) 0%, transparent 70%)",
          animation: "heroGlow 6s ease-in-out infinite alternate",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="absolute top-8 left-8 z-10 flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="object-contain"
        />
        <span className="font-extrabold text-gray-900 text-xl tracking-tight">Rintis AI</span>
      </div>

      <div className="relative z-10 text-center max-w-[700px] px-6">
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-text-hero leading-tight tracking-tight">
          Peluang bisnis digital terbaik
          <br />
          berada di ujung jari Anda
        </h1>
      </div>

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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5e6f0] text-gray-700">
        Loading...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

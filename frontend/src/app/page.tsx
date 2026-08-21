"use client";

import Image from "next/image";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./components/SearchBar";
import AnimatedLoadingLogo from "./components/AnimatedLoadingLogo";
import { analyzeKeyword } from "./api";

/* ──────────── Home Page ──────────── */


function HomeContent() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (submittedKeyword: string) => {
    if (!submittedKeyword.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // Call backend API (falls back to mock data if unavailable)
      await analyzeKeyword(submittedKeyword.trim());
      router.push(`/result?keyword=${encodeURIComponent(submittedKeyword.trim())}`);
    } catch {
      // Navigate anyway — result page will handle its own data fetching
      router.push(`/result?keyword=${encodeURIComponent(submittedKeyword.trim())}`);
    }
  };

  /* ────────── LOADING VIEW ────────── */
  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col overflow-hidden">
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
              <span className="font-bold text-[#0B5497] text-lg tracking-tight">Rintis AI</span>
            </div>
          </header>

          <div className="flex-grow flex flex-col justify-end pb-[220px] px-6">
            <div className="w-[90%] max-w-[650px] mx-auto flex items-center gap-3.5 animate-[fadeInUp_0.5s_ease_both]">
              <AnimatedLoadingLogo width={36} height={36} />
              <span className="text-xl font-semibold text-gray-800">
                Menganalisis...
              </span>
            </div>
          </div>

          <div className="fixed bottom-[10vh] left-1/2 -translate-x-1/2 flex justify-center w-full z-40">
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
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <header className="flex items-center h-[80px] px-8 shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo Rintis"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-bold text-[#0B5497] text-lg tracking-tight">Rintis AI</span>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-[700px] px-6">
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-[#0B5497] leading-tight tracking-tight">
          Peluang bisnis digital terbaik
          <br />
          berada di ujung jari Anda
        </h1>
        </div>
      </div>

      <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex justify-center w-full z-30">
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
      <div className="min-h-screen flex items-center justify-center bg-[#FFF3F9] text-gray-700">
        Loading...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

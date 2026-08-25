"use client";

import Image from "next/image";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./components/SearchBar";
import AnimatedLoadingLogo from "./components/AnimatedLoadingLogo";
import { analyzeKeyword } from "./api";
import { findMatchingKeyword } from "./keywords";

/* ──────────── Home Page ──────────── */

function HomeContent() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorKeyword, setErrorKeyword] = useState<string | null>(null);

  const handleSubmit = async (submittedKeyword: string) => {
    const trimmed = submittedKeyword.trim();
    if (!trimmed || isLoading) return;

    // Check if keyword is supported in the dataset
    const matched = findMatchingKeyword(trimmed);
    if (!matched) {
      setErrorKeyword(trimmed);
      return;
    }

    setIsLoading(true);
    setErrorKeyword(null);

    try {
      // Call backend API (falls back to mock data if unavailable)
      await analyzeKeyword(matched);
      router.push(`/result?keyword=${encodeURIComponent(matched)}`);
    } catch (error: any) {
      if (error instanceof Error && error.message.startsWith("KeywordNotFound")) {
        setIsLoading(false);
        setErrorKeyword(trimmed);
      } else {
        // Navigate anyway — result page will handle its own data fetching
        router.push(`/result?keyword=${encodeURIComponent(matched)}`);
      }
    }
  };

  /* ────────── LOADING VIEW ────────── */
  if (isLoading) {
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

        {/* Lower SearchBar & Loading Indicator Area */}
        <div className="fixed bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center w-full z-30 px-4">
          <div className="w-[90%] max-w-[650px] flex items-center gap-3 mb-4 pl-1 animate-[fadeInUp_0.3s_ease_both]">
            <AnimatedLoadingLogo width={30} height={30} />
            <span className="text-base md:text-lg font-semibold text-gray-800">
              Menganalisis...
            </span>
          </div>

          <SearchBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder="Masukkan kata kunci..."
          />
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

      {/* Center Title Area */}
      <div className="flex-grow flex items-center justify-center -mt-16">
        <div className="text-center max-w-[700px] px-6">
          <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-[#0B5497] leading-tight tracking-tight">
            Peluang bisnis digital terbaik
            <br />
            berada di ujung jari Anda
          </h1>
        </div>
      </div>

      {/* Lower SearchBar Area */}
      <div className="fixed bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center w-full z-30 px-4">
        {/* Not in Scope / Error Message */}
        {errorKeyword && (
          <div className="flex flex-col items-center mb-6 max-w-lg mx-auto text-center animate-[fadeInUp_0.3s_ease_both]">
            <div className="inline-flex items-center gap-2 bg-[#FFF0F2] border border-[#FFD0D0] px-4 py-1.5 rounded-full mb-2.5 shadow-xs">
              <svg
                className="w-4 h-4 text-[#E02424] shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[#E02424] text-xs md:text-sm font-semibold tracking-wide">
                Keyword di Luar Cakupan Kategori
              </span>
            </div>
            <div className="text-xs md:text-sm text-[#737373] leading-relaxed space-y-0.5">
              <p>Data untuk ‘{errorKeyword}’ belum tercakup.</p>
              <p>Sistem saat ini hanya menganalisis produk dalam lingkup Fashion dan F&B.</p>
            </div>
          </div>
        )}

        <SearchBar
          keyword={keyword}
          onKeywordChange={(val) => {
            setKeyword(val);
            if (errorKeyword) setErrorKeyword(null);
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Masukkan kata kunci..."
        />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#FFF3F9]">
          <AnimatedLoadingLogo width={40} height={40} />
          <span className="text-sm font-medium text-gray-600">Memuat...</span>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

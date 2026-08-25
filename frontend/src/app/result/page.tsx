"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultsView, { AnalysisResult } from "../components/ResultsView";
import AnimatedLoadingLogo from "../components/AnimatedLoadingLogo";
import SearchBar from "../components/SearchBar";
import { analyzeKeyword } from "../api";
import { AVAILABLE_KEYWORDS, findMatchingKeyword } from "../keywords";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlKeyword =
    searchParams.get("keyword") ||
    searchParams.get("search") ||
    searchParams.get("q") ||
    "";

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!urlKeyword.trim()) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    const matched = findMatchingKeyword(urlKeyword);
    if (!matched) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    analyzeKeyword(matched)
      .then((data) => {
        setResult(data);
        setNotFound(false);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [urlKeyword]);

  const handleReset = () => {
    router.push("/");
  };

  const handleSelectValidKeyword = (kw: string) => {
    router.push(`/result?keyword=${encodeURIComponent(kw)}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="relative z-10 flex-grow flex flex-col min-h-screen">
        <header className="flex items-center h-[80px] px-8 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="Kembali ke Halaman Utama"
          >
            <Image
              src="/logo.png"
              alt="Logo Rintis"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-[#0B5497] text-lg tracking-tight">Rintis AI</span>
          </button>
        </header>

        {/* Loading State matching Home layout */}
        {isLoading && (
          <div className="fixed bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center w-full z-30 px-4">
            <div className="w-[90%] max-w-[650px] flex items-center gap-3 mb-4 pl-1 animate-[fadeInUp_0.3s_ease_both]">
              <AnimatedLoadingLogo width={30} height={30} />
              <span className="text-base md:text-lg font-semibold text-gray-800">
                Menganalisis kata kunci &quot;{urlKeyword}&quot;...
              </span>
            </div>

            <SearchBar
              keyword={urlKeyword}
              onKeywordChange={() => {}}
              onSubmit={() => {}}
              isLoading={true}
              placeholder="Masukkan kata kunci..."
            />
          </div>
        )}

        {/* Not Found / Invalid Keyword State */}
        {!isLoading && notFound && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-[700px] mx-auto text-center pb-16 animate-[fadeInUp_0.4s_ease_both]">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4 shadow-xs">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Kata Kunci Tidak Ditemukan
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Pencarian untuk &quot;<strong className="text-gray-900">{urlKeyword}</strong>&quot; belum tersedia dalam dataset kami.
              Silakan pilih salah satu kata kunci yang tersedia di bawah ini:
            </p>

            {/* Category Groups */}
            <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-[#0B5497]/20 p-5 shadow-sm text-left mb-6">
              <div className="mb-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  👗 Kategori Fashion ({AVAILABLE_KEYWORDS.filter((k) => k.category === "Fashion").length} Kata Kunci)
                </h2>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_KEYWORDS.filter((k) => k.category === "Fashion").map((item) => (
                    <button
                      key={item.keyword}
                      onClick={() => handleSelectValidKeyword(item.keyword)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-500 hover:text-white text-pink-800 font-medium border border-pink-200 transition-all cursor-pointer shadow-2xs"
                    >
                      {item.keyword}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  🍱 Kategori F&B ({AVAILABLE_KEYWORDS.filter((k) => k.category === "F&B").length} Kata Kunci)
                </h2>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_KEYWORDS.filter((k) => k.category === "F&B").map((item) => (
                    <button
                      key={item.keyword}
                      onClick={() => handleSelectValidKeyword(item.keyword)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-900 font-medium border border-amber-200 transition-all cursor-pointer shadow-2xs"
                    >
                      {item.keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-[#0B5497] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}

        {/* Valid Result View */}
        {!isLoading && !notFound && result && (
          <>
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-[120px]">
              <ResultsView result={result} onReset={handleReset} />
            </div>

            {/* Fixed Bottom Center 'Cari Baru' Button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={handleReset}
                className="search-glass flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-[#0B5497] hover:scale-105 transition-all cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4 text-[#0B5497]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                Cari Baru
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#FFF3F9]">
          <AnimatedLoadingLogo width={40} height={40} />
          <span className="text-sm font-medium text-gray-600">Memuat...</span>
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}

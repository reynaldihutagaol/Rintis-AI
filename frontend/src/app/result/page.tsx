"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import ResultsView, { AnalysisResult } from "../components/ResultsView";
import { getMockResult } from "../mockData";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // If keyword isn't specified in URL query, default to "frozen food dimsum"
  const urlKeyword = searchParams.get("keyword") || searchParams.get("search") || searchParams.get("q") || "frozen food dimsum";

  const [keyword, setKeyword] = useState(urlKeyword);
  const [result, setResult] = useState<AnalysisResult>(() => getMockResult(urlKeyword));
  const [isLoading, setIsLoading] = useState(false);

  const [bgOpacity, setBgOpacity] = useState(1);

  useEffect(() => {
    if (urlKeyword) {
      setKeyword(urlKeyword);
      setResult(getMockResult(urlKeyword));
    }
  }, [urlKeyword]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // Fades background opacity smoothly from 1 to 0 over 350px of scroll
    const newOpacity = Math.max(0, 1 - scrollTop / 350);
    setBgOpacity(newOpacity);
  };

  const handleSubmit = (submittedKeyword: string) => {
    if (!submittedKeyword.trim() || isLoading) return;
    setIsLoading(true);

    setTimeout(() => {
      const mockResult = getMockResult(submittedKeyword);
      setResult(mockResult);
      setIsLoading(false);
      const newUrl = `/result?keyword=${encodeURIComponent(submittedKeyword.trim())}`;
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", newUrl);
      }
    }, 1200);
  };

  const handleReset = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#f5e6f0]">
        <div
          className="fixed inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/bg-hero.png')",
            backgroundColor: "#f5e6f0",
          }}
        />
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
              <span className="font-bold text-gray-900 text-lg tracking-tight">Rintis AI</span>
            </button>
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

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#f5e6f0]">
      {/* Base Curved Blue Hero Background with Scroll Opacity */}
      <div
        className="fixed inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none z-0 transition-opacity duration-75"
        style={{
          backgroundImage: "url('/bg-hero.png')",
          backgroundColor: "#f5e6f0",
          opacity: bgOpacity,
        }}
      />
      <div className="relative z-10 flex-grow flex flex-col min-h-screen">
        <header className="flex items-center justify-between h-[80px] px-8 shrink-0">
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
            <span className="font-bold text-gray-900 text-lg tracking-tight">Rintis AI</span>
          </button>
          
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white/60 hover:bg-white px-3 py-1.5 rounded-full border border-gray-300 transition-all cursor-pointer"
          >
            Cari Baru
          </button>
        </header>

        {/* Scrollable Content Container */}
        <div
          className="flex-1 overflow-y-auto px-6 pb-[200px]"
          onScroll={handleScroll}
        >
          <ResultsView result={result} onReset={handleReset} />
        </div>
      </div>

      {/* Bottom Clipped Overlay with Scroll Opacity */}
      <div
        className="fixed inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none z-20 transition-opacity duration-75"
        style={{
          backgroundImage: "url('/bg-hero.png')",
          clipPath: "inset(calc(100% - 220px) 0px 0px 0px)",
          opacity: 0.75 * bgOpacity,
        }}
      />

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

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5e6f0] text-gray-700">
        Loading...
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  );
}

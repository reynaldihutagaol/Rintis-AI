"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResultsView, { AnalysisResult } from "../components/ResultsView";
import { getMockResult } from "../mockData";
import { analyzeKeyword } from "../api";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Default to "frozen food dimsum" if keyword isn't specified in URL query
  const urlKeyword =
    searchParams.get("keyword") ||
    searchParams.get("search") ||
    searchParams.get("q") ||
    "frozen food dimsum";

  const [result, setResult] = useState<AnalysisResult>(() => getMockResult(urlKeyword));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (urlKeyword) {
      setIsLoading(true);
      analyzeKeyword(urlKeyword)
        .then((data) => setResult(data))
        .catch(() => setResult(getMockResult(urlKeyword)))
        .finally(() => setIsLoading(false));
    }
  }, [urlKeyword]);

  const handleReset = () => {
    router.push("/");
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

        {/* Scrollable Content Container */}
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
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF3F9] text-gray-700 font-semibold">
          Loading...
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}


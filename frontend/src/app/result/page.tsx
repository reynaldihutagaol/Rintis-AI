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
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#FFF3F9]">
      <div className="relative z-10 flex-grow flex flex-col min-h-screen">
        <header className="flex items-center justify-between h-[70px] md:h-[80px] px-6 md:px-8 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="Kembali ke Halaman Utama"
          >
            <Image
              src="/logo.png"
              alt="Logo Rintis"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="font-bold text-gray-900 text-lg tracking-tight">Rintis AI</span>
          </button>

          <button
            onClick={handleReset}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white/60 hover:bg-white px-3.5 py-1.5 rounded-full border border-gray-300 transition-all cursor-pointer shadow-xs"
          >
            Cari Baru
          </button>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-[90px]">
          {isLoading ? (
            <div className="max-w-[800px] mx-auto py-16 flex flex-col items-center justify-center gap-3">
              <Image
                src="/logo.png"
                alt="Loading"
                width={36}
                height={36}
                className="object-contain animate-smooth-spin"
              />
              <p className="text-gray-600 font-semibold text-sm">Memuat analisis...</p>
            </div>
          ) : (
            <ResultsView result={result} onReset={handleReset} />
          )}
        </div>
      </div>

      {/* Blue Gradient Overlay at Bottom */}
      <div
        className="fixed left-0 right-0 pointer-events-none z-20 transition-opacity duration-75"
        style={{
          bottom: "-65vh",
          height: "100vh",
          backgroundImage: "url('/gradation.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
        }}
      />
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


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

  // If keyword isn't specified in URL query, default to "frozen food dimsum"
  const urlKeyword = searchParams.get("keyword") || searchParams.get("search") || searchParams.get("q") || "frozen food dimsum";

  const [result, setResult] = useState<AnalysisResult>(() => getMockResult(urlKeyword));
  const [isLoading, setIsLoading] = useState(true);

  const [bgOpacity, setBgOpacity] = useState(1);

  useEffect(() => {
    if (urlKeyword) {
      setIsLoading(true);
      analyzeKeyword(urlKeyword)
        .then((data) => setResult(data))
        .finally(() => setIsLoading(false));
    }
  }, [urlKeyword]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // Fades background opacity smoothly from 1 to 0 over 350px of scroll
    const newOpacity = Math.max(0, 1 - scrollTop / 350);
    setBgOpacity(newOpacity);
  };


  const handleReset = () => {
    router.push("/");
  };


  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#FFF3F9]">
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
          className="flex-1 overflow-y-auto px-6 pb-[80px]"
          onScroll={handleScroll}
        >
          <ResultsView result={result} onReset={handleReset} />
        </div>
      </div>

      {/* Blue Gradient Overlay Above Content */}
      <div
        className="fixed left-0 right-0 pointer-events-none z-20 transition-opacity duration-75"
        style={{
          bottom: "-65vh",
          height: "100vh",
          backgroundImage: "url('/gradation.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center"
        }}
      />
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFF3F9] text-gray-700">
        Loading...
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  );
}

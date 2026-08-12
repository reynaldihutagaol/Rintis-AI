"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    // TODO: Connect to backend API (Phase 5)
    console.log(`Searching for: ${keyword}`);
  };

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

      {/* Search Bar — bottom, on the gradient */}
      <form
        id="search-bar"
        onSubmit={handleSubmit}
        className="search-glass absolute bottom-[10vh] left-1/2 -translate-x-1/2 w-[90%] max-w-[650px] flex items-center rounded-full p-1 transition-all duration-300"
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Masukkan kata kunci..."
          className="flex-1 bg-transparent border-none outline-none px-8 py-5 text-lg font-medium text-white placeholder:text-white/50"
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="flex items-center justify-center w-12 h-12 bg-transparent border-none text-white cursor-pointer mr-2 transition-transform duration-300 hover:scale-110"
          aria-label="Cari"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
    </main>
  );
}

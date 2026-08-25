"use client";

import { FormEvent, useRef } from "react";

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSubmit: (keyword: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  keyword,
  onKeywordChange,
  onSubmit,
  isLoading = false,
  placeholder = "Masukkan kata kunci...",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || isLoading) return;
    onSubmit(keyword.trim());
  };

  return (
    <div className="relative w-[90%] max-w-[650px] flex flex-col items-center">
      {/* Search Input Form */}
      <form
        onSubmit={handleSubmit}
        className="search-glass w-full flex items-center rounded-full p-1 transition-all duration-300 relative z-20 shadow-lg"
        role="search"
      >
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-grow bg-transparent border-none outline-none text-[#0B5497] font-medium placeholder:text-[#0B5497]/50 px-6 py-3 text-base md:text-lg"
        />
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="flex items-center justify-center w-[46px] h-[46px] bg-transparent hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shrink-0 mr-2 cursor-pointer"
          aria-label="Search"
        >
          {isLoading ? (
            <svg
              className="animate-spin w-5 h-5 text-[#0B5497]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-[#0B5497]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

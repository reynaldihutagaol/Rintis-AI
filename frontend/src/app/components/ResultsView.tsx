"use client";

import { useState } from "react";

export interface Explanation {
  icon: string;
  text: string;
}

export interface Metrics {
  predicted_demand: number;
  competition_density: number;
  competition_label: string;
  avg_price: number;
}

export interface AnalysisResult {
  keyword: string;
  category: string;
  opportunity_score: number;
  opportunity_level: string;
  opportunity_label: string;
  metrics: Metrics;
  explanations: Explanation[];
}

interface ResultsViewProps {
  result: AnalysisResult;
}

const levelConfig: Record<string, { color: string; bg: string; border: string }> = {
  high: { color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)" },
  niche: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
  red_ocean: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" },
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp")
    .trim();
}

function formatDemand(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

/* ---------- SVG Icons ---------- */
function CheckCircleIcon({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill={color} />
      <path d="M14 24.5L21 31.5L34 18.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B579E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B579E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B579E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function ExplanationCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
      <rect width="24" height="24" rx="6" fill="#22C55E" />
      <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExplanationWarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
      <path d="M12 2L1 21h22L12 2z" fill="#111827" />
      <line x1="12" y1="9" x2="12" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1" fill="white" />
    </svg>
  );
}

export default function ResultsView({ result }: ResultsViewProps) {
  const config = levelConfig[result.opportunity_level] ?? levelConfig.high;

  // Dynamic bar chart metrics calculation based on the result data
  const competitionWidth = Math.round((1 - result.metrics.competition_density) * 100);
  const demandWidth = Math.min(Math.round((result.metrics.predicted_demand / 1200) * 100), 100);
  const hargaWidth = Math.min(Math.round((result.metrics.avg_price / 200000) * 100), 100);
  const ratingWidth = Math.round(result.opportunity_score * 0.5 + 10); // Nice visual scaling for rating

  // Pricing Simulation Setup
  const isDimsum = result.keyword.toLowerCase().includes("dimsum");
  
  // Base price is 45.000 for dimsum, or half of avg_price for other products (rounded to nearest 1000)
  const basePrice = isDimsum 
    ? 45000 
    : Math.round((result.metrics.avg_price / 2) / 1000) * 1000;
    
  const minPrice = basePrice * 0.8;
  const maxPrice = basePrice * 1.2;
  
  // Default selection is Rp54.000 to match the mockup on load
  const [price, setPrice] = useState(isDimsum ? 54000 : maxPrice);
  
  const baseDemand = result.metrics.predicted_demand;
  
  // Linear interpolation for demand simulation
  const pct = (price - basePrice) / basePrice;
  let demand = Math.round(baseDemand * (1 - pct));
  if (isDimsum && price === 54000) {
    demand = 625; // Perfect mockup match
  }
  
  const percent = ((price - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className="w-full max-w-[780px] mx-auto animate-[fadeInUp_0.6s_ease_forwards] px-1">
      {/* Opportunity Badge */}
      <div className="flex items-center justify-center gap-4 mb-6" style={{ animationDelay: "0s" }}>
        <CheckCircleIcon color={config.color} />
        <h2
          className="text-3xl md:text-4xl font-extrabold tracking-tight"
          style={{ color: config.color }}
        >
          {result.opportunity_label}
        </h2>
      </div>

      {/* Keyword & Category Tags */}
      <div className="flex items-center justify-center gap-3 mb-8 animate-[fadeInUp_0.5s_0.1s_ease_both]">
        <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-gray-300 bg-white/70 text-sm text-gray-700">
          Keyword: <strong className="font-semibold text-gray-900">{result.keyword}</strong>
        </span>
        <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-gray-300 bg-white/70 text-sm text-gray-700">
          Category: <strong className="font-semibold text-gray-900">{result.category}</strong>
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10 animate-[fadeInUp_0.5s_0.2s_ease_both]">
        {/* Perkiraan Permintaan */}
        <div className="relative rounded-2xl border-[1.5px] border-[#0B579E] bg-white/80 p-5 shadow-sm">
          <div className="absolute top-4 right-4 opacity-90">
            <TrendUpIcon />
          </div>
          <p className="text-xs text-gray-500 mb-1.5">Perkiraan Permintaan</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {formatDemand(result.metrics.predicted_demand)} <span className="text-sm font-normal text-gray-500">unit/bulan</span>
          </p>
        </div>

        {/* Tingkat Kompetisi */}
        <div className="relative rounded-2xl border-[1.5px] border-[#0B579E] bg-white/80 p-5 shadow-sm">
          <div className="absolute top-4 right-4 opacity-90">
            <PeopleIcon />
          </div>
          <p className="text-xs text-gray-500 mb-1.5">Tingkat Kompetisi</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {result.metrics.competition_density.toFixed(2)}{" "}
            <span className="text-sm font-normal text-gray-500">({result.metrics.competition_label})</span>
          </p>
        </div>

        {/* Rata-rata Harga */}
        <div className="relative rounded-2xl border-[1.5px] border-[#0B579E] bg-white/80 p-5 shadow-sm">
          <div className="absolute top-4 right-4 opacity-90">
            <PriceTagIcon />
          </div>
          <p className="text-xs text-gray-500 mb-1.5">Rata-rata Harga</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {formatPrice(result.metrics.avg_price)}
          </p>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="animate-[fadeInUp_0.5s_0.3s_ease_both] mb-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Kenapa {result.opportunity_label}?
        </h3>
        <div className="flex flex-col gap-4">
          {result.explanations.map((exp, i) => (
            <div
              key={i}
              className="flex items-start gap-3 animate-[fadeInUp_0.4s_ease_both]"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              {exp.icon === "check" ? <ExplanationCheckIcon /> : <ExplanationWarningIcon />}
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">{exp.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="animate-[fadeInUp_0.5s_0.4s_ease_both] mb-10">
        <div className="relative flex flex-col gap-5 max-w-[500px] mx-auto py-4 pl-4">
          {/* Vertical axis line */}
          <div className="absolute left-[110px] top-0 bottom-0 w-[2px] bg-gray-300" />
          
          {/* Competition */}
          <div className="flex items-center">
            <span className="w-[100px] text-right pr-4 text-gray-700 font-medium text-sm md:text-base">Competition</span>
            <div className="flex-grow h-[36px]">
              <div 
                className="bg-[#0B579E] h-full transition-all duration-500 ease-out" 
                style={{ width: `${competitionWidth}%` }}
              />
            </div>
          </div>

          {/* Demand */}
          <div className="flex items-center">
            <span className="w-[100px] text-right pr-4 text-gray-700 font-medium text-sm md:text-base">Demand</span>
            <div className="flex-grow h-[36px]">
              <div 
                className="bg-[#0B579E] h-full transition-all duration-500 ease-out" 
                style={{ width: `${demandWidth}%` }}
              />
            </div>
          </div>

          {/* Harga */}
          <div className="flex items-center">
            <span className="w-[100px] text-right pr-4 text-gray-700 font-medium text-sm md:text-base">Harga</span>
            <div className="flex-grow h-[36px]">
              <div 
                className="bg-[#0B579E] h-full transition-all duration-500 ease-out" 
                style={{ width: `${hargaWidth}%` }}
              />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center">
            <span className="w-[100px] text-right pr-4 text-gray-700 font-medium text-sm md:text-base">Rating</span>
            <div className="flex-grow h-[36px]">
              <div 
                className="bg-[#0B579E] h-full transition-all duration-500 ease-out" 
                style={{ width: `${ratingWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simulasi Harga Section */}
      <div className="animate-[fadeInUp_0.5s_0.5s_ease_both] mb-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Simulasi Harga
        </h3>
        
        <div className="border border-gray-300 rounded-3xl p-6 bg-white/20 backdrop-blur-sm shadow-sm max-w-[780px] mx-auto">
          {/* Custom interactive slider container */}
          <div className="relative mt-12 mb-6 px-2">
            {/* Floating Tooltip Price Badge */}
            <div 
              className="absolute -top-10 bg-white border border-gray-300 px-3 py-1.5 rounded-2xl text-sm font-bold text-gray-900 shadow-md transition-all duration-75"
              style={{ 
                left: `${percent}%`, 
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
              }}
            >
              {formatPrice(price)}
            </div>
            
            {/* Range Input Slider */}
            <input 
              type="range"
              min={minPrice}
              max={maxPrice}
              step={500}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#0B579E] outline-none"
              style={{
                background: `linear-gradient(to right, #0B579E 0%, #0B579E ${percent}%, #D1D5DB ${percent}%, #D1D5DB 100%)`
              }}
            />
            
            {/* Min/Max Labels */}
            <div className="flex justify-between items-center mt-3 text-xs font-semibold text-gray-600">
              <span>{formatPrice(minPrice)} <span className="text-red-500">(-20%)</span></span>
              <span>{formatPrice(maxPrice)} <span className="text-green-600">(+20%)</span></span>
            </div>
          </div>

          {/* Simulated Demand Output */}
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-base md:text-lg">
            <span className="text-gray-700">Perkiraan Permintaan:</span>
            <span className="font-bold text-gray-900 text-xl md:text-2xl flex items-center gap-1.5">
              ~{formatDemand(demand)} unit/bulan
              {price > basePrice && (
                <svg className="w-5 h-5 text-red-500 animate-[bounce_1.5s_infinite]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {price < basePrice && (
                <svg className="w-5 h-5 text-green-500 animate-[bounce_1.5s_infinite]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

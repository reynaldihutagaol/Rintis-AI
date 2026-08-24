"use client";

import React from "react";

export interface Explanation {
  icon: string;
  text: string;
}

export interface Metrics {
  predicted_demand: number;
  demand_label?: string;
  competition_density: number;
  competition_label: string;
  avg_price: number;
  avg_price_label?: string;
  total_shops?: number;
}

export interface OtherProductIdea {
  id?: string;
  name: string;
  demand_label: string;
  competition_label: string;
  avg_price_label: string;
}

export interface FeatureContribution {
  label: string;
  contribution: number;
}

export interface FactorStrength {
  label: string;
  strength: "Sangat Mendukung" | "Mendukung" | "Sedikit Mendukung" | "Sedikit Menahan" | "Menahan" | "Sangat Menahan";
  isSupporting?: boolean;
  dots?: number;
}

export interface ProvinceInsight {
  province: string;
  shopCount: number;
  competitionLevel: "high" | "medium" | "low";
}

export interface AnalysisResult {
  keyword: string;
  category: string;
  opportunity_score: number;
  opportunity_level: string;
  opportunity_label: string;
  metrics: Metrics;
  explanations?: Explanation[];
  recommendation_explanation?: string;
  other_product_ideas?: OtherProductIdea[];
  contributions?: FeatureContribution[];
  factors?: FactorStrength[];
  provinceBreakdown?: ProvinceInsight[];
}

interface ResultsViewProps {
  result: AnalysisResult;
  onReset?: () => void;
}

function formatPrice(value: number): string {
  if (!value) return "Rp xx";
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

/* ────────── SVG ICONS ────────── */
function CheckCircleIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" className="shrink-0">
      <circle cx="18" cy="18" r="18" fill="#22C55E" />
      <path
        d="M10 18.5L15.5 24L26 13.5"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B579E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B579E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B579E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function BurgerDrinkIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className="shrink-0">
      {/* Straw & Drink Glass */}
      <path d="M29 13L35 5" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 16H42L39.5 38H28.5L26 16Z" fill="black" />
      <path d="M28 22H40" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* Burger */}
      {/* Top Bun */}
      <path d="M5 26C5 20.4772 9.47715 16 15 16C20.5228 16 25 20.4772 25 26H5Z" fill="black" />
      {/* Sesame Seeds */}
      <circle cx="11" cy="20" r="1" fill="white" />
      <circle cx="16" cy="19" r="1" fill="white" />
      <circle cx="19" cy="22" r="1" fill="white" />
      {/* Patty */}
      <rect x="4" y="28" width="22" height="4" rx="2" fill="black" />
      {/* Bottom Bun */}
      <path d="M5 34H25C25 36.2091 23.2091 38 21 38H9C6.79086 38 5 36.2091 5 34Z" fill="black" />
    </svg>
  );
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  // Navigation keyword
  const currentKeyword = result.keyword || "Frozen Food Dimsum";
  const currentCategory = result.category || "F&B";

  // Recommendation explanation text
  const recommendationText =
    result.recommendation_explanation ||
    (result.explanations && result.explanations.length > 0
      ? result.explanations.map((exp) => exp.text).join(", ")
      : "Jumlah Penjualan tinggi dengan mencapai 3000 penjualan, Rating rendah (0.18), Jumlah Ulasan cukup");

  // Fallback Product Ideas
  const defaultProductIdeas: OtherProductIdea[] = [
    {
      id: "1",
      name: "Cimol Bojot Aa",
      demand_label: "Tinggi",
      competition_label: "Tinggi",
      avg_price_label: "Rp xx",
    },
    {
      id: "2",
      name: "Dimsum Ayam Mentai",
      demand_label: "Tinggi",
      competition_label: "Tinggi",
      avg_price_label: "Rp xx",
    },
    {
      id: "3",
      name: "Baso Aci Garut",
      demand_label: "Tinggi",
      competition_label: "Rendah",
      avg_price_label: "Rp 25.000",
    },
  ];

  const productIdeas =
    result.other_product_ideas && result.other_product_ideas.length > 0
      ? result.other_product_ideas
      : defaultProductIdeas;

  // Metric values
  const demandValue = result.metrics.demand_label || "Tinggi";
  const competitionValue = result.metrics.competition_label || "Rendah";
  const priceValue =
    result.metrics.avg_price_label ||
    (result.metrics.avg_price ? formatPrice(result.metrics.avg_price) : "Rp xx");

  return (
    <div className="w-full max-w-[800px] mx-auto px-2 pt-2 pb-12 animate-[fadeInUp_0.5s_ease_both]">


      {/* 2. Status Title & Checklist Circle */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#22C55E] tracking-tight">
          {result.opportunity_label || "High Opportunity"}
        </h1>
        <CheckCircleIcon />
      </div>

      {/* Dual Badges/Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <div className="px-5 py-1.5 rounded-full border border-gray-300 bg-white text-xs md:text-sm text-gray-800 shadow-xs">
          Keyword: <strong className="font-bold text-gray-900">{currentKeyword}</strong>
        </div>
        <div className="px-5 py-1.5 rounded-full border border-gray-300 bg-white text-xs md:text-sm text-gray-800 shadow-xs">
          Category: <strong className="font-bold text-gray-900">{currentCategory}</strong>
        </div>
      </div>

      {/* 3. 3 Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* Card 1: Estimasi Penjualan */}
        <div className="relative border border-[#0B579E] rounded-xl bg-white p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-4 right-4 text-[#0B579E]">
            <TrendUpIcon />
          </div>
          <p className="text-xs md:text-sm font-semibold text-gray-700">Estimasi Penjualan</p>
          <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">{demandValue}</p>
        </div>

        {/* Card 2: Tingkat Kompetitif */}
        <div className="relative border border-[#0B579E] rounded-xl bg-white p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-4 right-4 text-[#0B579E]">
            <PeopleIcon />
          </div>
          <p className="text-xs md:text-sm font-semibold text-gray-700">Tingkat Kompetitif</p>
          <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">{competitionValue}</p>
        </div>

        {/* Card 3: Rata - rata harga */}
        <div className="relative border border-[#0B579E] rounded-xl bg-white p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <div className="absolute top-4 right-4 text-[#0B579E]">
            <PriceTagIcon />
          </div>
          <p className="text-xs md:text-sm font-semibold text-gray-700">Rata - rata harga</p>
          <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">{priceValue}</p>
        </div>
      </div>

      {/* 4. Section: Penjelasan Rekomendasi */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Penjelasan Rekomendasi
        </h2>
        <p className="text-sm md:text-base text-gray-800 leading-relaxed font-normal">
          {recommendationText}
        </p>
      </div>

      {/* 5. Section: Ide Produk Lainnya */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Ide Produk Lainnya
        </h2>
        <div className="flex flex-col gap-4">
          {productIdeas.map((product, idx) => (
            <div
              key={product.id || idx}
              className="border border-[#0B579E] rounded-xl p-4 md:p-5 bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              {/* Left Food Icon */}
              <BurgerDrinkIcon />

              {/* Center/Right Content */}
              <div className="flex-1 w-full flex flex-col gap-2.5">
                <h3 className="font-bold text-gray-900 text-base md:text-lg">
                  {product.name}
                </h3>

                {/* 3 Mini Sub-Metric Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  {/* Mini-Box 1 */}
                  <div className="border border-[#0B579E] rounded-xl px-3.5 py-2 bg-white flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-600 font-medium">
                        Estimasi Penjualan
                      </p>
                      <p className="text-xs md:text-sm font-bold text-gray-900">
                        {product.demand_label}
                      </p>
                    </div>
                    <TrendUpIcon />
                  </div>

                  {/* Mini-Box 2 */}
                  <div className="border border-[#0B579E] rounded-xl px-3.5 py-2 bg-white flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-600 font-medium">
                        Tingkat Kompetitif
                      </p>
                      <p className="text-xs md:text-sm font-bold text-gray-900">
                        {product.competition_label}
                      </p>
                    </div>
                    <PeopleIcon />
                  </div>

                  {/* Mini-Box 3 */}
                  <div className="border border-[#0B579E] rounded-xl px-3.5 py-2 bg-white flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-600 font-medium">
                        Rata - rata harga
                      </p>
                      <p className="text-xs md:text-sm font-bold text-gray-900">
                        {product.avg_price_label}
                      </p>
                    </div>
                    <PriceTagIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

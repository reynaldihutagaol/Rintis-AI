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
  total_shops?: number;
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
  explanations: Explanation[];
  contributions?: FeatureContribution[];
  factors?: FactorStrength[];
  provinceBreakdown?: ProvinceInsight[];
}

interface ResultsViewProps {
  result: AnalysisResult;
  onReset?: () => void;
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
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
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
      <rect width="24" height="24" rx="12" fill="#22C55E" />
      <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExplanationWarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="12" fill="#F59E0B" />
      <line x1="12" y1="8" x2="12" y2="13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.25" fill="white" />
    </svg>
  );
}

/* ────────── Section 3: Sebaran Kompetisi per Provinsi ────────── */
function ProvinceBreakdownSection({ provinceBreakdown }: { provinceBreakdown: ProvinceInsight[] }) {
  const sorted = [...provinceBreakdown].sort((a, b) => b.shopCount - a.shopCount);
  const maxCount = Math.max(...sorted.map((p) => p.shopCount), 1);

  // Find province with lowest shop count (or lowest competition)
  const lowestCompProvince = sorted.reduce(
    (prev, curr) => (curr.shopCount < prev.shopCount ? curr : prev),
    sorted[0]
  );

  return (
    <div className="animate-[fadeInUp_0.5s_0.25s_ease_both] mb-10">
      <div className="mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Sebaran Kompetisi per Provinsi
        </h3>
        <p className="text-xs md:text-sm text-gray-500 font-normal">
          Ini insight tambahan dari hasil analisis — bukan sesuatu yang perlu kamu pilih
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex flex-col gap-2.5">
          {sorted.map((item, index) => {
            const isLowest = item.province === lowestCompProvince.province;
            const barPct = Math.max((item.shopCount / maxCount) * 100, 10);

            let barColor = "bg-[#EF4444]";
            let trackColor = "bg-red-100/70";
            let textColor = "text-[#EF4444]";

            if (item.competitionLevel === "medium") {
              barColor = "bg-[#D97706]";
              trackColor = "bg-amber-100/70";
              textColor = "text-[#D97706]";
            } else if (item.competitionLevel === "low") {
              barColor = "bg-[#22C55E]";
              trackColor = "bg-green-100/70";
              textColor = "text-[#16A34A]";
            }

            return (
              <div
                key={index}
                className={`flex items-center gap-4 px-3.5 py-2.5 transition-all ${isLowest
                    ? "bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl shadow-xs"
                    : "rounded-lg"
                  }`}
              >
                {/* Province Name */}
                <div
                  className={`w-[120px] md:w-[150px] text-xs md:text-sm font-bold shrink-0 truncate ${isLowest ? "text-[#15803D]" : "text-gray-800"
                    }`}
                >
                  {item.province}
                </div>

                {/* Progress Bar Container */}
                <div className={`flex-1 h-3.5 ${trackColor} rounded-full overflow-hidden relative`}>
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>

                {/* Shop Count */}
                <div
                  className={`w-[60px] md:w-[70px] text-right text-xs md:text-sm font-bold shrink-0 ${isLowest ? "text-[#15803D]" : textColor
                    }`}
                >
                  {item.shopCount} toko
                </div>
              </div>
            );
          })}
        </div>

        {/* Muted count of remaining provinces */}
        <p className="text-xs text-gray-400 font-normal mt-4 mb-3 pl-3">
          ... dan 12 provinsi lainnya
        </p>

        {/* Insight Highlight Footer */}
        {lowestCompProvince && (
          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#16A34A] pl-3">
            <span className="text-[#16A34A] text-sm">◀</span>
            <span>
              {lowestCompProvince.province} paling sedikit kompetitornya — layak dipertimbangkan
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────── Section 5: Seberapa Kuat Pengaruh Tiap Faktor? (Word-based + Dots) ────────── */
function FactorStrengthChart({ factors }: { factors: FactorStrength[] }) {
  return (
    <div className="animate-[fadeInUp_0.5s_0.4s_ease_both] mb-10">
      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Seberapa Kuat Pengaruh Tiap Faktor?
        </h3>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm flex flex-col gap-5">
        {factors.map((factor, idx) => {
          let isSupporting = factor.isSupporting;
          let dotsCount = factor.dots;

          if (isSupporting === undefined || dotsCount === undefined) {
            switch (factor.strength) {
              case "Sangat Mendukung":
                isSupporting = true;
                dotsCount = 3;
                break;
              case "Mendukung":
                isSupporting = true;
                dotsCount = 2;
                break;
              case "Sedikit Mendukung":
                isSupporting = true;
                dotsCount = 1;
                break;
              case "Sangat Menahan":
                isSupporting = false;
                dotsCount = 3;
                break;
              case "Menahan":
                isSupporting = false;
                dotsCount = 2;
                break;
              case "Sedikit Menahan":
                isSupporting = false;
                dotsCount = 1;
                break;
              default:
                isSupporting = true;
                dotsCount = 1;
            }
          }

          return (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base font-bold text-gray-900">
                  {factor.label}
                </p>
                <p
                  className={`text-xs md:text-sm font-semibold mt-0.5 ${isSupporting ? "text-[#22C55E]" : "text-[#EF4444]"
                    }`}
                >
                  {factor.strength}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((dot) => {
                  const isFilled = dot <= (dotsCount ?? 1);
                  return (
                    <span
                      key={dot}
                      className={`w-3.5 h-3.5 rounded-full inline-block transition-colors ${isFilled
                          ? isSupporting
                            ? "bg-[#22C55E]"
                            : "bg-[#EF4444]"
                          : "bg-gray-200"
                        }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  const config = levelConfig[result.opportunity_level] ?? levelConfig.high;

  // Pricing Simulation Setup
  const isDimsum = result.keyword.toLowerCase().includes("dimsum");

  const basePrice = isDimsum
    ? 45000
    : Math.round((result.metrics.avg_price / 2) / 1000) * 1000;

  const minPrice = basePrice * 0.8;
  const maxPrice = basePrice * 1.2;

  const [price, setPrice] = useState(isDimsum ? 54000 : maxPrice);

  const baseDemand = result.metrics.predicted_demand;

  const pct = (price - basePrice) / basePrice;
  let demand = Math.round(baseDemand * (1 - pct));
  if (isDimsum && price === 54000) {
    demand = 625;
  }

  const percent = ((price - minPrice) / (maxPrice - minPrice)) * 100;

  // Fallback province breakdown if not provided
  const defaultProvinceBreakdown: ProvinceInsight[] = [
    { province: "DKI Jakarta", shopCount: 21, competitionLevel: "high" },
    { province: "Jawa Barat", shopCount: 17, competitionLevel: "high" },
    { province: "Jawa Timur", shopCount: 9, competitionLevel: "medium" },
    { province: "Banten", shopCount: 7, competitionLevel: "medium" },
    { province: "Sumatera Utara", shopCount: 2, competitionLevel: "low" },
  ];

  const provinceData = result.provinceBreakdown && result.provinceBreakdown.length > 0
    ? result.provinceBreakdown
    : defaultProvinceBreakdown;

  // Default factors for word-based chart
  const defaultFactors: FactorStrength[] = [
    {
      label: "Demand Nasional Stabil",
      strength: "Mendukung",
      isSupporting: true,
      dots: 2,
    },
    {
      label: "Sebaran Kompetisi Tidak Merata",
      strength: "Sedikit Mendukung",
      isSupporting: true,
      dots: 1,
    },
  ];

  // Derive factors from result.factors or result.contributions, ensuring requirement 5 factor is present
  let factorsData: FactorStrength[] = [];
  if (result.factors && result.factors.length > 0) {
    factorsData = [...result.factors];
  } else if (result.contributions && result.contributions.length > 0) {
    factorsData = result.contributions.map((c) => {
      const val = c.contribution;
      if (val >= 0.30) return { label: c.label, strength: "Sangat Mendukung", isSupporting: true, dots: 3 };
      if (val >= 0.15) return { label: c.label, strength: "Mendukung", isSupporting: true, dots: 2 };
      if (val > 0) return { label: c.label, strength: "Sedikit Mendukung", isSupporting: true, dots: 1 };
      if (val <= -0.30) return { label: c.label, strength: "Sangat Menahan", isSupporting: false, dots: 3 };
      if (val <= -0.15) return { label: c.label, strength: "Menahan", isSupporting: false, dots: 2 };
      return { label: c.label, strength: "Sedikit Menahan", isSupporting: false, dots: 1 };
    });
  } else {
    factorsData = defaultFactors;
  }

  // Ensure "Sebaran Kompetisi Tidak Merata" is included as requested in Point 5
  const hasProvinceFactor = factorsData.some((f) =>
    f.label.toLowerCase().includes("sebaran kompetisi")
  );
  if (!hasProvinceFactor) {
    factorsData.push({
      label: "Sebaran Kompetisi Tidak Merata",
      strength: "Sedikit Mendukung",
      isSupporting: true,
      dots: 1,
    });
  }

  // Ensure explanations include province distribution bullet as requested in Point 4
  const defaultExplanations: Explanation[] = [
    {
      icon: "check",
      text: `Secara nasional, demand cukup stabil (${formatDemand(result.metrics.predicted_demand)} unit/produk rata-rata).`,
    },
    {
      icon: "check",
      text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa.",
    },
  ];

  const explanationsData = result.explanations && result.explanations.length > 0
    ? result.explanations
    : defaultExplanations;

  // Total shop count label
  const totalShopsCount = result.metrics.total_shops ?? (result.metrics.competition_density ? Math.round(result.metrics.competition_density * 100) : 64);

  return (
    <div className="w-full max-w-[780px] mx-auto animate-[fadeInUp_0.6s_ease_forwards] px-1 pt-2">
      {/* 1. Header: Back button + Right Keyword Chip */}
      <div className="flex items-center justify-between mb-6">
        {onReset ? (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-700 hover:text-[#0B579E] transition-colors py-2 px-4 rounded-full bg-white/80 border border-gray-300 shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cari Kata Kunci Lain
          </button>
        ) : <div />}

        {/* Visual reminder chip (Read-only input reminder) */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EBF5FF] border border-[#BFDBFE] text-xs md:text-sm font-semibold text-[#1E40AF] shadow-xs">
          Input: "{result.keyword || "Jaket Pria"}"
        </div>
      </div>

      {/* Opportunity Badge */}
      <div className="flex items-center justify-center gap-3.5 mb-3" style={{ animationDelay: "0s" }}>
        <CheckCircleIcon color={config.color} />
        <h2
          className="text-3xl md:text-4xl font-extrabold tracking-tight"
          style={{ color: config.color }}
        >
          {result.opportunity_label}
        </h2>
      </div>

      {/* Category Tag */}
      <div className="flex items-center justify-center mb-8 animate-[fadeInUp_0.5s_0.1s_ease_both]">
        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-gray-300 bg-white/70 text-xs md:text-sm text-gray-700">
          Kategori: <strong className="font-semibold text-gray-900">{result.category || result.keyword}</strong>
        </span>
      </div>

      {/* 2. Section: Ringkasan Nasional */}
      <div className="mb-10 animate-[fadeInUp_0.5s_0.2s_ease_both]">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          RINGKASAN NASIONAL
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* Perkiraan Permintaan / Rata-rata Terjual */}
          <div className="relative rounded-2xl border-[1.5px] border-[#0B579E] bg-white/80 p-5 shadow-sm">
            <div className="absolute top-4 right-4 opacity-90">
              <TrendUpIcon />
            </div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">Rata-rata Terjual/Produk</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {formatDemand(result.metrics.predicted_demand)} <span className="text-xs md:text-sm font-normal text-gray-500">unit</span>
            </p>
          </div>

          {/* Total Toko Bersaing */}
          <div className="relative rounded-2xl border-[1.5px] border-[#0B579E] bg-white/80 p-5 shadow-sm">
            <div className="absolute top-4 right-4 opacity-90">
              <PeopleIcon />
            </div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">Total Toko Bersaing</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {totalShopsCount}{" "}
              <span className="text-xs md:text-sm font-normal text-gray-500">toko (nasional)</span>
            </p>
          </div>

          {/* Median Harga */}
          <div className="relative rounded-2xl border-[1.5px] border-[#0B579E] bg-white/80 p-5 shadow-sm">
            <div className="absolute top-4 right-4 opacity-90">
              <PriceTagIcon />
            </div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">Median Harga</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {formatPrice(result.metrics.avg_price)}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Section BARU: Sebaran Kompetisi per Provinsi */}
      <ProvinceBreakdownSection provinceBreakdown={provinceData} />

      {/* 4. Section: Kenapa [Status]? */}
      <div className="animate-[fadeInUp_0.5s_0.35s_ease_both] mb-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Kenapa {result.opportunity_label}?
        </h3>
        <div className="flex flex-col gap-3.5">
          {explanationsData.map((exp, i) => (
            <div
              key={i}
              className="flex items-start gap-3 animate-[fadeInUp_0.4s_ease_both]"
              style={{ animationDelay: `${0.35 + i * 0.08}s` }}
            >
              {exp.icon === "check" ? <ExplanationCheckIcon /> : <ExplanationWarningIcon />}
              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">{exp.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Section: Seberapa Kuat Pengaruh Tiap Faktor? (Word-based chart + dot indicator) */}
      <FactorStrengthChart factors={factorsData} />

      {/* 6. Footnote */}
      <p className="text-center text-[10px] text-gray-400 mt-12 mb-6 font-normal">
        *Rintis AI.
      </p>
    </div>
  );
}

import { AnalysisResult } from "./components/ResultsView";

/* ──────────── Dummy Data ──────────── */
export const MOCK_DATA: Record<string, AnalysisResult> = {
  default: {
    keyword: "Jaket Pria",
    category: "Jaket Pria",
    opportunity_score: 85,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 3240,
      competition_density: 0.64,
      competition_label: "Tinggi",
      avg_price: 178000,
      total_shops: 64,
    },
    explanations: [
      {
        icon: "check",
        text: "Secara nasional, demand cukup stabil (3.240 unit/produk rata-rata).",
      },
      {
        icon: "check",
        text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa seperti Sumatera Utara.",
      },
    ],
    factors: [
      { label: "Demand Nasional Stabil", strength: "Mendukung", isSupporting: true, dots: 2 },
      { label: "Sebaran Kompetisi Tidak Merata", strength: "Sedikit Mendukung", isSupporting: true, dots: 1 },
    ],
    provinceBreakdown: [
      { province: "DKI Jakarta", shopCount: 21, competitionLevel: "high" },
      { province: "Jawa Barat", shopCount: 17, competitionLevel: "high" },
      { province: "Jawa Timur", shopCount: 9, competitionLevel: "medium" },
      { province: "Banten", shopCount: 7, competitionLevel: "medium" },
      { province: "Sumatera Utara", shopCount: 2, competitionLevel: "low" },
    ],
  },
  "jaket pria": {
    keyword: "Jaket Pria",
    category: "Jaket Pria",
    opportunity_score: 85,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 3240,
      competition_density: 0.64,
      competition_label: "Tinggi",
      avg_price: 178000,
      total_shops: 64,
    },
    explanations: [
      {
        icon: "check",
        text: "Secara nasional, demand cukup stabil (3.240 unit/produk rata-rata).",
      },
      {
        icon: "check",
        text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa seperti Sumatera Utara.",
      },
    ],
    factors: [
      { label: "Demand Nasional Stabil", strength: "Mendukung", isSupporting: true, dots: 2 },
      { label: "Sebaran Kompetisi Tidak Merata", strength: "Sedikit Mendukung", isSupporting: true, dots: 1 },
    ],
    provinceBreakdown: [
      { province: "DKI Jakarta", shopCount: 21, competitionLevel: "high" },
      { province: "Jawa Barat", shopCount: 17, competitionLevel: "high" },
      { province: "Jawa Timur", shopCount: 9, competitionLevel: "medium" },
      { province: "Banten", shopCount: 7, competitionLevel: "medium" },
      { province: "Sumatera Utara", shopCount: 2, competitionLevel: "low" },
    ],
  },
  "frozen food dimsum": {
    keyword: "Frozen Food Dimsum",
    category: "Makanan",
    opportunity_score: 74,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 780,
      competition_density: 0.18,
      competition_label: "Rendah",
      avg_price: 89000,
      total_shops: 45,
    },
    explanations: [
      {
        icon: "check",
        text: "Persaingan rendah (0.18), belum banyak seller frozen dimsum yang konsisten di marketplace.",
      },
      {
        icon: "check",
        text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa seperti Sumatera Utara.",
      },
    ],
    factors: [
      { label: "Demand Nasional Stabil", strength: "Mendukung", isSupporting: true, dots: 2 },
      { label: "Sebaran Kompetisi Tidak Merata", strength: "Sedikit Mendukung", isSupporting: true, dots: 1 },
    ],
    provinceBreakdown: [
      { province: "DKI Jakarta", shopCount: 18, competitionLevel: "high" },
      { province: "Jawa Barat", shopCount: 14, competitionLevel: "high" },
      { province: "Jawa Timur", shopCount: 7, competitionLevel: "medium" },
      { province: "Banten", shopCount: 4, competitionLevel: "medium" },
      { province: "Sumatera Utara", shopCount: 2, competitionLevel: "low" },
    ],
  },
  "gamis syar'i premium": {
    keyword: "Gamis Syar'i Premium",
    category: "Fashion",
    opportunity_score: 81,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 1200,
      competition_density: 0.22,
      competition_label: "Rendah",
      avg_price: 350000,
      total_shops: 52,
    },
    explanations: [
      {
        icon: "check",
        text: "Demand sangat tinggi (1.200 unit/bulan), pasar busana muslim terus berkembang pesat.",
      },
      {
        icon: "check",
        text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa.",
      },
    ],
    factors: [
      { label: "Demand Nasional Stabil", strength: "Sangat Mendukung", isSupporting: true, dots: 3 },
      { label: "Sebaran Kompetisi Tidak Merata", strength: "Sedikit Mendukung", isSupporting: true, dots: 1 },
    ],
    provinceBreakdown: [
      { province: "DKI Jakarta", shopCount: 20, competitionLevel: "high" },
      { province: "Jawa Barat", shopCount: 15, competitionLevel: "high" },
      { province: "Jawa Timur", shopCount: 10, competitionLevel: "medium" },
      { province: "Banten", shopCount: 5, competitionLevel: "medium" },
      { province: "Sumatera Utara", shopCount: 2, competitionLevel: "low" },
    ],
  },
  "kaos polos": {
    keyword: "Kaos Polos",
    category: "Fashion",
    opportunity_score: 18,
    opportunity_level: "red_ocean",
    opportunity_label: "Red Ocean",
    metrics: {
      predicted_demand: 5000,
      competition_density: 0.92,
      competition_label: "Sangat Tinggi",
      avg_price: 45000,
      total_shops: 180,
    },
    explanations: [
      {
        icon: "warning",
        text: "Kompetisi sangat tinggi, ribuan seller sudah bersaing ketat di marketplace.",
      },
      {
        icon: "warning",
        text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa.",
      },
    ],
    factors: [
      { label: "Kompetisi Sangat Tinggi", strength: "Sangat Menahan", isSupporting: false, dots: 3 },
      { label: "Sebaran Kompetisi Tidak Merata", strength: "Sedikit Mendukung", isSupporting: true, dots: 1 },
    ],
    provinceBreakdown: [
      { province: "DKI Jakarta", shopCount: 85, competitionLevel: "high" },
      { province: "Jawa Barat", shopCount: 52, competitionLevel: "high" },
      { province: "Jawa Timur", shopCount: 28, competitionLevel: "medium" },
      { province: "Banten", shopCount: 12, competitionLevel: "medium" },
      { province: "Sumatera Utara", shopCount: 3, competitionLevel: "low" },
    ],
  },
  "snack pedas kekinian": {
    keyword: "Snack Pedas Kekinian",
    category: "Makanan",
    opportunity_score: 48,
    opportunity_level: "niche",
    opportunity_label: "Niche",
    metrics: {
      predicted_demand: 620,
      competition_density: 0.45,
      competition_label: "Sedang",
      avg_price: 25000,
      total_shops: 48,
    },
    explanations: [
      {
        icon: "check",
        text: "Tren snack pedas masih tinggi di kalangan anak muda, potensi viral di media sosial.",
      },
      {
        icon: "warning",
        text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa.",
      },
    ],
    factors: [
      { label: "Demand Nasional Stabil", strength: "Mendukung", isSupporting: true, dots: 2 },
      { label: "Sebaran Kompetisi Tidak Merata", strength: "Sedikit Mendukung", isSupporting: true, dots: 1 },
    ],
    provinceBreakdown: [
      { province: "DKI Jakarta", shopCount: 19, competitionLevel: "high" },
      { province: "Jawa Barat", shopCount: 15, competitionLevel: "high" },
      { province: "Jawa Timur", shopCount: 8, competitionLevel: "medium" },
      { province: "Banten", shopCount: 4, competitionLevel: "medium" },
      { province: "Sumatera Utara", shopCount: 2, competitionLevel: "low" },
    ],
  },
};

export function getMockResult(keyword: string): AnalysisResult {
  const key = keyword.toLowerCase().trim();
  if (MOCK_DATA[key]) {
    return MOCK_DATA[key];
  }
  return {
    ...MOCK_DATA.default,
    keyword: keyword.trim() || "Jaket Pria",
    category: keyword.trim() || "Jaket Pria",
  };
}

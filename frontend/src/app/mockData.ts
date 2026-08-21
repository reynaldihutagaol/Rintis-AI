import { AnalysisResult } from "./components/ResultsView";

/* ──────────── Dummy Data ──────────── */
export const MOCK_DATA: Record<string, AnalysisResult> = {
  default: {
    keyword: "Frozen Food Dimsum",
    category: "F&B",
    opportunity_score: 85,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 3000,
      demand_label: "Tinggi",
      competition_density: 0.18,
      competition_label: "Rendah",
      avg_price: 45000,
      avg_price_label: "Rp xx",
      total_shops: 45,
    },
    recommendation_explanation:
      "Jumlah Penjualan tinggi dengan mencapai 3000 penjualan, Rating rendah (0.18), Jumlah Ulasan cukup",
    other_product_ideas: [
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
    ],
    explanations: [
      {
        icon: "check",
        text: "Secara nasional, demand cukup stabil (3.000 unit/produk rata-rata).",
      },
      {
        icon: "check",
        text: "Kompetisi tidak merata — menumpuk di Jawa & Jabodetabek, masih sepi di luar Jawa.",
      },
    ],
  },
  "frozen food dimsum": {
    keyword: "Frozen Food Dimsum",
    category: "F&B",
    opportunity_score: 85,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 3000,
      demand_label: "Tinggi",
      competition_density: 0.18,
      competition_label: "Rendah",
      avg_price: 45000,
      avg_price_label: "Rp xx",
      total_shops: 45,
    },
    recommendation_explanation:
      "Jumlah Penjualan tinggi dengan mencapai 3000 penjualan, Rating rendah (0.18), Jumlah Ulasan cukup",
    other_product_ideas: [
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
    ],
    explanations: [
      {
        icon: "check",
        text: "Persaingan rendah (0.18), belum banyak seller frozen dimsum yang konsisten di marketplace.",
      },
    ],
  },
  "jaket pria": {
    keyword: "Jaket Pria",
    category: "Fashion",
    opportunity_score: 85,
    opportunity_level: "high",
    opportunity_label: "High Opportunity",
    metrics: {
      predicted_demand: 3240,
      demand_label: "Tinggi",
      competition_density: 0.64,
      competition_label: "Rendah",
      avg_price: 178000,
      avg_price_label: "Rp 178.000",
      total_shops: 64,
    },
    recommendation_explanation:
      "Jumlah Penjualan tinggi dengan mencapai 3240 penjualan, Rating rendah (0.24), Jumlah Ulasan cukup",
    other_product_ideas: [
      {
        id: "1",
        name: "Hoodie Oversize Unisex",
        demand_label: "Tinggi",
        competition_label: "Tinggi",
        avg_price_label: "Rp 120.000",
      },
      {
        id: "2",
        name: "Jaket Bomber Waterproof",
        demand_label: "Tinggi",
        competition_label: "Sedang",
        avg_price_label: "Rp 195.000",
      },
    ],
    explanations: [
      {
        icon: "check",
        text: "Secara nasional, demand cukup stabil (3.240 unit/produk rata-rata).",
      },
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
    keyword: keyword.trim() || "Frozen Food Dimsum",
    category: "F&B",
  };
}


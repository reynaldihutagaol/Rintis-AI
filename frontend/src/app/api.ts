import { AnalysisResult } from "./components/ResultsView";
import { getMockResult } from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Raw response shape from the backend /api/analyze endpoint.
 */
interface BackendAnalyzeResponse {
  keyword: string;
  category: string;
  opportunity_score: number;
  opportunity_level: string;
  opportunity_label: string;
  metrics: {
    predicted_demand: number;
    competition_density: number;
    competition_label: string;
    avg_price: number;
  };
  explanations: {
    icon: string;
    text: string;
  }[];
  shap_features: {
    name: string;
    value: number;
  }[];
  whatif: {
    current_price: number;
    min_price: number;
    max_price: number;
    current_demand: number;
  };
}

/**
 * Map backend emoji icons to frontend icon strings.
 */
function mapIcon(icon: string): string {
  if (icon === "✅") return "check";
  if (icon === "⚠️" || icon === "❌") return "warning";
  return "check";
}

/**
 * Map backend response to frontend AnalysisResult type.
 */
function mapToAnalysisResult(data: BackendAnalyzeResponse): AnalysisResult {
  const demandLabel =
    data.metrics.predicted_demand > 2000
      ? "Tinggi"
      : data.metrics.predicted_demand > 500
      ? "Sedang"
      : "Rendah";

  return {
    keyword: data.keyword,
    category: data.category || "F&B",
    opportunity_score: data.opportunity_score,
    opportunity_level: data.opportunity_level,
    opportunity_label: data.opportunity_label || "High Opportunity",
    metrics: {
      predicted_demand: data.metrics.predicted_demand,
      demand_label: demandLabel,
      competition_density: data.metrics.competition_density,
      competition_label: data.metrics.competition_label || "Rendah",
      avg_price: data.metrics.avg_price,
      avg_price_label: data.metrics.avg_price ? `Rp ${data.metrics.avg_price.toLocaleString("id-ID")}` : "Rp xx",
      total_shops: Math.round(data.metrics.competition_density * 100),
    },
    recommendation_explanation:
      data.explanations && data.explanations.length > 0
        ? data.explanations.map((exp) => exp.text).join(", ")
        : `Jumlah Penjualan tinggi dengan mencapai ${data.metrics.predicted_demand} penjualan, Rating rendah (${data.metrics.competition_density}), Jumlah Ulasan cukup`,
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
    explanations: data.explanations.map((exp) => ({
      icon: mapIcon(exp.icon),
      text: exp.text,
    })),
  };
}

/**
 * Call the backend API to analyze a keyword.
 * Falls back to mock data if the API is unavailable.
 */
export async function analyzeKeyword(keyword: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: BackendAnalyzeResponse = await response.json();
    return mapToAnalysisResult(data);
  } catch (error) {
    console.warn("API unavailable, falling back to mock data:", error);
    return getMockResult(keyword);
  }
}


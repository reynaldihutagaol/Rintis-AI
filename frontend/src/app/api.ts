import { AnalysisResult } from "./components/ResultsView";
import { getMockResult } from "./mockData";
import { findMatchingKeyword } from "./keywords";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Raw response shape from the backend /api/analyze endpoint.
 */
interface BackendAnalyzeResponse {
  keyword: string;
  matched_keyword?: string;
  category: string;
  opportunity_score: number;
  opportunity_level: string;
  opportunity_label: string;
  metrics: {
    predicted_demand: number;
    demand_label?: string;
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
  other_product_ideas?: {
    id?: string;
    name: string;
    demand_label: string;
    competition_label: string;
    avg_price_label: string;
  }[];
}

/**
 * Map backend emoji icons to frontend icon strings.
 */
function mapIcon(icon: string): string {
  if (icon.includes("✅") || icon.includes("✔")) return "check";
  if (icon.includes("⚠️") || icon.includes("❌")) return "warning";
  return "check";
}

/**
 * Map backend response to frontend AnalysisResult type.
 */
function mapToAnalysisResult(data: BackendAnalyzeResponse): AnalysisResult {
  const demandLabel =
    data.metrics.demand_label ||
    (data.metrics.predicted_demand > 1000
      ? "Tinggi"
      : data.metrics.predicted_demand >= 100
      ? "Medium"
      : "Rendah");

  const competitionLabel = data.metrics.competition_label || "Rendah";

  // Context-aware product ideas with exact clean keywords from dataset
  const fallbackProductIdeas =
    data.category === "Fashion"
      ? [
          {
            id: "1",
            name: "Hoodie",
            demand_label: "Tinggi",
            competition_label: "Tinggi",
            avg_price_label: "Rp 135.000",
          },
          {
            id: "2",
            name: "Kaos Pria",
            demand_label: "Tinggi",
            competition_label: "Tinggi",
            avg_price_label: "Rp 43.750",
          },
          {
            id: "3",
            name: "Kemeja Pria",
            demand_label: "Tinggi",
            competition_label: "Tinggi",
            avg_price_label: "Rp 85.900",
          },
        ]
      : [
          {
            id: "1",
            name: "Frozen Food",
            demand_label: "Tinggi",
            competition_label: "Tinggi",
            avg_price_label: "Rp 22.500",
          },
          {
            id: "2",
            name: "Keripik",
            demand_label: "Tinggi",
            competition_label: "Tinggi",
            avg_price_label: "Rp 26.775",
          },
          {
            id: "3",
            name: "Makanan Instan",
            demand_label: "Tinggi",
            competition_label: "Tinggi",
            avg_price_label: "Rp 29.145",
          },
        ];

  const productIdeas =
    data.other_product_ideas && data.other_product_ideas.length > 0
      ? data.other_product_ideas
      : fallbackProductIdeas;

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
      competition_label: competitionLabel,
      avg_price: data.metrics.avg_price,
      avg_price_label: data.metrics.avg_price
        ? `Rp ${data.metrics.avg_price.toLocaleString("id-ID")}`
        : "Rp xx",
      total_shops: Math.round(data.metrics.competition_density * 100),
    },
    recommendation_explanation:
      data.explanations && data.explanations.length > 0
        ? data.explanations.map((exp) => exp.text).join(" ")
        : `Jumlah Penjualan tinggi dengan mencapai ${data.metrics.predicted_demand} penjualan, persaingan ${competitionLabel.toLowerCase()}`,
    other_product_ideas: productIdeas,
    explanations: data.explanations.map((exp) => ({
      icon: mapIcon(exp.icon),
      text: exp.text,
    })),
  };
}

/**
 * Call the backend API to analyze a keyword.
 */
export async function analyzeKeyword(keyword: string): Promise<AnalysisResult> {
  const trimmed = keyword.trim();
  const matched = findMatchingKeyword(trimmed);

  if (!matched) {
    throw new Error(`KeywordNotFound: Kata kunci "${trimmed}" tidak ditemukan dalam data.`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword: matched }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`KeywordNotFound: Kata kunci "${trimmed}" tidak ditemukan di data.`);
      }
      let errorDetail = "";
      try {
        const errorBody = await response.json();
        errorDetail = JSON.stringify(errorBody);
      } catch {
        errorDetail = await response.text().catch(() => "");
      }
      throw new Error(`API error ${response.status}: ${errorDetail}`);
    }

    const data: BackendAnalyzeResponse = await response.json();
    return mapToAnalysisResult(data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith("KeywordNotFound")) {
      throw error;
    }
    console.warn("[analyzeKeyword] Menggunakan mock result sebagai fallback:", error);
    return getMockResult(matched);
  }
}
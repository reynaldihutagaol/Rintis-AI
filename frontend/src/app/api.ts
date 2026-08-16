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
  return {
    keyword: data.keyword,
    category: data.category,
    opportunity_score: data.opportunity_score,
    opportunity_level: data.opportunity_level,
    opportunity_label: data.opportunity_label,
    metrics: {
      predicted_demand: data.metrics.predicted_demand,
      competition_density: data.metrics.competition_density,
      competition_label: data.metrics.competition_label,
      avg_price: data.metrics.avg_price,
      total_shops: Math.round(data.metrics.competition_density * 100),
    },
    explanations: data.explanations.map((exp) => ({
      icon: mapIcon(exp.icon),
      text: exp.text,
    })),
    // factors and provinceBreakdown will use defaults in ResultsView
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

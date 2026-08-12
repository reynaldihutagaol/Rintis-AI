"""
Advisor API routes.
Handles the /api/analyze endpoint.
"""

from fastapi import APIRouter

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.opportunity import analyze_keyword

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    """
    Analyze a keyword and return opportunity score,
    metrics, SHAP explanations, and what-if simulation data.
    """
    result = analyze_keyword(request.keyword)
    return result

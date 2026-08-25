from fastapi import APIRouter, HTTPException

from app.models.schemas import InputAnalyze
from app.services.opportunity import analyze_keyword

router = APIRouter()


@router.post("/api/analyze")
def analyze(data: InputAnalyze):
    try:
        return analyze_keyword(data.keyword)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
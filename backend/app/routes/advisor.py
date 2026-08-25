from fastapi import APIRouter, HTTPException

from app.models.schemas import InputAnalyze
from app.services.opportunity import (
    analyze_keyword,
    _AVAILABLE_KEYWORDS,
    _category_for_keyword,
)

router = APIRouter()

@router.get("/api/keywords")
def get_keywords():
    """Mengembalikan daftar semua keyword yang tersedia di dataset."""
    return [
        {"keyword": kw, "category": _category_for_keyword(kw)}
        for kw in sorted(_AVAILABLE_KEYWORDS)
    ]

@router.post("/api/analyze")
def analyze(data: InputAnalyze):
    try:
        return analyze_keyword(data.keyword)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
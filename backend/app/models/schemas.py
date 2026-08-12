"""
Pydantic schemas for API request and response models.
"""

from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    """Request body for the /api/analyze endpoint."""
    keyword: str


class ShapFeature(BaseModel):
    """A single SHAP feature importance entry."""
    name: str
    value: float


class Explanation(BaseModel):
    """A single explanation bullet point."""
    icon: str
    text: str


class Metrics(BaseModel):
    """Key business metrics for the analyzed keyword."""
    predicted_demand: int
    competition_density: float
    competition_label: str
    avg_price: int


class WhatIf(BaseModel):
    """What-if simulation parameters."""
    current_price: int
    min_price: int
    max_price: int
    current_demand: int


class AnalyzeResponse(BaseModel):
    """Response body for the /api/analyze endpoint."""
    keyword: str
    category: str
    opportunity_score: int
    opportunity_level: str  # "high" | "niche" | "red_ocean"
    opportunity_label: str
    metrics: Metrics
    explanations: list[Explanation]
    shap_features: list[ShapFeature]
    whatif: WhatIf

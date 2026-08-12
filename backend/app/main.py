"""
AI Business Opportunity Advisor — FastAPI Backend
Entry point for the API server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.advisor import router as advisor_router

app = FastAPI(
    title="AI Business Opportunity Advisor",
    description="API untuk menganalisis peluang bisnis di marketplace",
    version="0.1.0",
)

# CORS middleware — allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(advisor_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "AI Business Opportunity Advisor API is running"}

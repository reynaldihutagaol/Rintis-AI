import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.advisor import router as advisor_router

app = FastAPI(title="Rintis AI Backend")

# CORS configuration: allow all by default in production or specific origins via ALLOWED_ORIGINS env
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Rintis AI API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

app.include_router(advisor_router)
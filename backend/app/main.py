from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.advisor import router as advisor_router

app = FastAPI()

# CORS: wajib, biar Next.js (localhost:3000) bisa manggil FastAPI (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(advisor_router)
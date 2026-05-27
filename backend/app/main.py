import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import auth, dashboard, payment, predict, sensitivity, train, upload


load_dotenv()

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app = FastAPI(title="Pricing Intelligence API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(payment.router)
app.include_router(upload.router)
app.include_router(train.router)
app.include_router(predict.router)
app.include_router(sensitivity.router)
app.include_router(dashboard.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "pricing-intelligence-api"}

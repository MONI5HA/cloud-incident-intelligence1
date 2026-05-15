from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.simulator.metrics_generator import generate_metrics
from app.anomaly_detection.detector import AnomalyDetector
from app.root_cause.analyzer import RootCauseAnalyzer
from app.recommendations.engine import RecommendationEngine

app = FastAPI()

# ✅ CORS MIDDLEWARE (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = AnomalyDetector()
rca = RootCauseAnalyzer()
recommender = RecommendationEngine()


@app.get("/")
def root():
    return {"message": "Cloud Incident Intelligence API running"}


@app.get("/metrics")
def get_metrics():

    metrics = generate_metrics()

    detection = detector.update(metrics)

    alerts = detection["alerts"]
    status = detection["status"]

    root_causes = rca.analyze(metrics, alerts)

    recommendations = recommender.generate(
        metrics,
        alerts,
        root_causes
    )

    return {
        "metrics": metrics,
        "alerts": alerts,
        "root_causes": root_causes,
        "recommendations": recommendations,
        "status": status
    }
from contextlib import asynccontextmanager
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.application.use_cases import AnalysisUnavailableError, GetJob, JobNotFoundError, SubmitText
from app.infrastructure.analysis_client import HttpAnalysisGateway
from app.infrastructure.config import settings
from app.infrastructure.database import Base, SessionLocal, engine
from app.infrastructure.repositories import SqlAlchemyJobRepository
from app.presentation.schemas import JobResponse, SubmitRequest, SubmitResponse


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="AnalytiCore Submission API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins,
                   allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["*"])


def session() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health(db: Session = Depends(session)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@app.post("/api/jobs", response_model=SubmitResponse, status_code=status.HTTP_202_ACCEPTED)
def submit(payload: SubmitRequest, db: Session = Depends(session)) -> SubmitResponse:
    try:
        job = SubmitText(SqlAlchemyJobRepository(db), HttpAnalysisGateway(settings.java_service_url)).execute(payload.text.strip())
        return SubmitResponse(job_id=job.id, status=job.status)
    except AnalysisUnavailableError as exc:
        raise HTTPException(status_code=503, detail="El servicio de análisis no está disponible") from exc


@app.get("/api/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: UUID, db: Session = Depends(session)) -> JobResponse:
    try:
        return JobResponse.from_domain(GetJob(SqlAlchemyJobRepository(db)).execute(job_id))
    except JobNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Trabajo no encontrado") from exc


from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.domain.job import Job, JobStatus


class SubmitRequest(BaseModel):
    text: str = Field(min_length=1, max_length=10000)

class SubmitResponse(BaseModel):
    job_id: UUID
    status: JobStatus

class JobResponse(BaseModel):
    job_id: UUID
    text: str
    status: JobStatus
    sentiment: str | None
    keywords: list[str] | None
    error: str | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_domain(cls, job: Job) -> "JobResponse":
        return cls(job_id=job.id, text=job.text, status=job.status,
                   sentiment=job.sentiment, keywords=job.keywords, error=job.error,
                   created_at=job.created_at, updated_at=job.updated_at)


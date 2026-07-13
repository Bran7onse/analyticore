from typing import Protocol
from uuid import UUID

from app.domain.job import Job


class JobRepository(Protocol):
    def create(self, text: str) -> Job: ...
    def get(self, job_id: UUID) -> Job | None: ...
    def mark_failed(self, job_id: UUID, reason: str) -> None: ...


class AnalysisGateway(Protocol):
    def start(self, job_id: UUID) -> None: ...


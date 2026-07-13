from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from uuid import UUID


class JobStatus(StrEnum):
    PENDING = "PENDIENTE"
    PROCESSING = "PROCESANDO"
    COMPLETED = "COMPLETADO"
    FAILED = "FALLIDO"


@dataclass(frozen=True)
class Job:
    id: UUID
    text: str
    status: JobStatus
    sentiment: str | None
    keywords: list[str] | None
    error: str | None
    created_at: datetime
    updated_at: datetime


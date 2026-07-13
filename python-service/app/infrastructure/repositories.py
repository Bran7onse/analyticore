from uuid import UUID

from sqlalchemy.orm import Session

from app.domain.job import Job, JobStatus
from app.infrastructure.models import JobModel


class SqlAlchemyJobRepository:
    def __init__(self, session: Session):
        self.session = session

    @staticmethod
    def _to_domain(model: JobModel) -> Job:
        return Job(model.id, model.text, JobStatus(model.status), model.sentiment,
                   model.keywords, model.error, model.created_at, model.updated_at)

    def create(self, text: str) -> Job:
        model = JobModel(text=text, status=JobStatus.PENDING.value)
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_domain(model)

    def get(self, job_id: UUID) -> Job | None:
        model = self.session.get(JobModel, job_id)
        return self._to_domain(model) if model else None

    def mark_failed(self, job_id: UUID, reason: str) -> None:
        model = self.session.get(JobModel, job_id)
        if model:
            model.status = JobStatus.FAILED.value
            model.error = reason
            self.session.commit()


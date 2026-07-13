from uuid import UUID

from app.domain.job import Job
from app.domain.ports import AnalysisGateway, JobRepository


class JobNotFoundError(Exception):
    pass


class AnalysisUnavailableError(Exception):
    pass


class SubmitText:
    def __init__(self, repository: JobRepository, analysis: AnalysisGateway):
        self.repository = repository
        self.analysis = analysis

    def execute(self, text: str) -> Job:
        job = self.repository.create(text)
        try:
            self.analysis.start(job.id)
        except Exception as exc:
            self.repository.mark_failed(job.id, "No fue posible iniciar el análisis")
            raise AnalysisUnavailableError from exc
        return job


class GetJob:
    def __init__(self, repository: JobRepository):
        self.repository = repository

    def execute(self, job_id: UUID) -> Job:
        job = self.repository.get(job_id)
        if job is None:
            raise JobNotFoundError
        return job


from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.application.use_cases import AnalysisUnavailableError, GetJob, JobNotFoundError, SubmitText
from app.domain.job import Job, JobStatus


class FakeRepository:
    def __init__(self):
        self.job = None

    def create(self, text):
        now = datetime.now(UTC)
        self.job = Job(uuid4(), text, JobStatus.PENDING, None, None, None, now, now)
        return self.job

    def get(self, job_id):
        return self.job if self.job and self.job.id == job_id else None

    def mark_failed(self, job_id, reason):
        self.failed = (job_id, reason)


class FakeGateway:
    def __init__(self, fails=False):
        self.fails = fails

    def start(self, job_id):
        if self.fails:
            raise ConnectionError
        self.started = job_id


def test_submit_creates_and_starts_job():
    repository, gateway = FakeRepository(), FakeGateway()
    job = SubmitText(repository, gateway).execute("Texto excelente")
    assert gateway.started == job.id
    assert job.status == JobStatus.PENDING


def test_submit_marks_job_failed_when_java_is_unavailable():
    repository = FakeRepository()
    with pytest.raises(AnalysisUnavailableError):
        SubmitText(repository, FakeGateway(fails=True)).execute("Texto")
    assert repository.failed[0] == repository.job.id


def test_get_missing_job_raises():
    with pytest.raises(JobNotFoundError):
        GetJob(FakeRepository()).execute(uuid4())

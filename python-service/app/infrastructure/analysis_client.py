from uuid import UUID

import httpx


class HttpAnalysisGateway:
    def __init__(self, base_url: str):
        normalized = base_url if "://" in base_url else f"http://{base_url}"
        self.base_url = normalized.rstrip("/")

    def start(self, job_id: UUID) -> None:
        response = httpx.post(f"{self.base_url}/internal/analyses", json={"jobId": str(job_id)}, timeout=10)
        response.raise_for_status()

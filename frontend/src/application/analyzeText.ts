import type { JobRepository } from '../domain/JobRepository'
import type { Job } from '../domain/job'

const delay = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

export async function analyzeText(repository: JobRepository, text: string, onUpdate: (job: Job) => void): Promise<Job> {
  const created = await repository.submit(text)
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const job = await repository.get(created.job_id)
    onUpdate(job)
    if (job.status === 'COMPLETADO' || job.status === 'FALLIDO') return job
    await delay(1500)
  }
  throw new Error('El análisis tardó demasiado. Puedes intentarlo nuevamente.')
}


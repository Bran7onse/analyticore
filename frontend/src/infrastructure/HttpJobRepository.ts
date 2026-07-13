import type { JobRepository } from '../domain/JobRepository'
import type { CreatedJob, Job } from '../domain/job'

const configuredUrl = import.meta.env.VITE_API_URL || ''

const API_URL = (
  configuredUrl && !configuredUrl.includes('://')
    ? `https://${configuredUrl}`
    : configuredUrl
).replace(/\/$/, '')

const delay = (ms: number) =>
  new Promise(resolve => window.setTimeout(resolve, ms))

export class HttpJobRepository implements JobRepository {
  private async request<T>(
    path: string,
    options?: RequestInit,
    maxAttempts = 1
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const response = await fetch(`${API_URL}${path}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {})
          }
        })

        if (response.ok) {
          return response.json() as Promise<T>
        }

        const body = await response.json().catch(() => ({}))
        const message =
          body.detail || `El servidor respondió con código ${response.status}`

        /*
         * Render puede devolver temporalmente 502, 503 o 504
         * mientras un servicio gratuito se está iniciando.
         */
        if (
          [502, 503, 504].includes(response.status) &&
          attempt < maxAttempts
        ) {
          await delay(5000)
          continue
        }

        throw new Error(message)
      } catch (error) {
        lastError =
          error instanceof Error
            ? error
            : new Error('No se pudo conectar con AnalytiCore')

        if (attempt < maxAttempts) {
          await delay(5000)
          continue
        }
      }
    }

    throw lastError || new Error('No se pudo conectar con AnalytiCore')
  }

  submit(text: string): Promise<CreatedJob> {
    return this.request<CreatedJob>(
      '/api/jobs',
      {
        method: 'POST',
        body: JSON.stringify({ text })
      },
      4
    )
  }

  get(id: string): Promise<Job> {
    return this.request<Job>(`/api/jobs/${id}`, undefined, 3)
  }
}
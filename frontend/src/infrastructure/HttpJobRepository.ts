import type { JobRepository } from '../domain/JobRepository'
import type { CreatedJob, Job } from '../domain/job'

const configuredUrl = import.meta.env.VITE_API_URL || ''
const API_URL = (configuredUrl && !configuredUrl.includes('://') ? `https://${configuredUrl}` : configuredUrl).replace(/\/$/, '')

export class HttpJobRepository implements JobRepository {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, { headers: {'Content-Type': 'application/json'}, ...options })
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.detail || 'No se pudo conectar con AnalytiCore')
    }
    return response.json() as Promise<T>
  }
  submit(text: string) { return this.request<CreatedJob>('/api/jobs', {method:'POST', body:JSON.stringify({text})}) }
  get(id: string) { return this.request<Job>(`/api/jobs/${id}`) }
}

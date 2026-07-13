export type JobStatus = 'PENDIENTE' | 'PROCESANDO' | 'COMPLETADO' | 'FALLIDO'
export interface Job { job_id: string; text: string; status: JobStatus; sentiment: string | null; keywords: string[] | null; error: string | null; created_at: string; updated_at: string }
export interface CreatedJob { job_id: string; status: JobStatus }


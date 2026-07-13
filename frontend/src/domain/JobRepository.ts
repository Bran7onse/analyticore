import type { CreatedJob, Job } from './job'
export interface JobRepository { submit(text: string): Promise<CreatedJob>; get(id: string): Promise<Job> }


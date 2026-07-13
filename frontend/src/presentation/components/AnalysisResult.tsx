import type { Job } from '../../domain/job'

export function AnalysisResult({job}:{job:Job}) {
  if (job.status !== 'COMPLETADO') return <section className="card status" aria-live="polite"><span className="spinner"/><div><strong>{job.status === 'PENDIENTE' ? 'Análisis en cola' : 'Procesando texto'}</strong><p>El resultado se actualizará automáticamente.</p></div></section>
  return <section className="card result" aria-live="polite"><div><span className="eyebrow">Sentimiento</span><strong className={`sentiment ${job.sentiment?.toLowerCase()}`}>{job.sentiment}</strong></div><div><span className="eyebrow">Palabras clave</span><div className="keywords">{job.keywords?.length ? job.keywords.map(word=><span key={word}>{word}</span>) : <em>No se encontraron palabras clave.</em>}</div></div></section>
}


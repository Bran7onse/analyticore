import { useState } from 'react'
import type { Job } from '../../domain/job'

interface AnalysisResultProps {
  job: Job
}

type SentimentStyle = {
  label: string
  icon: string
  className: string
  description: string
}

const SENTIMENT_STYLES: Record<string, SentimentStyle> = {
  POSITIVO: {
    label: 'Positivo',
    icon: '😊',
    className: 'sentiment-positive',
    description: 'El texto contiene una percepción principalmente favorable.',
  },
  NEGATIVO: {
    label: 'Negativo',
    icon: '☹️',
    className: 'sentiment-negative',
    description: 'El texto contiene una percepción principalmente desfavorable.',
  },
  NEUTRAL: {
    label: 'Neutral',
    icon: '😐',
    className: 'sentiment-neutral',
    description: 'El texto no presenta una tendencia emocional dominante.',
  },
}

export function AnalysisResult({ job }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false)

  const status = job.status.toUpperCase()
  const isCompleted = status === 'COMPLETADO'
  const isFailed = status === 'FALLIDO'

  const normalizedSentiment = (job.sentiment ?? 'NEUTRAL').toUpperCase()

  const sentiment =
    SENTIMENT_STYLES[normalizedSentiment] ?? SENTIMENT_STYLES.NEUTRAL

  const keywords = job.keywords ?? []

  const copyResult = async () => {
    const content = [
      `Sentimiento: ${sentiment.label.toUpperCase()}`,
      `Palabras clave: ${
        keywords.length > 0 ? keywords.join(', ') : 'No disponibles'
      }`,
      `Texto analizado: ${job.text}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setCopied(false)
    }
  }

  if (!isCompleted && !isFailed) {
    return (
      <section className="result-card processing-card" aria-live="polite">
        <div className="processing-content">
          <span className="spinner spinner-large" aria-hidden="true" />

          <div>
            <span className="eyebrow">Procesando solicitud</span>
            <h2>El análisis está en curso</h2>
            <p>
              Estado actual: <strong>{status}</strong>. La aplicación consultará
              automáticamente hasta obtener el resultado.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (isFailed) {
    return (
      <section className="result-card failed-card" aria-live="assertive">
        <div className="result-header">
          <div>
            <span className="eyebrow">Resultado del análisis</span>
            <h2>No fue posible analizar el texto</h2>
          </div>

          <span className="status-badge status-failed">FALLIDO</span>
        </div>

        <p className="failed-message">
          {job.error || 'El servicio devolvió un error durante el análisis.'}
        </p>
      </section>
    )
  }

  return (
    <section
      className={`result-card ${sentiment.className}`}
      aria-live="polite"
    >
      <div className="result-header">
        <div>
          <span className="eyebrow">Resultado del análisis</span>
          <h2>Análisis completado</h2>
        </div>

        <span className="status-badge status-completed">COMPLETADO</span>
      </div>

      <div className="result-grid">
        <article className="sentiment-panel">
          <span className="result-label">Sentimiento detectado</span>

          <div className="sentiment-main">
            <span className="sentiment-icon" aria-hidden="true">
              {sentiment.icon}
            </span>

            <strong>{sentiment.label}</strong>
          </div>

          <p>{sentiment.description}</p>
        </article>

        <article className="keywords-panel">
          <span className="result-label">Palabras clave</span>

          {keywords.length > 0 ? (
            <div className="keyword-list">
              {keywords.map(keyword => (
                <span className="keyword-chip" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-keywords">
              No se encontraron palabras clave relevantes.
            </p>
          )}
        </article>
      </div>

      <div className="result-footer">
        <span className="job-reference">
          Trabajo: {job.job_id.slice(0, 8)}…
        </span>

        <button
          type="button"
          className="copy-button"
          onClick={copyResult}
        >
          {copied ? '✓ Resultado copiado' : 'Copiar resultado'}
        </button>
      </div>
    </section>
  )
}
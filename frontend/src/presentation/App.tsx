import { useState } from 'react'
import { analyzeText } from '../application/analyzeText'
import type { JobRepository } from '../domain/JobRepository'
import type { Job } from '../domain/job'
import { AnalysisForm } from './components/AnalysisForm'
import { AnalysisResult } from './components/AnalysisResult'
import '../styles.css'

interface AppProps {
  repository: JobRepository
}

export default function App({ repository }: AppProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (text: string) => {
    setBusy(true)
    setError('')
    setJob(null)

    try {
      await analyzeText(repository, text, setJob)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Ocurrió un error inesperado.',
      )
    } finally {
      setBusy(false)
    }
  }

  const clearAnalysis = () => {
    setJob(null)
    setError('')
    setBusy(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <div className="brand">
            <span className="brand-logo">AC</span>

            <div>
              <strong>AnalytiCore</strong>
              <small>Análisis inteligente de texto</small>
            </div>
          </div>

          <span className="architecture-badge">
            React · FastAPI · Spring Boot
          </span>
        </div>
      </header>

      <main className="page-content">
        <section className="hero">
          <span className="eyebrow">Arquitectura políglota</span>

          <h1>
            Comprende el tono.
            <br />
            <em>Descubre lo esencial.</em>
          </h1>

          <p>
            Analiza el sentimiento de un texto y descubre sus palabras clave
            mediante servicios independientes desplegados en la nube.
          </p>
        </section>

        <AnalysisForm
          busy={busy}
          onSubmit={submit}
          onClear={clearAnalysis}
        />

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            <span aria-hidden="true">⚠️</span>

            <div>
              <strong>No se pudo completar el análisis</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {job && <AnalysisResult job={job} />}

        <section className="services-section">
          <div className="section-heading">
            <span className="eyebrow">Componentes principales</span>
            <h2>¿Cómo funciona AnalytiCore?</h2>
          </div>

          <div className="services-grid">
            <article className="service-card">
              <span className="service-icon" aria-hidden="true">
                ⚛️
              </span>
              <h3>Frontend React</h3>
              <p>
                Recibe el texto, envía la solicitud y presenta el resultado al
                usuario.
              </p>
            </article>

            <article className="service-card">
              <span className="service-icon" aria-hidden="true">
                ⚡
              </span>
              <h3>FastAPI</h3>
              <p>
                Crea los trabajos, coordina el proceso y almacena los resultados
                en PostgreSQL.
              </p>
            </article>

            <article className="service-card">
              <span className="service-icon" aria-hidden="true">
                ☕
              </span>
              <h3>Spring Boot</h3>
              <p>
                Analiza el sentimiento y selecciona las palabras clave más
                relevantes.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Proyecto académico desarrollado con React, FastAPI, Spring Boot,
          PostgreSQL, Docker y Render.
        </p>

        <a
          href="https://github.com/Bran7onse/analyticore"
          target="_blank"
          rel="noreferrer"
        >
          Ver repositorio en GitHub ↗
        </a>
      </footer>
    </div>
  )
}
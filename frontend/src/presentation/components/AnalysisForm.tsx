import { useState, type FormEvent } from 'react'

interface AnalysisFormProps {
  busy: boolean
  onSubmit: (text: string) => Promise<void> | void
  onClear: () => void
}

const MAX_CHARACTERS = 10_000

const EXAMPLES = [
  {
    label: 'Positivo',
    icon: '😊',
    className: 'positive',
    text: 'Excelente aplicación, funciona muy bien, es rápida, eficiente y me encanta la experiencia.',
  },
  {
    label: 'Negativo',
    icon: '☹️',
    className: 'negative',
    text: 'La aplicación es mala, horrible, lenta, inútil y tiene muchos errores. La experiencia fue terrible.',
  },
  {
    label: 'Neutral',
    icon: '😐',
    className: 'neutral',
    text: 'La aplicación permite registrar usuarios, consultar información y generar reportes del sistema.',
  },
] as const

export function AnalysisForm({
  busy,
  onSubmit,
  onClear,
}: AnalysisFormProps) {
  const [text, setText] = useState('')

  const trimmedText = text.trim()
  const canSubmit = trimmedText.length > 0 && !busy

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    await onSubmit(trimmedText)
  }

  const handleTextChange = (value: string) => {
    setText(value)
    onClear()
  }

  const selectExample = (exampleText: string) => {
    setText(exampleText)
    onClear()
  }

  const clearForm = () => {
    setText('')
    onClear()
  }

  return (
    <section className="form-card" aria-labelledby="analysis-form-title">
      <div className="form-card-header">
        <div>
          <span className="eyebrow">Nuevo análisis</span>
          <h2 id="analysis-form-title">Texto para analizar</h2>
        </div>

        <span className="character-badge">
          {text.length.toLocaleString('es-EC')} /{' '}
          {MAX_CHARACTERS.toLocaleString('es-EC')}
        </span>
      </div>

      <div className="examples-container">
        <span className="examples-label">Prueba un ejemplo:</span>

        <div className="example-buttons">
          {EXAMPLES.map(example => (
            <button
              key={example.label}
              type="button"
              className={`example-button ${example.className}`}
              onClick={() => selectExample(example.text)}
              disabled={busy}
            >
              <span aria-hidden="true">{example.icon}</span>
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="analysis-text">
          Escribe el texto que deseas analizar
        </label>

        <textarea
          id="analysis-text"
          className="analysis-textarea"
          placeholder="Escribe o pega aquí el texto que deseas analizar..."
          value={text}
          maxLength={MAX_CHARACTERS}
          disabled={busy}
          onChange={event => handleTextChange(event.target.value)}
          rows={8}
        />

        <div className="form-bottom">
          <div className="render-notice">
            <span aria-hidden="true">☁️</span>
            <p>
              El primer análisis puede tardar unos segundos mientras los
              servicios gratuitos de Render se activan.
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={clearForm}
              disabled={busy || text.length === 0}
            >
              Limpiar
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={!canSubmit}
            >
              {busy ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Analizando...
                </>
              ) : (
                <>
                  Analizar texto
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
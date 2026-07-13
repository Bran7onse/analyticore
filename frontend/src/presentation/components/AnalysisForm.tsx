import { FormEvent, useState } from 'react'

export function AnalysisForm({busy, onSubmit}:{busy:boolean; onSubmit:(text:string)=>void}) {
  const [text, setText] = useState('')
  const submit = (event:FormEvent) => { event.preventDefault(); const value=text.trim(); if(value) onSubmit(value) }
  return <form onSubmit={submit} className="card form">
    <label htmlFor="text">Texto para analizar</label>
    <textarea id="text" maxLength={10000} required rows={8} value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe o pega aquí el texto…" disabled={busy}/>
    <div className="form-footer"><span>{text.length.toLocaleString()} / 10.000</span><button disabled={busy || !text.trim()}>{busy ? 'Analizando…' : 'Analizar texto'}</button></div>
  </form>
}


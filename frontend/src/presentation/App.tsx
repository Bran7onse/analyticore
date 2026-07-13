import { useState } from 'react'
import { analyzeText } from '../application/analyzeText'
import type { JobRepository } from '../domain/JobRepository'
import type { Job } from '../domain/job'
import { AnalysisForm } from './components/AnalysisForm'
import { AnalysisResult } from './components/AnalysisResult'
import '../styles.css'

export default function App({repository}:{repository:JobRepository}) {
  const [job,setJob]=useState<Job|null>(null), [error,setError]=useState(''), [busy,setBusy]=useState(false)
  const submit=async(text:string)=>{setBusy(true);setError('');setJob(null);try{await analyzeText(repository,text,setJob)}catch(e){setError(e instanceof Error?e.message:'Ocurrió un error inesperado')}finally{setBusy(false)}}
  return <main><header><div className="brand"><span>AC</span> AnalytiCore</div><p>Convierte texto libre en señales útiles.</p></header><section className="hero"><span className="eyebrow">Análisis inteligente</span><h1>Comprende el tono.<br/><em>Descubre lo esencial.</em></h1><p>Identifica el sentimiento y las palabras clave de cualquier texto en segundos.</p></section><AnalysisForm busy={busy} onSubmit={submit}/>{error&&<div className="error" role="alert">{error}</div>}{job&&<AnalysisResult job={job}/>}<footer>Arquitectura políglota · React + FastAPI + Spring Boot</footer></main>
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HttpJobRepository } from './infrastructure/HttpJobRepository'
import App from './presentation/App'
const repository = new HttpJobRepository()
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App repository={repository}/></React.StrictMode>)

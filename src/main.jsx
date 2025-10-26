import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const base = import.meta.env.BASE_URL || '/'
    const swUrl = `${base}sw.js`

    navigator.serviceWorker
      .register(swUrl, { scope: base })
      .catch((err) => {
        console.error('Fallo al registrar SW', err)
      })
  }
}

registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

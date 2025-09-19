import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MobilePlanGiovanni from './MobilePlanGiovanni.jsx'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MobilePlanGiovanni />
  </React.StrictMode>
)

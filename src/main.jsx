import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SmoothScrollProvider } from './lib/smoothScroll'
import { captureClickIds, initPosthog, installClickTracking } from './lib/analytics'
import './index.css'

// Module scope, not an effect: runs once even under StrictMode.
initPosthog()
captureClickIds()
installClickTracking()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SmoothScrollProvider>
        <App />
      </SmoothScrollProvider>
    </BrowserRouter>
  </React.StrictMode>
)

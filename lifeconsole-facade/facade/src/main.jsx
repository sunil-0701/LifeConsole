import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyAccent, readAccent } from './lib/preferences'

// Restore the saved accent before React renders, so no reload flashes violet.
applyAccent(readAccent())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

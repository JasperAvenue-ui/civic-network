import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Auth from './Auth.jsx'

function Root() {
  const [session, setSession] = useState(null)

  if (!session) return <Auth onLogin={setSession} />
  return <App session={session} onLogout={() => setSession(null)} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)

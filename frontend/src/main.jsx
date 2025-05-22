import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/Authcontext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)

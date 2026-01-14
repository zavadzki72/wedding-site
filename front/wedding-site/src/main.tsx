import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GiftSelectionProvider } from './context/GiftSelectionContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GiftSelectionProvider>
    <App />
    </GiftSelectionProvider>
  </React.StrictMode>,
)
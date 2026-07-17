import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { router } from './router.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProfileProvider>
      <RouterProvider router={router} />
    </ProfileProvider>
  </StrictMode>,
)

// Unregister any stale Service Workers to prevent old cached JS from loading
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister());
  });
}


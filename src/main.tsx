
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProfileProvider } from './hooks/use-user-profile.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" attribute="class">
      <QueryClientProvider client={queryClient}>
        <UserProfileProvider>
          <Router>
            <App />
            <Toaster position="top-right" />
          </Router>
        </UserProfileProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

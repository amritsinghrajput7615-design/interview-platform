import { useState } from 'react'
import {RouterProvider} from 'react-router'
import './App.css'
import { router } from './app.router'
import { AuthProvider } from './features/auth/auth.context'
import { InterviewProvider } from './features/interview/Interview.context.jsx'
function App() {
  
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App

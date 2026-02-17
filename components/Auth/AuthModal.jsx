// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', 'forgot'

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
    // Modal yopilganda login sahifasiga qaytish
    setTimeout(() => setAuthMode('login'), 300)
  }, [])

  const value = {
    isAuthModalOpen,
    authMode,
    setAuthMode,
    openAuthModal,
    closeAuthModal
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
"use client";
import { createContext, useContext, useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode]               = useState('login')
  const [isLoading, setIsLoading]             = useState(true)

  useEffect(() => {
    const restore = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          setUser(await res.json())
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      } catch {
        // backend offline
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const _saveTokensAndFetchMe = async (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    const meRes = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    const me = await meRes.json()
    setUser(me)
    setIsAuthModalOpen(false)
    return me
  }

  const register = async (email, password, userData) => {
    setIsLoading(true)
    try {
      const full_name = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || email.split('@')[0]
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')

      // Backend returns {status: "verify_email", email} — OTP sent
      if (data.status === 'verify_email') {
        return { needsVerification: true, email: data.email }
      }

      // Fallback: if tokens returned directly
      return await _saveTokensAndFetchMe(data.access_token, data.refresh_token)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (email, code) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Invalid or expired code')
      return await _saveTokensAndFetchMe(data.access_token, data.refresh_token)
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async (email) => {
    const res = await fetch(`${API}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Failed to resend code')
    return data
  }

  const googleLogin = async (credential) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Google login failed')
      return await _saveTokensAndFetchMe(data.access_token, data.refresh_token)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.detail === 'verify_email_required') {
          return { needsVerification: true, email }
        }
        throw new Error(data.detail || 'Invalid email or password')
      }
      return await _saveTokensAndFetchMe(data.access_token, data.refresh_token)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const updateUserProfile = async (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    return updatedUser
  }

  const updateTestProgress = (testType, score) => {
    if (!user) return
    setUser(prev => ({
      ...prev,
      progress: { ...(prev.progress || {}), [testType]: Math.max((prev.progress?.[testType] || 0), score) }
    }))
  }

  const resetPassword = async (_email) => {
    return { message: 'If an account exists, reset instructions have been sent.' }
  }

  const deleteAccount = async () => {
    logout()
    return { message: 'Account deleted' }
  }

  const openAuthModal  = (mode = 'login') => { setAuthMode(mode); setIsAuthModalOpen(true) }
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const value = {
    user,
    isAuthModalOpen,
    authMode,
    isLoading,
    register,
    login,
    logout,
    verifyEmail,
    resendOTP,
    googleLogin,
    resetPassword,
    deleteAccount,
    updateUserProfile,
    updateTestProgress,
    openAuthModal,
    closeAuthModal,
    isAuthenticated: !!user,
    userProgress: user?.progress || {},
    testHistory: user?.testHistory || [],
    setAuthMode,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('examy_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        localStorage.removeItem('examy_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const register = async (email, password, userData) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true)
      
      // Simulate API call delay
      setTimeout(() => {
        try {
          // Basic validation
          if (!email || !password) {
            throw new Error('Email and password are required')
          }

          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long')
          }

          // Check if user already exists
          const existingUsers = JSON.parse(localStorage.getItem('examy_users') || '[]')
          const userExists = existingUsers.some(user => user.email === email)
          
          if (userExists) {
            throw new Error('User with this email already exists')
          }

          // Create new user
          const newUser = {
            id: Date.now(),
            email: email.toLowerCase().trim(),
            firstName: userData.firstName?.trim() || '',
            lastName: userData.lastName?.trim() || '',
            targetBand: userData.targetBand || '6.5',
            registrationDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            testHistory: [],
            progress: {
              speaking: 0,
              listening: 0,
              reading: 0,
              writing: 0
            }
          }

          // Save to localStorage
          const updatedUsers = [...existingUsers, newUser]
          localStorage.setItem('examy_users', JSON.stringify(updatedUsers))
          localStorage.setItem('examy_user', JSON.stringify(newUser))
          
          setUser(newUser)
          setIsAuthModalOpen(false)
          resolve(newUser)
        } catch (error) {
          reject(error)
        } finally {
          setIsLoading(false)
        }
      }, 1500)
    })
  }

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true)
      
      // Simulate API call delay
      setTimeout(() => {
        try {
          // Basic validation
          if (!email || !password) {
            throw new Error('Email and password are required')
          }

          // Check if user exists
          const existingUsers = JSON.parse(localStorage.getItem('examy_users') || '[]')
          const user = existingUsers.find(u => u.email === email.toLowerCase().trim())
          
          if (!user) {
            throw new Error('User not found. Please register first.')
          }

          // In a real app, you would verify the password here
          // For demo purposes, we'll accept any password
          if (!password) {
            throw new Error('Invalid password')
          }

          // Update last login
          const updatedUser = {
            ...user,
            lastLogin: new Date().toISOString()
          }

          // Update users list
          const updatedUsers = existingUsers.map(u => 
            u.id === user.id ? updatedUser : u
          )
          
          localStorage.setItem('examy_users', JSON.stringify(updatedUsers))
          localStorage.setItem('examy_user', JSON.stringify(updatedUser))
          
          setUser(updatedUser)
          setIsAuthModalOpen(false)
          resolve(updatedUser)
        } catch (error) {
          reject(error)
        } finally {
          setIsLoading(false)
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('examy_user')
    // Don't remove examy_users to preserve user data
  }

  const updateUserProfile = async (updates) => {
    return new Promise((resolve, reject) => {
      try {
        const existingUsers = JSON.parse(localStorage.getItem('examy_users') || '[]')
        const updatedUser = { ...user, ...updates }
        
        const updatedUsers = existingUsers.map(u => 
          u.id === user.id ? updatedUser : u
        )
        
        localStorage.setItem('examy_users', JSON.stringify(updatedUsers))
        localStorage.setItem('examy_user', JSON.stringify(updatedUser))
        
        setUser(updatedUser)
        resolve(updatedUser)
      } catch (error) {
        reject(error)
      }
    })
  }

  const updateTestProgress = (testType, score) => {
    if (!user) return

    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        [testType]: Math.max(user.progress[testType] || 0, score)
      },
      testHistory: [
        ...(user.testHistory || []),
        {
          testType,
          score,
          date: new Date().toISOString(),
          band: calculateBandScore(score)
        }
      ]
    }

    updateUserProfile(updatedUser)
  }

  const calculateBandScore = (score) => {
    // Simple band score calculation for demo
    if (score >= 35) return 9.0
    if (score >= 30) return 8.0
    if (score >= 25) return 7.0
    if (score >= 20) return 6.0
    if (score >= 15) return 5.0
    return 4.0
  }

  const resetPassword = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const existingUsers = JSON.parse(localStorage.getItem('examy_users') || '[]')
          const userExists = existingUsers.some(user => user.email === email.toLowerCase().trim())
          
          if (!userExists) {
            throw new Error('No account found with this email address')
          }

          // In a real app, you would send a password reset email here
          resolve({ message: 'Password reset instructions sent to your email' })
        } catch (error) {
          reject(error)
        }
      }, 1000)
    })
  }

  const deleteAccount = async () => {
    return new Promise((resolve, reject) => {
      try {
        if (!user) {
          throw new Error('No user logged in')
        }

        const existingUsers = JSON.parse(localStorage.getItem('examy_users') || '[]')
        const updatedUsers = existingUsers.filter(u => u.id !== user.id)
        
        localStorage.setItem('examy_users', JSON.stringify(updatedUsers))
        localStorage.removeItem('examy_user')
        
        setUser(null)
        resolve({ message: 'Account deleted successfully' })
      } catch (error) {
        reject(error)
      }
    })
  }

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const value = {
    // State
    user,
    isAuthModalOpen,
    authMode,
    isLoading,
    
    // Auth actions
    register,
    login,
    logout,
    resetPassword,
    deleteAccount,
    
    // User actions
    updateUserProfile,
    updateTestProgress,
    
    // Modal actions
    openAuthModal,
    closeAuthModal,
    
    // Utilities
    isAuthenticated: !!user,
    userProgress: user?.progress || {},
    testHistory: user?.testHistory || []
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContext
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ dark: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('ep-theme')
      if (saved === 'dark') {
        setDark(true)
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    } catch {}
  }, [])

  const toggle = () => {
    const nd = !dark
    setDark(nd)
    try {
      localStorage.setItem('ep-theme', nd ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', nd ? 'dark' : 'light')
    } catch {}
  }

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
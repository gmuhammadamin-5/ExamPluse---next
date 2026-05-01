'use client'

import { createContext, useContext, useState, useLayoutEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('quantum-light')

  // useLayoutEffect = paint'dan OLDIN ishlaydi → flash yo'q
  // [theme] dependency: toggle bosilganda ham, mount'da ham ishlaydi
  useLayoutEffect(() => {
    const isDark = theme === 'quantum-dark'
    const html = document.documentElement
    html.style.filter = isDark ? 'invert(1) hue-rotate(180deg)' : ''
    html.setAttribute('data-theme', theme)
  }, [theme])

  // Saqlangan temanio yuklash — bu ham useLayoutEffect, paint'dan oldin
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem('ep-theme')
      if (saved === 'quantum-dark' || saved === 'dark') {
        setTheme('quantum-dark')
      }
    } catch {}
  }, [])

  const toggleTheme = () => {
    const next = theme === 'quantum-dark' ? 'quantum-light' : 'quantum-dark'
    setTheme(next)
    try { localStorage.setItem('ep-theme', next) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'quantum-dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

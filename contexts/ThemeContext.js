"use client";
import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('quantum-dark')
  const [accentColor, setAccentColor] = useState('#6366F1')

  useEffect(() => {
    const savedTheme = localStorage.getItem('quantum-theme') || 'quantum-dark'
    const savedAccent = localStorage.getItem('quantum-accent') || '#6366F1'
    
    setTheme(savedTheme)
    setAccentColor(savedAccent)
    
    document.documentElement.setAttribute('data-theme', savedTheme)
    document.documentElement.style.setProperty('--primary', savedAccent)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'quantum-dark' ? 'quantum-light' : 'quantum-dark'
    setTheme(newTheme)
    localStorage.setItem('quantum-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const changeAccentColor = (color) => {
    setAccentColor(color)
    localStorage.setItem('quantum-accent', color)
    document.documentElement.style.setProperty('--primary', color)
  }

  const value = {
    theme,
    accentColor,
    toggleTheme,
    changeAccentColor,
    themes: ['quantum-dark', 'quantum-light', 'quantum-neon', 'quantum-midnight']
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
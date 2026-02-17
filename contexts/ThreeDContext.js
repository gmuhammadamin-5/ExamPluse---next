import React, { createContext, useContext, useState, useEffect } from 'react'

const ThreeDContext = createContext()

export const useThreeD = () => {
  const context = useContext(ThreeDContext)
  if (!context) {
    throw new Error('useThreeD must be used within a ThreeDProvider')
  }
  return context
}

export const ThreeDProvider = ({ children }) => {
  const [threeDEnabled, setThreeDEnabled] = useState(true)
  const [particleQuality, setParticleQuality] = useState('high')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [performanceMode, setPerformanceMode] = useState('balanced')

  useEffect(() => {
    const saved3D = localStorage.getItem('quantum-3d-enabled')
    const savedQuality = localStorage.getItem('quantum-particle-quality')
    const savedAnimations = localStorage.getItem('quantum-animations-enabled')
    const savedPerformance = localStorage.getItem('quantum-performance-mode')

    if (saved3D !== null) setThreeDEnabled(JSON.parse(saved3D))
    if (savedQuality) setParticleQuality(savedQuality)
    if (savedAnimations !== null) setAnimationsEnabled(JSON.parse(savedAnimations))
    if (savedPerformance) setPerformanceMode(savedPerformance)

    // Check device capabilities
    const checkDeviceCapabilities = () => {
      const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                           (navigator.deviceMemory || 4) < 4
      
      if (isLowEndDevice) {
        setPerformanceMode('performance')
        setParticleQuality('medium')
      }
    }

    checkDeviceCapabilities()
  }, [])

  const toggle3D = () => {
    const newValue = !threeDEnabled
    setThreeDEnabled(newValue)
    localStorage.setItem('quantum-3d-enabled', JSON.stringify(newValue))
  }

  const setQuality = (quality) => {
    setParticleQuality(quality)
    localStorage.setItem('quantum-particle-quality', quality)
  }

  const toggleAnimations = () => {
    const newValue = !animationsEnabled
    setAnimationsEnabled(newValue)
    localStorage.setItem('quantum-animations-enabled', JSON.stringify(newValue))
  }

  const setPerformance = (mode) => {
    setPerformanceMode(mode)
    localStorage.setItem('quantum-performance-mode', mode)
  }

  const value = {
    threeDEnabled,
    particleQuality,
    animationsEnabled,
    performanceMode,
    toggle3D,
    setQuality,
    toggleAnimations,
    setPerformance
  }

  return (
    <ThreeDContext.Provider value={value}>
      {children}
    </ThreeDContext.Provider>
  )
}
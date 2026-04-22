import React, { useState, useEffect } from 'react'

const TestTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(0)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressColor = () => {
    const percentage = (timeLeft / duration) * 100
    if (percentage > 50) return 'var(--accent-success)'
    if (percentage > 25) return 'var(--accent-warning)'
    return 'var(--accent-error)'
  }

  return (
    <div className="test-timer">
      <div className="timer-display">
        <i className="fas fa-clock"></i>
        <span className="time">{formatTime(timeLeft)}</span>
      </div>
      <div className="timer-progress">
        <div 
          className="timer-progress-fill"
          style={{
            width: `${(timeLeft / duration) * 100}%`,
            backgroundColor: getProgressColor()
          }}
        ></div>
      </div>
    </div>
  )
}

export default TestTimer
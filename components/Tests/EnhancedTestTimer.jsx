import React, { useState, useEffect, useRef } from 'react'

const EnhancedTestTimer = ({ duration, onTimeUp, onTick }) => {
    const [timeLeft, setTimeLeft] = useState(duration)
    const timerRef = useRef(null)
    const [isWarning, setIsWarning] = useState(false)

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 60) setIsWarning(true)
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        onTimeUp()
                        return 0
                    }
                    if (onTick) onTick(prev - 1)
                    return prev - 1
                })
            }, 1000)
        }

        return () => clearInterval(timerRef.current)
    }, [timeLeft, onTimeUp, onTick])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div style={{
            ...styles.timer,
            ...(isWarning && styles.warningTimer)
        }}>
            <div style={styles.timeDisplay}>
                ⏱️ {formatTime(timeLeft)}
            </div>
            <div style={styles.progressBar}>
                <div style={{
                    width: `${(timeLeft / duration) * 100}%`,
                    ...styles.progressFill
                }} />
            </div>
            {timeLeft <= 300 && (
                <div style={styles.warningMessage}>
                    ⚠️ Only {Math.floor(timeLeft / 60)} minutes remaining!
                </div>
            )}
        </div>
    )
}

const styles = {
    timer: {
        padding: '15px',
        background: '#1e293b',
        borderRadius: '10px',
        color: 'white'
    },
    warningTimer: {
        background: '#7f1d1d',
        animation: 'pulse 2s infinite'
    }
}

export default EnhancedTestTimer
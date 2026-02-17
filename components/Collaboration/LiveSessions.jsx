import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const LiveSessions = () => {
  const { user } = useAuth()
  const [activeSessions, setActiveSessions] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    // Mock data for sessions
    const mockActiveSessions = [
      {
        id: 1,
        title: 'Writing Task 2 Masterclass',
        instructor: 'Prof. Sarah Johnson',
        time: '18:00',
        duration: '90 daqiqa',
        participants: 24,
        level: 'Advanced',
        category: 'writing',
        isLive: true,
        roomId: 'writing-master-001'
      },
      {
        id: 2,
        title: 'Speaking Fluency Practice',
        instructor: 'Mike Chen',
        time: '19:00',
        duration: '60 daqiqa',
        participants: 18,
        level: 'Intermediate',
        category: 'speaking',
        isLive: true,
        roomId: 'speaking-fluency-002'
      }
    ]

    const mockUpcomingSessions = [
      {
        id: 3,
        title: 'Reading Strategies Workshop',
        instructor: 'Emma Wilson',
        time: '17:00',
        duration: '75 daqiqa',
        participants: 15,
        level: 'All Levels',
        category: 'reading',
        isLive: false,
        scheduled: '2024-01-25T17:00:00'
      },
      {
        id: 4,
        title: 'Listening Skills Intensive',
        instructor: 'David Kim',
        time: '16:00',
        duration: '60 daqiqa',
        participants: 12,
        level: 'Intermediate',
        category: 'listening',
        isLive: false,
        scheduled: '2024-01-25T16:00:00'
      },
      {
        id: 5,
        title: 'Grammar for IELTS',
        instructor: 'Dr. James Wilson',
        time: '15:00',
        duration: '45 daqiqa',
        participants: 20,
        level: 'Beginner',
        category: 'grammar',
        isLive: false,
        scheduled: '2024-01-26T15:00:00'
      }
    ]

    setActiveSessions(mockActiveSessions)
    setUpcomingSessions(mockUpcomingSessions)
  }, [])

  const joinSession = async (session) => {
    setIsJoining(true)
    // Simulate joining process
    setTimeout(() => {
      setSelectedSession(session)
      setIsJoining(false)
      // In real app, this would redirect to the live session room
      console.log(`Joining session: ${session.roomId}`)
    }, 2000)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      writing: '✍️',
      speaking: '🎤',
      reading: '📖',
      listening: '🎧',
      grammar: '🔤',
      vocabulary: '📚'
    }
    return icons[category] || '🎯'
  }

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': '#10B981',
      'Intermediate': '#F59E0B',
      'Advanced': '#EF4444',
      'All Levels': '#6366F1'
    }
    return colors[level] || '#6B7280'
  }

  const formatTimeUntil = (scheduledTime) => {
    const now = new Date()
    const scheduled = new Date(scheduledTime)
    const diff = scheduled - now
    
    if (diff <= 0) return 'Hozir'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours} soat ${minutes} daqiqa`
    return `${minutes} daqiqa`
  }

  return (
    <div className="live-sessions">
      <div className="container">
        <div className="page-header">
          <h1>🔴 Jonli Sessiyalar</h1>
          <p>IELTS ekspertlari bilan jonli darslarda qatnashing va savollaringizga javob oling</p>
        </div>

        <div className="sessions-content">
          {/* Active Live Sessions */}
          <div className="active-sessions-section">
            <div className="section-header">
              <h2>🎯 Hozir Davom Etayotgan Sessiyalar</h2>
              <div className="live-indicator">
                <div className="pulse"></div>
                <span>LIVE</span>
              </div>
            </div>

            {activeSessions.length > 0 ? (
              <div className="sessions-grid live">
                {activeSessions.map(session => (
                  <div key={session.id} className="session-card live">
                    <div className="session-badge live">🔴 LIVE</div>
                    
                    <div className="session-header">
                      <div className="session-category">
                        <span className="category-icon">
                          {getCategoryIcon(session.category)}
                        </span>
                        <span className="category-name">{session.category}</span>
                      </div>
                      <div 
                        className="session-level"
                        style={{ backgroundColor: getLevelColor(session.level) }}
                      >
                        {session.level}
                      </div>
                    </div>

                    <h3 className="session-title">{session.title}</h3>
                    <p className="session-instructor">👤 {session.instructor}</p>

                    <div className="session-details">
                      <div className="detail-item">
                        <span>⏰</span>
                        <span>{session.time} ({session.duration})</span>
                      </div>
                      <div className="detail-item">
                        <span>👥</span>
                        <span>{session.participants} ishtirokchi</span>
                      </div>
                    </div>

                    <div className="session-actions">
                      <button 
                        className="join-btn primary"
                        onClick={() => joinSession(session)}
                        disabled={isJoining}
                      >
                        {isJoining ? 'Qoʻshilmoqda...' : '🔴 Sessiyaga Qoʻshilish'}
                      </button>
                      <button className="info-btn">
                        ℹ️ Batafsil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-sessions">
                <div className="no-sessions-icon">📺</div>
                <h3>Hozir hech qanday jonli sessiya yoʻq</h3>
                <p>Keyingi rejalashtirilgan sessiyalarni tekshiring</p>
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="upcoming-sessions-section">
            <div className="section-header">
              <h2>📅 Rejalashtirilgan Sessiyalar</h2>
              <span className="sessions-count">{upcomingSessions.length} ta sessiya</span>
            </div>

            <div className="sessions-grid upcoming">
              {upcomingSessions.map(session => (
                <div key={session.id} className="session-card upcoming">
                  <div className="session-header">
                    <div className="session-category">
                      <span className="category-icon">
                        {getCategoryIcon(session.category)}
                      </span>
                      <span className="category-name">{session.category}</span>
                    </div>
                    <div 
                      className="session-level"
                      style={{ backgroundColor: getLevelColor(session.level) }}
                    >
                      {session.level}
                    </div>
                  </div>

                  <h3 className="session-title">{session.title}</h3>
                  <p className="session-instructor">👤 {session.instructor}</p>

                  <div className="session-details">
                    <div className="detail-item">
                      <span>📅</span>
                      <span>{new Date(session.scheduled).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span>⏰</span>
                      <span>{session.time} ({session.duration})</span>
                    </div>
                    <div className="detail-item">
                      <span>👥</span>
                      <span>{session.participants} ro'yxatdan o'tgan</span>
                    </div>
                  </div>

                  <div className="time-until">
                    <span className="time-text">
                      {formatTimeUntil(session.scheduled)}
                    </span>
                  </div>

                  <div className="session-actions">
                    <button className="remind-btn">
                      🔔 Eslatma Qo'shish
                    </button>
                    <button className="info-btn">
                      ℹ️ Batafsil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Categories */}
          <div className="categories-section">
            <h3>🎯 Sessiya Turlari</h3>
            <div className="categories-grid">
              <div className="category-card">
                <div className="category-icon">✍️</div>
                <div className="category-info">
                  <h4>Writing</h4>
                  <p>Essay structure va task response</p>
                  <span className="session-count">3 ta sessiya</span>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">🎤</div>
                <div className="category-info">
                  <h4>Speaking</h4>
                  <p>Fluency va pronunciation</p>
                  <span className="session-count">2 ta sessiya</span>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">📖</div>
                <div className="category-info">
                  <h4>Reading</h4>
                  <p>Speed reading strategies</p>
                  <span className="session-count">2 ta sessiya</span>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">🎧</div>
                <div className="category-info">
                  <h4>Listening</h4>
                  <p>Audio comprehension</p>
                  <span className="session-count">1 ta sessiya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Host Session Section */}
          <div className="host-section">
            <div className="host-card">
              <div className="host-content">
                <div className="host-icon">🎙️</div>
                <div className="host-info">
                  <h3>O'zingizning Sessiyangizni O'tkazing</h3>
                  <p>IELTS o'quvchilari bilan bilimlaringizni ulashing</p>
                </div>
                <button className="host-btn">
                  + Sessiya Yaratish
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedSession && (
          <div className="session-modal">
            <div className="modal-overlay" onClick={() => setSelectedSession(null)}></div>
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedSession.title}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedSession(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="session-info">
                  <p><strong>Instructor:</strong> {selectedSession.instructor}</p>
                  <p><strong>Duration:</strong> {selectedSession.duration}</p>
                  <p><strong>Level:</strong> {selectedSession.level}</p>
                  <p><strong>Participants:</strong> {selectedSession.participants}</p>
                </div>
                <div className="session-description">
                  <h4>Sessiya Tavsifi</h4>
                  <p>This session will cover essential techniques for {selectedSession.category} in IELTS exam. Perfect for {selectedSession.level.toLowerCase()} level students.</p>
                </div>
                <div className="modal-actions">
                  <button className="join-now-btn">
                    🔴 Hozir Qo'shilish
                  </button>
                  <button className="cancel-btn">
                    Bekor Qilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveSessions
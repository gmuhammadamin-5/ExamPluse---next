import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const LiveSessions = () => {
  const { user } = useAuth()
  const [activeSessions, setActiveSessions] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    // Simulate fetching live sessions data
    const mockActiveSessions = [
      {
        id: 1,
        title: 'Writing Task 2 Masterclass',
        instructor: 'Prof. Sarah Johnson',
        time: '18:00',
        duration: '90 min',
        participants: 24,
        level: 'Advanced',
        topic: 'Academic Essay Structure',
        isLive: true,
        roomId: 'writing-master-001'
      },
      {
        id: 2,
        title: 'Speaking Practice Session',
        instructor: 'Mike Chen',
        time: '19:00',
        duration: '60 min',
        participants: 18,
        level: 'Intermediate',
        topic: 'Fluency & Coherence',
        isLive: true,
        roomId: 'speaking-club-002'
      }
    ]

    const mockUpcomingSessions = [
      {
        id: 3,
        title: 'Reading Strategies Workshop',
        instructor: 'Emma Wilson',
        time: '17:00',
        duration: '75 min',
        participants: 15,
        level: 'All Levels',
        topic: 'Time Management',
        isLive: false,
        scheduled: '2024-01-25T17:00:00',
        roomId: 'reading-workshop-003'
      },
      {
        id: 4,
        title: 'Listening Skills Intensive',
        instructor: 'David Kim',
        time: '16:00',
        duration: '60 min',
        participants: 12,
        level: 'Intermediate',
        topic: 'Section 4 Practice',
        isLive: false,
        scheduled: '2024-01-26T16:00:00',
        roomId: 'listening-intensive-004'
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

  const formatTimeUntil = (scheduledTime) => {
    const now = new Date()
    const scheduled = new Date(scheduledTime)
    const diff = scheduled - now
    
    if (diff <= 0) return 'Starting soon'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`
    return `Starts in ${minutes}m`
  }

  const getSessionStatus = (session) => {
    if (session.isLive) {
      return { status: 'live', text: '🔴 LIVE', color: '#EF4444' }
    }
    
    const scheduled = new Date(session.scheduled)
    const now = new Date()
    const diff = scheduled - now
    
    if (diff < 30 * 60 * 1000) { // 30 minutes
      return { status: 'starting', text: '🟡 Starting Soon', color: '#F59E0B' }
    }
    
    return { status: 'scheduled', text: '⏰ Scheduled', color: '#3B82F6' }
  }

  return (
    <div className="live-sessions">
      <div className="container">
        <div className="page-header">
          <h1>🔴 Jonli Sessiyalar</h1>
          <p>Ekspertlar bilan jonli darslar va masterclasslarda qatnashing</p>
        </div>

        <div className="sessions-overview">
          <div className="overview-stats">
            <div className="stat-card primary">
              <div className="stat-icon">🔴</div>
              <div className="stat-content">
                <div className="stat-value">{activeSessions.length}</div>
                <div className="stat-label">Aktiv Sessiyalar</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">
                  {activeSessions.reduce((sum, session) => sum + session.participants, 0)}
                </div>
                <div className="stat-label">Faol Ishtirokchilar</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <div className="stat-value">{upcomingSessions.length}</div>
                <div className="stat-label">Kutilayotgan</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">4</div>
                <div className="stat-label">Ekspertlar</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sessions-tabs">
          <div className="tab-content">
            <div className="active-sessions">
              <h2>🔴 Hozir Davom Etayotgan Sessiyalar</h2>
              {activeSessions.length > 0 ? (
                <div className="sessions-grid">
                  {activeSessions.map(session => {
                    const status = getSessionStatus(session)
                    return (
                      <div key={session.id} className="session-card live">
                        <div className="session-header">
                          <div 
                            className="status-badge"
                            style={{ backgroundColor: status.color }}
                          >
                            {status.text}
                          </div>
                          <div className="participants-count">
                            👥 {session.participants}
                          </div>
                        </div>

                        <div className="session-content">
                          <h3>{session.title}</h3>
                          <div className="session-meta">
                            <div className="meta-item">
                              <span className="label">👤 Instructor:</span>
                              <span className="value">{session.instructor}</span>
                            </div>
                            <div className="meta-item">
                              <span className="label">⏰ Duration:</span>
                              <span className="value">{session.duration}</span>
                            </div>
                            <div className="meta-item">
                              <span className="label">🎯 Level:</span>
                              <span className="value">{session.level}</span>
                            </div>
                            <div className="meta-item">
                              <span className="label">📚 Topic:</span>
                              <span className="value">{session.topic}</span>
                            </div>
                          </div>
                        </div>

                        <div className="session-actions">
                          <button 
                            className="join-btn primary"
                            onClick={() => joinSession(session)}
                            disabled={isJoining}
                          >
                            {isJoining ? 'Joining...' : '🚀 Sessiyaga Qo\'shilish'}
                          </button>
                          <button className="info-btn">
                            ℹ️ Batafsil
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔴</div>
                  <h3>Hozircha aktiv sessiyalar yo'q</h3>
                  <p>Keyingi sessiyalarni tekshiring yoki o'z sessiyangizni yarating</p>
                </div>
              )}
            </div>

            <div className="upcoming-sessions">
              <h2>⏰ Kutilayotgan Sessiyalar</h2>
              {upcomingSessions.length > 0 ? (
                <div className="sessions-grid">
                  {upcomingSessions.map(session => {
                    const status = getSessionStatus(session)
                    return (
                      <div key={session.id} className="session-card upcoming">
                        <div className="session-header">
                          <div 
                            className="status-badge"
                            style={{ backgroundColor: status.color }}
                          >
                            {status.text}
                          </div>
                          <div className="time-until">
                            {formatTimeUntil(session.scheduled)}
                          </div>
                        </div>

                        <div className="session-content">
                          <h3>{session.title}</h3>
                          <div className="session-meta">
                            <div className="meta-item">
                              <span className="label">👤 Instructor:</span>
                              <span className="value">{session.instructor}</span>
                            </div>
                            <div className="meta-item">
                              <span className="label">⏰ Time:</span>
                              <span className="value">{session.time} ({session.duration})</span>
                            </div>
                            <div className="meta-item">
                              <span className="label">🎯 Level:</span>
                              <span className="value">{session.level}</span>
                            </div>
                            <div className="meta-item">
                              <span className="label">📚 Topic:</span>
                              <span className="value">{session.topic}</span>
                            </div>
                          </div>
                        </div>

                        <div className="session-actions">
                          <button className="remind-btn">
                            🔔 Eslatma Qo'shish
                          </button>
                          <button className="calendar-btn">
                            📅 Kalendarga Qo'shish
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">⏰</div>
                  <h3>Kutilayotgan sessiyalar yo'q</h3>
                  <p>Yangi sessiyalar tez orada e'lon qilinadi</p>
                </div>
              )}
            </div>
          </div>

          <div className="sessions-sidebar">
            <div className="sidebar-card">
              <h3>🎯 Sessiya Turlari</h3>
              <div className="session-types">
                <div className="type-item">
                  <span className="type-icon">✍️</span>
                  <div className="type-info">
                    <h4>Writing Workshops</h4>
                    <p>Essay structure va feedback</p>
                  </div>
                </div>
                <div className="type-item">
                  <span className="type-icon">🎤</span>
                  <div className="type-info">
                    <h4>Speaking Practice</h4>
                    <p>Real-time speaking exercises</p>
                  </div>
                </div>
                <div className="type-item">
                  <span className="type-icon">📖</span>
                  <div className="type-info">
                    <h4>Reading Masterclass</h4>
                    <p>Advanced reading strategies</p>
                  </div>
                </div>
                <div className="type-item">
                  <span className="type-icon">👂</span>
                  <div className="type-info">
                    <h4>Listening Intensive</h4>
                    <p>Audio comprehension practice</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>📊 Sessiya Statistikasi</h3>
              <div className="session-stats">
                <div className="stat-item">
                  <span className="stat-label">O'rtacha Ishtirokchilar</span>
                  <span className="stat-value">18</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">O'rtacha Reyting</span>
                  <span className="stat-value">4.8/5.0</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Haftalik Sessiyalar</span>
                  <span className="stat-value">12</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Muvaffaqiyat Darajasi</span>
                  <span className="stat-value">94%</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>🚀 O'z Sessiyangizni Yaratish</h3>
              <p>O'zingizning IELTS sessiyangizni o'tkazing va boshqa o'quvchilarga yordam bering</p>
              <button className="create-session-btn">
                + Yangi Sessiya Yaratish
              </button>
            </div>
          </div>
        </div>

        {selectedSession && (
          <div className="session-modal">
            <div className="modal-overlay" onClick={() => setSelectedSession(null)}></div>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Joining: {selectedSession.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedSession(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="joining-animation">
                  <div className="spinner"></div>
                  <p>Sessionga qo'shilmoqda...</p>
                </div>
                <div className="session-details">
                  <p><strong>Instructor:</strong> {selectedSession.instructor}</p>
                  <p><strong>Topic:</strong> {selectedSession.topic}</p>
                  <p><strong>Participants:</strong> {selectedSession.participants}</p>
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
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const QuickDrills = () => {
  const { user } = useAuth()
  const [activeDrill, setActiveDrill] = useState(null)
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [score, setScore] = useState(0)
  const [completedDrills, setCompletedDrills] = useState([])

  const quickDrills = [
    {
      id: 1,
      type: 'vocabulary',
      title: '5-min Vocabulary Sprint',
      description: '5 daqiqada iloji boricha ko\'p so\'z yodlang',
      duration: 300, // 5 minutes in seconds
      points: 25,
      icon: '📚',
      instructions: 'Berilgan so\'zlarni tezda o\'rganing va testga javob bering',
      words: ['ubiquitous', 'mitigate', 'consequently', 'nevertheless', 'furthermore']
    },
    {
      id: 2,
      type: 'grammar',
      title: 'Grammar Speed Test',
      description: '3 daqiqada grammatik savollarga javob bering',
      duration: 180,
      points: 20,
      icon: '🔤',
      instructions: 'Grammatik jihatdan to\'g\'ri javobni tanlang',
      questions: [
        {
          question: "She ________ to the gym every day.",
          options: ["go", "goes", "going", "went"],
          correct: 1
        },
        {
          question: "If I ________ you, I would study more.",
          options: ["am", "was", "were", "be"],
          correct: 2
        }
      ]
    },
    {
      id: 3,
      type: 'listening',
      title: 'Quick Listening',
      description: '2 daqiqada audio tinglab savollarga javob bering',
      duration: 120,
      points: 30,
      icon: '🎧',
      instructions: 'Qisqa audio tinglang va savollarga javob bering'
    },
    {
      id: 4,
      type: 'reading',
      title: 'Speed Reading',
      description: '4 daqiqada matn o\'qib savollarga javob bering',
      duration: 240,
      points: 35,
      icon: '📖',
      instructions: 'Matnni tez o\'qib, asosiy fikrlarni aniqlang'
    }
  ]

  useEffect(() => {
    let interval = null
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1)
      }, 1000)
    } else if (timer === 0 && isActive) {
      setIsActive(false)
      completeDrill()
    }
    return () => clearInterval(interval)
  }, [isActive, timer])

  const startDrill = (drill) => {
    setActiveDrill(drill)
    setTimer(drill.duration)
    setIsActive(true)
  }

  const completeDrill = () => {
    if (activeDrill && !completedDrills.includes(activeDrill.id)) {
      setScore(prev => prev + activeDrill.points)
      setCompletedDrills(prev => [...prev, activeDrill.id])
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getDrillProgress = () => {
    if (!activeDrill) return 0
    return ((activeDrill.duration - timer) / activeDrill.duration) * 100
  }

  return (
    <div className="quick-drills">
      <div className="container">
        <div className="page-header">
          <h1>⚡ Tezkor Mashqlar</h1>
          <p>Qisqa vaqtda IELTS ko'nikmalaringizni tekshiring va takomillashtiring</p>
        </div>

        <div className="drills-content">
          <div className="drills-overview">
            <div className="stats-card">
              <div className="stat">
                <div className="stat-value">{score}</div>
                <div className="stat-label">Jami Ball</div>
              </div>
              <div className="stat">
                <div className="stat-value">{completedDrills.length}</div>
                <div className="stat-label">Bajarilgan</div>
              </div>
              <div className="stat">
                <div className="stat-value">{quickDrills.length}</div>
                <div className="stat-label">Mavjud</div>
              </div>
            </div>

            <div className="drills-grid">
              {quickDrills.map(drill => (
                <div 
                  key={drill.id}
                  className={`drill-card ${completedDrills.includes(drill.id) ? 'completed' : ''} ${
                    activeDrill?.id === drill.id ? 'active' : ''
                  }`}
                >
                  <div className="drill-header">
                    <div className="drill-icon">{drill.icon}</div>
                    <div className="drill-info">
                      <h3>{drill.title}</h3>
                      <p>{drill.description}</p>
                    </div>
                    <div className="drill-points">
                      +{drill.points}⭐
                    </div>
                  </div>

                  <div className="drill-meta">
                    <span className="duration">⏱️ {Math.floor(drill.duration / 60)} min</span>
                    <span className="type">{drill.type}</span>
                  </div>

                  <div className="drill-actions">
                    {completedDrills.includes(drill.id) ? (
                      <button className="completed-btn" disabled>
                        ✅ Bajarilgan
                      </button>
                    ) : activeDrill?.id === drill.id ? (
                      <button className="active-btn" disabled>
                        🔄 Davom etmoqda
                      </button>
                    ) : (
                      <button 
                        className="start-btn"
                        onClick={() => startDrill(drill)}
                        disabled={activeDrill !== null}
                      >
                        🚀 Boshlash
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeDrill && (
            <div className="active-drill-section">
              <div className="drill-timer">
                <div className="timer-display">
                  <div className="time-remaining">{formatTime(timer)}</div>
                  <div className="timer-progress">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getDrillProgress()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="drill-instructions">
                  <h3>{activeDrill.title}</h3>
                  <p>{activeDrill.instructions}</p>
                </div>

                {activeDrill.type === 'vocabulary' && (
                  <div className="vocabulary-drill">
                    <h4>So'zlar ro'yxati:</h4>
                    <div className="words-grid">
                      {activeDrill.words.map((word, index) => (
                        <div key={index} className="word-item">
                          {word}
                        </div>
                      ))}
                    </div>
                    <div className="drill-actions">
                      <button className="complete-btn" onClick={() => setIsActive(false)}>
                        ✅ Yakunlash
                      </button>
                    </div>
                  </div>
                )}

                {activeDrill.type === 'grammar' && (
                  <div className="grammar-drill">
                    <h4>Grammatik Savollar:</h4>
                    {activeDrill.questions.map((q, index) => (
                      <div key={index} className="question-card">
                        <p>{q.question}</p>
                        <div className="options-grid">
                          {q.options.map((option, optIndex) => (
                            <button key={optIndex} className="option-btn">
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="drill-actions">
                      <button className="complete-btn" onClick={() => setIsActive(false)}>
                        ✅ Testni Yakunlash
                      </button>
                    </div>
                  </div>
                )}

                {['listening', 'reading'].includes(activeDrill.type) && (
                  <div className="content-drill">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">
                        {activeDrill.type === 'listening' ? '🎧' : '📖'}
                      </div>
                      <h4>{activeDrill.type === 'listening' ? 'Audio Tinglash' : 'Matn O\'qish'}</h4>
                      <p>Bu yerda {activeDrill.type === 'listening' ? 'audio content' : 'reading passage'} bo'ladi</p>
                      <div className="simulated-content">
                        {activeDrill.type === 'listening' ? (
                          <div className="audio-player">
                            <button className="play-btn">▶️ Play Audio</button>
                          </div>
                        ) : (
                          <div className="reading-passage">
                            <p>This is a sample reading passage for quick practice...</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="drill-actions">
                      <button className="complete-btn" onClick={() => setIsActive(false)}>
                        ✅ Yakunlash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!activeDrill && completedDrills.length > 0 && (
            <div className="completion-stats">
              <h3>🎉 Mashqlar Natijalari</h3>
              <div className="results-grid">
                <div className="result-card">
                  <div className="result-icon">⭐</div>
                  <div className="result-content">
                    <div className="result-value">{score}</div>
                    <div className="result-label">Jami Ball</div>
                  </div>
                </div>
                <div className="result-card">
                  <div className="result-icon">📊</div>
                  <div className="result-content">
                    <div className="result-value">
                      {Math.round((completedDrills.length / quickDrills.length) * 100)}%
                    </div>
                    <div className="result-label">Progress</div>
                  </div>
                </div>
                <div className="result-card">
                  <div className="result-icon">⚡</div>
                  <div className="result-content">
                    <div className="result-value">
                      {completedDrills.length}
                    </div>
                    <div className="result-label">Bajarilgan</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="daily-challenge">
          <div className="challenge-card">
            <div className="challenge-header">
              <h3>🏆 Kunlik Challenge</h3>
              <span className="challenge-badge">Yangi</span>
            </div>
            <div className="challenge-content">
              <p>3 xil turdagi tezkor mashqni bajarib, maxsus mukofotga ega bo'ling</p>
              <div className="challenge-reward">
                <span className="reward-icon">🎁</span>
                <span className="reward-text">+100 ball va maxsus badge</span>
              </div>
              <button className="challenge-btn">
                Challenge ni Boshlash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickDrills
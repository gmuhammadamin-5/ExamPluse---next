import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const PerformanceStats = () => {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState('month')

  const performanceData = {
    overall: {
      current: 7.2,
      previous: 6.8,
      trend: 'up'
    },
    skills: {
      reading: { score: 7.5, improvement: '+0.8', trend: 'up' },
      writing: { score: 6.5, improvement: '+0.3', trend: 'up' },
      speaking: { score: 6.8, improvement: '+0.5', trend: 'up' },
      listening: { score: 8.0, improvement: '+1.2', trend: 'up' }
    },
    consistency: {
      streak: 12,
      weeklyGoal: 5,
      completed: 4,
      accuracy: 78
    },
    comparisons: {
      average: 6.5,
      topPercentile: 85,
      globalRank: 1247
    }
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#6B7280'
  }

  return (
    <div className="performance-stats">
      <div className="container">
        <div className="page-header">
          <h1>📊 Performance Statistikasi</h1>
          <p>IELTS tayyorgarligingizning batafsil statistikasi va solishtirmalari</p>
        </div>

        <div className="timeframe-selector">
          <button 
            className={timeframe === 'week' ? 'active' : ''}
            onClick={() => setTimeframe('week')}
          >
            1 Hafta
          </button>
          <button 
            className={timeframe === 'month' ? 'active' : ''}
            onClick={() => setTimeframe('month')}
          >
            1 Oy
          </button>
          <button 
            className={timeframe === 'quarter' ? 'active' : ''}
            onClick={() => setTimeframe('quarter')}
          >
            3 Oy
          </button>
          <button 
            className={timeframe === 'year' ? 'active' : ''}
            onClick={() => setTimeframe('year')}
          >
            1 Yil
          </button>
        </div>

        <div className="stats-overview">
          <div className="main-stat-card">
            <div className="stat-content">
              <div className="stat-value">{performanceData.overall.current}</div>
              <div className="stat-label">Umumiy Ball</div>
              <div 
                className="stat-trend"
                style={{ color: getTrendColor(performanceData.overall.trend) }}
              >
                {getTrendIcon(performanceData.overall.trend)} 
                +{(performanceData.overall.current - performanceData.overall.previous).toFixed(1)}
              </div>
            </div>
            <div className="stat-chart">
              <div className="mini-chart">
                {[6.0, 6.4, 6.8, 7.2].map((point, index) => (
                  <div 
                    key={index}
                    className="chart-point"
                    style={{ height: `${(point / 9) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="secondary-stats">
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <div className="stat-value">{performanceData.consistency.streak}</div>
                <div className="stat-label">Ketma-ket Kunlar</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-value">{performanceData.consistency.accuracy}%</div>
                <div className="stat-label">Aniqlik</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <div className="stat-value">#{performanceData.comparisons.globalRank}</div>
                <div className="stat-label">Global Reyting</div>
              </div>
            </div>
          </div>
        </div>

        <div className="skills-breakdown">
          <h3>🎯 Ko'nikmalar Tahlili</h3>
          <div className="skills-grid">
            {Object.entries(performanceData.skills).map(([skill, data]) => (
              <div key={skill} className="skill-stat-card">
                <div className="skill-header">
                  <h4>{skill.charAt(0).toUpperCase() + skill.slice(1)}</h4>
                  <span 
                    className="improvement"
                    style={{ color: getTrendColor(data.trend) }}
                  >
                    {getTrendIcon(data.trend)} {data.improvement}
                  </span>
                </div>
                <div className="skill-score">
                  <span className="score">{data.score}</span>
                  <span className="max-score">/9.0</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(data.score / 9) * 100}%` }}
                  ></div>
                </div>
                <div className="skill-meta">
                  <span>Band {Math.floor(data.score)}</span>
                  <span>{((data.score / 9) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-section">
          <div className="comparison-card">
            <h3>🌍 Global Solishtirma</h3>
            <div className="comparison-content">
              <div className="comparison-item">
                <span className="label">Sizning Ballingiz</span>
                <div className="value-bar">
                  <div 
                    className="value-fill your-score"
                    style={{ width: `${(performanceData.overall.current / 9) * 100}%` }}
                  ></div>
                </div>
                <span className="value">{performanceData.overall.current}</span>
              </div>
              <div className="comparison-item">
                <span className="label">O'rtacha Ball</span>
                <div className="value-bar">
                  <div 
                    className="value-fill average-score"
                    style={{ width: `${(performanceData.comparisons.average / 9) * 100}%` }}
                  ></div>
                </div>
                <span className="value">{performanceData.comparisons.average}</span>
              </div>
              <div className="comparison-item">
                <span className="label">Eng Yuqori Ball</span>
                <div className="value-bar">
                  <div className="value-fill top-score" style={{ width: '100%' }}></div>
                </div>
                <span className="value">9.0</span>
              </div>
            </div>
            <div className="percentile-info">
              <span>📊 Siz {performanceData.comparisons.topPercentile}% dan yuqorisiz</span>
            </div>
          </div>

          <div className="consistency-card">
            <h3>📅 Muntazamlik</h3>
            <div className="consistency-content">
              <div className="streak-info">
                <div className="streak-count">
                  <span className="number">{performanceData.consistency.streak}</span>
                  <span className="label">kun</span>
                </div>
                <div className="streak-fire">🔥</div>
              </div>
              <div className="weekly-progress">
                <h4>Haftalik Maqsad</h4>
                <div className="progress-info">
                  <span>{performanceData.consistency.completed}/{performanceData.consistency.weeklyGoal} sessiya</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(performanceData.consistency.completed / performanceData.consistency.weeklyGoal) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="recommendations-section">
          <h3>🤖 AI Takliflari</h3>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <div className="rec-icon">🎯</div>
              <div className="rec-content">
                <h4>Writing Ko'nikmasini Oshirish</h4>
                <p>Complex sentence structures va academic vocabulary ustida ishlashingiz kerak</p>
                <div className="rec-stats">
                  <span>⏰ 2 hafta</span>
                  <span>📊 65% progress</span>
                </div>
                <button className="action-btn">Boshlash</button>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">⏱️</div>
              <div className="rec-content">
                <h4>Vaqt Boshqaruvi</h4>
                <p>Reading testda tezroq o'qish uchun maxsus mashqlar</p>
                <div className="rec-stats">
                  <span>⏰ 1 hafta</span>
                  <span>📊 40% progress</span>
                </div>
                <button className="action-btn">Boshlash</button>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">🔊</div>
              <div className="rec-content">
                <h4>Talaffuzni Takomillashtirish</h4>
                <p>Word stress patterns va intonation ustida ishlash</p>
                <div className="rec-stats">
                  <span>⏰ 3 hafta</span>
                  <span>📊 25% progress</span>
                </div>
                <button className="action-btn">Boshlash</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceStats
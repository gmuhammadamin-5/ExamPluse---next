import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const WeaknessAnalysis = () => {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('month')

  const weaknessData = {
    overall: {
      score: 6.8,
      improvement: '+0.4',
      trend: 'up'
    },
    weaknesses: [
      {
        skill: 'Writing',
        area: 'Task Response',
        severity: 'high',
        score: 5.5,
        improvement: '+0.3',
        description: 'Savolga to\'liq javob berishda qiyinchiliklar',
        recommendations: [
          'Essay structure ni yaxshilash',
          'Topic sentence larni aniqroq yozish',
          'Examples va explanations ni ko\'paytirish'
        ]
      },
      {
        skill: 'Speaking',
        area: 'Fluency',
        severity: 'medium',
        score: 6.0,
        improvement: '+0.5',
        description: 'Gapirishda vaqtincha to\'xtab qolishlar',
        recommendations: [
          'Diskurs markerlarini o\'rganish',
          'Mind map yaratish mashqlari',
          'Record qilib gapirish va tinglash'
        ]
      },
      {
        skill: 'Reading',
        area: 'Time Management',
        severity: 'medium',
        score: 6.2,
        improvement: '+0.2',
        description: 'Vaqtni samarali taqsimlay olmaslik',
        recommendations: [
          'Skimming va scanning techniques',
          'Passage bo\'yicha vaqt chegarasi',
          'Practice tests with timer'
        ]
      },
      {
        skill: 'Grammar',
        area: 'Complex Sentences',
        severity: 'low',
        score: 6.8,
        improvement: '+0.6',
        description: 'Murakkab gap tuzilmalarini kam ishlatish',
        recommendations: [
          'Relative clauses mashqlari',
          'Conditional sentences practice',
          'Sentence combining exercises'
        ]
      }
    ],
    progress: {
      writing: 45,
      speaking: 60,
      reading: 55,
      grammar: 75
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    }
    return colors[severity]
  }

  const getSeverityIcon = (severity) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    }
    return icons[severity]
  }

  return (
    <div className="weakness-analysis">
      <div className="container">
        <div className="page-header">
          <h1>🎯 Zaif Tomonlar Tahlili</h1>
          <p>IELTS tayyorgarligingizdagi zaif tomonlarni aniqlang va ular ustida ishlang</p>
        </div>

        <div className="analysis-overview">
          <div className="overview-card">
            <div className="overview-content">
              <h3>Umumiy Tahlil</h3>
              <div className="overview-stats">
                <div className="main-stat">
                  <div className="stat-value">{weaknessData.overall.score}</div>
                  <div className="stat-label">Zaiflik Indeksi</div>
                  <div className="stat-trend positive">
                    📈 {weaknessData.overall.improvement}
                  </div>
                </div>
                <div className="stat-breakdown">
                  <div className="breakdown-item">
                    <span className="label">Yuqori</span>
                    <span className="value">1</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="label">O'rta</span>
                    <span className="value">2</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="label">Past</span>
                    <span className="value">1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="improvement-chart">
              <div className="chart-title">Progress</div>
              <div className="mini-chart">
                {[5.5, 6.0, 6.4, 6.8].map((point, index) => (
                  <div 
                    key={index}
                    className="chart-bar"
                    style={{ height: `${(point / 9) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="weaknesses-grid">
          <h3>Zaif Tomonlar Ro'yxati</h3>
          <div className="weakness-cards">
            {weaknessData.weaknesses.map((weakness, index) => (
              <div key={index} className="weakness-card">
                <div className="weakness-header">
                  <div className="weakness-info">
                    <h4>{weakness.skill} - {weakness.area}</h4>
                    <div 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(weakness.severity) }}
                    >
                      {getSeverityIcon(weakness.severity)} {weakness.severity.toUpperCase()}
                    </div>
                  </div>
                  <div className="weakness-score">
                    <span className="score">{weakness.score}</span>
                    <span className="max-score">/9.0</span>
                    <div className="improvement">
                      📈 {weakness.improvement}
                    </div>
                  </div>
                </div>

                <div className="weakness-description">
                  <p>{weakness.description}</p>
                </div>

                <div className="progress-section">
                  <div className="progress-info">
                    <span>Takomillashtirish</span>
                    <span>{weaknessData.progress[weakness.skill.toLowerCase()]}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${weaknessData.progress[weakness.skill.toLowerCase()]}%` }}
                    ></div>
                  </div>
                </div>

                <div className="recommendations">
                  <h5>🤖 AI Takliflari:</h5>
                  <ul>
                    {weakness.recommendations.map((rec, recIndex) => (
                      <li key={recIndex}>💡 {rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="action-buttons">
                  <button className="practice-btn">📝 Mashq Qilish</button>
                  <button className="resources-btn">📚 Resurslar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="improvement-plan">
          <h3>📋 Takomillashtirish Rejasi</h3>
          <div className="plan-cards">
            <div className="plan-card urgent">
              <div className="plan-header">
                <h4>🔴 Zudlik bilan</h4>
                <span className="timeframe">1 hafta</span>
              </div>
              <ul>
                <li>Writing Task Response ni yaxshilash</li>
                <li>Essay structure qayta ko'rib chiqish</li>
                <li>Kuniga 2 ta writing practice</li>
              </ul>
            </div>

            <div className="plan-card important">
              <div className="plan-header">
                <h4>🟡 Muhim</h4>
                <span className="timeframe">2 hafta</span>
              </div>
              <ul>
                <li>Speaking fluency ni oshirish</li>
                <li>Diskurs markerlarini o'rgatish</li>
                <li>Kuniga 15 daqiqa speaking practice</li>
              </ul>
            </div>

            <div className="plan-card normal">
              <div className="plan-header">
                <h4>🟢 Oddiy</h4>
                <span className="timeframe">1 oy</span>
              </div>
              <ul>
                <li>Reading time management</li>
                <li>Complex sentences practice</li>
                <li>Haftada 3 ta grammar mashq</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="progress-tracking">
          <h3>📈 Progress Kuzatish</h3>
          <div className="progress-metrics">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-value">65%</div>
                <div className="metric-label">Umumiy Progress</div>
                <div className="metric-trend positive">+12%</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <div className="metric-value">3/4</div>
                <div className="metric-label">Zaifliklar Yaxshilandi</div>
                <div className="metric-trend positive">+1</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⏱️</div>
              <div className="metric-content">
                <div className="metric-value">18</div>
                <div className="metric-label">Mashq Sessiyalari</div>
                <div className="metric-trend positive">+5</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-content">
                <div className="metric-value">+0.8</div>
                <div className="metric-label">O'rtacha O'sish</div>
                <div className="metric-trend positive">+0.2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeaknessAnalysis
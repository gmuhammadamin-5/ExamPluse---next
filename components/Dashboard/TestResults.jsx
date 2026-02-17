// components/Dashboard/TestResults.jsx
import React, { useState, useMemo } from 'react'
import { useTests } from '../../contexts/TestContext'
import { Link } from 'react-router-dom'
import '../../styles/App.css'

const TestResults = () => {
  const { testResults, getTestById, clearTestResults, getUserProgress } = useTests()
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const progress = getUserProgress()

  const filteredAndSortedResults = useMemo(() => {
    let filtered = testResults
    if (filter !== 'all') {
      filtered = testResults.filter(result => result.testType === filter)
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.bandScore - a.bandScore
        case 'duration': return a.duration - b.duration
        case 'date':
        default: return new Date(b.date) - new Date(a.date)
      }
    })
  }, [testResults, filter, sortBy])

  const getBandColor = (band) => {
    if (band >= 8) return '#10B981'
    if (band >= 7) return '#3B82F6'
    if (band >= 6) return '#F59E0B'
    if (band >= 5) return '#EF4444'
    return '#6B7280'
  }

  const getPerformanceLevel = (band) => {
    if (band >= 8) return { level: 'Excellent', emoji: '🎉' }
    if (band >= 7) return { level: 'Great', emoji: '✨' }
    if (band >= 6) return { level: 'Good', emoji: '👍' }
    if (band >= 5) return { level: 'Fair', emoji: '📈' }
    return { level: 'Needs Practice', emoji: '💪' }
  }

  const ResultCard = ({ result }) => {
    const test = getTestById(result.testId)
    const performance = getPerformanceLevel(result.bandScore)
    const bandColor = getBandColor(result.bandScore)

    return (
      <div className="result-card" data-view={viewMode}>
        <div className="result-header">
          <div className="result-type-badge" style={{ backgroundColor: `${bandColor}20`, color: bandColor }}>
            {result.testType.toUpperCase()}
          </div>
          <div className="result-score" style={{ backgroundColor: bandColor }}>
            {result.bandScore}
          </div>
        </div>
        
        <div className="result-content">
          <h3>{test?.title || result.testTitle}</h3>
          <div className="result-meta">
            <span className="date">{new Date(result.date).toLocaleDateString()}</span>
            <span className="duration">{result.duration}min</span>
          </div>
          
          <div className="performance-indicator">
            <span className="performance-emoji">{performance.emoji}</span>
            <span className="performance-text">{performance.level}</span>
          </div>

          <div className="result-stats">
            <div className="stat">
              <label>Score</label>
              <span>{result.correctAnswers}/{result.totalQuestions}</span>
            </div>
            <div className="stat">
              <label>Time</label>
              <span>{Math.round(result.timeSpent / 60)}m</span>
            </div>
            <div className="stat">
              <label>Accuracy</label>
              <span>{((result.correctAnswers / result.totalQuestions) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button className="btn-outline btn-sm">View Details</button>
          <Link to="/tests" className="btn-primary btn-sm">Retake</Link>
        </div>
      </div>
    )
  }

  if (testResults.length === 0) {
    return (
      <div className="modern-results empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>No Test Results Yet</h2>
          <p>Take your first test to start tracking your progress</p>
          <Link to="/tests" className="btn-primary-glow">
            <span>Start Your First Test</span>
            <div className="btn-glow"></div>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="modern-results">
      {/* Header */}
      <div className="results-header">
        <div className="header-content">
          <div>
            <h1>Test Analytics</h1>
            <p>Track your progress and identify improvement areas</p>
          </div>
          <button 
            className="btn-outline danger"
            onClick={() => window.confirm('Clear all results?') && clearTestResults()}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <h3>{testResults.length}</h3>
            <p>Total Tests</p>
          </div>
        </div>
        <div className="summary-card success">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <h3>{(testResults.reduce((sum, r) => sum + r.bandScore, 0) / testResults.length).toFixed(1)}</h3>
            <p>Average Band</p>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">⏱️</div>
          <div className="summary-content">
            <h3>{Math.round(testResults.reduce((sum, r) => sum + r.timeSpent, 0) / 3600)}h</h3>
            <p>Total Study Time</p>
          </div>
        </div>
        <div className="summary-card info">
          <div className="summary-icon">📅</div>
          <div className="summary-content">
            <h3>{new Set(testResults.map(r => r.date.split('T')[0])).size}</h3>
            <p>Active Days</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="results-controls">
        <div className="control-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="modern-select">
            <option value="all">All Tests</option>
            <option value="speaking">Speaking</option>
            <option value="listening">Listening</option>
            <option value="reading">Reading</option>
            <option value="writing">Writing</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="modern-select">
            <option value="date">Most Recent</option>
            <option value="score">Highest Score</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        <div className="view-toggle">
          <button 
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            ▦ Grid
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            ☰ List
          </button>
        </div>
      </div>

      {/* Results Grid/List */}
      <div className={`results-container ${viewMode}`}>
        {filteredAndSortedResults.map(result => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>

      {/* Progress Overview */}
      <section className="progress-overview">
        <h2>Skills Overview</h2>
        <div className="skills-progress">
          {Object.entries(progress).map(([skill, data]) => (
            <div key={skill} className="skill-progress-item">
              <div className="skill-header">
                <span className="skill-name">{skill}</span>
                <span className="skill-band">Band {data.averageBand.toFixed(1)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(data.averageBand / 9) * 100}%`,
                    backgroundColor: getBandColor(data.averageBand)
                  }}
                ></div>
              </div>
              <div className="skill-meta">
                <span>{data.testsTaken} tests</span>
                <span>Best: {data.bestBand}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TestResults
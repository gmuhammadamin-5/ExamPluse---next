import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const GoalTracker = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('active')

  const goals = {
    active: [
      {
        id: 1,
        title: 'Overall Band 7.0',
        target: 7.0,
        current: 6.8,
        progress: 85,
        deadline: '2024-03-15',
        type: 'overall',
        priority: 'high',
        tasks: [
          { id: 1, text: 'Writing practice - 4 essays', completed: true },
          { id: 2, text: 'Speaking practice - 10 sessions', completed: false },
          { id: 3, text: 'Vocabulary - 50 new words', completed: true }
        ]
      },
      {
        id: 2,
        title: 'Writing 7.0',
        target: 7.0,
        current: 6.5,
        progress: 65,
        deadline: '2024-02-28',
        type: 'writing',
        priority: 'high',
        tasks: [
          { id: 1, text: 'Task 2 essays - 8 pieces', completed: true },
          { id: 2, text: 'Grammar exercises', completed: false },
          { id: 3, text: 'Peer reviews', completed: false }
        ]
      },
      {
        id: 3,
        title: 'Complete 30 Practice Tests',
        target: 30,
        current: 18,
        progress: 60,
        deadline: '2024-04-01',
        type: 'tests',
        priority: 'medium',
        tasks: [
          { id: 1, text: 'Weekly full tests', completed: true },
          { id: 2, text: 'Section-wise practice', completed: true }
        ]
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Vocabulary - 200 Words',
        target: 200,
        current: 200,
        progress: 100,
        completedDate: '2024-01-20',
        type: 'vocabulary',
        achievement: '🎉 Maqsadingizga erishdingiz!'
      }
    ]
  }

  const getGoalIcon = (type) => {
    const icons = {
      overall: '🎯',
      writing: '✍️',
      speaking: '🎤',
      reading: '📖',
      listening: '👂',
      vocabulary: '📚',
      tests: '🧪'
    }
    return icons[type] || '🎯'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    }
    return colors[priority]
  }

  const calculateDaysLeft = (deadline) => {
    const today = new Date()
    const targetDate = new Date(deadline)
    const diffTime = targetDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const addNewGoal = () => {
    // New goal functionality would be implemented here
    console.log('Add new goal')
  }

  return (
    <div className="goal-tracker">
      <div className="container">
        <div className="page-header">
          <h1>🎯 Maqsadlar Kuzatuchi</h1>
          <p>IELTS maqsadlaringizni belgilang, kuzating va amalga oshiring</p>
        </div>

        <div className="goals-summary">
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <div className="summary-value">
                {goals.active.length + goals.completed.length}
              </div>
              <div className="summary-label">Jami Maqsadlar</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">✅</div>
            <div className="summary-content">
              <div className="summary-value">{goals.completed.length}</div>
              <div className="summary-label">Bajarilgan</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">⏳</div>
            <div className="summary-content">
              <div className="summary-value">
                {goals.active.filter(g => calculateDaysLeft(g.deadline) < 7).length}
              </div>
              <div className="summary-label">Tez Kunda</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📈</div>
            <div className="summary-content">
              <div className="summary-value">
                {Math.round(goals.active.reduce((acc, goal) => acc + goal.progress, 0) / goals.active.length)}%
              </div>
              <div className="summary-label">O'rtacha Progress</div>
            </div>
          </div>
        </div>

        <div className="goals-tabs">
          <button 
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            🎯 Faol Maqsadlar ({goals.active.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Bajarilgan ({goals.completed.length})
          </button>
          <button className="add-goal-btn" onClick={addNewGoal}>
            + Yangi Maqsad
          </button>
        </div>

        {activeTab === 'active' && (
          <div className="active-goals">
            <div className="goals-grid">
              {goals.active.map(goal => (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <div className="goal-icon">{getGoalIcon(goal.type)}</div>
                    <div className="goal-info">
                      <h3>{goal.title}</h3>
                      <div 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(goal.priority) }}
                      >
                        {goal.priority.toUpperCase()}
                      </div>
                    </div>
                    <div className="goal-deadline">
                      <span className="days-left">
                        {calculateDaysLeft(goal.deadline)} kun qoldi
                      </span>
                      <span className="deadline-date">{goal.deadline}</span>
                    </div>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-info">
                      <span>Progress: {goal.progress}%</span>
                      <span>{goal.current}/{goal.target}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="goal-tasks">
                    <h4>Vazifalar:</h4>
                    <div className="tasks-list">
                      {goal.tasks.map(task => (
                        <div key={task.id} className="task-item">
                          <input 
                            type="checkbox" 
                            checked={task.completed}
                            onChange={() => {}}
                          />
                          <span className={task.completed ? 'completed' : ''}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="goal-actions">
                    <button className="update-btn">Progressni Yangilash</button>
                    <button className="details-btn">Batafsil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="completed-goals">
            <div className="goals-grid">
              {goals.completed.map(goal => (
                <div key={goal.id} className="goal-card completed">
                  <div className="completion-badge">✅ Bajarilgan</div>
                  <div className="goal-header">
                    <div className="goal-icon">{getGoalIcon(goal.type)}</div>
                    <div className="goal-info">
                      <h3>{goal.title}</h3>
                      <span className="completion-date">
                        {goal.completedDate}
                      </span>
                    </div>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-info">
                      <span>Yakunlandi: 100%</span>
                      <span>{goal.current}/{goal.target}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill completed" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="achievement-message">
                    <p>{goal.achievement}</p>
                  </div>

                  <div className="goal-actions">
                    <button className="celebrate-btn">🎉 Nishonlash</button>
                    <button className="new-goal-btn">Yangi Maqsad</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="goal-recommendations">
          <h3>🤖 AI Takliflar</h3>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <div className="rec-icon">📊</div>
              <div className="rec-content">
                <h4>Realistik Maqsadlar</h4>
                <p>Progressingizga asoslangan yangi maqsadlar</p>
                <button className="action-btn">Ko'rish</button>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">⏱️</div>
              <div className="rec-content">
                <h4>Vaqt Jadvali</h4>
                <p>Maqsadlaringiz uchun optimal vaqt jadvali</p>
                <button className="action-btn">Yaratish</button>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">📈</div>
              <div className="rec-content">
                <h4>Progress Bashorati</h4>
                <p>Joriy sur'atda davom etsangiz, 2 oyda Band 7.5</p>
                <button className="action-btn">Batafsil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalTracker
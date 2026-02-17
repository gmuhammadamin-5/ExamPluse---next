import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const GrammarExercises = () => {
  const { user } = useAuth()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState([])

  const exercises = [
    {
      id: 1,
      type: 'tenses',
      question: "She ________ to the gym every day.",
      options: ["go", "goes", "going", "went"],
      correctAnswer: 1,
      explanation: "Present Simple tense is used for habitual actions. Third person singular takes 's'."
    },
    {
      id: 2,
      type: 'conditionals',
      question: "If I ________ you, I would study more.",
      options: ["am", "was", "were", "be"],
      correctAnswer: 2,
      explanation: "Second conditional uses 'were' for all subjects in the if-clause."
    },
    {
      id: 3,
      type: 'prepositions',
      question: "I'm interested ________ learning English.",
      options: ["in", "on", "at", "by"],
      correctAnswer: 0,
      explanation: "'Interested in' is the correct preposition combination."
    },
    {
      id: 4,
      type: 'articles',
      question: "She is ________ best student in the class.",
      options: ["a", "an", "the", "no article"],
      correctAnswer: 2,
      explanation: "'The' is used with superlative adjectives."
    }
  ]

  const checkAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === exercises[currentExercise].correctAnswer
    if (isCorrect) {
      setScore(score + 10)
    }
    setCompleted([...completed, { 
      id: exercises[currentExercise].id, 
      correct: isCorrect 
    }])
    setShowExplanation(true)
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowExplanation(false)
    }
  }

  const getProgress = () => {
    return ((currentExercise + 1) / exercises.length) * 100
  }

  const grammarTopics = [
    { name: 'Tenses', icon: '⏰', progress: 75, exercises: 12 },
    { name: 'Conditionals', icon: '🔄', progress: 60, exercises: 8 },
    { name: 'Prepositions', icon: '📍', progress: 45, exercises: 15 },
    { name: 'Articles', icon: '📰', progress: 80, exercises: 10 },
    { name: 'Modals', icon: '💪', progress: 35, exercises: 6 },
    { name: 'Passive Voice', icon: '🎭', progress: 50, exercises: 9 }
  ]

  return (
    <div className="grammar-exercises">
      <div className="container">
        <div className="page-header">
          <h1>🔤 Grammatika Mashqlari</h1>
          <p>IELTS uchun muhim grammatika qoidalarini mustahkamlang</p>
        </div>

        <div className="grammar-content">
          <div className="exercise-area">
            <div className="exercise-header">
              <div className="progress-info">
                <span>Mashq {currentExercise + 1}/{exercises.length}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getProgress()}%` }}
                  ></div>
                </div>
              </div>
              <div className="score-display">
                <span>⭐ {score} ball</span>
              </div>
            </div>

            <div className="exercise-card">
              <h3 className="exercise-question">
                {exercises[currentExercise].question}
              </h3>

              <div className="exercise-options">
                {exercises[currentExercise].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${
                      showExplanation 
                        ? index === exercises[currentExercise].correctAnswer 
                          ? 'correct' 
                          : 'incorrect'
                        : ''
                    }`}
                    onClick={() => checkAnswer(index)}
                    disabled={showExplanation}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="explanation-section">
                  <div className="explanation-card">
                    <h4>💡 Izoh:</h4>
                    <p>{exercises[currentExercise].explanation}</p>
                    <button 
                      className="next-btn"
                      onClick={nextExercise}
                    >
                      {currentExercise < exercises.length - 1 ? 'Keyingi Mashq' : 'Yakunlash'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grammar-sidebar">
            <div className="topics-overview">
              <h3>📚 Grammatika Mavzulari</h3>
              <div className="topics-list">
                {grammarTopics.map((topic, index) => (
                  <div key={index} className="topic-item">
                    <div className="topic-icon">{topic.icon}</div>
                    <div className="topic-info">
                      <h4>{topic.name}</h4>
                      <span>{topic.exercises} mashq</span>
                    </div>
                    <div className="topic-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${topic.progress}%` }}
                        ></div>
                      </div>
                      <span>{topic.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{completed.length}</div>
                  <div className="stat-label">Bajarilgan</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {completed.filter(c => c.correct).length}/{completed.length || 1}
                  </div>
                  <div className="stat-label">To'g'ri</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-value">{Math.round(getProgress())}%</div>
                  <div className="stat-label">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grammar-tips">
          <h3>💡 Grammatika Maslahatlari</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">⏰</div>
              <h4>Present Perfect</h4>
              <p>O'tmishdagi harakat hozirgi vaqtga ta'sir ko'rsatganda ishlatiladi</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <h4>Conditionals</h4>
              <p>Real va unreal shartlarni ifodalash uchun turli conditional shakllar</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📍</div>
              <h4>Prepositions</h4>
              <p>Har bir preposition combination ni alohida o'rganish kerak</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📰</div>
              <h4>Articles</h4>
              <p>Countable/uncountable nouns va specific/general ma'nolar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GrammarExercises
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const VocabularyBuilder = () => {
  const { user } = useAuth()
  const [currentWord, setCurrentWord] = useState(0)
  const [score, setScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const vocabularyList = [
    {
      word: "ubiquitous",
      meaning: "present everywhere",
      example: "Mobile phones are ubiquitous in modern society.",
      synonyms: ["omnipresent", "universal", "everywhere"],
      level: "Advanced"
    },
    {
      word: "mitigate",
      meaning: "make less severe",
      example: "We need to mitigate the effects of climate change.",
      synonyms: ["alleviate", "reduce", "lessen"],
      level: "Advanced"
    },
    {
      word: "consequently",
      meaning: "as a result",
      example: "He didn't study, and consequently failed the exam.",
      synonyms: ["therefore", "thus", "accordingly"],
      level: "Intermediate"
    }
  ]

  const nextWord = () => {
    setCurrentWord((prev) => (prev + 1) % vocabularyList.length)
    setShowAnswer(false)
  }

  const markAsLearned = () => {
    setScore(score + 10)
    nextWord()
  }

  return (
    <div className="vocabulary-builder">
      <div className="container">
        <div className="page-header">
          <h1>📚 Lug'at O'stirish</h1>
          <p>IELTS uchun muhim akademik so'zlarni o'rganing</p>
        </div>

        <div className="vocabulary-content">
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-value">{score}</span>
              <span className="stat-label">Ball</span>
            </div>
            <div className="stat">
              <span className="stat-value">{currentWord + 1}/{vocabularyList.length}</span>
              <span className="stat-label">So'z</span>
            </div>
            <div className="stat">
              <span className="stat-value">{vocabularyList[currentWord].level}</span>
              <span className="stat-label">Daraja</span>
            </div>
          </div>

          <div className="word-card">
            <div className="word-header">
              <h2>{vocabularyList[currentWord].word}</h2>
              <span className="word-level">{vocabularyList[currentWord].level}</span>
            </div>

            {!showAnswer ? (
              <div className="quiz-section">
                <p>Bu so'zning ma'nosini bilasizmi?</p>
                <button 
                  className="show-answer-btn"
                  onClick={() => setShowAnswer(true)}
                >
                  Javobni Ko'rsatish
                </button>
              </div>
            ) : (
              <div className="answer-section">
                <div className="meaning">
                  <h4>Ma'nosi:</h4>
                  <p>{vocabularyList[currentWord].meaning}</p>
                </div>

                <div className="example">
                  <h4>Misol:</h4>
                  <p>"{vocabularyList[currentWord].example}"</p>
                </div>

                <div className="synonyms">
                  <h4>Sinonimlar:</h4>
                  <div className="synonyms-list">
                    {vocabularyList[currentWord].synonyms.map((synonym, index) => (
                      <span key={index} className="synonym-tag">{synonym}</span>
                    ))}
                  </div>
                </div>

                <div className="word-actions">
                  <button className="learned-btn" onClick={markAsLearned}>
                    ✅ O'rgandim
                  </button>
                  <button className="next-btn" onClick={nextWord}>
                    ➡️ Keyingi So'z
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="practice-modes">
            <h3>Mashq Turi</h3>
            <div className="mode-buttons">
              <button className="mode-btn active">📖 So'z O'rganish</button>
              <button className="mode-btn">🎯 Test</button>
              <button className="mode-btn">📝 Yozish</button>
              <button className="mode-btn">🎧 Eshitish</button>
            </div>
          </div>

          <div className="progress-section">
            <h3>Lug'at Boyligi</h3>
            <div className="progress-bars">
              <div className="progress-item">
                <span>Basic Words</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '85%'}}></div>
                </div>
                <span>85%</span>
              </div>
              <div className="progress-item">
                <span>Academic Words</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '60%'}}></div>
                </div>
                <span>60%</span>
              </div>
              <div className="progress-item">
                <span>Advanced Words</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '35%'}}></div>
                </div>
                <span>35%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VocabularyBuilder
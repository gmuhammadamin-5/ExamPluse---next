import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const PeerReview = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('give')
  const [reviews, setReviews] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    feedback: '',
    strengths: '',
    improvements: ''
  })

  // Mock data for submissions waiting for review
  const mockSubmissions = [
    {
      id: 1,
      user: 'Ali',
      essay: 'Technology has made our lives more complicated than easier. While it offers convenience, it also creates new challenges that we must overcome...',
      task: 'Writing Task 2',
      wordCount: 265,
      submitted: '2024-01-20',
      type: 'writing'
    },
    {
      id: 2,
      user: 'Sarah',
      essay: 'Globalization affects every aspect of our lives, from the food we eat to the clothes we wear. This phenomenon has both positive and negative impacts...',
      task: 'Writing Task 2',
      wordCount: 280,
      submitted: '2024-01-19',
      type: 'writing'
    }
  ]

  // Mock data for received reviews
  const mockReviews = [
    {
      id: 1,
      reviewer: 'Mike',
      submission: 'My essay about technology...',
      rating: 4,
      feedback: 'Good structure and arguments, but could use more specific examples.',
      strengths: 'Clear thesis statement, good paragraph structure',
      improvements: 'Add more concrete examples, improve conclusion',
      date: '2024-01-20'
    },
    {
      id: 2,
      reviewer: 'Emma',
      submission: 'My thoughts on globalization...',
      rating: 5,
      feedback: 'Excellent essay with strong arguments and good vocabulary.',
      strengths: 'Academic vocabulary, coherent arguments, good examples',
      improvements: 'Minor grammar corrections needed',
      date: '2024-01-19'
    }
  ]

  const submitReview = (submissionId) => {
    if (newReview.feedback.trim()) {
      const review = {
        id: Date.now(),
        submissionId,
        reviewer: user?.name,
        rating: newReview.rating,
        feedback: newReview.feedback,
        strengths: newReview.strengths,
        improvements: newReview.improvements,
        date: new Date().toISOString().split('T')[0]
      }

      setReviews(prev => [...prev, review])
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId))
      setNewReview({
        rating: 5,
        feedback: '',
        strengths: '',
        improvements: ''
      })
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10B981'
    if (rating >= 3.5) return '#F59E0B'
    return '#EF4444'
  }

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent'
    if (rating >= 3.5) return 'Good'
    if (rating >= 2.5) return 'Average'
    return 'Needs Improvement'
  }

  return (
    <div className="peer-review">
      <div className="container">
        <div className="page-header">
          <h1>🔄 Peer Review</h1>
          <p>Boshqa o'quvchilar bilan bir-biringizni baholang va birgalikda o'rganing</p>
        </div>

        <div className="review-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">4.2</div>
              <div className="stat-label">O'rtacha Reyting</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <div className="stat-content">
              <div className="stat-value">{mockSubmissions.length}</div>
              <div className="stat-label">Baholash Uchun</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{mockReviews.length}</div>
              <div className="stat-label">Olingan Baholar</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">8</div>
              <div className="stat-label">Baholaganlar</div>
            </div>
          </div>
        </div>

        <div className="review-tabs">
          <button 
            className={`tab-btn ${activeTab === 'give' ? 'active' : ''}`}
            onClick={() => setActiveTab('give')}
          >
            ✍️ Baho Berish
          </button>
          <button 
            className={`tab-btn ${activeTab === 'receive' ? 'active' : ''}`}
            onClick={() => setActiveTab('receive')}
          >
            📥 Olingan Baholar
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            📋 Mening Essaylarim
          </button>
        </div>

        {activeTab === 'give' && (
          <div className="give-review">
            <h2>✍️ Essaylarni Baholash</h2>
            {mockSubmissions.length > 0 ? (
              <div className="submissions-list">
                {mockSubmissions.map(submission => (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-header">
                      <div className="submission-info">
                        <h3>{submission.task} by {submission.user}</h3>
                        <div className="submission-meta">
                          <span>📅 {submission.submitted}</span>
                          <span>📝 {submission.wordCount} words</span>
                        </div>
                      </div>
                      <div className="submission-actions">
                        <button className="view-btn">👁️ Ko'rish</button>
                      </div>
                    </div>

                    <div className="submission-content">
                      <p>{submission.essay.substring(0, 200)}...</p>
                    </div>

                    <div className="review-form">
                      <h4>Baho Berish:</h4>
                      
                      <div className="rating-section">
                        <label>Umumiy Reyting:</label>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              className={`star-btn ${star <= newReview.rating ? 'active' : ''}`}
                              onClick={() => setNewReview(prev => ({...prev, rating: star}))}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                        <span className="rating-text">
                          {getRatingText(newReview.rating)}
                        </span>
                      </div>

                      <div className="feedback-section">
                        <label>Asosiy Feedback:</label>
                        <textarea
                          value={newReview.feedback}
                          onChange={(e) => setNewReview(prev => ({...prev, feedback: e.target.value}))}
                          placeholder="Essay haqida asosiy fikringizni yozing..."
                          rows="3"
                        />
                      </div>

                      <div className="strengths-section">
                        <label>Kuchli Tomonlar:</label>
                        <textarea
                          value={newReview.strengths}
                          onChange={(e) => setNewReview(prev => ({...prev, strengths: e.target.value}))}
                          placeholder="Essayning kuchli tomonlarini yozing..."
                          rows="2"
                        />
                      </div>

                      <div className="improvements-section">
                        <label>Takomillashtirish:</label>
                        <textarea
                          value={newReview.improvements}
                          onChange={(e) => setNewReview(prev => ({...prev, improvements: e.target.value}))}
                          placeholder="Qanday takomillashtirish mumkin?"
                          rows="2"
                        />
                      </div>

                      <button 
                        className="submit-review-btn"
                        onClick={() => submitReview(submission.id)}
                        disabled={!newReview.feedback.trim()}
                      >
                        📤 Bahoni Yuborish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>Hozircha baholash uchun essaylar yo'q</h3>
                <p>Boshqa o'quvchilar essaylarini baholash uchun keyinroq keling</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'receive' && (
          <div className="receive-reviews">
            <h2>📥 Olingan Baholar</h2>
            {mockReviews.length > 0 ? (
              <div className="reviews-list">
                {mockReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.reviewer.charAt(0)}
                        </div>
                        <div>
                          <h4>{review.reviewer}</h4>
                          <span className="review-date">{review.date}</span>
                        </div>
                      </div>
                      <div 
                        className="rating-badge"
                        style={{ backgroundColor: getRatingColor(review.rating) }}
                      >
                        ⭐ {review.rating}/5
                      </div>
                    </div>

                    <div className="review-content">
                      <div className="feedback-section">
                        <h5>Asosiy Feedback:</h5>
                        <p>{review.feedback}</p>
                      </div>

                      <div className="strengths-section">
                        <h5>✅ Kuchli Tomonlar:</h5>
                        <p>{review.strengths}</p>
                      </div>

                      <div className="improvements-section">
                        <h5>🎯 Takomillashtirish:</h5>
                        <p>{review.improvements}</p>
                      </div>
                    </div>

                    <div className="review-actions">
                      <button className="helpful-btn">
                        👍 Foydali (12)
                      </button>
                      <button className="reply-btn">
                        💬 Javob Berish
                      </button>
                      <button className="save-btn">
                        💾 Saqlash
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📥</div>
                <h3>Hali hech qanday baho olishmadingiz</h3>
                <p>Essaylaringizni yuklang va boshqa o'quvchilardan feedback oling</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div className="my-submissions">
            <h2>📋 Mening Essaylarim</h2>
            <div className="submission-actions">
              <button className="new-submission-btn">
                + Yangi Essay Yuklash
              </button>
            </div>

            <div className="my-submissions-list">
              <div className="submission-item">
                <div className="submission-header">
                  <h4>Technology Essay</h4>
                  <span className="status pending">⏳ Kutilyapti</span>
                </div>
                <div className="submission-meta">
                  <span>📅 Yesterday</span>
                  <span>📝 275 words</span>
                  <span>👁️ 0 reviews</span>
                </div>
              </div>

              <div className="submission-item">
                <div className="submission-header">
                  <h4>Globalization Essay</h4>
                  <span className="status reviewed">✅ Baholangan</span>
                </div>
                <div className="submission-meta">
                  <span>📅 2 days ago</span>
                  <span>📝 280 words</span>
                  <span>⭐ 4.5/5.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="review-guidelines">
          <h3>📝 Baho Berish Ko'rsatmalari</h3>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h4>🎯 Task Response</h4>
              <ul>
                <li>Savolga to'liq javob berilganmi?</li>
                <li>Asosiy fikrlar aniq ifodalanganmi?</li>
                <li>Misollar va tafsilotlar bormi?</li>
              </ul>
            </div>
            <div className="guideline-card">
              <h4>📊 Coherence & Cohesion</h4>
              <ul>
                <li>Essay tuzilishi mantiqiymi?</li>
                <li>Paragraphlar yaxshi bog'langanmi?</li>
                <li>Linking words to'g'ri ishlatilganmi?</li>
              </ul>
            </div>
            <div className="guideline-card">
              <h4>📚 Lexical Resource</h4>
              <ul>
                <li>Lug'at boyligi qanday?</li>
                <li>Academic vocabulary ishlatilganmi?</li>
                <li>So'zlar to'g'ri ishlatilganmi?</li>
              </ul>
            </div>
            <div className="guideline-card">
              <h4>🔤 Grammar</h4>
              <ul>
                <li>Grammatik xatolar bormi?</li>
                <li>Gap tuzilmalari xilma-xilmi?</li>
                <li>Punctuation to'g'rimi?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeerReview
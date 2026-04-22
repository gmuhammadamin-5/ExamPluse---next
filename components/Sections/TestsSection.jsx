import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const TestsSection = () => {
  const { user, openAuthModal } = useAuth()

  if (!user) {
    return (
      <section className="tests-section auth-required">
        <div className="container">
          <div className="auth-required-message">
            <h2>Access Full IELTS Tests</h2>
            <p>Please register or login to access all practice tests</p>
            <button 
              className="btn btn-primary"
              onClick={() => openAuthModal('register')}
            >
              Register Now
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="tests-section">
      <div className="container">
        <div className="section-header">
          <h1>IELTS Practice Tests</h1>
          <p>Choose from our comprehensive collection of tests</p>
        </div>
        <div className="tests-coming-soon">
          <h3>Tests Coming Soon!</h3>
          <p>We're preparing speaking, reading, writing, and listening tests for you.</p>
        </div>
      </div>
    </section>
  )
}

export default TestsSection
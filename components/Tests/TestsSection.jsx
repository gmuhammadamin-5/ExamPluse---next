import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTests } from '../../contexts/TestContext'
import TestList from '../Tests/TestList'
import SpeakingTest from '../Tests/SpeakingTest'
import ReadingTest from '../Tests/ReadingTest'
import WritingTest from '../Tests/WritingTest'
import ListeningTest from '../Tests/ListeningTest'

const TestsSection = () => {
  const { user, openAuthModal } = useAuth()
  const { currentTest, testInProgress } = useTests()

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

  if (testInProgress && currentTest) {
    switch (currentTest.type) {
      case 'speaking':
        return <SpeakingTest test={currentTest} />
      case 'reading':
        return <ReadingTest test={currentTest} />
      case 'writing':
        return <WritingTest test={currentTest} />
      case 'listening':
        return <ListeningTest test={currentTest} />
      default:
        return <TestList />
    }
  }

  return (
    <section className="tests-section">
      <div className="container">
        <div className="section-header">
          <h1>IELTS Practice Tests</h1>
          <p>Choose from our comprehensive collection of tests</p>
        </div>
        <TestList />
      </div>
    </section>
  )
}

export default TestsSection
// TestContext.js
import React, { createContext, useState, useContext, useEffect } from 'react'
import { mockTestData, calculateBandScore } from './TestData'

const TestContext = createContext()

export const useTests = () => {
  const context = useContext(TestContext)
  if (!context) {
    throw new Error('useTests must be used within a TestProvider')
  }
  return context
}

export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState([])
  const [currentTest, setCurrentTest] = useState(null)
  const [userResults, setUserResults] = useState([])
  const [testHistory, setTestHistory] = useState([])

  useEffect(() => {
    // Load mock tests
    setTests(mockTestData)

    // Load saved results from localStorage
    const savedResults = localStorage.getItem('ieltsTestResults')
    if (savedResults) {
      setUserResults(JSON.parse(savedResults))
    }

    const savedHistory = localStorage.getItem('ieltsTestHistory')
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    // Save results to localStorage
    if (userResults.length > 0) {
      localStorage.setItem('ieltsTestResults', JSON.stringify(userResults))
    }
  }, [userResults])

  const submitTest = (testId, section, answers, timeSpent) => {
    const test = tests.find(t => t.id === testId)
    if (!test) return null

    let score = 0
    let correctAnswers = 0
    let totalQuestions = 0
    let detailedResults = {}

    switch (section) {
      case 'listening':
        totalQuestions = 40
        correctAnswers = calculateListeningScore(test, answers)
        score = calculateBandScore(correctAnswers, totalQuestions, 'listening')
        detailedResults = analyzeListeningMistakes(test, answers)
        break

      case 'reading':
        totalQuestions = 40
        correctAnswers = calculateReadingScore(test, answers)
        score = calculateBandScore(correctAnswers, totalQuestions, 'reading')
        detailedResults = analyzeReadingMistakes(test, answers)
        break

      case 'writing':
        score = evaluateWriting(answers)
        detailedResults = {
          task1: evaluateWritingTask(answers.task1 || '', 1),
          task2: evaluateWritingTask(answers.task2 || '', 2),
          overall: score
        }
        break

      case 'speaking':
        score = evaluateSpeaking(answers)
        detailedResults = {
          fluency: Math.floor(Math.random() * 2) + 7,
          pronunciation: Math.floor(Math.random() * 2) + 7,
          vocabulary: Math.floor(Math.random() * 2) + 7,
          grammar: Math.floor(Math.random() * 2) + 7,
          coherence: Math.floor(Math.random() * 2) + 7,
          overall: score
        }
        break
    }

    const result = {
      testId,
      section,
      score: parseFloat(score.toFixed(1)),
      correctAnswers,
      totalQuestions,
      timeSpent,
      answers,
      detailedResults,
      submittedAt: new Date().toISOString(),
      testTitle: test.title
    }

    setUserResults(prev => {
      const filtered = prev.filter(r => !(r.testId === testId && r.section === section))
      return [...filtered, result]
    })

    // Update test history
    setTestHistory(prev => {
      const newEntry = {
        testId,
        section,
        score,
        date: new Date().toISOString()
      }
      return [newEntry, ...prev.slice(0, 49)] // Keep last 50 entries
    })

    return result
  }

  const calculateListeningScore = (test, userAnswers) => {
    let correct = 0
    const answerKey = test.answerKeys.listening

    Object.keys(userAnswers).forEach(questionId => {
      const qId = parseInt(questionId)
      if (answerKey[qId] !== undefined) {
        if (Array.isArray(answerKey[qId])) {
          if (answerKey[qId].includes(userAnswers[questionId])) {
            correct++
          }
        } else if (answerKey[qId] === userAnswers[questionId]) {
          correct++
        }
      }
    })

    return correct
  }

  const calculateReadingScore = (test, userAnswers) => {
    let correct = 0
    const answerKey = test.answerKeys.reading

    Object.keys(userAnswers).forEach(questionId => {
      const qId = parseInt(questionId)
      if (answerKey[qId] !== undefined) {
        if (Array.isArray(answerKey[qId])) {
          if (answerKey[qId].includes(userAnswers[questionId])) {
            correct++
          }
        } else if (answerKey[qId] === userAnswers[questionId]) {
          correct++
        }
      }
    })

    return correct
  }

  const analyzeListeningMistakes = (test, userAnswers) => {
    const mistakes = []
    const answerKey = test.answerKeys.listening

    Object.keys(userAnswers).forEach(questionId => {
      const qId = parseInt(questionId)
      const question = test.listening.find(q => q.id === qId)

      if (question && answerKey[qId] !== undefined) {
        let isCorrect = false

        if (Array.isArray(answerKey[qId])) {
          isCorrect = answerKey[qId].includes(userAnswers[questionId])
        } else {
          isCorrect = answerKey[qId] === userAnswers[questionId]
        }

        if (!isCorrect) {
          mistakes.push({
            questionId: qId,
            userAnswer: userAnswers[questionId],
            correctAnswer: answerKey[qId],
            question: question.question,
            explanation: question.explanation || 'No explanation available',
            section: question.section
          })
        }
      }
    })

    return {
      totalMistakes: mistakes.length,
      mistakesBySection: mistakes.reduce((acc, mistake) => {
        acc[mistake.section] = (acc[mistake.section] || 0) + 1
        return acc
      }, {}),
      detailedMistakes: mistakes
    }
  }

  const analyzeReadingMistakes = (test, userAnswers) => {
    const mistakes = []
    const answerKey = test.answerKeys.reading

    Object.keys(userAnswers).forEach(questionId => {
      const qId = parseInt(questionId)
      let question = null

      // Find which passage the question belongs to
      for (const passage of test.reading) {
        const foundQuestion = passage.questions.find(q => q.id === qId)
        if (foundQuestion) {
          question = foundQuestion
          break
        }
      }

      if (question && answerKey[qId] !== undefined) {
        let isCorrect = false

        if (Array.isArray(answerKey[qId])) {
          isCorrect = answerKey[qId].includes(userAnswers[questionId])
        } else {
          isCorrect = answerKey[qId] === userAnswers[questionId]
        }

        if (!isCorrect) {
          mistakes.push({
            questionId: qId,
            userAnswer: userAnswers[questionId],
            correctAnswer: answerKey[qId],
            question: question.question || question.statement,
            explanation: question.explanation || 'No explanation available',
            type: question.type
          })
        }
      }
    })

    return {
      totalMistakes: mistakes.length,
      mistakesByType: mistakes.reduce((acc, mistake) => {
        acc[mistake.type] = (acc[mistake.type] || 0) + 1
        return acc
      }, {}),
      detailedMistakes: mistakes
    }
  }

  const evaluateWriting = (answers) => {
    const task1Score = evaluateWritingTask(answers.task1 || '', 1)
    const task2Score = evaluateWritingTask(answers.task2 || '', 2)

    // Task 2 counts twice as much as Task 1
    const overallScore = (task1Score + (task2Score * 2)) / 3
    return parseFloat(overallScore.toFixed(1))
  }

  const evaluateWritingTask = (text, taskNumber) => {
    if (!text || text.trim().length === 0) return 4.0

    const words = text.trim().split(/\s+/).length
    const minWords = taskNumber === 1 ? 150 : 250

    // Base score based on word count
    let score = 4.0
    if (words >= minWords) score = 6.0
    if (words >= minWords + 50) score = 7.0
    if (words >= minWords + 100) score = 8.0

    // Adjust based on content quality (simulated)
    const hasComplexSentences = text.includes(', although') || text.includes('; however') || text.includes('. Furthermore')
    const hasAcademicVocab = text.match(/\b(significantly|consequently|moreover|nevertheless)\b/i)
    const hasGoodStructure = text.split('\n\n').length >= (taskNumber === 1 ? 4 : 5)

    if (hasComplexSentences) score += 0.5
    if (hasAcademicVocab) score += 0.5
    if (hasGoodStructure) score += 0.5

    // Add some randomness for simulation
    score += Math.random() * 0.5 - 0.25

    return Math.min(Math.max(score, 4.0), 9.0)
  }

  const evaluateSpeaking = (answers) => {
    // Simulated speaking evaluation
    const criteria = {
      fluency: Math.floor(Math.random() * 2) + 6,
      pronunciation: Math.floor(Math.random() * 2) + 6,
      vocabulary: Math.floor(Math.random() * 2) + 6,
      grammar: Math.floor(Math.random() * 2) + 6,
      coherence: Math.floor(Math.random() * 2) + 6
    }

    const overall = Object.values(criteria).reduce((sum, score) => sum + score, 0) / Object.keys(criteria).length
    return parseFloat(overall.toFixed(1))
  }

  const getOverallScore = (testId) => {
    const testResults = userResults.filter(r => r.testId === testId)
    if (testResults.length === 0) return null

    const sections = ['listening', 'reading', 'writing', 'speaking']
    const scores = {}

    sections.forEach(section => {
      const result = testResults.find(r => r.section === section)
      scores[section] = result?.score || 0
    })

    // Calculate overall band score (average of 4 sections)
    const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / 4

    return {
      overall: parseFloat(overall.toFixed(1)),
      ...scores,
      testResults
    }
  }

  const getDetailedAnalysis = (testId, section) => {
    const result = userResults.find(r => r.testId === testId && r.section === section)
    if (!result) return null

    return {
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      accuracy: result.totalQuestions > 0
        ? parseFloat(((result.correctAnswers / result.totalQuestions) * 100).toFixed(1))
        : 0,
      timeSpent: result.timeSpent,
      detailedResults: result.detailedResults,
      recommendations: generateRecommendations(result.score, section)
    }
  }

  const generateRecommendations = (score, section) => {
    const recommendations = []

    if (score < 6.0) {
      recommendations.push('You need to focus more on this section. Consider practicing with more sample tests.')
      recommendations.push('Build your vocabulary with academic word lists.')
      recommendations.push('Work on time management during the test.')
    } else if (score < 7.0) {
      recommendations.push('Good effort, but there is room for improvement.')
      recommendations.push('Focus on understanding question types and strategies.')
      recommendations.push('Practice with timed tests to improve speed and accuracy.')
    } else if (score < 8.0) {
      recommendations.push('Excellent performance! Maintain your current study routine.')
      recommendations.push('Focus on minimizing small errors to reach higher bands.')
      recommendations.push('Try more challenging practice materials.')
    } else {
      recommendations.push('Outstanding performance! You are at expert level.')
      recommendations.push('Continue practicing to maintain your high standard.')
      recommendations.push('Consider helping others with their IELTS preparation.')
    }

    // Section-specific recommendations
    if (section === 'listening') {
      recommendations.push('Practice listening to different English accents.')
      recommendations.push('Improve note-taking skills while listening.')
    } else if (section === 'reading') {
      recommendations.push('Develop skimming and scanning techniques.')
      recommendations.push('Practice reading academic articles and journals.')
    } else if (section === 'writing') {
      recommendations.push('Study model answers for different question types.')
      recommendations.push('Practice writing within time limits.')
    } else if (section === 'speaking') {
      recommendations.push('Record yourself speaking and analyze your performance.')
      recommendations.push('Practice speaking on a variety of topics.')
    }

    return recommendations
  }

  const getTestProgress = (testId) => {
    const testResults = userResults.filter(r => r.testId === testId)
    const completedSections = testResults.length
    const totalSections = 4

    return {
      completed: completedSections,
      total: totalSections,
      percentage: (completedSections / totalSections) * 100,
      sections: {
        listening: testResults.some(r => r.section === 'listening'),
        reading: testResults.some(r => r.section === 'reading'),
        writing: testResults.some(r => r.section === 'writing'),
        speaking: testResults.some(r => r.section === 'speaking')
      }
    }
  }

  const getAllTestProgress = () => {
    return tests.map(test => ({
      testId: test.id,
      title: test.title,
      progress: getTestProgress(test.id)
    }))
  }

  const resetTest = (testId) => {
    setUserResults(prev => prev.filter(r => r.testId !== testId))
  }

  const exportResults = () => {
    const data = {
      userResults,
      testHistory,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ielts-test-results-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSectionStatusForTest = (testId, section) => {
    const result = userResults.find(
      r => r.testId === testId && r.section === section
    )
    return result ? 'Completed' : 'Not started'
  }

  return (
    <TestContext.Provider value={{
      tests,
      currentTest,
      userResults,
      testHistory,
      setCurrentTest,
      submitTest,
      getOverallScore,
      getDetailedAnalysis,
      getTestProgress,
      getAllTestProgress,
      resetTest,
      exportResults,
      getSectionStatusForTest
      
    }}>
      {children}
    </TestContext.Provider>
  )
}
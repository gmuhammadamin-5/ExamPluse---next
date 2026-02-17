import React, { createContext, useContext, useState, useEffect } from 'react'

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
  const [testInProgress, setTestInProgress] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [testStartTime, setTestStartTime] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Initialize test data
  useEffect(() => {
    const initializeTestData = () => {
      const testData = [
        // Speaking Tests (5 tests)
        {
          id: 1,
          type: 'speaking',
          title: 'Speaking Practice Test 1',
          description: 'Complete speaking simulation with all three parts',
          duration: 15,
          bandLevel: '6.5-7.5',
          category: 'Full Test',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              part: 1,
              question: 'Tell me about your hometown.',
              instructions: 'Speak for 1-2 minutes about your hometown.',
              preparationTime: 15,
              speakingTime: 45,
              followUp: 'What do you like most about your hometown?'
            },
            {
              id: 2,
              part: 2,
              question: 'Describe a book you recently read.',
              instructions: 'You should say: what book it was, when you read it, why you chose it, and how you felt about it.',
              preparationTime: 60,
              speakingTime: 120,
              followUp: 'Would you recommend this book to others?'
            },
            {
              id: 3,
              part: 3,
              question: 'How has technology changed reading habits?',
              instructions: 'Discuss the impact of technology on reading.',
              preparationTime: 0,
              speakingTime: 60,
              followUp: 'Do you think people read more or less than in the past?'
            }
          ]
        },
        {
          id: 2,
          type: 'speaking',
          title: 'Speaking Practice Test 2',
          description: 'Focus on part 2 with extended speaking',
          duration: 12,
          bandLevel: '7.0-8.0',
          category: 'Part 2 Focus',
          difficulty: 'Hard',
          questions: [
            {
              id: 1,
              part: 2,
              question: 'Describe an important historical event in your country.',
              instructions: 'Speak about the event, its significance, and its impact.',
              preparationTime: 60,
              speakingTime: 120,
              followUp: 'How has this event shaped your country today?'
            }
          ]
        },
        {
          id: 3,
          type: 'speaking',
          title: 'Speaking Practice Test 3',
          description: 'Everyday topics and personal experiences',
          duration: 10,
          bandLevel: '5.5-6.5',
          category: 'Part 1 Focus',
          difficulty: 'Easy',
          questions: [
            {
              id: 1,
              part: 1,
              question: 'Do you prefer reading books or watching movies?',
              instructions: 'Give your opinion and reasons.',
              preparationTime: 15,
              speakingTime: 45,
              followUp: 'Why do you prefer that?'
            }
          ]
        },
        {
          id: 4,
          type: 'speaking',
          title: 'Speaking Practice Test 4',
          description: 'Academic topics and abstract discussions',
          duration: 15,
          bandLevel: '7.5-8.5',
          category: 'Part 3 Focus',
          difficulty: 'Hard',
          questions: [
            {
              id: 1,
              part: 3,
              question: 'What are the benefits of learning a second language?',
              instructions: 'Discuss the advantages from different perspectives.',
              preparationTime: 0,
              speakingTime: 90,
              followUp: 'How does language learning affect brain development?'
            }
          ]
        },
        {
          id: 5,
          type: 'speaking',
          title: 'Speaking Practice Test 5',
          description: 'Mixed topics with time pressure',
          duration: 14,
          bandLevel: '6.0-7.0',
          category: 'Mixed Parts',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              part: 1,
              question: 'What kind of music do you like?',
              instructions: 'Talk about your music preferences.',
              preparationTime: 15,
              speakingTime: 45
            },
            {
              id: 2,
              part: 2,
              question: 'Describe a memorable journey you have taken.',
              instructions: 'Include where, when, and why it was memorable.',
              preparationTime: 60,
              speakingTime: 120
            }
          ]
        },

        // Listening Tests (5 tests)
        {
          id: 6,
          type: 'listening',
          title: 'Listening Test 1 - Social Context',
          description: 'Everyday conversations and social situations',
          duration: 30,
          bandLevel: '6.0-7.0',
          category: 'Section 1-2',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              section: 1,
              audio: 'conversation-accommodation',
              question: 'What type of accommodation is the student looking for?',
              options: ['Shared apartment', 'University dormitory', 'Private studio', 'Homestay'],
              correctAnswer: 2
            },
            {
              id: 2,
              section: 1,
              audio: 'conversation-accommodation',
              question: 'What is the maximum budget per week?',
              options: ['£100', '£150', '£200', '£250'],
              correctAnswer: 1
            },
            {
              id: 3,
              section: 2,
              audio: 'campus-tour',
              question: 'Where is the main library located?',
              options: ['Next to student union', 'Behind science building', 'Near sports center', 'Across from cafeteria'],
              correctAnswer: 0
            }
          ]
        },
        {
          id: 7,
          type: 'listening',
          title: 'Listening Test 2 - Academic Context',
          description: 'University lectures and academic discussions',
          duration: 30,
          bandLevel: '7.0-8.0',
          category: 'Section 3-4',
          difficulty: 'Hard',
          questions: [
            {
              id: 1,
              section: 3,
              audio: 'academic-discussion',
              question: 'What is the main topic of the discussion?',
              options: ['Climate change effects', 'Renewable energy sources', 'Urban planning strategies', 'Economic development models'],
              correctAnswer: 1
            },
            {
              id: 2,
              section: 4,
              audio: 'academic-lecture',
              question: 'According to the lecture, what is the most promising renewable energy source?',
              options: ['Solar power', 'Wind energy', 'Hydroelectric', 'Geothermal'],
              correctAnswer: 0
            }
          ]
        },
        {
          id: 8,
          type: 'listening',
          title: 'Listening Test 3 - Workplace Context',
          description: 'Professional conversations and workplace scenarios',
          duration: 30,
          bandLevel: '6.5-7.5',
          category: 'Section 1-2',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              section: 1,
              audio: 'job-interview',
              question: 'What position is being discussed?',
              options: ['Marketing manager', 'Software developer', 'Sales representative', 'Project coordinator'],
              correctAnswer: 3
            }
          ]
        },
        {
          id: 9,
          type: 'listening',
          title: 'Listening Test 4 - Mixed Context',
          description: 'Various listening scenarios with different accents',
          duration: 30,
          bandLevel: '7.5-8.5',
          category: 'Full Test',
          difficulty: 'Hard',
          questions: [
            {
              id: 1,
              section: 1,
              audio: 'travel-information',
              question: 'What time does the next train depart?',
              options: ['2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM'],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 10,
          type: 'listening',
          title: 'Listening Test 5 - General Training',
          description: 'Everyday English for general purposes',
          duration: 30,
          bandLevel: '5.5-6.5',
          category: 'General',
          difficulty: 'Easy',
          questions: [
            {
              id: 1,
              section: 1,
              audio: 'restaurant-booking',
              question: 'How many people is the reservation for?',
              options: ['2', '4', '6', '8'],
              correctAnswer: 1
            }
          ]
        },

        // Reading Tests (5 tests)
        {
          id: 11,
          type: 'reading',
          title: 'Reading Test 1 - Academic',
          description: 'Three passages with academic texts',
          duration: 60,
          bandLevel: '6.5-7.5',
          category: 'Academic',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              passage: `Climate change is one of the most pressing issues facing humanity today. The scientific consensus is clear that human activities, particularly the burning of fossil fuels and deforestation, are driving unprecedented changes in our planet's climate system. These changes manifest in rising global temperatures, melting polar ice caps, and increasing frequency of extreme weather events.`,
              question: 'What is stated about climate change in the first paragraph?',
              options: [
                'It is a naturally occurring phenomenon',
                'Human activities are the primary cause',
                'It only affects polar regions',
                'Scientists are divided on its causes'
              ],
              correctAnswer: 1
            },
            {
              id: 2,
              passage: `The development of renewable energy sources has accelerated in recent years. Solar and wind power are becoming increasingly cost-competitive with traditional fossil fuels. Many countries are investing heavily in green technology to reduce their carbon footprint and meet international climate commitments.`,
              question: 'What is the main focus of the second paragraph?',
              options: [
                'The cost of fossil fuels',
                'Growth of renewable energy',
                'International politics',
                'Technological challenges'
              ],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 12,
          type: 'reading',
          title: 'Reading Test 2 - General Training',
          description: 'Everyday reading materials and advertisements',
          duration: 60,
          bandLevel: '5.5-6.5',
          category: 'General',
          difficulty: 'Easy',
          questions: [
            {
              id: 1,
              passage: `The City Library will be closed for renovations from June 1st to June 15th. During this period, no books can be borrowed or returned. However, the online library service will remain available 24/7. All due dates have been extended until June 30th.`,
              question: 'How long will the library be closed?',
              options: ['1 week', '2 weeks', '3 weeks', '1 month'],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 13,
          type: 'reading',
          title: 'Reading Test 3 - Complex Texts',
          description: 'Complex academic texts with detailed comprehension',
          duration: 60,
          bandLevel: '7.5-8.5',
          category: 'Academic',
          difficulty: 'Hard',
          questions: [
            {
              id: 1,
              passage: `The philosophical underpinnings of modern democracy can be traced back to the Enlightenment era, when thinkers began challenging traditional authority structures and advocating for individual rights and popular sovereignty.`,
              question: 'What historical period influenced modern democracy?',
              options: ['Renaissance', 'Enlightenment', 'Industrial Revolution', 'Middle Ages'],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 14,
          type: 'reading',
          title: 'Reading Test 4 - Mixed Topics',
          description: 'Various topics from different academic fields',
          duration: 60,
          bandLevel: '6.0-7.0',
          category: 'Mixed',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              passage: `Artificial intelligence is transforming industries ranging from healthcare to finance. Machine learning algorithms can now diagnose diseases with accuracy comparable to human experts and predict market trends with remarkable precision.`,
              question: 'What is the main idea of the passage?',
              options: [
                'AI limitations',
                'AI applications across industries',
                'Healthcare technology',
                'Financial predictions'
              ],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 15,
          type: 'reading',
          title: 'Reading Test 5 - Technical Texts',
          description: 'Technical and scientific reading materials',
          duration: 60,
          bandLevel: '7.0-8.0',
          category: 'Technical',
          difficulty: 'Hard',
          questions: [
            {
              id: 1,
              passage: `Quantum computing represents a paradigm shift in computational technology. Unlike classical computers that use bits, quantum computers use qubits which can exist in multiple states simultaneously, enabling them to solve certain problems exponentially faster.`,
              question: 'What is the key difference mentioned between classical and quantum computers?',
              options: [
                'Processing speed',
                'Use of qubits vs bits',
                'Energy consumption',
                'Physical size'
              ],
              correctAnswer: 1
            }
          ]
        },

        // Writing Tests (5 tests)
        {
          id: 16,
          type: 'writing',
          title: 'Writing Test 1 - Academic Task 1',
          description: 'Describe and compare data from charts',
          duration: 20,
          bandLevel: '6.0-7.0',
          category: 'Task 1',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              task: 'The chart below shows the percentage of people using different modes of transportation in a European city between 1960 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
              type: 'chart',
              wordLimit: 150
            }
          ]
        },
        {
          id: 17,
          type: 'writing',
          title: 'Writing Test 2 - Academic Task 2',
          description: 'Essay writing on contemporary issues',
          duration: 40,
          bandLevel: '6.5-7.5',
          category: 'Task 2',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              task: 'Some people believe that technology has made our lives more complicated, while others argue it has made life easier. Discuss both views and give your own opinion.',
              type: 'opinion',
              wordLimit: 250
            }
          ]
        },
        {
          id: 18,
          type: 'writing',
          title: 'Writing Test 3 - General Task 1',
          description: 'Letter writing for various situations',
          duration: 20,
          bandLevel: '5.5-6.5',
          category: 'General Task 1',
          difficulty: 'Easy',
          questions: [
            {
              id: 1,
              task: 'You are planning to move to a new city for work. Write a letter to a friend who lives there. In your letter: explain why you are moving, describe the type of accommodation you are looking for, and ask for advice about living in the city.',
              type: 'letter',
              wordLimit: 150
            }
          ]
        },
        {
          id: 19,
          type: 'writing',
          title: 'Writing Test 4 - Problem/Solution',
          description: 'Essay discussing problems and solutions',
          duration: 40,
          bandLevel: '7.0-8.0',
          category: 'Task 2',
          difficulty: 'Hard',
          questions: [
            {
              id: 1,
              task: 'Many cities around the world are facing serious housing problems. What are the main causes of these problems, and what measures could be taken to address them?',
              type: 'problem-solution',
              wordLimit: 250
            }
          ]
        },
        {
          id: 20,
          type: 'writing',
          title: 'Writing Test 5 - Advantage/Disadvantage',
          description: 'Essay discussing advantages and disadvantages',
          duration: 40,
          bandLevel: '6.0-7.0',
          category: 'Task 2',
          difficulty: 'Medium',
          questions: [
            {
              id: 1,
              task: 'More and more people are using computers and electronic devices to access information. What are the advantages and disadvantages of this trend?',
              type: 'advantage-disadvantage',
              wordLimit: 250
            }
          ]
        }
      ]

      setTests(testData)
      
      // Load saved test results
      const savedResults = localStorage.getItem('examy_test_results')
      if (savedResults) {
        setTestResults(JSON.parse(savedResults))
      }
    }

    initializeTestData()
  }, [])

  // Save test results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('examy_test_results', JSON.stringify(testResults))
  }, [testResults])

  const startTest = (testId) => {
    const test = tests.find(t => t.id === testId)
    if (!test) {
      throw new Error('Test not found')
    }

    setCurrentTest(test)
    setTestInProgress(true)
    setTestStartTime(new Date())
    setTimeRemaining(test.duration * 60)
    setUserAnswers({})
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Store timer reference to clear later
    setCurrentTest(prev => ({
      ...prev,
      _timer: timer
    }))
  }

  const handleTimeUp = () => {
    if (currentTest) {
      submitTest(userAnswers, currentTest.duration * 60)
    }
  }

  const submitTest = (answers, timeSpent) => {
    if (!currentTest) return

    // Clear timer
    if (currentTest._timer) {
      clearInterval(currentTest._timer)
    }

    const score = calculateScore(answers, currentTest)
    const bandScore = calculateBandScore(score, currentTest.questions.length)
    
    const result = {
      id: Date.now(),
      testId: currentTest.id,
      testType: currentTest.type,
      testTitle: currentTest.title,
      score,
      bandScore,
      totalQuestions: currentTest.questions.length,
      correctAnswers: score,
      timeSpent: currentTest.duration * 60 - timeRemaining,
      date: new Date().toISOString(),
      answers: answers,
      duration: currentTest.duration
    }

    setTestResults(prev => [result, ...prev])
    setCurrentTest(null)
    setTestInProgress(false)
    setUserAnswers({})
    setTimeRemaining(0)

    return result
  }

  const calculateScore = (answers, test) => {
    if (test.type === 'speaking' || test.type === 'writing') {
      // For speaking and writing, use a simulated scoring system
      return Math.floor(Math.random() * 20) + 15 // Random score between 15-35
    }

    // For listening and reading, calculate based on correct answers
    let correct = 0
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const calculateBandScore = (score, totalQuestions) => {
    if (totalQuestions === 0) return 0

    const percentage = (score / totalQuestions) * 100
    
    if (percentage >= 90) return 9.0
    if (percentage >= 80) return 8.5
    if (percentage >= 75) return 8.0
    if (percentage >= 70) return 7.5
    if (percentage >= 65) return 7.0
    if (percentage >= 60) return 6.5
    if (percentage >= 55) return 6.0
    if (percentage >= 50) return 5.5
    if (percentage >= 40) return 5.0
    if (percentage >= 30) return 4.5
    if (percentage >= 20) return 4.0
    if (percentage >= 10) return 3.5
    return 3.0
  }

  const updateAnswer = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const getTestResult = (testId) => {
    return testResults.find(result => result.testId === testId)
  }

  const getUserProgress = () => {
    const progress = {
      speaking: { testsTaken: 0, averageBand: 0, bestBand: 0 },
      listening: { testsTaken: 0, averageBand: 0, bestBand: 0 },
      reading: { testsTaken: 0, averageBand: 0, bestBand: 0 },
      writing: { testsTaken: 0, averageBand: 0, bestBand: 0 }
    }

    testResults.forEach(result => {
      const type = result.testType
      if (progress[type]) {
        progress[type].testsTaken++
        progress[type].averageBand += result.bandScore
        if (result.bandScore > progress[type].bestBand) {
          progress[type].bestBand = result.bandScore
        }
      }
    })

    // Calculate averages
    Object.keys(progress).forEach(type => {
      if (progress[type].testsTaken > 0) {
        progress[type].averageBand = Number((progress[type].averageBand / progress[type].testsTaken).toFixed(1))
      }
    })

    return progress
  }

  const getRecentResults = (limit = 5) => {
    return testResults
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }

  const clearTestResults = () => {
    setTestResults([])
    localStorage.removeItem('examy_test_results')
  }

  const pauseTest = () => {
    if (currentTest && currentTest._timer) {
      clearInterval(currentTest._timer)
    }
  }

  const resumeTest = () => {
    if (currentTest && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      setCurrentTest(prev => ({
        ...prev,
        _timer: timer
      }))
    }
  }

  const value = {
    // State
    tests,
    currentTest,
    testInProgress,
    testResults,
    userAnswers,
    timeRemaining,
    testStartTime,
    
    // Test actions
    startTest,
    submitTest,
    updateAnswer,
    pauseTest,
    resumeTest,
    
    // Results and progress
    getTestResult,
    getUserProgress,
    getRecentResults,
    clearTestResults,
    
    // Utilities
    totalTestsTaken: testResults.length,
    hasCompletedTest: (testId) => testResults.some(result => result.testId === testId),
    getTestById: (testId) => tests.find(test => test.id === testId)
  }

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  )
}
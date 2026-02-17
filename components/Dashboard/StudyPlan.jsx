import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTests } from '../../contexts/TestContext'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/App.css'

const StudyPlan = () => {
  const { user } = useAuth()
  const { getUserProgress, tests } = useTests()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('weekly')
  const [completedDays, setCompletedDays] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const [studyTime, setStudyTime] = useState(0)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    
    const savedCompletedDays = localStorage.getItem('examy_completed_days')
    if (savedCompletedDays) {
      try {
        setCompletedDays(JSON.parse(savedCompletedDays))
      } catch (e) {
        console.error('Error loading completed days:', e)
      }
    }

    const savedStudyTime = localStorage.getItem('examy_study_time')
    if (savedStudyTime) {
      setStudyTime(parseInt(savedStudyTime) || 0)
    }
    
    setTimeout(() => {
      setIsLoading(false)
    }, 1200)
  }, [user, navigate])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (isLoading) {
    return <StudyPlanLoader />
  }

  if (!user) return null

  const progress = getUserProgress()
  const targetBand = user ? parseFloat(user.targetBand) || 6.5 : 6.5
  const userName = user?.name || 'Student'
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  const toggleDayCompletion = (dayIndex) => {
    const newCompletedDays = completedDays.includes(dayIndex)
      ? completedDays.filter(d => d !== dayIndex)
      : [...completedDays, dayIndex]
    
    setCompletedDays(newCompletedDays)
    localStorage.setItem('examy_completed_days', JSON.stringify(newCompletedDays))
    
    if (!completedDays.includes(dayIndex)) {
      const newStudyTime = studyTime + 60
      setStudyTime(newStudyTime)
      localStorage.setItem('examy_study_time', newStudyTime.toString())
    }
  }

  const getWeakSkills = () => {
    return Object.entries(progress)
      .filter(([_, data]) => (data.averageBand || 0) < targetBand - 0.5)
      .map(([skill]) => skill)
  }

  const getRecommendedTests = (skill) => {
    return tests
      .filter(test => test.type === skill)
      .slice(0, 2)
      .map(test => test.title)
  }

  const weeklyPlan = [
    {
      day: 'Monday',
      focus: 'Reading',
      icon: '📚',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
      lightColor: '#DBEAFE',
      tasks: [
        'Academic Reading Test (40 min)',
        'Vocabulary Building Exercise',
        'Speed Reading Practice (15min)'
      ],
      duration: '60 minutes',
      skill: 'reading',
      tips: ['Skim first, then read carefully', 'Practice with academic texts', 'Learn topic-specific vocabulary']
    },
    {
      day: 'Tuesday',
      focus: 'Listening',
      icon: '🎧',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      lightColor: '#EDE9FE',
      tasks: [
        'Academic Listening Test',
        'Note-taking Practice',
        'Accent Recognition Exercise'
      ],
      duration: '45 minutes',
      skill: 'listening',
      tips: ['Listen for key information', 'Practice with different accents', 'Take notes while listening']
    },
    {
      day: 'Wednesday',
      focus: 'Writing',
      icon: '✏️',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
      lightColor: '#FEE2E2',
      tasks: [
        'Essay Writing Practice (Task 2)',
        'Grammar and Structure Review',
        'Task 1 Data Analysis'
      ],
      duration: '75 minutes',
      skill: 'writing',
      tips: ['Plan before writing', 'Use academic vocabulary', 'Check grammar and spelling']
    },
    {
      day: 'Thursday',
      focus: 'Speaking',
      icon: '🎤',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      lightColor: '#D1FAE5',
      tasks: [
        'Speaking Practice Test',
        'Pronunciation Drills',
        'Fluency Exercise (Record & Review)'
      ],
      duration: '50 minutes',
      skill: 'speaking',
      tips: ['Practice speaking aloud', 'Record and review yourself', 'Focus on pronunciation']
    },
    {
      day: 'Friday',
      focus: 'Mixed Practice',
      icon: '📋',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      lightColor: '#FEF3C7',
      tasks: [
        'Full Practice Test',
        'Weak Area Review Session',
        'Time Management Practice'
      ],
      duration: '120 minutes',
      skill: 'mixed',
      tips: ['Simulate exam conditions', 'Review all sections', 'Practice time management']
    },
    {
      day: 'Saturday',
      focus: 'Review & Strategy',
      icon: '📈',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
      lightColor: '#FCE7F3',
      tasks: [
        'Error Analysis Session',
        'Test Strategy Refinement',
        'Mock Test Under Real Conditions'
      ],
      duration: '90 minutes',
      skill: 'review',
      tips: ['Analyze mistakes', 'Improve strategies', 'Practice under pressure']
    },
    {
      day: 'Sunday',
      focus: 'Rest & Planning',
      icon: '📅',
      color: '#6B7280',
      gradient: 'linear-gradient(135deg, #6B7280, #4B5563)',
      lightColor: '#F3F4F6',
      tasks: [
        'Light Vocabulary Review',
        'Next Week Study Planning',
        'Relaxation and Motivation'
      ],
      duration: '30 minutes',
      skill: 'planning',
      tips: ['Plan next week', 'Relax and recharge', 'Stay motivated']
    }
  ]

  const weakSkills = getWeakSkills()
  const recommendedSkills = weakSkills.length > 0 ? weakSkills : ['reading', 'listening', 'writing', 'speaking']

  const calculateWeeklyProgress = () => {
    return Math.round((completedDays.length / weeklyPlan.length) * 100)
  }

  const getCurrentAverageBand = () => {
    const total = Object.values(progress).reduce((sum, data) => sum + (data.averageBand || 0), 0)
    const count = Object.values(progress).filter(data => data.averageBand).length
    return (total / Math.max(count, 1)).toFixed(1)
  }

  const formatStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <section 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle gradient overlays */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Header Section */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div className="header-content" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '30px'
          }}>
            <div className="header-info" style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px',
                marginBottom: '20px' 
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  {userInitials}
                </div>
                <div>
                  <div style={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    fontWeight: '500',
                    marginBottom: '5px'
                  }}>
                    Welcome back,
                  </div>
                  <h1 style={{
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0,
                    fontWeight: '800',
                    lineHeight: 1.2
                  }}>
                    {userName}'s Study Plan
                  </h1>
                </div>
              </div>
              
              <p style={{
                fontSize: '1.1rem',
                color: '#4B5563',
                maxWidth: '600px',
                lineHeight: 1.6,
                marginBottom: '25px'
              }}>
                Your personalized roadmap to achieve <strong style={{ color: '#1e40af' }}>Band {targetBand}</strong> in IELTS
              </p>

              {/* Quick Stats */}
              <div style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                {[
                  { label: 'Study Days', value: completedDays.length, icon: '📅' },
                  { label: 'Target Band', value: targetBand, icon: '🎯' },
                  { label: 'Current Average', value: getCurrentAverageBand(), icon: '📊' },
                  { label: 'Study Time', value: formatStudyTime(studyTime), icon: '⏱️' }
                ].map((stat, idx) => (
                  <div key={stat.label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '12px 20px',
                    borderRadius: '14px',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{stat.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: '#1F2937',
                        lineHeight: 1
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#6B7280',
                        fontWeight: '500'
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Circle */}
            <div className="progress-indicator" style={{ 
              textAlign: 'center'
            }}>
              <CircularProgress 
                progress={calculateWeeklyProgress()} 
                size={140}
              />
              <p style={{
                marginTop: '10px',
                color: '#4B5563',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Weekly Progress
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 2,
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'weekly', icon: '📅', label: 'Weekly Plan', color: '#3B82F6' },
            { id: 'recommendations', icon: '🎯', label: 'Recommendations', color: '#8B5CF6' },
            { id: 'analytics', icon: '📊', label: 'Progress Analytics', color: '#10B981' },
            { id: 'resources', icon: '📚', label: 'Study Resources', color: '#F59E0B' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '18px 28px',
                background: activeTab === tab.id ? tab.color : 'white',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === tab.id 
                  ? `0 8px 20px ${tab.color}30`
                  : '0 4px 12px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                color: activeTab === tab.id ? 'white' : '#4B5563',
                position: 'relative',
                overflow: 'hidden',
                flex: '1 0 auto',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = `${tab.color}10`
                  e.currentTarget.style.color = tab.color
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#4B5563'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)'
                }
              }}
            >
              <span style={{ 
                fontSize: '1.4rem',
                transition: 'transform 0.3s ease'
              }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '3px',
                  background: `linear-gradient(90deg, ${tab.color}, ${tab.color}CC)`,
                  borderRadius: '0 0 14px 14px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ 
          position: 'relative',
          zIndex: 2,
          minHeight: '500px'
        }}>
          {activeTab === 'weekly' && (
            <WeeklyPlanView 
              weeklyPlan={weeklyPlan}
              completedDays={completedDays}
              toggleDayCompletion={toggleDayCompletion}
              targetBand={targetBand}
              getCurrentAverageBand={getCurrentAverageBand}
              progress={progress}
              studyTime={studyTime}
              formatStudyTime={formatStudyTime}
            />
          )}
          
          {activeTab === 'recommendations' && (
            <RecommendationsView 
              recommendedSkills={recommendedSkills}
              progress={progress}
              targetBand={targetBand}
              getRecommendedTests={getRecommendedTests}
              weakSkills={weakSkills}
            />
          )}
          
          {activeTab === 'analytics' && (
            <AnalyticsView 
              progress={progress}
              targetBand={targetBand}
              weakSkills={weakSkills}
              calculateWeeklyProgress={calculateWeeklyProgress}
              getCurrentAverageBand={getCurrentAverageBand}
              completedDays={completedDays}
              studyTime={studyTime}
              formatStudyTime={formatStudyTime}
            />
          )}
          
          {activeTab === 'resources' && (
            <ResourcesView />
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          padding: '30px',
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '0.95rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ margin: 0 }}>Stay consistent and you'll achieve your goals! 🚀</p>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .day-card-3d {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .day-card-3d:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </section>
  )
}

// Circular Progress Component
const CircularProgress = ({ progress, size = 120 }) => {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div style={{
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`
    }}>
      <svg
        width={size}
        height={size}
        style={{
          transform: 'rotate(-90deg)'
        }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.2s ease-out'
          }}
        />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: `${size * 0.25}px`,
          fontWeight: '800',
          color: '#1F2937',
          lineHeight: 1,
          marginBottom: '4px'
        }}>
          {progress}%
        </div>
      </div>
    </div>
  )
}

// Loading Component
const StudyPlanLoader = () => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        padding: '40px'
      }}>
        {/* Animated Book Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 30px',
          position: 'relative',
          animation: 'bookFlip 2s ease-in-out infinite'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            transform: 'perspective(100px) rotateY(0deg)'
          }}>
            📚
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '20px'
        }}>
          Preparing Your Study Plan
        </h2>
        
        <p style={{
          color: '#6B7280',
          fontSize: '1.1rem',
          marginBottom: '30px',
          lineHeight: 1.6
        }}>
          Creating your personalized learning roadmap{dots}
        </p>

        {/* Loading Bar */}
        <div style={{
          width: '300px',
          height: '6px',
          background: 'rgba(59,130,246,0.1)',
          borderRadius: '3px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            borderRadius: '3px',
            animation: 'loadingBar 2s ease-in-out infinite'
          }} />
        </div>
      </div>
      
      <style jsx="true">{`
        @keyframes bookFlip {
          0%, 100% { 
            transform: rotateY(0deg) scale(1); 
          }
          50% { 
            transform: rotateY(20deg) scale(1.05); 
          }
        }
        
        @keyframes loadingBar {
          0%, 100% { 
            transform: translateX(-100%); 
          }
          50% { 
            transform: translateX(200%); 
          }
        }
      `}</style>
    </div>
  )
}

// Weekly Plan View Component
const WeeklyPlanView = ({ weeklyPlan, completedDays, toggleDayCompletion, targetBand, getCurrentAverageBand, progress, studyTime, formatStudyTime }) => {
  const [expandedDay, setExpandedDay] = useState(null)

  return (
    <div>
      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {[
          {
            title: 'Target Band',
            value: targetBand,
            subtext: 'Goal Score',
            icon: '🎯',
            color: '#3B82F6',
            gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
          },
          {
            title: 'Current Average',
            value: getCurrentAverageBand(),
            subtext: 'Across All Skills',
            icon: '📊',
            color: '#8B5CF6',
            gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
          },
          {
            title: 'Study Time',
            value: formatStudyTime(studyTime),
            subtext: 'Total This Week',
            icon: '⏱️',
            color: '#10B981',
            gradient: 'linear-gradient(135deg, #10B981, #059669)'
          },
          {
            title: 'Completed Days',
            value: `${completedDays.length}/7`,
            subtext: 'This Week',
            icon: '✅',
            color: '#F59E0B',
            gradient: 'linear-gradient(135deg, #F59E0B, #D97706)'
          }
        ].map((stat, idx) => (
          <div
            key={stat.title}
            className="day-card-3d"
            style={{
              background: 'white',
              borderRadius: '18px',
              padding: '25px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              animation: `fadeIn 0.6s ease-out ${0.2 + idx * 0.1}s both`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '55px',
                height: '55px',
                background: stat.gradient,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                color: 'white',
                boxShadow: `0 6px 15px ${stat.color}30`
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#6B7280',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  {stat.title}
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: '#1F2937',
                  lineHeight: 1
                }}>
                  {stat.value}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: '#9CA3AF',
              fontWeight: '500'
            }}>
              {stat.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {weeklyPlan.map((day, index) => {
          const isCompleted = completedDays.includes(index)
          const isExpanded = expandedDay === index
          
          return (
            <div
              key={day.day}
              className="day-card-3d"
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: isCompleted
                  ? '0 8px 25px rgba(16, 185, 129, 0.12)'
                  : '0 8px 25px rgba(0, 0, 0, 0.06)',
                border: `1px solid ${isCompleted ? '#10B98130' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                animation: `fadeIn 0.6s ease-out ${0.4 + index * 0.1}s both`,
                position: 'relative'
              }}
              onClick={() => setExpandedDay(isExpanded ? null : index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = isCompleted
                  ? '0 15px 35px rgba(16, 185, 129, 0.2)'
                  : '0 15px 35px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = isCompleted
                  ? '0 8px 25px rgba(16, 185, 129, 0.12)'
                  : '0 8px 25px rgba(0, 0, 0, 0.06)'
              }}
            >
              {/* Completed Badge */}
              {isCompleted && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#10B981',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  <span>✓</span>
                  Completed
                </div>
              )}

              {/* Day Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: day.gradient,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    color: 'white',
                    boxShadow: `0 8px 20px ${day.color}30`
                  }}>
                    {day.icon}
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0 0 6px 0',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1F2937'
                    }}>
                      {day.day}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{
                        background: day.gradient,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {day.focus}
                      </span>
                      <span style={{
                        background: 'rgba(0,0,0,0.03)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        ⏱️ {day.duration}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Completion Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleDayCompletion(index)
                  }}
                  style={{
                    width: '44px',
                    height: '44px',
                    background: isCompleted 
                      ? '#10B981'
                      : 'rgba(0,0,0,0.04)',
                    border: `2px solid ${isCompleted ? '#10B981' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    color: isCompleted ? 'white' : '#9CA3AF',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 3
                  }}
                  onMouseEnter={(e) => {
                    if (!isCompleted) {
                      e.currentTarget.style.background = `${day.color}20`
                      e.currentTarget.style.borderColor = day.color
                      e.currentTarget.style.color = day.color
                    }
                  }}
                >
                  {isCompleted ? '✓' : '○'}
                </button>
              </div>

              {/* Tasks Section */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  margin: '0 0 15px 0',
                  fontSize: '1.1rem',
                  color: '#374151',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    background: day.color,
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    color: 'white'
                  }}>
                    {day.tasks.length}
                  </span>
                  Today's Tasks:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {day.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} style={{
                      padding: '12px',
                      background: 'rgba(0,0,0,0.02)',
                      borderRadius: '12px',
                      borderLeft: `3px solid ${day.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{
                        width: '22px',
                        height: '22px',
                        minWidth: '22px',
                        background: day.gradient,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {taskIndex + 1}
                      </div>
                      <div style={{
                        color: '#4B5563',
                        lineHeight: 1.5,
                        fontWeight: '500',
                        flex: 1,
                        fontSize: '0.95rem'
                      }}>
                        {task}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips Section (Expanded) */}
              {isExpanded && (
                <div style={{
                  marginBottom: '20px',
                  animation: 'fadeIn 0.4s ease-out'
                }}>
                  <h4 style={{
                    margin: '0 0 15px 0',
                    fontSize: '1.1rem',
                    color: '#374151',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      background: day.color,
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: 'white'
                    }}>
                      💡
                    </span>
                    Pro Tips:
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {day.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} style={{
                        padding: '10px 14px',
                        background: day.lightColor,
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        color: '#4B5563',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ color: day.color, fontSize: '1.1rem' }}>•</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '15px'
              }}>
                <Link
                  to="/tests"
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: day.gradient,
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 8px 20px ${day.color}40`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span>🚀</span>
                  Start Practice
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // View resources logic here
                  }}
                  style={{
                    padding: '14px 20px',
                    background: 'white',
                    border: `2px solid ${day.color}40`,
                    color: day.color,
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = day.lightColor
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span>📚</span>
                  Resources
                </button>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedDay(isExpanded ? null : index)
                }}
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '36px',
                  height: '36px',
                  background: 'rgba(0,0,0,0.03)',
                  border: `1px solid ${day.color}20`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: day.color,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = day.color + '10'
                }}
              >
                {isExpanded ? '↑' : '↓'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Recommendations View Component
const RecommendationsView = ({ recommendedSkills, progress, targetBand, getRecommendedTests, weakSkills }) => {
  const skillData = {
    reading: { 
      icon: '📚', 
      color: '#3B82F6',
      description: 'Improve reading speed and comprehension'
    },
    listening: { 
      icon: '🎧', 
      color: '#8B5CF6',
      description: 'Enhance listening skills and note-taking'
    },
    writing: { 
      icon: '✏️', 
      color: '#EF4444',
      description: 'Master essay structure and vocabulary'
    },
    speaking: { 
      icon: '🎤', 
      color: '#10B981',
      description: 'Build fluency and pronunciation'
    }
  }

  return (
    <div>
      {/* Focus Areas */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '35px',
        marginBottom: '40px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h2 style={{
              fontSize: '2rem',
              color: '#1F2937',
              marginBottom: '10px',
              fontWeight: '800'
            }}>
              🎯 Focus Areas
            </h2>
            <p style={{
              color: '#6B7280',
              fontSize: '1.1rem',
              maxWidth: '600px'
            }}>
              Based on your performance, these skills need attention
            </p>
          </div>
          
          <div style={{
            background: '#F0F9FF',
            padding: '15px 25px',
            borderRadius: '14px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#0369A1',
              fontWeight: '600',
              marginBottom: '5px'
            }}>
              Priority Areas
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#0369A1',
              lineHeight: 1
            }}>
              {weakSkills.length}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '25px'
        }}>
          {recommendedSkills.map((skill, idx) => {
            const currentSkill = skillData[skill] || skillData.reading
            const currentBand = progress[skill]?.averageBand?.toFixed(1) || '0.0'
            
            return (
              <div
                key={skill}
                className="day-card-3d"
                style={{
                  background: 'white',
                  borderRadius: '18px',
                  padding: '25px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.6s ease-out ${0.2 + idx * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Skill Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '65px',
                    height: '65px',
                    background: `linear-gradient(135deg, ${currentSkill.color}, ${currentSkill.color}CC)`,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'white',
                    boxShadow: `0 8px 20px ${currentSkill.color}30`
                  }}>
                    {currentSkill.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '1.6rem',
                      fontWeight: '800',
                      color: '#1F2937'
                    }}>
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </h3>
                    <div style={{
                      fontSize: '0.95rem',
                      color: currentSkill.color,
                      fontWeight: '600'
                    }}>
                      {currentSkill.description}
                    </div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  marginBottom: '25px',
                  background: 'rgba(0,0,0,0.02)',
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid rgba(0,0,0,0.03)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#6B7280',
                      fontWeight: '600',
                      marginBottom: '6px'
                    }}>
                      Current Band
                    </div>
                    <div style={{
                      fontSize: '2.2rem',
                      fontWeight: '800',
                      color: currentSkill.color,
                      lineHeight: 1
                    }}>
                      {currentBand}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#6B7280',
                      fontWeight: '600',
                      marginBottom: '6px'
                    }}>
                      Target Band
                    </div>
                    <div style={{
                      fontSize: '2.2rem',
                      fontWeight: '800',
                      color: '#059669',
                      lineHeight: 1
                    }}>
                      {targetBand}
                    </div>
                  </div>
                </div>

                {/* Suggested Tests */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{
                    margin: '0 0 15px 0',
                    fontSize: '1.1rem',
                    color: '#374151',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      background: currentSkill.color,
                      width: '26px',
                      height: '26px',
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: 'white'
                    }}>
                      📝
                    </span>
                    Recommended Tests
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {getRecommendedTests(skill).map((test, testIdx) => (
                      <div
                        key={testIdx}
                        style={{
                          padding: '14px',
                          background: 'rgba(0,0,0,0.02)',
                          borderRadius: '12px',
                          border: `1px solid ${currentSkill.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(5px)'
                          e.currentTarget.style.background = currentSkill.color + '10'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)'
                          e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: `linear-gradient(135deg, ${currentSkill.color}, ${currentSkill.color}CC)`,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          color: 'white',
                          flexShrink: 0
                        }}>
                          {testIdx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#1F2937',
                            marginBottom: '3px'
                          }}>
                            {test}
                          </div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#6B7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <span>⏱️ 40 min</span>
                            <span>•</span>
                            <span>📊 Band {targetBand - 0.5}+</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to="/tests"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '16px',
                    background: `linear-gradient(135deg, ${currentSkill.color}, ${currentSkill.color}CC)`,
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '14px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = `0 10px 25px ${currentSkill.color}40`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span>🚀</span>
                  Practice {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Study Tips */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '35px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#1F2937',
          marginBottom: '15px',
          fontWeight: '800',
          textAlign: 'center'
        }}>
          💡 Study Strategies
        </h2>
        <p style={{
          color: '#6B7280',
          fontSize: '1.1rem',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto 35px',
          lineHeight: 1.6
        }}>
          Expert techniques to maximize your learning efficiency
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              icon: '⏰',
              title: 'Time Management',
              color: '#3B82F6',
              tips: ['Use a timer for each section', 'Practice under exam conditions', 'Allocate time based on difficulty']
            },
            {
              icon: '📝',
              title: 'Active Learning',
              color: '#8B5CF6',
              tips: ['Take notes while studying', 'Teach concepts to others', 'Create mind maps and summaries']
            },
            {
              icon: '🔄',
              title: 'Consistency',
              color: '#10B981',
              tips: ['Study 30-60 minutes daily', 'Review previous lessons', 'Maintain a study schedule']
            },
            {
              icon: '🎯',
              title: 'Focus Practice',
              color: '#EF4444',
              tips: ['Target weak areas specifically', 'Use focused practice sessions', 'Track progress in each skill']
            }
          ].map((strategy, idx) => (
            <div
              key={strategy.title}
              className="day-card-3d"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${strategy.color}20`,
                transition: 'all 0.3s ease',
                textAlign: 'center',
                animation: `fadeIn 0.6s ease-out ${0.3 + idx * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${strategy.color}, ${strategy.color}CC)`,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                margin: '0 auto 20px auto',
                color: 'white',
                boxShadow: `0 8px 20px ${strategy.color}30`
              }}>
                {strategy.icon}
              </div>
              <h4 style={{
                margin: '0 0 15px 0',
                fontSize: '1.3rem',
                color: '#1F2937',
                fontWeight: '700'
              }}>
                {strategy.title}
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                textAlign: 'left'
              }}>
                {strategy.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} style={{
                    fontSize: '0.95rem',
                    color: '#4B5563',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <span style={{
                      color: strategy.color,
                      fontWeight: 'bold',
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      •
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Analytics View Component
const AnalyticsView = ({ progress, targetBand, weakSkills, calculateWeeklyProgress, getCurrentAverageBand, completedDays, studyTime, formatStudyTime }) => {
  const totalTests = Object.values(progress).reduce((sum, data) => sum + (data.testsTaken || 0), 0)
  
  return (
    <div>
      {/* Performance Overview */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '35px',
        marginBottom: '40px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#1F2937',
          marginBottom: '15px',
          fontWeight: '800',
          textAlign: 'center'
        }}>
          📊 Performance Analytics
        </h2>
        <p style={{
          color: '#6B7280',
          fontSize: '1.1rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 35px',
          lineHeight: 1.6
        }}>
          Track your learning journey and progress metrics
        </p>
        
        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            {
              title: 'Overall Progress',
              value: `${calculateWeeklyProgress()}%`,
              icon: '📈',
              color: '#3B82F6'
            },
            {
              title: 'Average Band',
              value: getCurrentAverageBand(),
              icon: '🏆',
              color: '#8B5CF6'
            },
            {
              title: 'Tests Completed',
              value: totalTests,
              icon: '✅',
              color: '#10B981'
            },
            {
              title: 'Study Time',
              value: formatStudyTime(studyTime),
              icon: '⏱️',
              color: '#F59E0B'
            }
          ].map((metric, idx) => (
            <div
              key={metric.title}
              className="day-card-3d"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${metric.color}20`,
                transition: 'all 0.3s ease',
                textAlign: 'center',
                animation: `fadeIn 0.6s ease-out ${0.2 + idx * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = `0 12px 25px ${metric.color}20`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                width: '55px',
                height: '55px',
                background: `linear-gradient(135deg, ${metric.color}, ${metric.color}CC)`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                margin: '0 auto 15px auto',
                color: 'white',
                boxShadow: `0 6px 15px ${metric.color}30`
              }}>
                {metric.icon}
              </div>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: '800',
                color: '#1F2937',
                lineHeight: 1,
                marginBottom: '8px'
              }}>
                {metric.value}
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#6B7280',
                fontWeight: '600'
              }}>
                {metric.title}
              </div>
            </div>
          ))}
        </div>

        {/* Skill Distribution */}
        <div style={{
          background: 'rgba(0,0,0,0.02)',
          borderRadius: '18px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid rgba(0,0,0,0.03)'
        }}>
          <h3 style={{
            margin: '0 0 25px 0',
            fontSize: '1.6rem',
            fontWeight: '800',
            color: '#1F2937',
            textAlign: 'center'
          }}>
            📊 Skill Distribution
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {Object.entries(progress).map(([skill, data], idx) => {
              const colorMap = {
                reading: '#3B82F6',
                listening: '#8B5CF6',
                writing: '#EF4444',
                speaking: '#10B981'
              }
              const color = colorMap[skill]
              const testsTaken = data.testsTaken || 0
              const avgBand = data.averageBand?.toFixed(1) || '0.0'
              const progressWidth = Math.min((testsTaken / 10) * 100, 100)
              
              return (
                <div key={skill} style={{
                  padding: '20px',
                  background: 'white',
                  borderRadius: '14px',
                  border: `1px solid ${color}20`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        color: 'white'
                      }}>
                        {skill === 'reading' ? '📚' :
                         skill === 'listening' ? '🎧' :
                         skill === 'writing' ? '✏️' : '🎤'}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#1F2937',
                          marginBottom: '2px'
                        }}>
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#6B7280'
                        }}>
                          {testsTaken} tests • Band {avgBand}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: color,
                        lineHeight: 1
                      }}>
                        {progressWidth}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{
                    height: '8px',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: `${progressWidth}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                      borderRadius: '4px',
                      transition: 'width 1.5s ease-out'
                    }} />
                  </div>
                  
                  {/* Band Comparison */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    color: '#6B7280'
                  }}>
                    <div>
                      <span>Current: </span>
                      <strong style={{ color }}>Band {avgBand}</strong>
                    </div>
                    <div>
                      <span>Target: </span>
                      <strong style={{ color: '#059669' }}>Band {targetBand}</strong>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Study Activity */}
        <div>
          <h3 style={{
            margin: '0 0 25px 0',
            fontSize: '1.6rem',
            fontWeight: '800',
            color: '#1F2937',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            📅 Study Activity
          </h3>
          
          {/* Weekly Activity */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '25px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))',
            borderRadius: '16px',
            border: '1px solid rgba(59,130,246,0.1)'
          }}>
            <div>
              <div style={{
                fontSize: '1.1rem',
                color: '#3B82F6',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📅</span>
                This Week's Progress
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: '#1F2937',
                lineHeight: 1
              }}>
                {completedDays.length}/7 days
              </div>
            </div>
            <div style={{
              textAlign: 'center'
            }}>
              <CircularProgress 
                progress={calculateWeeklyProgress()} 
                size={90}
              />
            </div>
          </div>
          
          {/* Activity Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            {[
              { label: 'Daily Average', value: '45 min', color: '#3B82F6' },
              { label: 'Practice Tests', value: totalTests, color: '#8B5CF6' },
              { label: 'Vocabulary', value: '150 words', color: '#10B981' },
              { label: 'Accuracy', value: '78%', color: '#F59E0B' }
            ].map((item, idx) => (
              <div key={item.label} style={{
                padding: '20px',
                background: 'white',
                borderRadius: '14px',
                border: `1px solid ${item.color}20`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#6B7280',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  color: item.color,
                  lineHeight: 1
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Resources View Component
const ResourcesView = () => {
  const resources = [
    {
      category: 'Reading',
      icon: '📚',
      color: '#3B82F6',
      items: [
        { title: 'Academic Reading Practice', type: 'PDF', size: '2.4 MB' },
        { title: 'Vocabulary Builder', type: 'Interactive', size: 'Online' },
        { title: 'Speed Reading Exercises', type: 'Video', size: '15 min' }
      ]
    },
    {
      category: 'Listening',
      icon: '🎧',
      color: '#8B5CF6',
      items: [
        { title: 'Accent Training Modules', type: 'Audio', size: '45 min' },
        { title: 'Note-taking Practice', type: 'Interactive', size: 'Online' },
        { title: 'Practice Tests Collection', type: 'PDF', size: '3.1 MB' }
      ]
    },
    {
      category: 'Writing',
      icon: '✏️',
      color: '#EF4444',
      items: [
        { title: 'Essay Templates', type: 'PDF', size: '1.8 MB' },
        { title: 'Grammar Guide', type: 'Interactive', size: 'Online' },
        { title: 'Sample Answers', type: 'PDF', size: '2.2 MB' }
      ]
    },
    {
      category: 'Speaking',
      icon: '🎤',
      color: '#10B981',
      items: [
        { title: 'Pronunciation Exercises', type: 'Video', size: '30 min' },
        { title: 'Speaking Topics', type: 'PDF', size: '1.5 MB' },
        { title: 'Mock Test Videos', type: 'Video', size: '60 min' }
      ]
    }
  ]

  return (
    <div>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '35px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#1F2937',
          marginBottom: '15px',
          fontWeight: '800',
          textAlign: 'center'
        }}>
          📚 Study Resources
        </h2>
        <p style={{
          color: '#6B7280',
          fontSize: '1.1rem',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto 35px',
          lineHeight: 1.6
        }}>
          Premium study materials and resources to accelerate your learning
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          {resources.map((category, idx) => (
            <div
              key={category.category}
              className="day-card-3d"
              style={{
                background: 'white',
                borderRadius: '18px',
                padding: '25px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${category.color}20`,
                transition: 'all 0.3s ease',
                animation: `fadeIn 0.6s ease-out ${0.2 + idx * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${category.color}, ${category.color}CC)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  color: 'white',
                  boxShadow: `0 8px 20px ${category.color}30`
                }}>
                  {category.icon}
                </div>
                <div>
                  <h3 style={{
                    margin: '0 0 6px 0',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#1F2937'
                  }}>
                    {category.category}
                  </h3>
                  <div style={{
                    fontSize: '0.95rem',
                    color: '#6B7280',
                    fontWeight: '500'
                  }}>
                    {category.items.length} resources available
                  </div>
                </div>
              </div>

              {/* Resources List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '25px'
              }}>
                {category.items.map((resource, resIdx) => (
                  <div
                    key={resource.title}
                    style={{
                      padding: '16px',
                      background: 'rgba(0,0,0,0.02)',
                      borderRadius: '12px',
                      border: `1px solid ${category.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(5px)'
                      e.currentTarget.style.background = category.color + '10'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)'
                      e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{
                      width: '45px',
                      height: '45px',
                      background: category.color + '20',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      color: category.color,
                      flexShrink: 0
                    }}>
                      {resource.type === 'PDF' ? '📄' :
                       resource.type === 'Video' ? '🎥' :
                       resource.type === 'Audio' ? '🎵' : '🖥️'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '1.05rem',
                        fontWeight: '600',
                        color: '#1F2937',
                        marginBottom: '4px'
                      }}>
                        {resource.title}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.85rem',
                        color: '#6B7280'
                      }}>
                        <span style={{
                          background: category.color + '15',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}>
                          {resource.type}
                        </span>
                        <span>📦 {resource.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <button style={{
                width: '100%',
                padding: '14px',
                background: category.color + '10',
                border: `2px solid ${category.color}30`,
                color: category.color,
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = category.color
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = category.color + '10'
                e.currentTarget.style.color = category.color
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <span>📚</span>
                View All Resources
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudyPlan
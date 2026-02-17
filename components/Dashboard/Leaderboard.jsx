import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [timeframe, setTimeframe] = useState('weekly')
  const [category, setCategory] = useState('overall')
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { user } = useAuth()
  
  const containerRef = useRef(null)
  const particlesRef = useRef([])
  const cardsRef = useRef([])
  const topCardsRef = useRef([])

  useEffect(() => {
    // Mouse tracking for 3D effects
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Initial loading animation
    const timer = setTimeout(() => {
      // Simulate leaderboard data
      const mockLeaderboard = [
        { 
          id: 1, 
          name: 'Sarah Chen', 
          score: 8.5, 
          tests: 15, 
          improvement: 1.2,
          avatar: 'SC',
          country: '🇨🇳',
          streak: 12
        },
        { 
          id: 2, 
          name: 'Marcus Johnson', 
          score: 8.2, 
          tests: 12, 
          improvement: 0.8,
          avatar: 'MJ',
          country: '🇺🇸',
          streak: 8
        },
        { 
          id: 3, 
          name: 'Aisha Rahman', 
          score: 8.0, 
          tests: 18, 
          improvement: 1.5,
          avatar: 'AR',
          country: '🇸🇦',
          streak: 15
        },
        { 
          id: 4, 
          name: 'David Kim', 
          score: 7.8, 
          tests: 10, 
          improvement: 0.5,
          avatar: 'DK',
          country: '🇰🇷',
          streak: 6
        },
        { 
          id: 5, 
          name: 'You', 
          score: 7.5, 
          tests: 8, 
          improvement: 0.3,
          avatar: user?.firstName?.charAt(0) || 'U',
          country: '🌍',
          streak: 3,
          isCurrentUser: true
        },
        { 
          id: 6, 
          name: 'Emma Wilson', 
          score: 7.4, 
          tests: 14, 
          improvement: 0.9,
          avatar: 'EW',
          country: '🇬🇧',
          streak: 9
        },
        { 
          id: 7, 
          name: 'Carlos Rodriguez', 
          score: 7.3, 
          tests: 11, 
          improvement: 0.7,
          avatar: 'CR',
          country: '🇪🇸',
          streak: 7
        },
        { 
          id: 8, 
          name: 'Priya Patel', 
          score: 7.2, 
          tests: 16, 
          improvement: 1.1,
          avatar: 'PP',
          country: '🇮🇳',
          streak: 11
        }
      ]
      setLeaderboard(mockLeaderboard)
      setIsLoading(false)
      
      // Start animations after load
      startParticlesAnimation()
      startCardsAnimation()
    }, 1800)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleMouseMove)
      particlesRef.current.forEach(p => clearInterval(p.interval))
    }
  }, [timeframe, category, user])

  const startParticlesAnimation = () => {
    const container = containerRef.current
    if (!container) return

    particlesRef.current = []
    
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement('div')
      const size = 2 + Math.random() * 4
      const colors = ['#1e90ff', '#00bfff', '#87cefa', '#4682b4', '#4169e1']
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        filter: blur(${size/2}px);
        opacity: 0;
        z-index: 1;
        pointer-events: none;
      `
      
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      container.appendChild(particle)
      
      const animation = {
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        size: size
      }
      
      const interval = setInterval(() => {
        animation.x += animation.vx
        animation.y += animation.vy
        
        if (animation.x > 100) animation.x = 0
        if (animation.x < 0) animation.x = 100
        if (animation.y > 100) animation.y = 0
        if (animation.y < 0) animation.y = 100
        
        particle.style.left = `${animation.x}%`
        particle.style.top = `${animation.y}%`
        
        // 3D rotation based on mouse
        const rotateX = mousePosition.y * 5
        const rotateY = mousePosition.x * 5
        particle.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${size}px)`
      }, 50)
      
      particlesRef.current.push({ ...animation, interval })
      
      // Fade in animation
      setTimeout(() => {
        particle.style.opacity = animation.opacity
        particle.style.transition = 'opacity 1s ease'
      }, i * 100)
    }
  }

  const startCardsAnimation = () => {
    // Animate top cards
    topCardsRef.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          card.style.opacity = '1'
          card.style.transform = 'translateY(0) rotateX(0) rotateY(0)'
          card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }, index * 200)
      }
    })
    
    // Animate list cards
    cardsRef.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          card.style.opacity = '1'
          card.style.transform = 'translateX(0) rotateX(0)'
          card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }, index * 100 + 600)
      }
    })
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return { icon: '🥇', color: '#FFD700', bgColor: '#FFF9C4' }
      case 2: return { icon: '🥈', color: '#C0C0C0', bgColor: '#F5F5F5' }
      case 3: return { icon: '🥉', color: '#CD7F32', bgColor: '#FFE0B2' }
      default: return { icon: `#${rank}`, color: '#6B7280', bgColor: '#F8FAFC' }
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return '#16A34A'
    if (score >= 7.5) return '#22C55E'
    if (score >= 7) return '#EAB308'
    if (score >= 6.5) return '#F97316'
    return '#EF4444'
  }

  const currentUserRank = leaderboard.findIndex(item => item.isCurrentUser) + 1

  // Hero background with 3D perspective
  const heroStyle = {
    position: 'relative',
    padding: '100px 0 60px',
    background: `
      radial-gradient(circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, 
        rgba(30, 144, 255, 0.15) 0%, 
        rgba(135, 206, 250, 0.1) 25%, 
        rgba(240, 248, 255, 0.05) 50%, 
        transparent 70%
      ),
  
    `,
    minHeight: '100vh',
    overflow: 'hidden',
    perspective: '1000px',
    transformStyle: 'preserve-3d'
  }

  // 3D Loading component
  const LoadingSection = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      perspective: '1000px',
      transformStyle: 'preserve-3d'
    }}>
      {/* 3D Rotating Logo */}
      <div style={{
        width: '100px',
        height: '100px',
        marginBottom: '40px',
        transformStyle: 'preserve-3d',
        animation: 'rotate3D 8s infinite linear'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e90ff, #00bfff, #87cefa)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: `
            0 20px 40px rgba(30, 144, 255, 0.4),
            inset 0 0 60px rgba(255, 255, 255, 0.3)
          `,
          border: '2px solid rgba(255, 255, 255, 0.5)',
          transform: 'translateZ(20px)'
        }}>
          EP
        </div>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(30, 144, 255, 0.2)',
          borderRadius: '20px',
          filter: 'blur(20px)',
          transform: 'translateZ(-20px)'
        }} />
      </div>
      
      {/* Text with shimmer effect */}
      <div style={{
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '20px',
        position: 'relative',
        display: 'inline-block'
      }}>
        <span style={{ 
          color: '#1a365d',
          opacity: 0.8,
          filter: `blur(${Math.abs(mousePosition.x) * 2}px)`
        }}>Loading</span>
        {' '}
        <span style={{
          background: 'linear-gradient(90deg, #1e90ff, #00bfff, #87cefa, #1e90ff)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 3s infinite linear'
        }}>
          Leaderboard
        </span>
      </div>
      
      {/* 3D Progress ring */}
      <div style={{
        width: '200px',
        height: '200px',
        position: 'relative',
        margin: '30px auto'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: '4px solid rgba(30, 144, 255, 0.1)',
          borderTopColor: '#1e90ff',
          animation: 'spin 1.5s linear infinite',
          transformStyle: 'preserve-3d'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(60deg)',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          border: '3px solid rgba(0, 191, 255, 0.1)',
          borderRightColor: '#00bfff',
          animation: 'spin 2s linear infinite reverse',
          transformStyle: 'preserve-3d'
        }} />
      </div>
      
      {/* Floating dots */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginTop: '30px'
      }}>
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            style={{
              width: '20px',
              height: '20px',
              background: `linear-gradient(135deg, #1e90ff, #00bfff)`,
              borderRadius: '50%',
              animation: `float3D 2s ease-in-out infinite ${i * 0.3}s`,
              boxShadow: '0 10px 20px rgba(30, 144, 255, 0.4)',
              transformStyle: 'preserve-3d'
            }}
          />
        ))}
      </div>
    </div>
  )

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes rotate3D {
        0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        33% { transform: rotateX(20deg) rotateY(120deg) rotateZ(10deg); }
        66% { transform: rotateX(-10deg) rotateY(240deg) rotateZ(-5deg); }
        100% { transform: rotateX(0deg) rotateY(360deg) rotateZ(0deg); }
      }
      
      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 300% 50%; }
      }
      
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      @keyframes float3D {
        0%, 100% { 
          transform: translateY(0px) translateZ(0px) rotateX(0deg); 
          opacity: 0.5;
        }
        50% { 
          transform: translateY(-30px) translateZ(20px) rotateX(20deg); 
          opacity: 1;
        }
      }
      
      @keyframes glowPulse {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(30, 144, 255, 0.3),
                     0 0 40px rgba(30, 144, 255, 0.2),
                     0 0 60px rgba(30, 144, 255, 0.1);
        }
        50% { 
          box-shadow: 0 0 30px rgba(30, 144, 255, 0.5),
                     0 0 60px rgba(30, 144, 255, 0.3),
                     0 0 90px rgba(30, 144, 255, 0.2);
        }
      }
      
      @keyframes cardFloat {
        0%, 100% { transform: translateY(0px) rotateX(0deg); }
        50% { transform: translateY(-10px) rotateX(5deg); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (isLoading) {
    return (
      <section style={heroStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>
          <LoadingSection />
        </div>
      </section>
    )
  }

  return (
    <section style={heroStyle} ref={containerRef}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 30px', 
        position: 'relative', 
        zIndex: 2,
        transformStyle: 'preserve-3d'
      }}>
        
        {/* Header with 3D effect */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          transform: `translateZ(${mousePosition.y * 20}px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
          transition: 'transform 0.1s linear'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #1e90ff, #00bfff)',
            padding: '15px 40px',
            borderRadius: '50px',
            display: 'inline-block',
            marginBottom: '30px',
            boxShadow: '0 15px 35px rgba(30, 144, 255, 0.4)',
            transformStyle: 'preserve-3d',
            animation: 'glowPulse 3s infinite'
          }}>
            <span style={{
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              letterSpacing: '2px'
            }}>
              <i className="fas fa-trophy" style={{ transform: 'rotateY(20deg)' }}></i>
              GLOBAL LEADERBOARD
              <i className="fas fa-trophy" style={{ transform: 'rotateY(-20deg)' }}></i>
            </span>
          </div>
          
          <h2 style={{
            fontSize: 'clamp(2.8rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '15px',
            textShadow: `2px 2px 4px rgba(0,0,0,0.1),
                         ${mousePosition.x * 5}px ${mousePosition.y * 5}px 10px rgba(30, 144, 255, 0.2)`
          }}>
            <span style={{
              background: 'linear-gradient(90deg, #1a365d, #1a365d 50%, #1e90ff 50%, #00bfff)',
              backgroundSize: '200% 100%',
              backgroundPosition: `${mousePosition.x * 10 + 50}% 0`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              transition: 'background-position 0.3s ease'
            }}>
              Compete with IELTS Learners
            </span>
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#4a5568',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            transform: `translateZ(${mousePosition.y * 10}px)`,
            transition: 'transform 0.1s linear'
          }}>
            Track your progress in 3D and see how you stack up worldwide
          </p>
        </div>

        {/* Controls with 3D tilt */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '50px',
          boxShadow: `
            0 25px 50px -12px rgba(30, 144, 255, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.5)
          `,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${mousePosition.y * 0.5}deg) 
            rotateY(${mousePosition.x * 0.5}deg)
            translateZ(${mousePosition.y * 5}px)
          `,
          transition: 'transform 0.3s ease'
        }}>
          {/* Controls content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Timeframe controls */}
            <div>
              <h3 style={{ 
                color: '#1a365d', 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: 'white',
                  transform: `rotateY(${mousePosition.x * 10}deg)`,
                  transition: 'transform 0.3s ease'
                }}>
                  <i className="fas fa-calendar-alt"></i>
                </div>
                Timeframe
              </h3>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                {[
                  { key: 'weekly', icon: '📅', label: 'This Week' },
                  { key: 'monthly', icon: '🗓️', label: 'This Month' },
                  { key: 'alltime', icon: '⭐', label: 'All Time' }
                ].map((time) => (
                  <button
                    key={time.key}
                    onClick={() => setTimeframe(time.key)}
                    style={{
                      flex: 1,
                      background: timeframe === time.key 
                        ? 'linear-gradient(135deg, #1e90ff, #00bfff)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      color: timeframe === time.key ? 'white' : '#4a5568',
                      border: `2px solid ${timeframe === time.key ? 'transparent' : 'rgba(30, 144, 255, 0.2)'}`,
                      padding: '15px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                      transformStyle: 'preserve-3d',
                      transform: timeframe === time.key 
                        ? `translateZ(20px) rotateX(${mousePosition.y * 2}deg)` 
                        : 'translateZ(0)',
                      boxShadow: timeframe === time.key 
                        ? `0 15px 30px rgba(30, 144, 255, 0.4)` 
                        : '0 5px 15px rgba(30, 144, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      if (timeframe !== time.key) {
                        e.currentTarget.style.transform = 'translateZ(10px)'
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(30, 144, 255, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (timeframe !== time.key) {
                        e.currentTarget.style.transform = 'translateZ(0)'
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(30, 144, 255, 0.1)'
                      }
                    }}
                  >
                    <span style={{ fontSize: '24px', transform: `rotateY(${mousePosition.x * 15}deg)` }}>
                      {time.icon}
                    </span>
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category controls */}
            <div>
              <h3 style={{ 
                color: '#1a365d', 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #00bfff, #87cefa)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: 'white',
                  transform: `rotateY(${mousePosition.x * 10}deg)`,
                  transition: 'transform 0.3s ease'
                }}>
                  <i className="fas fa-bullseye"></i>
                </div>
                Category
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { key: 'overall', icon: '🏆', label: 'Overall' },
                  { key: 'speaking', icon: '🎤', label: 'Speaking' },
                  { key: 'listening', icon: '🎧', label: 'Listening' },
                  { key: 'reading', icon: '📚', label: 'Reading' },
                  { key: 'writing', icon: '✏️', label: 'Writing' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    style={{
                      background: category === cat.key 
                        ? 'linear-gradient(135deg, #00bfff, #87cefa)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      color: category === cat.key ? 'white' : '#4a5568',
                      border: `2px solid ${category === cat.key ? 'transparent' : 'rgba(0, 191, 255, 0.2)'}`,
                      padding: '12px 15px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transformStyle: 'preserve-3d',
                      transform: category === cat.key 
                        ? `translateZ(15px) rotateX(${mousePosition.y * 2}deg)` 
                        : 'translateZ(0)',
                      boxShadow: category === cat.key 
                        ? `0 10px 25px rgba(0, 191, 255, 0.4)` 
                        : '0 5px 15px rgba(0, 191, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      if (category !== cat.key) {
                        e.currentTarget.style.transform = 'translateZ(8px) rotateX(5deg)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 191, 255, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (category !== cat.key) {
                        e.currentTarget.style.transform = 'translateZ(0) rotateX(0)'
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 191, 255, 0.1)'
                      }
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Winners with 3D Cards */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            color: '#1a365d', 
            fontSize: '2rem', 
            fontWeight: '700', 
            marginBottom: '30px',
            textAlign: 'center',
            transform: `translateZ(${mousePosition.y * 15}px)`,
            transition: 'transform 0.1s linear'
          }}>
            🎉 Top Performers
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '30px',
            transformStyle: 'preserve-3d'
          }}>
            {leaderboard.slice(0, 3).map((userItem, index) => {
              const rank = index + 1
              const rankInfo = getRankIcon(rank)
              
              return (
                <div 
                  key={userItem.id}
                  ref={el => topCardsRef.current[index] = el}
                  style={{
                    opacity: 0,
                    transform: 'translateY(50px) rotateX(-30deg)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '35px 30px',
                    boxShadow: `
                      0 25px 50px -12px ${rankInfo.color}40,
                      0 0 0 1px rgba(255, 255, 255, 0.5)
                    `,
                    border: `2px solid ${rankInfo.color}50`,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transformStyle: 'preserve-3d',
                    animation: index === 1 ? 'cardFloat 4s ease-in-out infinite' : 'none',
                    animationDelay: index === 1 ? '1s' : '0s'
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const centerX = rect.width / 2
                    const centerY = rect.height / 2
                    
                    const rotateY = ((x - centerX) / centerX) * 15
                    const rotateX = ((centerY - y) / centerY) * -15
                    
                    e.currentTarget.style.transform = `
                      perspective(1000px) 
                      rotateX(${rotateX}deg) 
                      rotateY(${rotateY}deg)
                      scale3d(1.05, 1.05, 1.05)
                    `
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `
                      perspective(1000px) 
                      rotateX(0deg) 
                      rotateY(0deg)
                      scale3d(1, 1, 1)
                    `
                    e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  {/* 3D Rank Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '-25px',
                    width: '80px',
                    height: '80px',
                    background: rankInfo.bgColor,
                    color: rankInfo.color,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    boxShadow: `0 15px 35px ${rankInfo.color}50`,
                    transform: `rotate(-45deg) translateZ(30px)`,
                    zIndex: 2
                  }}>
                    {rankInfo.icon}
                  </div>
                  
                  {/* 3D Avatar */}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 25px',
                    position: 'relative',
                    transformStyle: 'preserve-3d'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: 'white',
                      boxShadow: `0 20px 40px rgba(30, 144, 255, 0.4)`,
                      transform: 'translateZ(40px)',
                      transition: 'transform 0.3s ease'
                    }}>
                      {userItem.avatar}
                    </div>
                    
                    {/* Avatar shadow */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      right: '10px',
                      bottom: '10px',
                      background: 'rgba(30, 144, 255, 0.3)',
                      borderRadius: '20px',
                      filter: 'blur(20px)',
                      transform: 'translateZ(20px)',
                      zIndex: -1
                    }} />
                  </div>
                  
                  <h3 style={{ 
                    color: '#1a365d', 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    marginBottom: '15px',
                    transform: 'translateZ(30px)'
                  }}>
                    {userItem.name}
                  </h3>
                  
                  {/* 3D Score Circle */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 25px',
                    position: 'relative',
                    transformStyle: 'preserve-3d'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `conic-gradient(${getScoreColor(userItem.score)} 0% 80%, rgba(30, 144, 255, 0.1) 80% 100%)`,
                      borderRadius: '50%',
                      transform: 'translateZ(25px)',
                      boxShadow: `0 15px 35px ${getScoreColor(userItem.score)}40`
                    }} />
                    
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      right: '10px',
                      bottom: '10px',
                      background: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'translateZ(50px)',
                      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.5)'
                    }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: '800', 
                        color: getScoreColor(userItem.score) 
                      }}>
                        {userItem.score}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#718096', 
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        Band
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px',
                    transform: 'translateZ(20px)'
                  }}>
                    {[
                      { icon: '📊', value: userItem.tests, label: 'Tests' },
                      { icon: '📈', value: `+${userItem.improvement}`, label: 'Improve' },
                      { icon: '🔥', value: userItem.streak, label: 'Streak' }
                    ].map((stat, idx) => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', marginBottom: '5px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a365d' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Leaderboard List with 3D items */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '50px',
          boxShadow: `
            0 25px 50px -12px rgba(30, 144, 255, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.5)
          `,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          transformStyle: 'preserve-3d'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#1a365d', 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              marginBottom: '10px',
              transform: `translateZ(${mousePosition.y * 10}px)`,
              transition: 'transform 0.1s linear'
            }}>
              📋 Global Rankings
            </h2>
            <p style={{ 
              color: '#718096', 
              fontSize: '15px',
              transform: `translateZ(${mousePosition.y * 5}px)`,
              transition: 'transform 0.1s linear'
            }}>
              See how you stack up in 3D
            </p>
          </div>
          
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: '15px', overflow: 'hidden' }}>
            {leaderboard.slice(3).map((userItem, index) => {
              const rank = index + 4
              const rankInfo = getRankIcon(rank)
              const isCurrentUser = userItem.isCurrentUser
              
              return (
                <div 
                  key={userItem.id}
                  ref={el => cardsRef.current[index] = el}
                  style={{
                    opacity: 0,
                    transform: 'translateX(-50px) rotateX(-20deg)',
                    display: 'grid',
                    gridTemplateColumns: '70px 1fr 120px',
                    alignItems: 'center',
                    padding: '25px 30px',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
                    background: isCurrentUser 
                      ? 'linear-gradient(90deg, rgba(30, 144, 255, 0.15), rgba(135, 206, 250, 0.08))' 
                      : 'transparent',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    transformStyle: 'preserve-3d'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateZ(20px) rotateX(5deg)'
                    e.currentTarget.style.background = isCurrentUser
                      ? 'linear-gradient(90deg, rgba(30, 144, 255, 0.2), rgba(135, 206, 250, 0.1))'
                      : 'rgba(255, 255, 255, 0.7)'
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(30, 144, 255, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateZ(0) rotateX(0deg)'
                    e.currentTarget.style.background = isCurrentUser
                      ? 'linear-gradient(90deg, rgba(30, 144, 255, 0.15), rgba(135, 206, 250, 0.08))'
                      : 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Rank with 3D effect */}
                  <div style={{ textAlign: 'center', transformStyle: 'preserve-3d' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      margin: '0 auto',
                      background: rankInfo.bgColor,
                      color: rankInfo.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '700',
                      boxShadow: `0 8px 20px ${rankInfo.color}30`,
                      transform: 'translateZ(15px)',
                      transition: 'transform 0.3s ease'
                    }}>
                      {rankInfo.icon}
                    </div>
                  </div>
                  
                  {/* User info with 3D avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', transformStyle: 'preserve-3d' }}>
                    <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
                      <div style={{
                        width: '55px',
                        height: '55px',
                        background: isCurrentUser 
                          ? 'linear-gradient(135deg, #1e90ff, #00bfff)' 
                          : '#f1f5f9',
                        color: isCurrentUser ? 'white' : '#1a365d',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        transform: 'translateZ(20px)',
                        boxShadow: isCurrentUser 
                          ? '0 10px 25px rgba(30, 144, 255, 0.4)' 
                          : '0 5px 15px rgba(30, 144, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}>
                        {userItem.avatar}
                      </div>
                      
                      {/* Streak indicator */}
                      {userItem.streak > 7 && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#f97316',
                          color: 'white',
                          fontSize: '10px',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          transform: 'translateZ(25px)',
                          boxShadow: '0 5px 15px rgba(249, 115, 22, 0.4)'
                        }}>
                          🔥 {userItem.streak}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ transform: 'translateZ(10px)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                        <h4 style={{ color: '#1a365d', fontSize: '17px', fontWeight: '600', margin: 0 }}>
                          {userItem.name}
                        </h4>
                        <span style={{ fontSize: '20px', transform: 'translateZ(5px)' }}>{userItem.country}</span>
                        {isCurrentUser && (
                          <span style={{
                            background: 'linear-gradient(90deg, #1e90ff, #00bfff)',
                            color: 'white',
                            fontSize: '12px',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            transform: 'translateZ(15px)',
                            boxShadow: '0 5px 15px rgba(30, 144, 255, 0.4)'
                          }}>
                            You
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#718096' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>📊</span>
                          {userItem.tests} tests
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>📈</span>
                          +{userItem.improvement} improvement
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score with 3D effect */}
                  <div style={{ textAlign: 'right', transformStyle: 'preserve-3d' }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${getScoreColor(userItem.score)}, ${getScoreColor(userItem.score)}80)`,
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      boxShadow: `0 10px 25px ${getScoreColor(userItem.score)}40`,
                      transform: 'translateZ(25px)',
                      transition: 'transform 0.3s ease'
                    }}>
                      <div style={{ fontSize: '22px', fontWeight: '800' }}>{userItem.score}</div>
                      <div style={{ fontSize: '12px', opacity: 0.9, letterSpacing: '1px' }}>BAND SCORE</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivation Section with 3D */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '50px',
          boxShadow: `
            0 25px 50px -12px rgba(30, 144, 255, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.5)
          `,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${mousePosition.y * 0.3}deg) 
            rotateY(${mousePosition.x * 0.3}deg)
            translateZ(${mousePosition.y * 10}px)
          `,
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {/* 3D Icon */}
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: 'white',
              flexShrink: 0,
              boxShadow: '0 20px 40px rgba(30, 144, 255, 0.4)',
              transform: `
                rotateX(${mousePosition.y * 10}deg) 
                rotateY(${mousePosition.x * 10}deg)
                translateZ(${mousePosition.y * 20}px)
              `,
              transition: 'transform 0.3s ease'
            }}>
              🚀
            </div>
            
            <div style={{ flex: '1' }}>
              <h3 style={{ 
                color: '#1a365d', 
                fontSize: '1.8rem', 
                fontWeight: '700', 
                marginBottom: '15px',
                background: 'linear-gradient(90deg, #1a365d, #1e90ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Keep Pushing Forward! 💪
              </h3>
              <p style={{ 
                color: '#4a5568', 
                lineHeight: '1.6', 
                fontSize: '16px', 
                marginBottom: '25px',
                transform: `translateZ(${mousePosition.y * 5}px)`,
                transition: 'transform 0.1s linear'
              }}>
                {currentUserRank <= 3 
                  ? "Amazing! You're crushing it! Stay at the top! 🎉"
                  : currentUserRank <= 5
                  ? "You're so close to the podium! One more test could get you there! ⭐"
                  : currentUserRank <= 10
                  ? "Great progress! Keep practicing to break into the top 5! 🔥"
                  : "Every test brings you closer to your goals. Stay consistent and watch your rank improve! ✨"
                }
              </p>
              <button style={{
                background: 'linear-gradient(90deg, #1e90ff, #00bfff)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 15px 35px rgba(30, 144, 255, 0.4)',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(0)',
                position: 'relative',
                overflow: 'hidden'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateZ(20px) scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(30, 144, 255, 0.6)'
                  
                  // Create ripple effect
                  const ripple = document.createElement('span')
                  ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                  `
                  const rect = e.currentTarget.getBoundingClientRect()
                  const size = Math.max(rect.width, rect.height)
                  const x = e.clientX - rect.left - size/2
                  const y = e.clientY - rect.top - size/2
                  
                  ripple.style.width = ripple.style.height = `${size}px`
                  ripple.style.left = `${x}px`
                  ripple.style.top = `${y}px`
                  
                  e.currentTarget.appendChild(ripple)
                  setTimeout(() => ripple.remove(), 600)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateZ(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(30, 144, 255, 0.4)'
                }}
              >
                <i className="fas fa-play-circle" style={{ fontSize: '20px' }}></i>
                Take Practice Test
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Add ripple animation */}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

export default Leaderboard
import React, { useState } from 'react'
import { useTests } from '../../contexts/TestContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, OrbitControls } from '@react-three/drei'

// 3D Test Card komponenti
function TestCard3D({ title, position, onClick }) {
  const meshRef = React.useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
  })

  return (
    <group position={position} onClick={onClick}>
      <Float speed={2} rotationIntensity={1}>
        <mesh ref={meshRef}>
          <boxGeometry args={[2, 1.5, 0.2]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            metalness={0.8}
            roughness={0.2}
            emissive="#1e40af"
            emissiveIntensity={0.2}
          />
        </mesh>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.05}
          position={[-0.8, 0.3, 0.11]}
        >
          {title}
          <meshNormalMaterial />
        </Text3D>
      </Float>
    </group>
  )
}

const TestList = () => {
  const { startTest, hoverSound, clickSound } = useTests()
  const [hoveredCard, setHoveredCard] = useState(null)
  
  const tests = [
    {
      id: 'ielts17-t1',
      title: 'IELTS 17 TEST 1',
      type: 'full',
      duration: '2h 45m',
      questions: 80,
      band: '6.5-7.5',
      price: 'FREE',
      color: '#1e40af',
      gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
      description: 'Full authentic IELTS test with British accent audio'
    },
    {
      id: 'ielts17-t2',
      title: 'IELTS 17 TEST 2',
      type: 'full',
      duration: '2h 45m',
      questions: 80,
      band: '7.0-8.0',
      price: '$9.99',
      color: '#1d4ed8',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #60a5fa 100%)'
    },
    {
      id: 'listening-m1',
      title: 'LISTENING MASTER',
      type: 'listening',
      duration: '30m',
      questions: 40,
      band: '7.5+',
      price: 'FREE',
      color: '#0369a1',
      gradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 50%, #38bdf8 100%)',
      description: 'British accent recordings with noise simulation'
    },
    {
      id: 'writing-task2',
      title: 'WRITING TASK 2',
      type: 'writing',
      duration: '40m',
      questions: 1,
      band: '6.0-8.0',
      price: 'FREE',
      color: '#1e3a8a',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)'
    }
  ]

  const handleCardHover = (index) => {
    setHoveredCard(index)
    if (hoverSound) hoverSound.play()
  }

  const handleStartTest = (test) => {
    if (clickSound) clickSound.play()
    startTest(test)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      {/* 3D Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          {tests.map((test, i) => (
            <TestCard3D 
              key={test.id}
              title={test.title}
              bandLevel={test.band}
              position={[
                (i - tests.length/2) * 3,
                Math.sin(i * 1.5) * 0.5,
                -i * 0.5
              ]}
              onClick={() => handleStartTest(test)}
            />
          ))}
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px' }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: '60px',
            backdropFilter: 'blur(10px)',
            background: 'rgba(30, 58, 138, 0.3)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <h1 style={{
            fontSize: '3.5rem',
            background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            fontWeight: '800'
          }}>
            IELTS MOCK TEST LAB
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#cbd5e1',
            maxWidth: '800px',
            margin: '0 auto 30px'
          }}>
            Experience real IELTS testing environment with British accent audio, 
            3D animations, and AI-powered evaluation. <strong>First exam is FREE!</strong>
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '40px'
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)'
              }}
              onClick={() => handleStartTest(tests[0])}
            >
              🚀 START FREE TEST
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid #3b82f6',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              🎧 DEMO AUDIO
            </motion.button>
          </div>
        </motion.div>

        {/* Test Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <AnimatePresence>
            {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: hoveredCard === index ? 10 : 0,
                  boxShadow: '0 25px 50px rgba(59, 130, 246, 0.4)'
                }}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: test.gradient,
                  borderRadius: '20px',
                  padding: '30px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                onClick={() => handleStartTest(test)}
              >
                {/* 3D Effect Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  transform: `translateX(${hoveredCard === index ? '100%' : '-100%'})`,
                  transition: 'transform 0.6s ease'
                }} />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      margin: 0,
                      color: 'white'
                    }}>
                      {test.title}
                    </h3>
                    <span style={{
                      background: test.price === 'FREE' ? '#10b981' : '#f59e0b',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {test.price}
                    </span>
                  </div>
                  
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '25px',
                    lineHeight: '1.6'
                  }}>
                    {test.description || 'Full practice test with detailed evaluation'}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      <span>⏱️ {test.duration}</span>
                      <span>📝 {test.questions} Qs</span>
                      <span>🎯 Band {test.band}</span>
                    </div>
                    
                    <motion.div
                      animate={{ 
                        rotate: hoveredCard === index ? 360 : 0,
                        scale: hoveredCard === index ? 1.2 : 1
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}
                    >
                      →
                    </motion.div>
                  </div>
                  
                  {test.price === 'FREE' && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      border: '1px dashed rgba(255, 255, 255, 0.3)'
                    }}>
                      ✅ Includes: British audio + AI evaluation + Detailed report
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* British Accent Demo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '80px',
            textAlign: 'center',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <h2 style={{
            fontSize: '2rem',
            color: '#93c5fd',
            marginBottom: '20px'
          }}>
            🎧 Authentic British Accent Audio
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '30px', maxWidth: '800px', margin: '0 auto' }}>
            All listening tests feature native British speakers with various accents 
            (RP, Scottish, Irish, Welsh) just like the real IELTS exam.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '15px',
                minWidth: '200px'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🇬🇧</div>
              <h4 style={{ margin: '10px 0' }}>Received Pronunciation</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Standard British accent</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '15px',
                minWidth: '200px'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
              <h4 style={{ margin: '10px 0' }}>Scottish Accent</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Edinburgh/Glasgow speakers</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TestList
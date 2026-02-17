import React, { useEffect, useState } from 'react';

const SectionLoading = ({ message = "Loading..." }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Mouse tracking
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(dotsInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Leaderboard bilan bir xil hero fon
  const heroStyle = {
    position: 'relative',
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `
      radial-gradient(circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, 
        rgba(30, 144, 255, 0.15) 0%, 
        rgba(135, 206, 250, 0.1) 25%, 
        rgba(240, 248, 255, 0.05) 50%, 
        transparent 70%
      ),
      
    `,
    padding: '40px 20px',
    perspective: '1000px',
    transformStyle: 'preserve-3d'
  };

  return (
    <div style={heroStyle}>
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
            opacity: 0.8
          }}>Exam</span>
          {' '}
          <span style={{
            background: 'linear-gradient(90deg, #1e90ff, #00bfff, #87cefa, #1e90ff)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 3s infinite linear'
          }}>
            Pulse
          </span>
        </div>
        
        {/* Loading Message */}
        <p style={{
          color: '#4a5568',
          fontSize: '1.1rem',
          maxWidth: '400px',
          margin: '0 auto 30px',
          lineHeight: '1.6'
        }}>
          {message}{dots}
        </p>

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
            transform: 'translate(-50%, -50%)',
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

      {/* CSS Animations */}
      <style jsx>{`
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
          }
          50% { 
            transform: translateY(-20px) translateZ(15px) rotateX(15deg); 
          }
        }
      `}</style>
    </div>
  );
};

export default SectionLoading;
import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Play } from 'lucide-react';

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // --- SCROLL ANIMATION ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const ctx = gsap.context(() => {
        // Title animatsiyasi (Pastdan tepaga silliq chiqadi)
        gsap.from(".anim-title", { 
          y: 40, 
          opacity: 0, 
          duration: 1, 
          ease: "power3.out" 
        });
        
        // Video Player animatsiyasi (Tepadan pastga tushadi)
        gsap.from(".anim-video", { 
          y: -50, 
          opacity: 0, 
          scale: 0.95, 
          duration: 1.2, 
          delay: 0.2, 
          ease: "power3.out" 
        });
      }, sectionRef);
      return () => ctx.revert();
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} style={styles.section}>
      <div style={styles.container}>
        
        {/* SARLAVHA: "Our Services" uslubida (Havorang va Qalin) */}
        <h2 className="anim-title" style={styles.mainTitle}>
          How does this actually work?
        </h2>

        {/* --- VIDEO PLAYER --- */}
        <div className="anim-video" style={styles.videoWrapper}>
          
          <div style={styles.screenContainer}>
            {/* Header (Browser ko'rinishi) */}
            <div style={styles.screenHeader}>
              <div style={styles.dots}>
                <div style={{...styles.dot, background: '#FF5F56'}}></div>
                <div style={{...styles.dot, background: '#FFBD2E'}}></div>
                <div style={{...styles.dot, background: '#27C93F'}}></div>
              </div>
              <div style={styles.urlBar}>exampulse.ai/tutorial</div>
            </div>

            {/* Video Area */}
            <div style={styles.displayArea}>
              <div style={styles.playBox}>
                <div style={styles.pulseCircle}></div>
                <div style={styles.playIcon}>
                  <Play size={40} fill="#3b82f6" color="#3b82f6" style={{ marginLeft: '6px' }} />
                </div>
                <span style={styles.mediaLabel}>Watch System Walkthrough</span>
              </div>
              
              {/* Gradient Fon (Video o'rnida) */}
              <div style={styles.videoGradient}></div>
            </div>
          </div>
          
          {/* Orqa fon Glow effekti */}
          <div style={styles.glow}></div>

        </div>

      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '120px 0',
    // 1. FON: HeroZenithPro bilan AYNAN BIR XIL (Chiziq bo'lmaydi)
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative',
    zIndex: 20,
    overflow: 'hidden'
  },
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '0 20px', 
    textAlign: 'center' 
  },
  
  // 2. SARLAVHA STILI ("Our Services" bilan bir xil)
  mainTitle: {
    fontSize: '3rem',       // Katta
    fontWeight: '900',      // Qalin
    color: '#3b82f6',       // Brand Blue (Havorang)
    marginBottom: '60px', 
    letterSpacing: '-1px',
    textTransform: 'none',   // Hammasi kichkina bo'lmasligi uchun
    lineHeight: '1.2'
  },

  // Video Wrapper (Akkuratniy o'lcham)
  videoWrapper: {
    position: 'relative',
    maxWidth: '850px', 
    margin: '0 auto',
    zIndex: 10
  },

  screenContainer: {
    width: '100%', 
    aspectRatio: '16/9', 
    background: '#FFFFFF', 
    borderRadius: '24px', 
    overflow: 'hidden', 
    // Chiroyli yumshoq soya
    boxShadow: '0 40px 80px -20px rgba(59, 130, 246, 0.25)', 
    zIndex: 2, 
    position: 'relative',
    border: '6px solid white'
  },
  screenHeader: {
    padding: '14px 24px', 
    background: '#f8fafc', 
    borderBottom: '1px solid #e2e8f0',
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px'
  },
  dots: { display: 'flex', gap: '8px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  urlBar: { 
    flex: 1, 
    background: '#ffffff', 
    padding: '6px 15px', 
    borderRadius: '8px', 
    fontSize: '12px', 
    color: '#94a3b8', 
    border: '1px solid #e2e8f0', 
    textAlign: 'center', 
    fontWeight: '500'
  },
  
  displayArea: { 
    width: '100%', 
    height: '100%', 
    position: 'relative', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    overflow: 'hidden'
  },
  
  videoGradient: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute', 
    top: 0, 
    left: 0,
    // Yorqin Moviy Gradient
    background: 'linear-gradient(45deg, #60a5fa, #3b82f6, #2563eb)',
    opacity: 0.85
  },
  
  playBox: { 
    position: 'relative', 
    zIndex: 10, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '25px'
  },
  
  playIcon: { 
    width: '90px', 
    height: '90px', 
    background: 'rgba(255,255,255,0.9)', 
    backdropFilter: 'blur(10px)', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    cursor: 'pointer', 
    transition: 'transform 0.3s ease',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
  },
  
  pulseCircle: {
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    width: '140px', 
    height: '140px', 
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.6)', 
    opacity: 0.6,
    animation: 'pulse 2s infinite' 
  },
  
  mediaLabel: { 
    color: 'white', 
    fontSize: '15px', 
    fontWeight: '700', 
    letterSpacing: '1px', 
    textTransform: 'uppercase',
    textShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  
  glow: {
    position: 'absolute', 
    top: '15%', 
    left: '10%', 
    width: '80%', 
    height: '80%',
    background: '#3b82f6', 
    filter: 'blur(100px)', 
    opacity: 0.4, 
    zIndex: 1,
    transform: 'translateY(40px)'
  }
};

// CSS Animation (Pulse uchun)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.4; }
    100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
  }
`;
document.head.appendChild(styleSheet);

export default HowItWorks;
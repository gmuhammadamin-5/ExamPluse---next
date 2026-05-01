import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// BARCHA IKONKALARNI IMPORT QILAMIZ - SHU QATOR XATONI TO'G'RILAYDI
import { 
  Mic2, 
  ShieldCheck, 
  PenTool, 
  BarChart3, 
  Cpu, 
  Activity, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BentoFeatures = () => {
  useEffect(() => {
    // Elegant stagger animation for the grid items
    gsap.fromTo(".bento-item", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, y: 0, 
        stagger: 0.15, 
        duration: 1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 85%"
        }
      }
    );
  }, []);

  return (
    <section className="bento-section" style={styles.section}>
      <style>{`
        @media(max-width:900px){
          .bento-section { padding: clamp(60px,8vw,100px) 0 !important; }
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-large { grid-column: span 1 !important; grid-row: span 1 !important; }
          .bento-wide  { grid-column: span 1 !important; flex-direction: column !important; }
          .bento-wide .bento-chart-icon { width: 80px !important; height: 80px !important; }
        }
        @media(max-width:480px){
          .bento-section .container { padding: 0 16px !important; }
        }
      `}</style>
      <div className="container" style={styles.container}>
        
        {/* HEADER AREA */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <Cpu size={14} color="#3b82f6" />
            <span>AI-DRIVEN ECOSYSTEM</span>
          </div>
          <h2 style={styles.h2}>The Elite Standard in <br /> <span style={styles.blueText}>AI IELTS Preparation.</span></h2>
          <p style={styles.subTitle}>High-precision tools engineered to bridge the gap between your potential and Band 8.5+ reality.</p>
        </div>

        {/* BENTO GRID */}
        <div className="bento-grid" style={styles.grid}>
          
          {/* LARGE CARD: SPEAKING AI */}
          <div className="bento-item bento-large" style={{...styles.card, gridColumn: 'span 2', gridRow: 'span 2'}}>
            <div style={styles.iconBox}><Mic2 size={30} color="#3b82f6" /></div>
            <h3 style={styles.cardTitle}>Neural Speaking Engine</h3>
            <p style={styles.cardDesc}>Experience the world's most advanced AI interview simulation. Get real-time feedback on your pronunciation, intonation, and grammatical range with 99.4% precision.</p>
            <div style={styles.visualMockup}>
               <div style={styles.waveContainer}>
                  {[1,2,3,4,5,6].map(i => <div key={i} style={{...styles.waveBar, height: `${30 + (i * 10)}%`}}></div>)}
               </div>
               <span style={styles.visualStatus}>AI Analyzing Phonemes...</span>
            </div>
          </div>

          {/* SMALL CARD: ACCURACY */}
          <div className="bento-item" style={styles.card}>
            <ShieldCheck size={28} color="#3b82f6" style={{marginBottom: '20px'}} />
            <h3 style={styles.smallTitle}>Official Standards</h3>
            <p style={styles.smallDesc}>Calibrated strictly against IDP and British Council marking rubrics.</p>
          </div>

          {/* SMALL CARD: WRITING */}
          <div className="bento-item" style={styles.card}>
            <PenTool size={28} color="#3b82f6" style={{marginBottom: '20px'}} />
            <h3 style={styles.smallTitle}>Recursive Writing</h3>
            <p style={styles.smallDesc}>Instant structural and band-specific feedback for Task 1 & 2 essays.</p>
          </div>

          {/* WIDE CARD: ANALYTICS (WHERE BarChart3 LIVES) */}
          <div className="bento-item bento-wide" style={{...styles.card, gridColumn: 'span 2', flexDirection: 'row', alignItems: 'center', gap: '30px'}}>
            <div style={{flex: 1}}>
              <h3 style={styles.cardTitle}>Predictive Analytics</h3>
              <p style={styles.cardDesc}>Track your progress with granular data. Identify scoring plateaus and receive AI-generated pathways to improvement.</p>
            </div>
            <div className="bento-chart-icon" style={styles.chartIconBox}>
               <BarChart3 size={48} color="#3b82f6" strokeWidth={1.5} />
            </div>
          </div>

          {/* SMALL CARD: REAL-TIME */}
          <div className="bento-item" style={styles.card}>
            <Activity size={28} color="#3b82f6" style={{marginBottom: '20px'}} />
            <h3 style={styles.smallTitle}>Live Tracking</h3>
            <p style={styles.smallDesc}>Every practice session updates your global ranking and band projection.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '140px 0',
    // SIZ SO'RAGAN YENGIL KO'K GRADIENT FON
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '0 40px' },
  header: { textAlign: 'center', marginBottom: '80px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    background: '#FFFFFF', padding: '10px 24px', borderRadius: '100px',
    fontSize: '11px', fontWeight: '800', color: '#3b82f6',
    border: '1px solid #dbeafe', marginBottom: '25px', letterSpacing: '1.2px'
  },
  h2: {
    fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', fontWeight: '800', color: '#0f172a',
    lineHeight: '1.1', margin: '0 0 24px 0', letterSpacing: '-2.5px'
  },
  blueText: { 
    background: 'linear-gradient(90deg, #3b82f6, #0ea5e9)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  subTitle: { fontSize: '1.2rem', color: '#475569', maxWidth: '700px', margin: '0 auto', fontWeight: '500', lineHeight: '1.6' },

  // BENTO GRID SYSTEM
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoRows: 'minmax(220px, auto)',
    gap: '24px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(25px)',
    padding: '40px',
    borderRadius: '35px',
    border: '1px solid #FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.03)',
    cursor: 'default',
    transition: 'transform 0.4s ease'
  },
  iconBox: {
    width: '64px', height: '64px', background: '#eff6ff', 
    borderRadius: '18px', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', marginBottom: '30px'
  },
  cardTitle: { fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.5px' },
  smallTitle: { fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' },
  cardDesc: { fontSize: '1.05rem', color: '#475569', lineHeight: '1.6', fontWeight: '500' },
  smallDesc: { fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', fontWeight: '500' },
  
  visualMockup: {
    marginTop: 'auto', padding: '25px', background: '#f8fbff', 
    borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px',
    border: '1px solid #edf2f7'
  },
  waveContainer: { display: 'flex', alignItems: 'flex-end', gap: '4px', height: '30px' },
  waveBar: { width: '4px', background: '#3b82f6', borderRadius: '10px' },
  visualStatus: { fontSize: '11px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' },
  chartIconBox: { width: '120px', height: '120px', background: '#eff6ff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default BentoFeatures;
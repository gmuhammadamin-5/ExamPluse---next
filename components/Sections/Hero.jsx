import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, Headphones, BookOpen, PenTool, Sparkles, ArrowRight, PlayCircle, MonitorPlay, ChevronRight } from 'lucide-react';

// --- RANGLAR (SIZGA YOQQAN TO'Q MOVIY) ---
const PARTICLES_COLOR = '#1e3a8a'; 
const BRAND_BLUE = '#3b82f6';      
const BG_GRADIENT = 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)';

// --- SHAKLNI NUSXALASH ---
function sampleShapeFromCanvas(count, drawFn) {
  const canvas = document.createElement('canvas');
  const size = 400; canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size); 
  ctx.fillStyle = '#fff'; drawFn(ctx, size); 

  const imgData = ctx.getImageData(0, 0, size, size);
  const pixels = imgData.data;
  const positions = new Float32Array(count * 3);
  let collected = 0; let attempt = 0;
  
  // Yopishib qolmasligi uchun (Scale 5.0)
  while (collected < count && attempt < count * 50) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      const index = (y * size + x) * 4;
      if (pixels[index] > 50) { 
          const i3 = collected * 3;
          positions[i3] = (x / size - 0.5) * 5.0; 
          positions[i3+1] = -(y / size - 0.5) * 5.0; 
          positions[i3+2] = (Math.random() - 0.5) * 0.5; 
          collected++;
      }
      attempt++;
  }
  return positions;
}

// --- 3D ENGINE ---
function MorphingParticles({ section, activeService }) {
  const ref = useRef();
  const count = 13000; 

  const shapes = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3; 
      const phi = Math.acos(-1 + (2 * i) / count); 
      const theta = Math.sqrt(count * Math.PI) * phi; 
      const r = 2.5; 
      sphere.set([r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)], i3);
    }
    const speaking = sampleShapeFromCanvas(count, (ctx, s) => {
        ctx.beginPath(); ctx.arc(s*0.3, s*0.6, s*0.15, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(s*0.3, s*0.9, s*0.22, s*0.14, 0, Math.PI, Math.PI*2); ctx.fill();
        ctx.roundRect(s*0.5, s*0.25, s*0.4, s*0.3, s*0.05); ctx.fill();
        ctx.beginPath(); ctx.moveTo(s*0.6, s*0.55); ctx.lineTo(s*0.5, s*0.65); ctx.lineTo(s*0.7, s*0.55); ctx.fill();
    });
    const listening = sampleShapeFromCanvas(count, (ctx, s) => {
        ctx.lineWidth = s*0.1; ctx.strokeStyle = '#fff';
        ctx.beginPath(); ctx.arc(s*0.5, s*0.5, s*0.35, Math.PI, 0); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(s*0.06, s*0.45, s*0.14, s*0.25); ctx.fillRect(s*0.8, s*0.45, s*0.14, s*0.25);
    });
    const reading = sampleShapeFromCanvas(count, (ctx, s) => {
        ctx.beginPath();
        ctx.moveTo(s*0.5, s*0.2); ctx.quadraticCurveTo(s*0.25, s*0.25, s*0.1, s*0.2); ctx.lineTo(s*0.1, s*0.8); ctx.quadraticCurveTo(s*0.25, s*0.85, s*0.5, s*0.8);
        ctx.moveTo(s*0.5, s*0.2); ctx.quadraticCurveTo(s*0.75, s*0.25, s*0.9, s*0.2); ctx.lineTo(s*0.9, s*0.8); ctx.quadraticCurveTo(s*0.75, s*0.85, s*0.5, s*0.8);
        ctx.lineTo(s*0.5, s*0.2); ctx.fill();
    });
    const writing = sampleShapeFromCanvas(count, (ctx, s) => {
        ctx.save(); ctx.translate(s*0.5, s*0.5); ctx.rotate(-Math.PI/4);
        ctx.fillRect(-s*0.08, -s*0.35, s*0.16, s*0.7); 
        ctx.beginPath(); ctx.moveTo(-s*0.08, s*0.35); ctx.lineTo(0, s*0.5); ctx.lineTo(s*0.08, s*0.35); ctx.fill(); ctx.restore();
    });
    return { sphere, speaking, listening, reading, writing };
  }, []);

  const velocities = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime(); 
    const array = ref.current.geometry.attributes.position.array;

    // Positsiya: Hero(0) -> Services(-3.5)
    let targetPos = new THREE.Vector3(section === 'hero' ? 0 : -3.5, 0, 0);
    ref.current.position.lerp(targetPos, 0.05);

    let targetShape = shapes.sphere;
    if (section === 'services') {
      if (activeService === 'Speaking') targetShape = shapes.speaking;
      else if (activeService === 'Listening') targetShape = shapes.listening;
      else if (activeService === 'Reading') targetShape = shapes.reading;
      else if (activeService === 'Writing') targetShape = shapes.writing;
    }

    // Tinch animatsiya (Sichqonchadan qochmaydi)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const idle = Math.sin(time * 0.5 + i * 0.1) * 0.015; 
      
      array[i3]   += (targetShape[i3]   + idle - array[i3])   * 0.07;
      array[i3+1] += (targetShape[i3+1] + idle - array[i3+1]) * 0.07;
      array[i3+2] += (targetShape[i3+2]        - array[i3+2]) * 0.07;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    if (section === 'hero') { ref.current.rotation.y += 0.0015; } 
    else { ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, 0.05); }
  });

  return (
    <Points ref={ref} positions={shapes.sphere.slice()} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={PARTICLES_COLOR} size={0.055} sizeAttenuation={true} depthWrite={false} opacity={1.0} />
    </Points>
  );
}

// --- ASOSIY KOMPONENT ---
const HeroZenithPro = () => {
  const [section, setSection] = useState('hero');
  const [activeService, setActiveService] = useState('Speaking');

  useEffect(() => {
    const handleScroll = () => {
      // Hero balandligidan o'tganda
      setSection(window.scrollY > window.innerHeight * 0.5 ? 'services' : 'hero');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { id: 'Speaking', icon: <MessageSquareText size={22}/>, title: "Speaking AI", desc: "Fluency & pronunciation analysis.", screen: "Speaking Simulation" },
    { id: 'Listening', icon: <Headphones size={22}/>, title: "Listening Lab", desc: "High-fidelity audio tests.", screen: "Listening Interface" },
    { id: 'Reading', icon: <BookOpen size={22}/>, title: "Reading Engine", desc: "Smart text highlighting.", screen: "Reading View" },
    { id: 'Writing', icon: <PenTool size={22}/>, title: "Writing Pro", desc: "Instant grammar feedback.", screen: "Writing Editor" },
  ];

  const currentScreenText = services.find(s => s.id === activeService)?.screen;

  return (
    <div style={{ background: BG_GRADIENT, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* BU YERDA KAT KOD: PARENT DIV (Relative)
          Bu div Hero va Servicesni ushlab turadi.
      */}
      <div style={{ position: 'relative' }}>
        
        {/* CANVAS (STICKY) - Faqat shu parent ichida qotib turadi */}
        <div style={{ 
            position: 'sticky', 
            top: 0, 
            height: '100vh', 
            width: '100%', 
            zIndex: 0,
            overflow: 'hidden'
        }}>
          <Canvas camera={{ position: [0, 0, 8.5], fov: 50 }} dpr={[1, 2]}>
            <MorphingParticles section={section} activeService={activeService} />
          </Canvas>
        </div>

        {/* CONTENT (Hero + Services) 
            Sticky canvas ustiga chiqishi uchun margin-top: -100vh 
        */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: '-100vh' }}>
          
          {/* Hero Section */}
          <section style={{ 
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: section === 'hero' ? 1 : 0, 
            transform: section === 'hero' ? 'translateY(0)' : 'translateY(-50px)',
            transition: 'all 0.6s ease',
            pointerEvents: section === 'hero' ? 'auto' : 'none'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '800px' }}>
              <div style={S.badge}><Sparkles size={14} fill={BRAND_BLUE} /> ExamPulse v2.0</div>
              <h1 style={S.h1}>Mastery <br/><span style={{color: BRAND_BLUE}}>Perfected by AI.</span></h1>
              <p style={S.desc}>Fusing neural engineering with official standards. Experience the future.</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button style={S.btnPrimary}>Start Assessment <ArrowRight size={18} /></button>
                <button style={S.btnSecondary}><PlayCircle size={20} color={BRAND_BLUE} /> Watch Demo</button>
              </div>
              <div style={{ marginTop: '50px', color: '#94a3b8', fontSize: '14px' }}>↓ Scroll to Explore</div>
            </div>
          </section>

          {/* Services Section */}
          <section style={{ 
            minHeight: '100vh', display: 'flex', alignItems: 'center', 
            opacity: section === 'services' ? 1 : 0,
            pointerEvents: section === 'services' ? 'auto' : 'none',
            transition: 'opacity 0.6s ease'
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 50px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              
              <div></div> {/* Chap taraf bo'sh (Tochkalar shu yerda bo'ladi) */}

              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <h2 style={{...S.h2, color: BRAND_BLUE}}>Our Services</h2>
                <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '18px' }}>Choose a module to experience the simulation.</p>

                <div style={{ display: 'grid', gap: '14px', marginBottom: '40px' }}>
                  {services.map((srv) => (
                    <div 
                      key={srv.id}
                      onClick={() => setActiveService(srv.id)}
                      style={{
                        padding: '18px 24px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px', 
                        transition: 'all 0.3s ease',
                        background: activeService === srv.id ? '#ffffff' : 'rgba(255,255,255,0.5)',
                        border: activeService === srv.id ? `2px solid ${BRAND_BLUE}` : '2px solid transparent',
                        boxShadow: activeService === srv.id ? '0 12px 30px rgba(59, 130, 246, 0.15)' : 'none',
                        transform: activeService === srv.id ? 'translateX(5px)' : 'translateX(0)'
                      }}
                    >
                      <div style={{ 
                        background: activeService === srv.id ? BRAND_BLUE : '#e2e8f0', 
                        color: activeService === srv.id ? '#fff' : '#64748b',
                        width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {srv.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>{srv.title}</h3>
                        <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748b' }}>{srv.desc}</p>
                      </div>
                      {activeService === srv.id && <ChevronRight size={20} color={BRAND_BLUE} />}
                    </div>
                  ))}
                </div>

                <div style={S.screenContainer}>
                   <div style={S.screenHeader}>
                     <div style={{display:'flex', gap:'6px'}}><div style={S.dot}/><div style={S.dot}/><div style={S.dot}/></div>
                     <div style={S.urlBar}>exampulse.ai/modules/{activeService.toLowerCase()}</div>
                   </div>
                   <div style={S.screenBody}>
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={activeService}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          style={{textAlign: 'center'}}
                        >
                          <MonitorPlay size={45} color={BRAND_BLUE} style={{opacity: 0.7, marginBottom: '15px'}} />
                          <div style={{fontWeight: '700', fontSize: '18px', color: '#1e293b'}}>{currentScreenText}</div>
                          <div style={{fontSize: '12px', color: '#94a3b8', marginTop: '5px'}}>Interactive 3D Preview</div>
                        </motion.div>
                      </AnimatePresence>
                   </div>
                </div>
              </div>
            </div>
          </section>
        
        </div>
      </div>

      {/* BU YERDAN KEYIN KELADIGAN HAR QANDAY SECTIONGA TOCHKALAR O'TMAYDI */}
      {/* Misol: How it works */}
      {/* <section style={{height: '100vh', background: 'white'}}>How it works section...</section> */}

    </div>
  );
};

// --- STILLAR ---
const S = {
  badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '10px 20px', borderRadius: '100px', fontSize: '12px', fontWeight: '800', color: BRAND_BLUE, marginBottom: '30px', border: `1px solid ${BRAND_BLUE}40` },
  h1: { fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', fontWeight: '900', color: '#0f172a', lineHeight: '0.95', letterSpacing: '-3px', margin: '0 0 25px 0' },
  desc: { fontSize: '1.2rem', color: '#475569', lineHeight: '1.6', marginBottom: '45px', fontWeight: '500', margin: '0 auto' },
  h2: { fontSize: '3rem', fontWeight: '900', marginBottom: '15px' },
  btnPrimary: { background: BRAND_BLUE, color: '#fff', border: 'none', padding: '18px 35px', borderRadius: '15px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  btnSecondary: { background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', padding: '18px 35px', borderRadius: '15px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  screenContainer: { background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', height: '220px' },
  screenHeader: { padding: '10px 15px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', background: '#cbd5e1' },
  urlBar: { flex: 1, background: '#fff', padding: '4px', borderRadius: '6px', fontSize: '10px', color: '#94a3b8', textAlign: 'center', border: '1px solid #e2e8f0' },
  screenBody: { height: 'calc(100% - 35px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfdff' }
};

export default HeroZenithPro;
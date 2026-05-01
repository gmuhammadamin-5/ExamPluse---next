"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquareText, Headphones, BookOpen, PenTool,
  Sparkles, ArrowRight, PlayCircle, MonitorPlay, ChevronRight,
} from 'lucide-react';

const SVC_COLOR = {
  Speaking:  '#0ea5e9',
  Listening: '#050a09',
  Reading:   '#7c3aed',
  Writing:   '#ea580c',
}

const STATS = [
  { value: '12,000+', label: 'Students',  color: '#3b82f6' },
  { value: '98.7%',   label: 'Accuracy',  color: '#0ea5e9' },
  { value: '4.9 ★',  label: 'Rating',    color: '#7c3aed' },
  { value: '150+',    label: 'Countries', color: '#059669' },
]

function sampleShape(count, drawFn) {
  if (typeof window === 'undefined') return new Float32Array(count * 3)
  const cv = document.createElement('canvas')
  cv.width = cv.height = 400
  const ctx = cv.getContext('2d')
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 400, 400)
  ctx.fillStyle = '#fff'; drawFn(ctx, 400)
  const px = ctx.getImageData(0, 0, 400, 400).data
  const pos = new Float32Array(count * 3)
  let n = 0, a = 0
  while (n < count && a < count * 50) {
    const x = Math.floor(Math.random() * 400)
    const y = Math.floor(Math.random() * 400)
    if (px[(y * 400 + x) * 4] > 50) {
      pos[n*3]   = (x / 400 - 0.5) * 5.0
      pos[n*3+1] = -(y / 400 - 0.5) * 5.0
      pos[n*3+2] = (Math.random() - 0.5) * 0.5
      n++
    }
    a++
  }
  return pos
}

function MorphingParticles({ section, activeService, mouseRef, isMobile }) {
  const { scene } = useThree()
  const count = 13000

  const shapes = useMemo(() => {
    const sphere = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      const r = 2.5, i3 = i * 3
      sphere[i3]   = r * Math.cos(theta) * Math.sin(phi)
      sphere[i3+1] = r * Math.sin(theta) * Math.sin(phi)
      sphere[i3+2] = r * Math.cos(phi)
    }
    // Speaking: person (head circle + shoulder dome) lower-left + rounded-rect speech bubble upper-right
    const speaking = sampleShape(count, (c, s) => {
      // person head — large circle
      c.beginPath(); c.arc(s*.24, s*.50, s*.145, 0, Math.PI*2); c.fill()
      // person shoulders — top semicircle (dome)
      c.beginPath()
      c.arc(s*.24, s*.88, s*.23, Math.PI, 0)
      c.closePath(); c.fill()
      // speech bubble — rounded rectangle upper right
      c.beginPath(); c.roundRect(s*.41, s*.07, s*.53, s*.47, s*.07); c.fill()
      // bubble tail pointing left-down toward person head
      c.beginPath()
      c.moveTo(s*.43, s*.53)
      c.lineTo(s*.36, s*.64)
      c.lineTo(s*.56, s*.53)
      c.fill()
    })

    // Listening: headphones — thick horseshoe arc + two big ear cups
    const listening = sampleShape(count, (c, s) => {
      // outer arc (headband)
      c.lineWidth = s*.10; c.strokeStyle = '#fff'
      c.beginPath(); c.arc(s*.50, s*.44, s*.28, Math.PI*1.05, Math.PI*1.95, false); c.stroke()
      // left ear cup
      c.fillRect(s*.09, s*.42, s*.16, s*.34)
      // right ear cup
      c.fillRect(s*.75, s*.42, s*.16, s*.34)
      // inner cutout (black) — inner part of ear cup
      c.fillStyle = '#000'
      c.fillRect(s*.135, s*.47, s*.07, s*.24)
      c.fillRect(s*.795, s*.47, s*.07, s*.24)
      c.fillStyle = '#fff'
    })

    // Reading: open book — two spread pages with spine
    const reading = sampleShape(count, (c, s) => {
      // left page
      c.beginPath()
      c.moveTo(s*.50, s*.16); c.quadraticCurveTo(s*.33, s*.19, s*.08, s*.14)
      c.lineTo(s*.08, s*.82); c.quadraticCurveTo(s*.33, s*.87, s*.50, s*.82)
      c.closePath(); c.fill()
      // right page
      c.beginPath()
      c.moveTo(s*.50, s*.16); c.quadraticCurveTo(s*.67, s*.19, s*.92, s*.14)
      c.lineTo(s*.92, s*.82); c.quadraticCurveTo(s*.67, s*.87, s*.50, s*.82)
      c.closePath(); c.fill()
      // spine gap (black)
      c.fillStyle = '#000'; c.fillRect(s*.47, s*.14, s*.06, s*.70); c.fillStyle = '#fff'
    })

    // Writing: open book + thick diagonal pen crossing it
    const writing = sampleShape(count, (c, s) => {
      // left page
      c.beginPath()
      c.moveTo(s*.48, s*.18); c.quadraticCurveTo(s*.32, s*.21, s*.08, s*.16)
      c.lineTo(s*.08, s*.78); c.quadraticCurveTo(s*.32, s*.83, s*.48, s*.78)
      c.closePath(); c.fill()
      // right page
      c.beginPath()
      c.moveTo(s*.52, s*.18); c.quadraticCurveTo(s*.68, s*.21, s*.88, s*.16)
      c.lineTo(s*.88, s*.78); c.quadraticCurveTo(s*.68, s*.83, s*.52, s*.78)
      c.closePath(); c.fill()
      // spine (black)
      c.fillStyle = '#000'; c.fillRect(s*.455, s*.16, s*.09, s*.64); c.fillStyle = '#fff'
      // pen body — thick diagonal
      c.save()
      c.translate(s*.68, s*.24)
      c.rotate(Math.PI * 0.68)
      c.fillRect(-s*.055, -s*.30, s*.11, s*.52)    // body
      c.fillStyle = '#222'; c.fillRect(-s*.055, -s*.30, s*.11, s*.08); c.fillStyle = '#fff' // cap
      c.beginPath(); c.moveTo(-s*.055, s*.22); c.lineTo(0, s*.40); c.lineTo(s*.055, s*.22); c.fill() // tip
      c.restore()
    })
    return { sphere, speaking, listening, reading, writing }
  }, [])

  const mat = useRef(new THREE.PointsMaterial({
    color: new THREE.Color('#007bff'),
    size: 0.052, sizeAttenuation: true,
    transparent: true, opacity: 0.92, depthWrite: false,
  }))

  const geo = useRef((() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(shapes.sphere.slice(), 3))
    return g
  })())

  const mesh = useRef(new THREE.Points(geo.current, mat.current))

  useEffect(() => {
    scene.add(mesh.current)
    return () => scene.remove(mesh.current)
  }, [scene])

  useEffect(() => {
    // Fewer particles on mobile for performance
    geo.current.setDrawRange(0, isMobile ? 7000 : 13000)
    // Slightly smaller sphere on mobile
    mesh.current.scale.setScalar(isMobile ? 0.72 : 1.0)
  }, [isMobile])

  const lifeOffsets = useMemo(() => {
    const a = new Float32Array(count)
    for (let i = 0; i < count; i++) a[i] = Math.random() * Math.PI * 2
    return a
  }, [])

  const tgtColor = useRef(new THREE.Color('#1e3a8a'))
  const secRef = useRef(section)
  const svcRef = useRef(activeService)
  const mobileRef = useRef(isMobile)

  useEffect(() => { secRef.current = section }, [section])
  useEffect(() => { mobileRef.current = isMobile }, [isMobile])
  useEffect(() => {
    svcRef.current = activeService
    tgtColor.current.set(SVC_COLOR[activeService] || '#1e3a8a')
  }, [activeService])
  useEffect(() => {
    if (section === 'hero') tgtColor.current.set('#1e3a8a')
    else tgtColor.current.set(SVC_COLOR[activeService] || '#1e3a8a')
  }, [section])

  useFrame((state) => {
    const m = mesh.current
    const ma = mat.current
    const g = geo.current
    if (!m) return
    const t = state.clock.getElapsedTime()
    const sec = secRef.current
    const svc = svcRef.current
    const arr = g.attributes.position.array

    let target = shapes.sphere
    if (sec === 'services') {
      if (svc === 'Speaking') target = shapes.speaking
      else if (svc === 'Listening') target = shapes.listening
      else if (svc === 'Reading') target = shapes.reading
      else if (svc === 'Writing') target = shapes.writing
    }

    const tx = (sec === 'hero' || mobileRef.current) ? 0 : -3.2
    m.position.x = THREE.MathUtils.lerp(m.position.x, tx, 0.045)

    const mx = mouseRef?.current?.x ?? 0
    const my = mouseRef?.current?.y ?? 0
    if (sec === 'hero') {
      m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, mx * 0.5 + t * 0.001, 0.04)
      m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, -my * 0.3 + Math.sin(t * 0.15) * 0.08, 0.04)
    } else {
      m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, 0, 0.02)
      m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, 0, 0.02)
    }

    const limit = mobileRef.current ? 7000 : count
    for (let i = 0; i < limit; i++) {
      const i3 = i * 3, off = lifeOffsets[i]
      const lv = Math.sin(t*.4+off)*.025 + Math.sin(t*1.2+off*1.7)*.012 + Math.sin(t*3.5+off*2.3)*.006
      arr[i3]   += (target[i3]   + lv - arr[i3])   * 0.065
      arr[i3+1] += (target[i3+1] + lv*.8 - arr[i3+1]) * 0.065
      arr[i3+2] += (target[i3+2] + Math.sin(t*.8+off)*.04 - arr[i3+2]) * 0.065
    }
    g.attributes.position.needsUpdate = true
    ma.color.lerp(tgtColor.current, 0.05)
  })

  return null
}

export default function Hero() {
  const [section, setSection] = useState('hero')
  const [activeService, setActiveService] = useState('Speaking')
  const [scrollProg, setScrollProg] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { setTimeout(() => setMounted(true), 80) }, [])

  useEffect(() => {
    const fn = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setScrollProg(max > 0 ? window.scrollY / max : 0)
      setSection(window.scrollY > window.innerHeight * 0.6 ? 'services' : 'hero')
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const services = [
    { id: 'Speaking',  icon: <MessageSquareText size={21}/>, title: 'Speaking AI',    desc: 'Fluency & pronunciation analysis.',  screen: 'Speaking Simulation'  },
    { id: 'Listening', icon: <Headphones size={21}/>,        title: 'Listening Lab',  desc: 'High-fidelity audio tests.',         screen: 'Listening Interface'  },
    { id: 'Reading',   icon: <BookOpen size={21}/>,          title: 'Reading Engine', desc: 'Smart text highlighting.',           screen: 'Reading View'         },
    { id: 'Writing',   icon: <PenTool size={21}/>,           title: 'Writing Pro',    desc: 'Instant grammar feedback.',          screen: 'Writing Editor'       },
  ]

  const currentScreen = services.find(s => s.id === activeService)?.screen

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .ep-left  { display: none !important; }
          .ep-grid  { grid-template-columns: 1fr !important; padding: 0 16px !important; }
          .ep-h1    { font-size: 2rem !important; letter-spacing: -1.5px !important; }
          .ep-btns  { flex-direction: column !important; }
          .ep-btn   { justify-content: center !important; width: 100% !important; }
          .ep-stats { gap: 8px !important; }
          .ep-stat  { min-width: 80px !important; padding: 10px 14px !important; }
          .ep-hero-content { padding: 0 20px !important; }
          .ep-svc-wrap { padding: 24px 0 !important; }
        }
      `}</style>

      {/* Scroll progress — hidden on mobile */}
      <div style={{ position:'fixed', left:22, top:'50%', transform:'translateY(-50%)', zIndex:100, display: isMobile ? 'none' : 'flex', flexDirection:'column', alignItems:'center', gap:8, pointerEvents:'none' }}>
        <div style={{ width:2, height:110, background:'rgba(59,130,246,0.15)', borderRadius:2, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:`${scrollProg*100}%`, background:'linear-gradient(180deg,#0ea5e9,#3b82f6)', borderRadius:2, transition:'height .08s linear' }}/>
        </div>
        {[0,1].map(i => (
          <div key={i} style={{ width:6, height:6, borderRadius:'50%', background: scrollProg >= i*0.45 ? '#3b82f6' : 'rgba(59,130,246,0.2)', transition:'background .3s' }}/>
        ))}
      </div>

      <div style={{ position:'relative' }}>
        {/* Sticky canvas */}
        <div style={{ position:'sticky', top:0, height:'100vh', width:'100%', zIndex:0, overflow:'hidden' }}>
          <Canvas camera={{ position:[0,0,8.5], fov:50 }} dpr={isMobile ? [1,1] : [1,1.5]} gl={{ alpha:true }} style={{ background:'transparent' }}>
            <MorphingParticles section={section} activeService={activeService} mouseRef={mouseRef} isMobile={isMobile}/>
          </Canvas>
        </div>

        <div style={{ position:'relative', zIndex:10, marginTop:'-100vh' }}>

          {/* HERO SECTION */}
          <section style={{
            height:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
            opacity: section==='hero' ? 1 : 0,
            transform: section==='hero' ? 'translateY(0)' : 'translateY(-40px)',
            transition: 'opacity 0.5s, transform 0.5s',
            pointerEvents: section==='hero' ? 'auto' : 'none',
            padding:'0 20px',
          }}>
            <div className="ep-hero-content" style={{ textAlign:'center', maxWidth:820, width:'100%' }}>

              <motion.div initial={{ opacity:0, y:-20 }} animate={mounted?{opacity:1,y:0}:{}} transition={{ duration:.5 }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.88)', backdropFilter:'blur(14px)', padding:'9px 20px', borderRadius:100, fontSize:12, fontWeight:800, color:'#3b82f6', marginBottom:24, border:'1px solid rgba(59,130,246,0.16)' }}>
                <Sparkles size={13} fill="#3b82f6"/> ExamPulse v2.0
              </motion.div>

              <motion.h1 className="ep-h1" initial={{ opacity:0, y:28 }} animate={mounted?{opacity:1,y:0}:{}} transition={{ duration:.65, delay:.1 }}
                style={{ fontSize:'clamp(2.4rem,6vw,5.5rem)', fontWeight:900, color:'#0f172a', lineHeight:.95, letterSpacing:'-3px', margin:'0 0 22px' }}>
                Mastery<br/><span style={{ color:'#3b82f6' }}>Perfected by AI.</span>
              </motion.h1>

              <motion.p initial={{ opacity:0, y:20 }} animate={mounted?{opacity:1,y:0}:{}} transition={{ duration:.6, delay:.2 }}
                style={{ fontSize:'1.05rem', color:'#475569', lineHeight:1.7, fontWeight:500, maxWidth:500, margin:'0 auto 32px' }}>
                Fusing neural engineering with official IELTS standards. Experience the future of exam preparation.
              </motion.p>

              <motion.div className="ep-btns" initial={{ opacity:0, y:16 }} animate={mounted?{opacity:1,y:0}:{}} transition={{ duration:.55, delay:.3 }}
                style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button className="ep-btn" onClick={() => {}}
                  style={{ background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', color:'#fff', border:'none', padding:'14px 28px', borderRadius:13, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 8px 26px rgba(59,130,246,0.4)', transition:'all .22s', fontFamily:'inherit' }}
                  onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                  Start Assessment <ArrowRight size={16}/>
                </button>
                <button className="ep-btn" onClick={() => {}}
                  style={{ background:'rgba(255,255,255,0.82)', backdropFilter:'blur(14px)', color:'#1e293b', border:'1.5px solid rgba(255,255,255,0.95)', padding:'14px 28px', borderRadius:13, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 18px rgba(0,0,0,0.07)', transition:'all .22s', fontFamily:'inherit' }}
                  onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                  <PlayCircle size={17} color="#3b82f6"/> Watch Demo
                </button>
              </motion.div>

              <div className="ep-stats" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:36, opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(20px)', transition:'all 0.7s ease 0.5s' }}>
                {STATS.map((s,i) => (
                  <motion.div key={s.label} className="ep-stat" initial={{ opacity:0, y:20, scale:.9 }} animate={mounted?{opacity:1,y:0,scale:1}:{}} transition={{ delay:.55+i*.07, duration:.45 }}
                    style={{ background:'rgba(255,255,255,0.78)', backdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.96)', borderRadius:14, padding:'12px 20px', textAlign:'center', boxShadow:'0 4px 22px rgba(0,0,0,0.06)', minWidth:95 }}>
                    <div style={{ fontSize:20, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:'#94a3b8', marginTop:4, textTransform:'uppercase', letterSpacing:'0.8px' }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity:0 }} animate={mounted?{opacity:1}:{}} transition={{ delay:1.1 }}
                style={{ marginTop:28, color:'#94a3b8', fontSize:13, fontWeight:600 }}>
                ↓ Scroll to Explore
              </motion.div>
            </div>
          </section>

          {/* SERVICES SECTION */}
          <section style={{
            minHeight:'100vh', display:'flex', alignItems:'center',
            opacity: section==='services' ? 1 : 0,
            transition: 'opacity 0.55s',
            pointerEvents: section==='services' ? 'auto' : 'none',
          }}>
            <div className="ep-grid" style={{ maxWidth:1400, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, padding:'0 50px' }}>
              <div className="ep-left"/>

              <div className="ep-svc-wrap" style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 0' }}>
                <motion.div initial={{ opacity:0, x:30 }} animate={section==='services'?{opacity:1,x:0}:{}} transition={{ duration:.55 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:'#3b82f6', textTransform:'uppercase', letterSpacing:2, marginBottom:10 }}>What We Offer</div>
                  <h2 style={{ fontSize:'clamp(1.7rem,4vw,2.8rem)', fontWeight:900, color:'#0f172a', marginBottom:10, lineHeight:1.1, letterSpacing:'-1.5px' }}>
                    Our <span style={{ color:'#3b82f6' }}>Services</span>
                  </h2>
                  <p style={{ color:'#64748b', marginBottom:22, fontSize:14, lineHeight:1.65 }}>
                    Click a module — watch the particles transform.
                  </p>
                </motion.div>

                <div style={{ display:'grid', gap:9, marginBottom:22 }}>
                  {services.map((srv, i) => {
                    const active = activeService === srv.id
                    const col = SVC_COLOR[srv.id]
                    return (
                      <motion.div key={srv.id}
                        initial={{ opacity:0, x:30 }} animate={section==='services'?{opacity:1,x:0}:{}} transition={{ duration:.5, delay:i*.07 }}
                        onClick={() => setActiveService(srv.id)}
                        style={{ padding:'13px 18px', borderRadius:14, cursor:'pointer', display:'flex', alignItems:'center', gap:14, transition:'all 0.22s ease', background: active?'#fff':'rgba(255,255,255,0.48)', border: active?`2px solid ${col}`:'2px solid transparent', boxShadow: active?`0 8px 28px ${col}33`:'none', transform: active?'translateX(6px)':'translateX(0)' }}>
                        <div style={{ width:42, height:42, borderRadius:11, flexShrink:0, background: active?col:'#e2e8f0', color: active?'#fff':'#64748b', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.22s', boxShadow: active?`0 4px 12px ${col}44`:'none' }}>
                          {srv.icon}
                        </div>
                        <div style={{ flex:1 }}>
                          <h3 style={{ margin:0, fontSize:13, fontWeight:800, color:'#0f172a' }}>{srv.title}</h3>
                          <p style={{ margin:'2px 0 0', fontSize:11, color:'#64748b' }}>{srv.desc}</p>
                        </div>
                        <AnimatePresence>
                          {active && (
                            <motion.div initial={{ opacity:0, scale:.5 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.5 }} transition={{ duration:.15 }}>
                              <ChevronRight size={16} color={col}/>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.div initial={{ opacity:0, y:24 }} animate={section==='services'?{opacity:1,y:0}:{}} transition={{ duration:.55, delay:.32 }}
                  style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #e2e8f0', boxShadow:'0 20px 50px rgba(0,0,0,0.08)', height:185 }}>
                  <div style={{ padding:'8px 14px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ display:'flex', gap:5 }}>
                      {['#ff5f57','#febc2e','#28c840'].map(col => <div key={col} style={{ width:8, height:8, borderRadius:'50%', background:col }}/>)}
                    </div>
                    <div style={{ flex:1, background:'#fff', borderRadius:5, padding:'3px 10px', fontSize:9, color:'#94a3b8', border:'1px solid #e2e8f0', textAlign:'center' }}>
                      exampulse.ai/modules/{activeService.toLowerCase()}
                    </div>
                  </div>
                  <div style={{ height:'calc(100% - 30px)', display:'flex', alignItems:'center', justifyContent:'center', background:'#fcfdff' }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={activeService}
                        initial={{ opacity:0, scale:.86, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.86, y:-10 }} transition={{ duration:.18 }}
                        style={{ textAlign:'center' }}>
                        <MonitorPlay size={36} color={SVC_COLOR[activeService]} style={{ opacity:.82, marginBottom:8 }}/>
                        <div style={{ fontWeight:800, fontSize:14, color:'#1e293b' }}>{currentScreen}</div>
                        <div style={{ fontSize:10, color:'#94a3b8', marginTop:3 }}>Interactive 3D Preview</div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
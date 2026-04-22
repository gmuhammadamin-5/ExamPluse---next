'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Award, Target, Clock, Download,
  Mic, Headphones, BookOpen, PenTool,
  CheckCircle, XCircle, Zap, BarChart2
} from 'lucide-react'
import { resultsApi } from '../../app/lib/api'

const SKILLS_META = [
  { key:'listening', label:'Listening', icon:Headphones, color:'#007bff', bg:'#e6f0ff', dbg:'#1e3a5f' },
  { key:'reading',   label:'Reading',   icon:BookOpen,   color:'#7c3aed', bg:'#ede9fe', dbg:'#2e1f5e' },
  { key:'speaking',  label:'Speaking',  icon:Mic,        color:'#059669', bg:'#d1fae5', dbg:'#064e3b' },
  { key:'writing',   label:'Writing',   icon:PenTool,    color:'#ea580c', bg:'#ffedd5', dbg:'#431407' },
]

// ── 3D Globe ─────────────────────────────────────────────
function ScoreGlobe({ score, dark }) {
  const meshRef  = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ptsRef   = useRef()

  const ptPos = useMemo(() => {
    const arr = new Float32Array(350 * 3)
    for (let i = 0; i < 350; i++) {
      const phi   = Math.acos(-1 + (2*i)/350)
      const theta = Math.sqrt(350 * Math.PI) * phi
      const r = 1.5 + Math.random() * 0.5
      arr[i*3]   = r * Math.cos(theta) * Math.sin(phi)
      arr[i*3+1] = r * Math.sin(theta) * Math.sin(phi)
      arr[i*3+2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current)  { meshRef.current.rotation.y = t*0.2; meshRef.current.rotation.x = Math.sin(t*0.1)*0.07 }
    if (ring1Ref.current) { ring1Ref.current.rotation.z = t*0.3; ring1Ref.current.rotation.x = Math.PI/2+Math.sin(t*0.13)*0.1 }
    if (ring2Ref.current) { ring2Ref.current.rotation.y = -t*0.18 }
    if (ptsRef.current)   { ptsRef.current.rotation.y = -t*0.06 }
  })

  const coreColor  = dark ? '#162032' : '#dbeafe'
  const emissive   = dark ? '#001a40' : '#93c5fd'
  const textColor  = dark ? '#60a5fa' : '#1d4ed8'
  const labelColor = dark ? '#94a3b8' : '#64748b'

  return (
    <group>
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ptPos, 3]}/>
        </bufferGeometry>
        <pointsMaterial color="#3b82f6" size={0.022} transparent opacity={0.4} sizeAttenuation/>
      </points>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.38, 0.015, 16, 120]}/>
        <meshBasicMaterial color="#007bff" transparent opacity={0.5}/>
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI/3, 0.4, 0]}>
        <torusGeometry args={[1.55, 0.009, 16, 120]}/>
        <meshBasicMaterial color="#00bfff" transparent opacity={0.25}/>
      </mesh>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.22}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.0, 72, 72]}/>
          <MeshDistortMaterial color={coreColor} distort={0.15} speed={1.4} roughness={0.1} metalness={0.5} emissive={emissive} emissiveIntensity={0.35}/>
        </mesh>
        <Text position={[0, 0.1, 1.06]} fontSize={0.48} color={textColor} anchorX="center" anchorY="middle">
          {score.toFixed(1)}
        </Text>
        <Text position={[0, -0.28, 1.06]} fontSize={0.12} color={labelColor} anchorX="center" anchorY="middle">
          BAND SCORE
        </Text>
      </Float>
      {SKILLS.map((sk, i) => {
        const a = (i / SKILLS.length) * Math.PI * 2
        return (
          <group key={sk.key} position={[Math.cos(a)*1.95, Math.sin(i*0.8)*0.35, Math.sin(a)*1.95]}>
            <mesh>
              <sphereGeometry args={[0.08, 16, 16]}/>
              <meshStandardMaterial color={sk.color} emissive={sk.color} emissiveIntensity={1.2} metalness={0.8}/>
            </mesh>
          </group>
        )
      })}
      <ambientLight intensity={dark ? 0.6 : 1.2}/>
      <pointLight position={[3,3,3]}    intensity={1.5} color="#007bff"/>
      <pointLight position={[-3,-2,-3]} intensity={0.8} color="#00bfff"/>
    </group>
  )
}

// ── 3D Skill Orbs ────────────────────────────────────────
function SkillOrb({ color, position, speed }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.y = t * speed
      ref.current.rotation.x = Math.sin(t * speed * 0.7) * 0.3
      ref.current.scale.setScalar(0.88 + Math.sin(t*1.1+position[0])*0.06)
    }
  })
  return (
    <group position={position}>
      <mesh><sphereGeometry args={[0.48,32,32]}/><meshBasicMaterial color={color} transparent opacity={0.1}/></mesh>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.34, 3]}/>
        <MeshDistortMaterial color={color} distort={0.25} speed={2.2} roughness={0.1} metalness={0.6} emissive={color} emissiveIntensity={0.3}/>
      </mesh>
      <pointLight intensity={1.5} color={color} distance={2.5}/>
    </group>
  )
}

// ── 3D Bars ──────────────────────────────────────────────
function Bar3D({ height, color, posX, delay }) {
  const ref = useRef()
  const [ch, setCh] = useState(0.001)
  useEffect(() => { const t = setTimeout(() => setCh(height), delay); return () => clearTimeout(t) }, [])
  useFrame(() => {
    if (!ref.current) return
    ref.current.scale.y += (ch - ref.current.scale.y) * 0.07
    ref.current.position.y = ref.current.scale.y / 2 - 0.5
  })
  return (
    <mesh ref={ref} position={[posX, -0.5, 0]} scale={[1, 0.001, 1]}>
      <boxGeometry args={[0.38, 1, 0.38]}/>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.25} metalness={0.5}/>
    </mesh>
  )
}

// ── SVG Line Chart ────────────────────────────────────────
function LineChart({ data, skill, dark }) {
  const W=540, H=130, P=18
  const vals = data.map(d => d[skill] ?? d.overall)
  const mn = Math.min(...vals)-0.4, mx = Math.max(...vals)+0.4
  const pts = vals.map((v,i) => [P+(i/(vals.length-1))*(W-P*2), H-P-((v-mn)/(mx-mn))*(H-P*2)])
  const line = pts.map(([x,y],i) => `${i?'L':'M'}${x},${y}`).join(' ')
  const area = `M${P},${H} ${pts.map(([x,y]) => `L${x},${y}`).join(' ')} L${W-P},${H} Z`
  const col  = SKILLS.find(s=>s.key===skill)?.color || '#007bff'
  const dotFill = dark ? '#1e293b' : '#fff'
  const labelCol = dark ? '#64748b' : '#94a3b8'

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
      <defs>
        <linearGradient id="lcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={col} stopOpacity="0"/>
        </linearGradient>
        <filter id="gf"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d={area} fill="url(#lcg)"/>
      <path d={line} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#gf)"/>
      {pts.map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.5" fill={dotFill} stroke={col} strokeWidth="2.5"/>
          <text x={x} y={H+6}  textAnchor="middle" fill={labelCol} fontSize="9"    fontFamily="inherit">{data[i].date}</text>
          <text x={x} y={y-11} textAnchor="middle" fill={col}      fontSize="10.5" fontWeight="700" fontFamily="inherit">{vals[i]}</text>
        </g>
      ))}
    </svg>
  )
}

// ── Main ─────────────────────────────────────────────────
export default function TestResults() {
  const [tab, setTab]             = useState('overview')
  const [skillView, setSkillView] = useState('overall')
  const [dark, setDark]           = useState(false)
  const [apiStats, setApiStats]   = useState(null)
  const [apiTests, setApiTests]   = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('ep-theme')
    setDark(saved === 'dark')
    const onStorage = () => setDark(localStorage.getItem('ep-theme') === 'dark')
    window.addEventListener('storage', onStorage)
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.getAttribute('data-theme') === 'dark')
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => { window.removeEventListener('storage', onStorage); obs.disconnect() }
  }, [])

  useEffect(() => {
    Promise.all([resultsApi.stats(), resultsApi.list({ limit: 20 })])
      .then(([s, r]) => { setApiStats(s); setApiTests(r) })
      .catch(() => {})
  }, [])

  const SKILLS = SKILLS_META.map(m => ({
    ...m,
    score: apiStats?.by_section?.[m.key]
      ? parseFloat((apiStats.by_section[m.key] / 11.1).toFixed(1))
      : 0
  }))

  const TESTS = apiTests.map((r, i) => ({
    id: i + 1,
    type: `${r.exam_type} ${r.section?.charAt(0).toUpperCase() + r.section?.slice(1) || ''}`,
    date: new Date(r.created_at || r.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short' }),
    score: parseFloat((r.band_score || r.score / 11.1).toFixed(1)),
    duration: r.duration_seconds ? `${Math.round(r.duration_seconds/60)}m` : '—',
  }))

  const overallBand = apiStats
    ? parseFloat((apiStats.average_score / 11.1).toFixed(1))
    : 0

  const latest = { overall: overallBand }
  const diff = 0

  // ── Theme tokens ─────────────────────────────────────
  const T = {
    page:       dark ? 'linear-gradient(135deg,#0a0f1e 0%,#0d1528 50%,#0a1020 100%)' : 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
    card:       dark ? '#111827' : '#ffffff',
    cardBorder: dark ? 'rgba(0,123,255,0.20)' : 'rgba(0,123,255,0.13)',
    cardShadow: dark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,123,255,0.09)',
    textPri:    dark ? '#f1f5f9' : '#0f172a',
    textSec:    dark ? '#94a3b8' : '#64748b',
    textMuted:  dark ? '#64748b' : '#94a3b8',
    inputBg:    dark ? '#1e293b' : '#f8fafc',
    rowBg:      dark ? '#1e293b' : '#f8fafc',
    rowBorder:  dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
    rowHover:   dark ? 'rgba(59,130,246,0.08)' : '#eff6ff',
    rowHoverBorder: dark ? 'rgba(59,130,246,0.35)' : '#93c5fd',
    tabBg:      dark ? 'rgba(0,123,255,0.10)' : 'rgba(0,123,255,0.07)',
    tabBorder:  dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
    barTrack:   dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
    tipBg:      dark ? '#1e293b' : '#f8fafc',
    blue:       dark ? '#3b82f6' : '#007bff',
    blueGrad:   'linear-gradient(135deg,#007bff,#00bfff)',
    planeBg:    dark ? '#162032' : '#f1f5f9',
  }

  const card = (extra = {}) => ({
    background: T.card,
    border: `2px solid ${T.cardBorder}`,
    borderRadius: 20,
    boxShadow: T.cardShadow,
    transition: 'box-shadow .25s, border-color .25s, transform .25s',
    ...extra,
  })

  return (
    <div style={{ minHeight:'100vh', background:T.page, color:T.textPri, fontFamily:'Inter,system-ui,sans-serif', paddingTop:90, paddingBottom:80, transition:'background .3s,color .3s' }}>
      <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 32px' }}>

        {/* ── Header ── */}
        <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
          style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:40 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:T.blue, textTransform:'uppercase', letterSpacing:2.5, marginBottom:8 }}>Analytics</div>
            <h1 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:900, color:T.textPri, margin:0, letterSpacing:'-1.5px', lineHeight:1.08 }}>
              Performance{' '}
              <span style={{ background:'linear-gradient(90deg,#007bff,#00bfff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Dashboard
              </span>
            </h1>
            <p style={{ color:T.textSec, marginTop:8, fontSize:14 }}>Track every score, every insight — your IELTS journey.</p>
          </div>
          <button onClick={()=>{
            const nd = !dark; setDark(nd)
            localStorage.setItem('ep-theme', nd?'dark':'light')
            document.documentElement.setAttribute('data-theme', nd?'dark':'light')
          }} style={{ padding:'11px 22px', borderRadius:12, border:`2px solid ${T.cardBorder}`, background:T.card, color:T.textPri, fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:T.cardShadow, transition:'all .25s' }}>
            {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </motion.div>

        {/* ── Stat cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
          {[
            { icon:Award,     label:'Current Band', value:latest.overall, badge:`+${diff}`, bc:'#059669', bb: dark?'#064e3b':'#d1fae5' },
            { icon:BarChart2, label:'Tests Taken',  value:28,             badge:'+3',       bc:'#007bff', bb: dark?'#1e3a5f':'#e6f0ff' },
            { icon:Target,    label:'Target Band',  value:'8.0',          badge:'goal',     bc:'#7c3aed', bb: dark?'#2e1f5e':'#ede9fe' },
            { icon:Clock,     label:'Study Hours',  value:'64h',          badge:'+5h',      bc:'#ea580c', bb: dark?'#431407':'#ffedd5' },
          ].map((s,i) => {
            const Icon = s.icon
            return (
              <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08,duration:0.4}}
                style={{ ...card({ padding:'20px', position:'relative', overflow:'hidden' }) }}>
                <div style={{ position:'absolute', top:-18, right:-18, width:80, height:80, background:`radial-gradient(circle,${s.bc}20 0%,transparent 70%)`, pointerEvents:'none' }}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                  <div style={{ width:38, height:38, borderRadius:11, background:s.bb, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={17} color={s.bc}/>
                  </div>
                  <span style={{ fontSize:10, fontWeight:800, color:s.bc, background:s.bb, padding:'3px 9px', borderRadius:20 }}>{s.badge}</span>
                </div>
                <div style={{ fontSize:30, fontWeight:900, color:T.textPri, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:T.textMuted, marginTop:5, fontWeight:600 }}>{s.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display:'flex', gap:4, marginBottom:22, padding:5, background:T.tabBg, border:`1px solid ${T.tabBorder}`, borderRadius:14, width:'fit-content' }}>
          {['overview','skills','history','mistakes'].map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ padding:'9px 22px', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .22s', fontFamily:'inherit', textTransform:'capitalize', background: tab===t ? T.blueGrad : 'transparent', color: tab===t ? '#fff' : T.textSec, boxShadow: tab===t ? '0 4px 14px rgba(0,123,255,0.3)' : 'none' }}>
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ══ OVERVIEW ══ */}
          {tab==='overview' && (
            <motion.div key="ov" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:0.28}}>
              <div style={{ display:'grid', gridTemplateColumns:'1.15fr 0.85fr', gap:18, marginBottom:18 }}>

                {/* Globe card */}
                <div style={{ ...card({ padding:0, overflow:'hidden' }) }}>
                  <div style={{ padding:'24px 26px 0' }}>
                    <div style={{ fontSize:11, fontWeight:800, color:T.textMuted, textTransform:'uppercase', letterSpacing:2, marginBottom:4 }}>Overall Band</div>
                    <div style={{ fontSize:52, fontWeight:900, color:T.blue, lineHeight:1 }}>{latest.overall}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:7 }}>
                      <TrendingUp size={13} color="#059669"/>
                      <span style={{ fontSize:13, color:'#059669', fontWeight:700 }}>+{diff} from last test</span>
                    </div>
                  </div>
                  <div style={{ height:280 }}>
                    <Canvas camera={{position:[0,0,5.2],fov:45}} dpr={[1,1.5]} gl={{alpha:true,antialias:true}} style={{background:'transparent'}}>
                      <ScoreGlobe score={latest.overall} dark={dark}/>
                    </Canvas>
                  </div>
                </div>

                {/* Recent tests */}
                <div style={{ ...card({ padding:'24px' }) }}>
                  <div style={{ fontWeight:800, fontSize:16, color:T.textPri, marginBottom:16 }}>Recent Tests</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                    {TESTS.map((t,i) => (
                      <motion.div key={t.id} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', background:T.rowBg, border:`1px solid ${T.rowBorder}`, borderRadius:11, cursor:'pointer', transition:'all .2s' }}
                        onMouseOver={e=>{e.currentTarget.style.borderColor=T.rowHoverBorder;e.currentTarget.style.background=T.rowHover}}
                        onMouseOut={e=>{e.currentTarget.style.borderColor=T.rowBorder;e.currentTarget.style.background=T.rowBg}}>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13, color:T.textPri }}>{t.type}</div>
                          <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{t.date} · {t.duration}</div>
                        </div>
                        <div style={{ fontSize:20, fontWeight:900, color:T.blue }}>{t.score}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3D Bar chart */}
              <div style={{ ...card({ padding:'24px 28px' }) }}>
                <div style={{ fontWeight:800, fontSize:16, color:T.textPri, marginBottom:3 }}>Score Progression — 3D</div>
                <div style={{ fontSize:12, color:T.textMuted, marginBottom:14 }}>Band scores Jan–Mar 2026</div>
                <div style={{ height:210 }}>
                  <Canvas camera={{position:[0,1.8,5.8],fov:44}} dpr={[1,1.5]} gl={{alpha:true,antialias:true}} style={{background:'transparent'}}>
                    <ambientLight intensity={dark?0.5:1.2}/>
                    <pointLight position={[0,4,3]} intensity={2} color="#007bff"/>
                    <pointLight position={[0,-2,-2]} intensity={0.8} color="#00bfff"/>
                    {HISTORY.map((h,i) => {
                      const c = new THREE.Color().lerpColors(new THREE.Color('#93c5fd'), new THREE.Color('#1d4ed8'), i/(HISTORY.length-1))
                      return <Bar3D key={i} height={h.overall-5} color={c.getStyle()} posX={(i-HISTORY.length/2+0.5)*0.88} delay={i*110}/>
                    })}
                    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.5,0]}>
                      <planeGeometry args={[9,4]}/><meshBasicMaterial color={T.planeBg} transparent opacity={0.8}/>
                    </mesh>
                  </Canvas>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', paddingLeft:14, paddingRight:14, marginTop:4 }}>
                  {HISTORY.map(h => <span key={h.date} style={{fontSize:10,color:T.textMuted}}>{h.date}</span>)}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ SKILLS ══ */}
          {tab==='skills' && (
            <motion.div key="sk" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:0.28}}>
              <div style={{ ...card({ padding:'24px 28px', marginBottom:18 }) }}>
                <div style={{ fontWeight:800, fontSize:16, color:T.textPri, marginBottom:3 }}>Skill Orbs — 3D</div>
                <div style={{ fontSize:12, color:T.textMuted, marginBottom:14 }}>Each orb = one skill — brightness shows performance</div>
                <div style={{ height:185 }}>
                  <Canvas camera={{position:[0,0.4,6.2],fov:46}} dpr={[1,1.5]} gl={{alpha:true}} style={{background:'transparent'}}>
                    <ambientLight intensity={dark?0.4:1.0}/>
                    {SKILLS.map((sk,i) => <SkillOrb key={sk.key} color={sk.color} position={[[-2.2,-0.74,0.74,2.2][i],0,0]} speed={0.3+i*0.08}/>)}
                  </Canvas>
                </div>
                <div style={{ display:'flex', justifyContent:'center', gap:32, marginTop:8 }}>
                  {SKILLS.map(sk => (
                    <div key={sk.key} style={{ textAlign:'center' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:sk.color, margin:'0 auto 5px', boxShadow:`0 0 8px ${sk.color}` }}/>
                      <div style={{ fontSize:11, color:T.textSec }}>{sk.label}</div>
                      <div style={{ fontSize:17, fontWeight:900, color:sk.color }}>{sk.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...card({ padding:'24px 28px', marginBottom:18 }) }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <div style={{ fontWeight:800, fontSize:16, color:T.textPri }}>Timeline</div>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    {['overall',...SKILLS.map(s=>s.key)].map(sk => {
                      const skMeta = SKILLS.find(s=>s.key===sk)
                      const c  = skMeta?.color || '#007bff'
                      const bg = dark ? skMeta?.dbg||'#1e3a5f' : skMeta?.bg||'#e6f0ff'
                      return (
                        <button key={sk} onClick={()=>setSkillView(sk)}
                          style={{ padding:'5px 13px', borderRadius:20, border: skillView===sk?`1.5px solid ${c}`:`1.5px solid ${T.rowBorder}`, background: skillView===sk?bg:'transparent', color: skillView===sk?c:T.textSec, fontSize:11, fontWeight:700, cursor:'pointer', transition:'all .2s', fontFamily:'inherit', textTransform:'capitalize' }}>
                          {sk}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <LineChart data={HISTORY} skill={skillView} dark={dark}/>
              </div>

              <div style={{ ...card({ padding:'26px 28px' }) }}>
                <div style={{ fontWeight:800, fontSize:16, color:T.textPri, marginBottom:20 }}>vs Target (8.0)</div>
                {SKILLS.map((sk,i) => {
                  const Icon = sk.icon
                  const iconBg = dark ? sk.dbg : sk.bg
                  return (
                    <motion.div key={sk.key} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}} style={{marginBottom:18}}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon size={15} color={sk.color}/>
                          </div>
                          <span style={{ fontWeight:700, fontSize:14, color:T.textPri }}>{sk.label}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ fontSize:11, color:T.textMuted }}>Target 8.0</span>
                          <span style={{ fontSize:20, fontWeight:900, color:sk.color }}>{sk.score}</span>
                        </div>
                      </div>
                      <div style={{ height:8, background:T.barTrack, borderRadius:99, position:'relative', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${(sk.score/9)*100}%`, background:`linear-gradient(90deg,${sk.color}70,${sk.color})`, borderRadius:99, animation:'ep-bar 1s ease both', boxShadow:`0 0 8px ${sk.color}50` }}/>
                        <div style={{ position:'absolute', top:0, bottom:0, left:`${(8/9)*100}%`, width:2, background: dark?'rgba(255,255,255,0.15)':'#cbd5e1', borderRadius:2 }}/>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ══ HISTORY ══ */}
          {tab==='history' && (
            <motion.div key="hi" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:0.28}}>
              <div style={{ ...card({ overflow:'hidden' }) }}>
                <div style={{ padding:'20px 26px', borderBottom:`1px solid ${T.rowBorder}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontWeight:800, fontSize:16, color:T.textPri }}>Test History</div>
                  <span style={{ fontSize:12, color:T.textMuted }}>{TESTS.length} tests</span>
                </div>
                {TESTS.map((t,i) => (
                  <motion.div key={t.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                    style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', padding:'18px 26px', borderBottom:i<TESTS.length-1?`1px solid ${T.rowBorder}`:'none', cursor:'pointer', transition:'background .2s' }}
                    onMouseOver={e=>e.currentTarget.style.background=T.rowHover}
                    onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:T.textPri, marginBottom:5 }}>{t.type}</div>
                      <div style={{ display:'flex', gap:14, fontSize:12, color:T.textMuted }}>
                        <span>📅 {t.date}</span><span>⏱ {t.duration}</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:28, fontWeight:900, color:T.blue, lineHeight:1 }}>{t.score}</div>
                        <div style={{ fontSize:9, color:T.textMuted, textTransform:'uppercase', letterSpacing:1 }}>Band</div>
                      </div>
                      <CheckCircle size={18} color="#059669"/>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ MISTAKES ══ */}
          {tab==='mistakes' && (
            <motion.div key="mi" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:0.28}}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:18 }}>
                {MISTAKES.map((m,i) => (
                  <motion.div key={i} initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} transition={{delay:i*0.08}}
                    style={{ ...card({ padding:'22px', position:'relative', overflow:'hidden' }) }}>
                    <div style={{ position:'absolute', top:-18, right:-18, width:90, height:90, background:`radial-gradient(circle,${m.color}15 0%,transparent 70%)`, pointerEvents:'none' }}/>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                      <div>
                        <div style={{ fontWeight:800, fontSize:14, color:T.textPri }}>{m.topic}</div>
                        <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{m.skill}</div>
                      </div>
                      <div style={{ fontSize:36, fontWeight:900, color:m.color, lineHeight:1 }}>{m.count}</div>
                    </div>
                    <div style={{ fontSize:12, color:T.textSec, lineHeight:1.65, background:T.tipBg, padding:'10px 13px', borderRadius:10, borderLeft:`3px solid ${m.color}` }}>
                      💡 {m.tip}
                    </div>
                    <div style={{ marginTop:12, height:5, background:T.barTrack, borderRadius:99 }}>
                      <div style={{ height:'100%', width:`${(m.count/10)*100}%`, background:`linear-gradient(90deg,${m.color}55,${m.color})`, borderRadius:99, animation:'ep-bar 1s ease both' }}/>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ ...card({ padding:'24px 26px', marginBottom:14 }) }}>
                <div style={{ fontWeight:800, fontSize:16, color:T.textPri, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
                  <Zap size={16} color={T.blue}/> AI Feedback Summary
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {[
                    { text:'Listening is your strongest skill — keep it up!',     good:true  },
                    { text:'Writing needs the most improvement to reach Band 8.', good:false },
                    { text:'Speaking fluency improved +0.5 points this month.',   good:true  },
                    { text:'Reading accuracy is consistent — focus on speed.',    good:true  },
                  ].map((f,i) => (
                    <motion.div key={i} initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                      style={{ display:'flex', alignItems:'flex-start', gap:11, fontSize:13, color:T.textSec, lineHeight:1.6, padding:'10px 13px', background:T.rowBg, borderRadius:10 }}>
                      {f.good ? <CheckCircle size={15} color="#059669" style={{flexShrink:0,marginTop:2}}/> : <XCircle size={15} color="#ea580c" style={{flexShrink:0,marginTop:2}}/>}
                      {f.text}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ background:'linear-gradient(135deg,#007bff,#00bfff)', borderRadius:16, padding:'22px 26px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:16, color:'#fff', marginBottom:4 }}>Fix weak spots with AI Tutor 🤖</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)' }}>Personalized exercises targeting your top mistakes.</div>
                </div>
                <button style={{ background:'#fff', color:'#007bff', border:'none', padding:'11px 22px', borderRadius:11, fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:7, boxShadow:'0 4px 14px rgba(0,0,0,0.15)' }}>
                  <Zap size={13}/> Start AI Session
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <style>{`@keyframes ep-bar { from { width: 0; } }`}</style>
    </div>
  )
}
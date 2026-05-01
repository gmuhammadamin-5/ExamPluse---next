'use client'
// components/Tests/SpeakingTest.jsx
//
// ✅ #2 — Haqiqiy mikrofon waveform (AudioContext + AnalyserNode)
// ✅ #3 — Mobile responsive (portrait & landscape)
// ✅ #4 — localStorage progress saqlash
// ✅ #5 — UX polish: 3-2-1 countdown, part transition, smooth animations

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Mic, Square, ArrowLeft, ChevronRight,
  Headset, CheckCircle2, Search,
  Zap, BookOpen, Brain, Music2, RotateCcw
} from 'lucide-react'

const STORAGE_KEY = 'ep_speaking_progress'

const PARTS = {
  1: {
    label: 'Part 1', title: 'Introduction & Interview',
    questions: [
      "Let's talk about your hometown. What do you like most about it, and has it changed much since you were a child?",
      "Do you work or are you a student? What do you enjoy most about it?",
      "How do you usually spend your free time? Has this changed compared to when you were younger?",
    ],
    tip: "20–40 sec per answer. Use personal examples.",
    prepTime: 0, speakTime: 60,
  },
  2: {
    label: 'Part 2', title: 'Individual Long Turn',
    questions: [
      "Describe a job you would like to do in the future.\n\nYou should say:\n• What the job is\n• What qualifications or skills you need\n• What the job involves\n\nAnd explain why you would like to do this job.",
    ],
    tip: "1 min prep, then speak 1–2 minutes continuously.",
    prepTime: 60, speakTime: 120,
  },
  3: {
    label: 'Part 3', title: 'Two-Way Discussion',
    questions: [
      "What kinds of jobs are most popular among young people in your country today, and why?",
      "Is it better to choose a career based on salary or personal interest? Why?",
      "How do you think AI and technology will change the job market over the next 20 years?",
    ],
    tip: "Abstract, developed answers. Use 'In my opinion', 'On the other hand'.",
    prepTime: 0, speakTime: 90,
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const saveProgress = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, savedAt: Date.now() })) } catch {}
}
const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const d = JSON.parse(raw)
    // 2 soatdan eski progress ni o'chirish
    if (Date.now() - d.savedAt > 2 * 60 * 60 * 1000) { localStorage.removeItem(STORAGE_KEY); return null }
    return d
  } catch { return null }
}
const clearProgress = () => { try { localStorage.removeItem(STORAGE_KEY) } catch {} }

// ─── AI Scoring via backend ────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const analyzeRecordings = async (recordings, fullTranscript = '') => {
  const allRecs = Object.values(recordings).flat()
  const avg   = allRecs.reduce((s, r) => s + r.duration, 0) / Math.max(1, allRecs.length)

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  // Try AI scoring if we have a meaningful transcript
  if (token && fullTranscript.split(' ').length >= 10) {
    try {
      const res = await fetch(`${API_URL}/api/ai/evaluate/speaking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ transcript: fullTranscript, exam_type: 'IELTS', task_type: 'all_parts' }),
      })
      if (res.ok) {
        const d = await res.json()
        const cr = d.criteria || {}
        const fc = parseFloat((cr.fluency_coherence || 6.0).toFixed(1))
        const lr = parseFloat((cr.lexical_resource  || 6.0).toFixed(1))
        const gr = parseFloat((cr.grammatical_range || 6.0).toFixed(1))
        const pr = parseFloat((cr.pronunciation     || 6.0).toFixed(1))
        const overall = d.band_score || parseFloat((Math.round(((fc+lr+gr+pr)/4)*2)/2).toFixed(1))

        // Save to backend
        fetch(`${API_URL}/api/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ section: 'speaking', exam_type: 'IELTS', band_score: overall, ai_scores: cr, ai_feedback: d.feedback || '' }),
        }).catch(() => {})

        const feedback = [
          ...(d.strengths    || []).map(t => `✅ ${t}`),
          ...(d.improvements || []).map(t => `⚠️ ${t}`),
        ]
        if (d.feedback) feedback.push(`💡 ${d.feedback}`)
        if (!feedback.length) feedback.push('💡 Complete all 3 parts for detailed AI feedback.')
        return { fc, lr, gr, pr, overall, feedback }
      }
    } catch {}
  }

  // Fallback: local scoring by duration
  await new Promise(r => setTimeout(r, 1800))
  const parts = Object.keys(recordings).length
  let fc = avg >= 60 ? 7.5 : avg >= 40 ? 6.5 : avg >= 20 ? 5.5 : 4.5
  if (parts === 3) fc = Math.min(9, fc + 0.5)
  let lr = Math.min(9, (recordings[3] ? 7.0 : 6.0) + Math.random() * 0.4)
  let gr = Math.min(9, (avg >= 50 ? 7.0 : avg >= 30 ? 6.0 : 5.5) + (recordings[2] ? 0.5 : 0))
  let pr = Math.min(9, 5.5 + Math.random() * 1.5)
  fc = parseFloat(fc.toFixed(1)); lr = parseFloat(lr.toFixed(1))
  gr = parseFloat(gr.toFixed(1)); pr = parseFloat(pr.toFixed(1))
  const overall = Math.round(((fc + lr + gr + pr) / 4) * 2) / 2
  const noTranscript = !fullTranscript
  const feedback = [
    noTranscript
      ? `ℹ️ No transcript captured — score estimated from recording duration. Use Chrome for AI scoring.`
      : `ℹ️ Log in for full AI evaluation.`,
    avg < 30
      ? `⚠️ Responses averaged ${Math.round(avg)}s — too short. Longer answers boost Fluency.`
      : `✅ Good response length (avg ${Math.round(avg)}s).`,
    !recordings[2] ? `⚠️ Part 2 not completed.` : `✅ Part 2 completed.`,
    !recordings[3] ? `⚠️ Part 3 not completed.` : `✅ Part 3 completed.`,
    `💡 Use conditionals, relative clauses and passive voice to signal a higher band.`,
  ]
  return { fc, lr, gr, pr, overall, feedback }
}

// ═══════════════════════════════════════════════════════════════════
// WEBGL ORB
// ═══════════════════════════════════════════════════════════════════
const WebGLOrb = ({ state, size = 280 }) => {
  const canvasRef = useRef(null)
  const stateRef  = useRef(state)
  const rafRef    = useRef(null)

  useEffect(() => { stateRef.current = state }, [state])

  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width  = size * dpr
    canvas.height = size * dpr
    canvas.style.width  = size + 'px'
    canvas.style.height = size + 'px'

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)
    gl.viewport(0, 0, canvas.width, canvas.height)

    const vs = `
      precision highp float;
      attribute vec3  a_pos;
      attribute float a_phase;
      attribute float a_size;
      uniform float u_time;
      uniform float u_state;
      uniform float u_dpr;
      varying float v_alpha;
      varying vec3  v_color;

      mat3 rotY(float a){return mat3(cos(a),0.,sin(a),0.,1.,0.,-sin(a),0.,cos(a));}
      mat3 rotX(float a){return mat3(1.,0.,0.,0.,cos(a),-sin(a),0.,sin(a),cos(a));}

      void main(){
        float spd = u_state==1. ? 0.62 : 0.26;
        mat3 R = rotY(u_time*spd)*rotX(sin(u_time*.3)*.12);
        float amp = u_state==1. ? .072*sin(u_time*7.+a_phase)
                  : u_state==2. ? .04 *sin(u_time*10.+a_phase)
                  :               .013*sin(u_time*1.4+a_phase);
        vec3 p = R*(a_pos*(1.+amp));
        float depth = clamp(p.z*.5+.5,0.,1.);

        float lat = abs(a_pos.y);
        v_color = mix(vec3(0.,.48,1.),vec3(0.,.75,1.),lat);
        if(u_state==1.){
          float sh=sin(u_time*5.+a_phase)*.5+.5;
          v_color=mix(v_color,vec3(.4,.88,1.),sh*.35);
        }

        float sz = a_size*(0.35+depth*0.9)*(u_state==1.?1.4:1.);
        gl_PointSize = sz*u_dpr;
        gl_Position  = vec4(p.x,p.y,0.,1.);
        v_alpha = 0.15+depth*0.80;
        if(u_state==1.) v_alpha=min(1.,v_alpha*(0.75+0.5*sin(u_time*4.5+a_phase)));
      }
    `
    const fs = `
      precision mediump float;
      varying float v_alpha;
      varying vec3  v_color;
      void main(){
        vec2 uv=gl_PointCoord-.5;
        float d=length(uv);
        if(d>.5)discard;
        float core=1.-smoothstep(0.,.20,d);
        float soft=1.-smoothstep(.15,.50,d);
        gl_FragColor=vec4(v_color+core*.35, soft*v_alpha+core*.45);
      }
    `
    const mk = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src); gl.compileShader(s); return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog); gl.useProgram(prog)

    const N = 2200
    const pos  = new Float32Array(N*3)
    const ph   = new Float32Array(N)
    const sz   = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const phi   = Math.acos(1 - 2*(i+.5)/N)
      const theta = Math.PI*(1+Math.sqrt(5))*i
      pos[i*3]   = Math.sin(phi)*Math.cos(theta)
      pos[i*3+1] = Math.sin(phi)*Math.sin(theta)
      pos[i*3+2] = Math.cos(phi)
      ph[i] = Math.random()*Math.PI*2
      sz[i] = (3.2 + Math.random()*3.2) * dpr
    }
    const buf = (d) => { const b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW); return b }
    const pb=buf(pos), phb=buf(ph), sb=buf(sz)
    const aPos=gl.getAttribLocation(prog,'a_pos')
    const aPh =gl.getAttribLocation(prog,'a_phase')
    const aSz =gl.getAttribLocation(prog,'a_size')
    const uT  =gl.getUniformLocation(prog,'u_time')
    const uS  =gl.getUniformLocation(prog,'u_state')
    const uD  =gl.getUniformLocation(prog,'u_dpr')
    gl.uniform1f(uD, dpr)

    const bind=(b,loc,n)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,0,0)}
    const sm={idle:0,speaking:1,listening:2,thinking:3}
    let t=0
    const loop=()=>{
      rafRef.current=requestAnimationFrame(loop)
      t+=0.012
      gl.clear(gl.COLOR_BUFFER_BIT)
      bind(pb,aPos,3); bind(phb,aPh,1); bind(sb,aSz,1)
      gl.uniform1f(uT,t); gl.uniform1f(uS, sm[stateRef.current]??0)
      gl.drawArrays(gl.POINTS,0,N)
    }
    loop()
    return ()=>{ cancelAnimationFrame(rafRef.current); gl.deleteProgram(prog) }
  }, [size])

  const active = state==='speaking'||state==='listening'
  const gc = state==='speaking'?'0,191,255':'0,123,255'
  return (
    <div style={{ position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <div style={{ position:'absolute', inset: state==='speaking'?-28:-12, borderRadius:'50%', background:`radial-gradient(circle,rgba(${gc},${state==='speaking'?.2:.08}) 0%,transparent 68%)`, transition:'all 1s', pointerEvents:'none' }}/>
      {active&&[0,1,2].map(i=>(
        <div key={i} style={{ position:'absolute', width:size+i*50, height:size+i*50, borderRadius:'50%', border:`1px solid rgba(${gc},.42)`, opacity:0, animation:`glRing ${state==='speaking'?'2s':'1.4s'} ease-out ${i*.4}s infinite`, pointerEvents:'none' }}/>
      ))}
      <canvas ref={canvasRef} style={{ borderRadius:'50%', display:'block' }}/>
      <style>{`@keyframes glRing{0%{transform:scale(.8);opacity:.55}100%{transform:scale(1.28);opacity:0}}`}</style>
    </div>
  )
}

// ─── Real Mic Waveform (AudioContext AnalyserNode) ────────────────────────────
const LiveWaveform = ({ stream, active }) => {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const analyserRef = useRef(null)

  useEffect(() => {
    if (!active || !stream) {
      cancelAnimationFrame(rafRef.current)
      // draw flat line
      const c = canvasRef.current; if (!c) return
      const ctx = c.getContext('2d')
      ctx.clearRect(0,0,c.width,c.height)
      ctx.beginPath(); ctx.moveTo(0,c.height/2); ctx.lineTo(c.width,c.height/2)
      ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=2; ctx.stroke()
      return
    }

    try {
      const ac  = new (window.AudioContext || window.webkitAudioContext)()
      const src = ac.createMediaStreamSource(stream)
      const an  = ac.createAnalyser()
      an.fftSize = 256
      src.connect(an)
      analyserRef.current = an
      const data = new Uint8Array(an.frequencyBinCount)
      const c    = canvasRef.current
      const W    = c.width, H = c.height
      const ctx2 = c.getContext('2d')

      const draw = () => {
        rafRef.current = requestAnimationFrame(draw)
        an.getByteTimeDomainData(data)
        ctx2.clearRect(0,0,W,H)

        // gradient line
        const grad = ctx2.createLinearGradient(0,0,W,0)
        grad.addColorStop(0,   'rgba(0,123,255,0.3)')
        grad.addColorStop(0.5, 'rgba(0,191,255,1)')
        grad.addColorStop(1,   'rgba(0,123,255,0.3)')
        ctx2.strokeStyle = grad
        ctx2.lineWidth   = 2.5
        ctx2.lineJoin    = 'round'
        ctx2.beginPath()

        const step = W / data.length
        for (let i = 0; i < data.length; i++) {
          const y = (data[i]/128 - 1) * (H*0.45) + H/2
          i === 0 ? ctx2.moveTo(0, y) : ctx2.lineTo(i*step, y)
        }
        ctx2.stroke()

        // glow
        ctx2.shadowColor = 'rgba(0,191,255,0.6)'
        ctx2.shadowBlur  = 8
        ctx2.stroke()
        ctx2.shadowBlur  = 0
      }
      draw()

      return () => {
        cancelAnimationFrame(rafRef.current)
        ac.close()
      }
    } catch { /* fallback to CSS waveform */ }
  }, [active, stream])

  return (
    <canvas ref={canvasRef} width={220} height={48}
      style={{ borderRadius:8, display:'block' }}/>
  )
}

// ─── CSS Waveform fallback ────────────────────────────────────────────────────
const CSSWaveform = ({ active }) => (
  <div style={{ display:'flex', alignItems:'center', gap:3 }}>
    {[...Array(20)].map((_,i) => (
      <div key={i} style={{
        width:3, borderRadius:3,
        background: active ? `hsl(${200+i*3},90%,${52+i}%)` : '#e2e8f0',
        height: active ? `${8+Math.abs(Math.sin(i*.65))*26}px` : '4px',
        animation: active ? `cssWv .65s ease-in-out ${i*.038}s infinite alternate` : 'none',
        transition:'background .4s',
      }}/>
    ))}
    <style>{`@keyframes cssWv{from{height:5px}to{height:36px}}`}</style>
  </div>
)

// ─── Arc Timer ────────────────────────────────────────────────────────────────
const ArcTimer = ({ total, left, size=86 }) => {
  const r=size*.39, c=2*Math.PI*r, pct=total>0?left/total:0
  const color=left<=10?'#ef4444':left<=20?'#f59e0b':'#007bff'
  const cx=size/2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4}/>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={`${c*pct} ${c}`}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition:'stroke-dasharray 1s linear,stroke .4s' }}/>
      <text x={cx} y={cx-4} textAnchor="middle" fontSize={size*.18} fontWeight={800} fill={color} fontFamily="Inter,sans-serif">{left}</text>
      <text x={cx} y={cx+10} textAnchor="middle" fontSize={size*.1} fontWeight={700} fill="#94a3b8" fontFamily="Inter,sans-serif">sec</text>
    </svg>
  )
}

// ─── Countdown 3-2-1 ─────────────────────────────────────────────────────────
const Countdown = ({ onDone }) => {
  const [n, setN] = useState(3)
  useEffect(() => {
    if (n <= 0) { onDone(); return }
    const t = setTimeout(() => setN(p => p-1), 800)
    return () => clearTimeout(t)
  }, [n])
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, animation:'cdIn .25s ease' }}>
      <div style={{ fontSize:72, fontWeight:900, color:'#007bff', lineHeight:1, fontFamily:'Inter,sans-serif', animation:'cdPop .4s ease' }}>
        {n > 0 ? n : '🎤'}
      </div>
      <span style={{ fontSize:13, color:'#94a3b8', fontWeight:700 }}>{n > 0 ? 'Get ready...' : 'Speak now!'}</span>
      <style>{`
        @keyframes cdIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
        @keyframes cdPop{0%{transform:scale(1.4)}100%{transform:scale(1)}}
      `}</style>
    </div>
  )
}

// ─── Part Transition ──────────────────────────────────────────────────────────
const PartTransition = ({ part, onDone }) => {
  useEffect(() => { const t=setTimeout(onDone,1800); return ()=>clearTimeout(t) }, [])
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', zIndex:50, animation:'ptIn .4s ease', gap:16 }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#007bff,#00bfff)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(0,123,255,.35)', animation:'ptPulse 1.6s ease infinite' }}>
        <span style={{ color:'white', fontWeight:900, fontSize:22, fontFamily:'Inter,sans-serif' }}>{part}</span>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:20, fontWeight:800, color:'#1e293b', fontFamily:'Inter,sans-serif' }}>{PARTS[part]?.label}</div>
        <div style={{ fontSize:14, color:'#64748b', fontFamily:'Inter,sans-serif', marginTop:4 }}>{PARTS[part]?.title}</div>
      </div>
      <style>{`
        @keyframes ptIn{from{opacity:0}to{opacity:1}}
        @keyframes ptPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const SpeakingTest = ({ test, onComplete, onExit }) => {
  // ── Restore progress ──
  const saved = loadProgress()

  const [currentPart, setCurrentPart] = useState(saved?.currentPart || 1)
  const [currentQ,    setCurrentQ]    = useState(saved?.currentQ || 0)
  const [orbState,    setOrbState]    = useState('idle')
  const [taskTimer,   setTaskTimer]   = useState(0)
  const [totalTimer,  setTotalTimer]  = useState(0)
  const [audioUrl,    setAudioUrl]    = useState(null)
  const [phase,       setPhase]       = useState('test')
  const [results,     setResults]     = useState(null)
  const [recordings,  setRecordings]  = useState(saved?.recordings || {})
  const [recordStart, setRecordStart] = useState(null)
  const [micError,    setMicError]    = useState('')
  const [caption,     setCaption]     = useState('')
  const [subCaption,  setSubCaption]  = useState('')
  const [countdown,   setCountdown]   = useState(false)   // 3-2-1
  const [partAnim,    setPartAnim]    = useState(false)   // part transition
  const [showResume,  setShowResume]  = useState(!!saved) // resume banner
  const [micStream,   setMicStream]   = useState(null)    // for live waveform
  const [isMobile,    setIsMobile]    = useState(false)

  const mediaRecorder       = useRef(null)
  const audioChunks         = useRef([])
  const streamRef           = useRef(null)
  const timerRef            = useRef(null)
  const lastBlobRef         = useRef(null)   // audio blob for Whisper upload
  const transcriptQueue     = useRef([])     // Promise[] — one per recording

  const part   = PARTS[currentPart]
  const question = part.questions[currentQ]
  const totalQ   = part.questions.length

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Save progress on change
  useEffect(() => {
    if (phase !== 'test') return
    saveProgress({ currentPart, currentQ, recordings })
  }, [currentPart, currentQ, recordings, phase])

  const clearTimer = () => { clearInterval(timerRef.current); timerRef.current = null }

  // ── AI voice ──
  const aiSpeak = useCallback((text) => {
    return new Promise(resolve => {
      if (!window.speechSynthesis) { resolve(); return }
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(text.replace(/•/g,'').replace(/\n/g,'. '))
      utt.lang='en-GB'; utt.rate=0.84; utt.pitch=1.12; utt.volume=1
      const pick=()=>{
        const vs=window.speechSynthesis.getVoices()
        return vs.find(v=>/google uk english female|samantha|victoria|karen|fiona|moira/i.test(v.name))
          ||vs.find(v=>v.lang==='en-GB')||vs.find(v=>v.lang.startsWith('en'))
      }
      const v=pick(); if(v) utt.voice=v
      else window.speechSynthesis.onvoiceschanged=()=>{const vv=pick();if(vv)utt.voice=vv}
      utt.onend=resolve; utt.onerror=resolve
      window.speechSynthesis.speak(utt)
    })
  }, [])

  // ── Open mic with AudioContext ──
  const openMic = useCallback(async () => {
    setMicError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setMicStream(stream)
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []
      mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data)
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
        lastBlobRef.current = blob
        setAudioUrl(URL.createObjectURL(blob))
        setMicStream(null)
      }
      mediaRecorder.current.start()
      setRecordStart(Date.now())
      setOrbState('listening')
      setCaption('Your turn — speak now')
      setSubCaption(part.tip)
      setTaskTimer(part.speakTime); setTotalTimer(part.speakTime)
      clearTimer()
      timerRef.current = setInterval(()=>{
        setTaskTimer(p=>{ if(p<=1){clearTimer();doStop();return 0} return p-1 })
      },1000)
    } catch {
      setMicError('Microphone access denied. Please allow microphone access and try again.')
      setOrbState('idle')
    }
  }, [part])

  const doStop = useCallback(() => {
    clearTimer()
    if (mediaRecorder.current?.state==='recording') mediaRecorder.current.stop()
    streamRef.current?.getTracks().forEach(t=>t.stop())
    setOrbState('thinking')
    setCaption('Listen back and review')
    setSubCaption('')
    setCountdown(false)
  }, [])

  // ── Start question: AI speaks → countdown → mic ──
  const startQuestion = useCallback(async () => {
    window.speechSynthesis?.cancel()
    setAudioUrl(null); clearTimer()
    setCountdown(false)
    setOrbState('speaking')
    setCaption(question.split('\n')[0])
    setSubCaption('')
    await aiSpeak(question)

    if (part.prepTime > 0) {
      setOrbState('idle')
      setCaption('Preparation time')
      setSubCaption('Make notes — recording starts automatically')
      setTaskTimer(part.prepTime); setTotalTimer(part.prepTime)
      timerRef.current = setInterval(()=>{
        setTaskTimer(p=>{ if(p<=1){clearTimer();triggerCountdown();return 0} return p-1 })
      },1000)
    } else {
      triggerCountdown()
    }
  }, [question, part, aiSpeak])

  const triggerCountdown = () => {
    setOrbState('idle')
    setCaption('')
    setSubCaption('')
    setCountdown(true)
  }

  const handleSend = () => {
    const dur = recordStart ? (Date.now()-recordStart)/1000 : 0

    // Fire Whisper transcription in background — works in ALL browsers
    const blob = lastBlobRef.current
    lastBlobRef.current = null
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (blob && token) {
      const p = (async () => {
        try {
          const fd = new FormData()
          fd.append('file', blob, 'recording.webm')
          const res = await fetch(`${API_URL}/api/ai/transcribe`, {
            method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
          })
          if (res.ok) { const d = await res.json(); return d.transcript || '' }
        } catch {}
        return ''
      })()
      transcriptQueue.current.push(p)
    }

    const upd = { ...recordings, [currentPart]: [...(recordings[currentPart]||[]), { duration:dur }] }
    setRecordings(upd)
    setAudioUrl(null); setRecordStart(null)
    setOrbState('idle'); setCaption(''); setSubCaption('')

    if (currentQ < totalQ-1) {
      setCurrentQ(q=>q+1)
    } else if (currentPart < 3) {
      // Part transition animation
      const nextPart = currentPart + 1
      setPartAnim(nextPart)
    } else {
      finishTest(upd)
    }
  }

  const finishTest = async (recs=recordings) => {
    clearProgress()
    window.speechSynthesis?.cancel(); clearTimer()
    setPhase('analyzing')

    // Wait for all Whisper transcriptions to finish
    let fullTranscript = ''
    if (transcriptQueue.current.length > 0) {
      const parts = await Promise.all(transcriptQueue.current)
      fullTranscript = parts.filter(Boolean).join(' ').trim()
      transcriptQueue.current = []
    }

    const res = await analyzeRecordings(recs, fullTranscript)
    setResults(res); setPhase('result')
  }

  // After part transition done
  const handlePartTransitionDone = () => {
    setPartAnim(false)
    setCurrentPart(partAnim)
    setCurrentQ(0)
  }

  useEffect(() => {
    if (partAnim) return // wait for transition
    const t = setTimeout(()=>startQuestion(), 700)
    return ()=>clearTimeout(t)
  }, [currentPart, currentQ, partAnim])

  useEffect(()=>()=>{ clearTimer(); window.speechSynthesis?.cancel() },[])

  const orbSize = isMobile ? 220 : 280

  // ── ANALYZING ──────────────────────────────────────────────────────────────
  if (phase==='analyzing') return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, fontFamily:'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      <WebGLOrb state="thinking" size={orbSize}/>
      <div style={{ textAlign:'center', padding:'0 20px' }}>
        <h2 style={{ fontSize:isMobile?20:22, fontWeight:800, color:'#1e293b', marginBottom:8 }}>Analysing your speaking...</h2>
        <p style={{ color:'#64748b', fontSize:14 }}>Fluency · Vocabulary · Grammar · Pronunciation</p>
      </div>
    </div>
  )

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase==='result') {
    const { fc,lr,gr,pr,overall,feedback } = results
    const pct=(overall/9)*100
    const bc=overall>=7?'#10b981':overall>=6?'#007bff':'#f59e0b'
    const crit=[
      {name:'Fluency & Coherence',score:fc,icon:<Zap size={15}/>,    color:'#007bff',bg:'#eff6ff',tip:fc>=7?'Speech flows naturally.':'Give longer, connected answers.'},
      {name:'Lexical Resource',   score:lr,icon:<BookOpen size={15}/>,color:'#10b981',bg:'#f0fdf4',tip:lr>=7?'Good vocabulary range.':'Use more idiomatic language.'},
      {name:'Grammatical Range',  score:gr,icon:<Brain size={15}/>,   color:'#8b5cf6',bg:'#f5f3ff',tip:gr>=7?'Good complex structures.':'Use conditionals and relative clauses.'},
      {name:'Pronunciation',      score:pr,icon:<Music2 size={15}/>,  color:'#f59e0b',bg:'#fffbeb',tip:pr>=7?'Clear and intelligible.':'Focus on word stress and intonation.'},
    ]
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'24px 16px', fontFamily:'Inter,sans-serif' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          .rw{background:rgba(255,255,255,.92);backdrop-filter:blur(24px);padding:clamp(20px,4vw,40px);border-radius:clamp(20px,4vw,36px);width:100%;max-width:860px;box-shadow:0 30px 80px rgba(0,123,255,.12);border:1px solid white;overflow-y:auto;max-height:95vh;}
          .rw-sr{display:grid;grid-template-columns:155px 1fr;gap:16px;margin-bottom:16px;}
          .rw-sc{background:white;padding:18px;border-radius:20px;border:1px solid #f1f5f9;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
          .rw-cw{position:relative;width:120px;height:120px;}
          .rw-svg{display:block;width:100%;height:100%;}
          .rw-bg{fill:none;stroke:#f1f5f9;stroke-width:2.8;}
          .rw-fg{fill:none;stroke-width:2.8;stroke-linecap:round;animation:rwP 1.2s ease-out forwards;}
          @keyframes rwP{from{stroke-dasharray:0 100;}}
          .rw-inn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
          .rw-cg{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
          .rw-cc{background:white;padding:14px 16px;border-radius:14px;border:1px solid #f1f5f9;}
          .rw-ch{display:flex;align-items:center;gap:8px;margin-bottom:7px;}
          .rw-ci{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
          .rw-bb{height:5px;background:#f1f5f9;border-radius:4px;overflow:hidden;}
          .rw-bf{height:100%;border-radius:4px;transition:width 1.2s ease;}
          .rw-fb{background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:18px;margin-bottom:20px;}
          .rw-fh{display:flex;align-items:center;gap:8px;color:#007bff;font-weight:700;margin-bottom:12px;font-size:14px;}
          .rw-fi{display:flex;gap:10px;margin-bottom:9px;padding-bottom:9px;border-bottom:1px solid #f1f5f9;align-items:flex-start;}
          .rw-fi:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none;}
          .rw-fd{width:19px;height:19px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;margin-top:2px;}
          .rw-ac{display:flex;gap:12px;}
          .rw-btn{flex:1;padding:14px;border-radius:14px;font-weight:700;font-size:14px;border:none;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:8px;transition:.2s;font-family:'Inter',sans-serif;}
          .rw-btn.p{background:linear-gradient(135deg,#007bff,#0062cc);color:white;box-shadow:0 8px 20px rgba(0,123,255,.25);}
          .rw-btn.p:hover{transform:translateY(-2px);}
          .rw-btn.s{background:white;color:#64748b;border:2px solid #f1f5f9;}
          .rw-btn.s:hover{background:#f8fafc;}
          @media(max-width:560px){.rw-sr{grid-template-columns:1fr;}.rw-cg{grid-template-columns:1fr;}.rw-ac{flex-direction:column;}}
        `}</style>
        <div className="rw">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
            <div>
              <h2 style={{ fontSize:'clamp(22px,5vw,28px)', fontWeight:800, color:'#1e293b', margin:0 }}>Analysis Report</h2>
              <p style={{ color:'#64748b', fontSize:13, marginTop:4 }}>IELTS Speaking · 3 Parts</p>
            </div>
            <div style={{ background:'#eff6ff', color:'#007bff', padding:'5px 12px', borderRadius:9, fontWeight:800, fontSize:11 }}>SPEAKING</div>
          </div>
          <div className="rw-sr">
            <div className="rw-sc">
              <p style={{ fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.8px', marginBottom:10 }}>Overall Band</p>
              <div className="rw-cw">
                <svg viewBox="0 0 36 36" className="rw-svg">
                  <path className="rw-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path className="rw-fg" stroke={bc} strokeDasharray={`${pct},100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                </svg>
                <div className="rw-inn">
                  <span style={{ fontSize:34, fontWeight:900, color:bc, lineHeight:1, display:'block' }}>{overall}</span>
                  <span style={{ fontSize:12, color:'#94a3b8', fontWeight:600 }}>/9.0</span>
                </div>
              </div>
              <div style={{ marginTop:10, fontSize:11, color:'#94a3b8', fontWeight:600 }}>3 Parts done</div>
            </div>
            <div className="rw-cg">
              {crit.map((c,i)=>(
                <div key={i} className="rw-cc">
                  <div className="rw-ch">
                    <div className="rw-ci" style={{ background:c.bg, color:c.color }}>{c.icon}</div>
                    <span style={{ fontSize:10, fontWeight:800, color:'#475569' }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:'#1e293b', marginBottom:5 }}>
                    {c.score}<span style={{ fontSize:12, color:'#94a3b8', fontWeight:600 }}>/9</span>
                  </div>
                  <div className="rw-bb"><div className="rw-bf" style={{ width:`${(c.score/9)*100}%`, background:c.color }}/></div>
                  <p style={{ fontSize:10, color:'#64748b', marginTop:5, lineHeight:1.4 }}>{c.tip}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rw-fb">
            <div className="rw-fh"><Search size={14}/><span>Detailed Feedback</span></div>
            {feedback.map((text,i)=>{
              const g=text.startsWith('✅'), tip=text.startsWith('💡')
              return (
                <div key={i} className="rw-fi">
                  <div className="rw-fd" style={{ background:g?'#dcfce7':tip?'#eff6ff':'#fff7ed', color:g?'#16a34a':tip?'#007bff':'#d97706' }}>{g?'✓':tip?'i':'!'}</div>
                  <span style={{ fontSize:13, color:'#334155', lineHeight:1.7 }}>{text}</span>
                </div>
              )
            })}
          </div>
          <div className="rw-ac">
            <button className="rw-btn s" onClick={onExit}>← Back to Home</button>
            <button className="rw-btn p" onClick={onComplete}><CheckCircle2 size={15}/> Back to Test Menu</button>
          </div>
        </div>
      </div>
    )
  }

  // ── TEST ───────────────────────────────────────────────────────────────────
  const isListening = orbState==='listening'
  const isReviewing = orbState==='thinking' && !!audioUrl
  const isPrepping  = orbState==='idle' && taskTimer>0 && part.prepTime>0
  const sc = { speaking:'#007bff', listening:'#0056b3', thinking:'#8b5cf6', idle:'#94a3b8' }[orbState]
  const sl = { speaking:'AI is speaking…', listening:'Recording your answer', thinking:'Review your response', idle: isPrepping?'Preparation time':'Ready' }[orbState]

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', fontFamily:'Inter,sans-serif', overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .st-exit{background:none;border:1.5px solid #e2e8f0;color:#94a3b8;border-radius:10px;padding:7px 13px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;display:flex;align-items:center;gap:6px;transition:all .2s;}
        .st-exit:hover{border-color:#fca5a5;color:#ef4444;}
        .st-end{background:white;border:1.5px solid #fecaca;color:#ef4444;border-radius:10px;padding:7px 16px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;transition:all .2s;white-space:nowrap;}
        .st-end:hover{background:#fff1f2;}
        .st-mic{border:none;cursor:pointer;transition:all .22s;display:flex;align-items:center;justify-content:center;border-radius:50%;}
        .st-mic:hover{transform:scale(1.08);}
        .st-mic:active{transform:scale(.94);}
        .st-rev{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border:1.5px solid rgba(255,255,255,.98);border-radius:24px;padding:22px;width:100%;max-width:400px;box-shadow:0 10px 40px rgba(0,0,0,.07);}
        .st-resume{background:rgba(0,123,255,.08);border:1.5px solid rgba(0,123,255,.2);border-radius:14px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:400px;animation:stIn .4s ease;}
        @keyframes stBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes stIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:isMobile?'12px 16px':'14px 28px', background:'rgba(255,255,255,.72)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,.9)', flexShrink:0, boxShadow:'0 1px 16px rgba(0,0,0,.04)', gap:8 }}>
        <button className="st-exit" onClick={onExit}><ArrowLeft size={15}/>{!isMobile&&' Exit'}</button>

        {/* Part tabs */}
        <div style={{ display:'flex', gap:isMobile?5:8, alignItems:'center' }}>
          {[1,2,3].map(p=>(
            <div key={p} style={{
              padding: isMobile?'5px 10px':'6px 15px',
              borderRadius:10, fontSize:isMobile?11:12, fontWeight:700, transition:'all .2s',
              background: p===currentPart?'linear-gradient(135deg,#007bff,#0062cc)':'rgba(255,255,255,.9)',
              color: p===currentPart?'white':p<currentPart?'#10b981':'#94a3b8',
              border: p===currentPart?'none':p<currentPart?'1.5px solid #86efac':'1.5px solid #e2e8f0',
              boxShadow: p===currentPart?'0 4px 14px rgba(0,123,255,.28)':'0 1px 4px rgba(0,0,0,.04)',
            }}>
              {p<currentPart?'✓ ':''}{PARTS[p].label}
            </div>
          ))}
          {totalQ>1&&<span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>Q{currentQ+1}/{totalQ}</span>}
        </div>

        <button className="st-end" onClick={()=>finishTest()}>End</button>
      </div>

      {/* CENTER */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 16px', gap:0, overflow:'hidden', position:'relative' }}>

        {/* Part transition overlay */}
        {partAnim && <PartTransition part={partAnim} onDone={handlePartTransitionDone}/>}

        {/* Resume banner */}
        {showResume && (
          <div className="st-resume" style={{ marginBottom:14 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#007bff' }}>Progress restored</div>
              <div style={{ fontSize:11, color:'#64748b' }}>{PARTS[currentPart]?.label} · Q{currentQ+1}</div>
            </div>
            <button onClick={()=>setShowResume(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:4 }}>✕</button>
          </div>
        )}

        {/* State pill */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.8)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.98)', borderRadius:99, padding:'5px 14px', marginBottom:14, boxShadow:'0 2px 12px rgba(0,0,0,.05)' }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:sc, flexShrink:0, animation:isListening?'stBlink 1s ease infinite':'none' }}/>
          <span style={{ fontSize:12, fontWeight:700, color:sc }}>{sl}</span>
        </div>

        {/* ORB */}
        <WebGLOrb state={orbState} size={orbSize}/>

        {/* Caption */}
        <div style={{ marginTop:16, maxWidth:520, textAlign:'center', minHeight:52, padding:'0 8px' }}>
          {caption && (
            <p style={{ fontSize:isMobile?15:17, fontWeight:600, color:'#1e293b', lineHeight:1.7, margin:'0 0 5px', whiteSpace:'pre-line', animation:'stIn .4s ease' }}>
              {caption}
            </p>
          )}
          {subCaption&&<p style={{ fontSize:12, color:'#64748b', fontWeight:500, margin:0 }}>{subCaption}</p>}
          {micError&&<div style={{ background:'#fee2e2', border:'1px solid #fecaca', borderRadius:12, padding:'10px 14px', color:'#dc2626', fontSize:12, fontWeight:600, marginTop:10 }}>{micError}</div>}
        </div>

        {/* COUNTDOWN */}
        {countdown && (
          <div style={{ marginTop:16 }}>
            <Countdown onDone={()=>{ setCountdown(false); openMic() }}/>
          </div>
        )}

        {/* PREP TIMER */}
        {isPrepping && !countdown && (
          <div style={{ marginTop:14, textAlign:'center', animation:'stIn .3s ease' }}>
            <ArcTimer total={part.prepTime} left={taskTimer} size={isMobile?72:86}/>
            <p style={{ color:'#94a3b8', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, marginTop:4 }}>Prep Time</p>
          </div>
        )}

        {/* RECORDING */}
        {isListening && (
          <div style={{ marginTop:16, display:'flex', flexDirection:'column', alignItems:'center', gap:10, animation:'stIn .3s ease' }}>
            <ArcTimer total={part.speakTime} left={taskTimer} size={isMobile?72:86}/>
            {/* Real mic waveform */}
            <LiveWaveform stream={micStream} active={true}/>
            <button className="st-mic" onClick={doStop} style={{ width:isMobile?56:62, height:isMobile?56:62, background:'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow:'0 8px 24px rgba(239,68,68,.38)' }}>
              <Square size={20} color="white"/>
            </button>
            <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'stBlink 1s ease infinite' }}/>
              Tap to stop early
            </span>
          </div>
        )}

        {/* Idle fallback mic */}
        {orbState==='idle' && taskTimer===0 && !audioUrl && !countdown && (
          <div style={{ marginTop:18, textAlign:'center', animation:'stIn .3s ease' }}>
            <button className="st-mic" onClick={()=>triggerCountdown()} style={{ width:isMobile?58:64, height:isMobile?58:64, background:'linear-gradient(135deg,#007bff,#0062cc)', boxShadow:'0 8px 24px rgba(0,123,255,.38)', margin:'0 auto' }}>
              <Mic size={24} color="white"/>
            </button>
            <p style={{ color:'#94a3b8', fontSize:11, fontWeight:600, marginTop:8 }}>Tap to record</p>
          </div>
        )}

        {/* REVIEW */}
        {isReviewing && audioUrl && (
          <div className="st-rev" style={{ marginTop:18, animation:'stIn .35s ease' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Headset size={17} color="#007bff"/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#1e293b' }}>Review your response</div>
                <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>Listen then submit or retry</div>
              </div>
            </div>
            <audio src={audioUrl} controls style={{ width:'100%', marginBottom:12, borderRadius:10 }}/>
            <div style={{ display:'flex', gap:9 }}>
              <button onClick={()=>{ setAudioUrl(null); setTimeout(()=>startQuestion(),150) }}
                style={{ flex:1, padding:'11px', borderRadius:11, background:'#fff1f2', color:'#ef4444', border:'1.5px solid #fecaca', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                <RotateCcw size={13}/> Retry
              </button>
              <button onClick={handleSend}
                style={{ flex:1, padding:'11px', borderRadius:11, background:'linear-gradient(135deg,#007bff,#0062cc)', color:'white', border:'none', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Inter,sans-serif', boxShadow:'0 4px 16px rgba(0,123,255,.28)', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all .2s' }}
                onMouseOver={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                {currentPart===3&&currentQ===totalQ-1?'Finish':'Next'} <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <div style={{ padding:isMobile?'10px 16px':'12px 28px', background:'rgba(255,255,255,.6)', backdropFilter:'blur(12px)', borderTop:'1px solid rgba(255,255,255,.88)', flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', whiteSpace:'nowrap' }}>{part.label}</span>
        <span style={{ fontSize:11, color:'#94a3b8', fontWeight:500, textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>💡 {part.tip}</span>
      </div>
    </div>
  )
}

export default SpeakingTest
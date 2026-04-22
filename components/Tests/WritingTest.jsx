'use client'
// components/Tests/WritingTest.jsx
//
// ✅ Skrin bilan aynan bir xil layout
// ✅ Haqiqiy IELTS 4-criteria scoring
// ✅ Result sahifasi — Task 1 + Task 2 feedback
// ✅ onComplete() → test selector ga qaytadi
// ✅ Login gradient style

import React, { useState, useEffect, useRef } from 'react'
import {
  Clock, FileText, Type, ChevronRight, ChevronLeft,
  CheckCircle2, ArrowLeft, Loader2, Search,
  Target, Layers, BookOpen, Brain
} from 'lucide-react'

// ─── HAQIQIY IELTS SCORING ────────────────────────────────────────────────────
const analyzeEssay = async (text, taskType, minWords) => {
  await new Promise(r => setTimeout(r, 1800))

  const words = text.trim().split(/\s+/).filter(Boolean)
  const wc = words.length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5)
  const avgLen = sentences.length > 0 ? wc / sentences.length : 0
  const unique = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size
  const lexDiv = wc > 0 ? unique / wc : 0
  const paras = text.split(/\n\n+/).filter(p => p.trim().length > 30).length

  const cohesive = ['however','therefore','furthermore','moreover','although',
    'nevertheless','consequently','in addition','on the other hand','in contrast',
    'firstly','secondly','finally','in conclusion','for instance','for example',
    'despite','whereas','as a result','in order to','additionally','subsequently']
  const cohCount = cohesive.filter(w => text.toLowerCase().includes(w)).length

  const complex = ['which','who','that','where','when','while','since',
    'because','if','unless','whether','although','despite','provided that','as long as']
  const cxCount = complex.filter(w => new RegExp(`\\b${w}\\b`,'gi').test(text)).length

  const wcRatio = Math.min(1, wc / minWords)

  // Task Achievement / Response
  let ta = wcRatio >= 1 ? 7.5 : wcRatio >= 0.85 ? 6.5 : wcRatio >= 0.65 ? 5.5 : 4.0
  if (paras >= 3) ta = Math.min(9, ta + 0.5)

  // Coherence & Cohesion
  let cc = cohCount >= 10 ? 8.0 : cohCount >= 6 ? 7.0 : cohCount >= 3 ? 6.0 : 5.0
  if (paras >= 4) cc = Math.min(9, cc + 0.5)

  // Lexical Resource
  let lr = lexDiv >= 0.72 ? 8.0 : lexDiv >= 0.58 ? 7.0 : lexDiv >= 0.44 ? 6.0 : 5.0

  // Grammatical Range & Accuracy
  let gr = 5.0
  if (avgLen >= 14 && avgLen <= 30) gr += 1.0
  if (cxCount >= 8) gr += 1.5
  else if (cxCount >= 4) gr += 0.8
  gr = Math.min(9, gr)

  const overall = Math.round(((ta + cc + lr + gr) / 4) * 2) / 2

  // Feedback
  const fb = []
  if (wc < minWords)
    fb.push({ type: 'warn', text: `Word count: ${wc}/${minWords} — ${minWords - wc} words short. This heavily penalises Task Achievement in real IELTS.` })
  else
    fb.push({ type: 'good', text: `Word count: ${wc} words ✓ — minimum requirement met.` })

  if (cohCount < 3)
    fb.push({ type: 'warn', text: `Only ${cohCount} linking expressions found. Use "However", "Furthermore", "In conclusion" etc. to boost Coherence.` })
  else
    fb.push({ type: 'good', text: `${cohCount} cohesive devices detected — good argument flow and logical progression.` })

  if (lexDiv < 0.42)
    fb.push({ type: 'warn', text: `High word repetition detected (${Math.round(lexDiv*100)}% diversity). Vary vocabulary with synonyms to improve Lexical Resource.` })
  else
    fb.push({ type: 'good', text: `Vocabulary diversity: ${Math.round(lexDiv*100)}% — strong lexical range detected.` })

  if (cxCount < 3)
    fb.push({ type: 'warn', text: `Mostly simple sentences. Add relative clauses, conditionals and subordination to reach Band 7+ Grammar.` })
  else
    fb.push({ type: 'good', text: `${cxCount} complex structures detected — good grammatical range shown.` })

  if (paras < 3)
    fb.push({ type: 'warn', text: `Use clear paragraph breaks: Introduction → Body 1 → Body 2 → Conclusion.` })

  return { ta: +ta.toFixed(1), cc: +cc.toFixed(1), lr: +lr.toFixed(1), gr: +gr.toFixed(1), overall, fb, wc }
}

// ─── TASKS DATA ───────────────────────────────────────────────────────────────
const TASKS = [
  {
    id: 1,
    label: 'Task 1',
    type: 'Academic Task 1',
    instruction: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    prompt: 'The table below shows the area of forested land (in millions of hectares) in different parts of the world in 1990, 2000 and 2005.',
    task: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    table: {
      title: 'Forest Area (000,000 ha)',
      cols: ['', '1990', '2000', '2005'],
      rows: [
        ['Africa',        '749', '709', '691'],
        ['Asia',          '576', '570', '584'],
        ['Europe',        '989', '998', '1001'],
        ['North America', '708', '705', '705'],
        ['Oceania',       '199', '198', '197'],
        ['South America', '946', '904', '882'],
      ]
    }
  },
  {
    id: 2,
    label: 'Task 2',
    type: 'Academic Task 2',
    instruction: 'You should spend about 40 minutes on this task. Write at least 250 words.',
    minWords: 250,
    prompt: 'In many countries, very few young people read newspapers or watch TV news on a regular basis.',
    task: 'What are the causes of this? What solutions can you suggest to encourage more young people to follow the news? Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
    tips: [
      'State your position clearly in the introduction.',
      'Use 4–5 paragraphs: Intro → Cause 1 → Cause 2 → Solutions → Conclusion.',
      'Support every point with a specific example.',
      'Aim for sentence variety: mix simple, compound and complex sentences.',
    ]
  }
]

// ─── SHARED RESULT STYLES (EnhancedWritingTest bilan aynan bir xil) ──────────
const ResultStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    .wt-result-wrap { background: rgba(255,255,255,0.92); backdrop-filter: blur(24px); padding: 40px; border-radius: 36px; width: 100%; max-width: 880px; box-shadow: 0 30px 80px rgba(59,130,246,0.12); border: 1px solid white; overflow-y: auto; max-height: 95vh; position: relative; margin: 0 auto; }
    .wt-rd-hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px; }
    .wt-rd-title { font-size: 28px; font-weight: 800; color: #1e293b; font-family: 'Inter',sans-serif; }
    .wt-rd-sub { color: #64748b; font-size: 14px; margin-top: 4px; font-family: 'Inter',sans-serif; }
    .wt-rd-badge { background: #eff6ff; color: #2563eb; padding: 6px 14px; border-radius: 10px; font-weight: 800; font-size: 12px; font-family: 'Inter',sans-serif; white-space: nowrap; }
    .wt-score-row { display: grid; grid-template-columns: 175px 1fr; gap: 18px; margin-bottom: 16px; }
    .wt-score-card-wrap { background: white; padding: 20px; border-radius: 20px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .wt-score-lbl { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; font-family: 'Inter',sans-serif; }
    .wt-circle-wrap { position: relative; width: 128px; height: 128px; }
    .wt-circle-svg { display: block; width: 100%; height: 100%; }
    .wt-circle-bg { fill: none; stroke: #f1f5f9; stroke-width: 2.8; }
    .wt-circle-fg { fill: none; stroke-width: 2.8; stroke-linecap: round; animation: wt-prog 1.2s ease-out forwards; }
    @keyframes wt-prog { from { stroke-dasharray: 0 100; } }
    .wt-circle-inner { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
    .wt-big-num { font-size: 38px; font-weight: 900; color: #1e293b; line-height: 1; display: block; font-family: 'Inter',sans-serif; }
    .wt-small-denom { font-size: 13px; color: #94a3b8; font-weight: 600; font-family: 'Inter',sans-serif; }
    .wt-crit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .wt-crit-card { background: white; padding: 16px 18px; border-radius: 16px; border: 1px solid #f1f5f9; }
    .wt-crit-hdr { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .wt-crit-ico { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .wt-crit-name { font-size: 11px; font-weight: 800; color: #475569; font-family: 'Inter',sans-serif; }
    .wt-crit-score { font-size: 20px; font-weight: 900; color: #1e293b; margin-bottom: 6px; font-family: 'Inter',sans-serif; }
    .wt-bar-bg { height: 6px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
    .wt-bar-fill { height: 100%; border-radius: 4px; transition: width 1.2s ease; }
    .wt-crit-tip { font-size: 11px; color: #64748b; margin-top: 6px; line-height: 1.4; font-family: 'Inter',sans-serif; }
    .wt-feedback-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; margin-bottom: 22px; }
    .wt-fb-hdr { display: flex; align-items: center; gap: 8px; color: #3b82f6; font-weight: 700; margin-bottom: 14px; font-size: 14px; font-family: 'Inter',sans-serif; }
    .wt-fb-item { display: flex; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; align-items: flex-start; font-family: 'Inter',sans-serif; }
    .wt-fb-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .wt-fb-dot { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; margin-top: 1px; }
    .wt-fb-txt { font-size: 14px; color: #334155; line-height: 1.75; }
    .wt-section-divider { height: 1px; background: #f1f5f9; margin: 24px 0; }
    .wt-task-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .wt-task-eyebrow { font-size: 11px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Inter',sans-serif; }
    .wt-task-name { font-size: 20px; font-weight: 900; color: #1e293b; font-family: 'Inter',sans-serif; }
    .wt-task-meta { font-size: 12px; color: #64748b; font-weight: 500; margin-top: 3px; font-family: 'Inter',sans-serif; }
    .wt-btn-primary { background: linear-gradient(135deg,#3b82f6,#2563eb); color: white; border: none; border-radius: 15px; padding: 15px 36px; font-weight: 700; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 9px; box-shadow: 0 8px 20px rgba(59,130,246,0.28); transition: all 0.22s; font-family: 'Inter',sans-serif; }
    .wt-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(59,130,246,0.4); }
    @media (max-width: 640px) {
      .wt-result-wrap { padding: 24px 18px; border-radius: 24px; }
      .wt-score-row { grid-template-columns: 1fr; }
      .wt-crit-grid { grid-template-columns: 1fr; }
    }
  `}</style>
)

// ─── SHARED ScoreCircle (EnhancedWritingTest SVG path style) ─────────────────
const ScoreCircle = ({ score }) => {
  const pct = (score / 9) * 100
  const color = score >= 7 ? '#10b981' : score >= 6 ? '#3b82f6' : '#f59e0b'
  return (
    <div className="wt-circle-wrap">
      <svg viewBox="0 0 36 36" className="wt-circle-svg">
        <path className="wt-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        <path className="wt-circle-fg" stroke={color}
          strokeDasharray={`${pct}, 100`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
      </svg>
      <div className="wt-circle-inner">
        <span className="wt-big-num" style={{ color }}>{score}</span>
        <span className="wt-small-denom">/9.0</span>
      </div>
    </div>
  )
}

// ─── SHARED CriteriaCard (icon li, EnhancedWritingTest bilan bir xil) ────────
const CriteriaCard = ({ name, score, icon, color, bgColor, tip }) => (
  <div className="wt-crit-card">
    <div className="wt-crit-hdr">
      <div className="wt-crit-ico" style={{ background: bgColor, color }}>{icon}</div>
      <span className="wt-crit-name">{name}</span>
    </div>
    <div className="wt-crit-score">
      {score}<span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>/9</span>
    </div>
    <div className="wt-bar-bg">
      <div className="wt-bar-fill" style={{ width: `${(score/9)*100}%`, background: color }}/>
    </div>
    <p className="wt-crit-tip">{tip}</p>
  </div>
)

// ─── TASK RESULT BLOCK ────────────────────────────────────────────────────────
const TaskResult = ({ task, result }) => {
  const criteria = [
    { name: task.id === 1 ? 'Task Achievement' : 'Task Response', key: 'ta',
      icon: <Target size={15}/>, color: '#3b82f6', bgColor: '#eff6ff',
      tip: result.ta >= 7 ? 'Good task coverage.' : 'Develop ideas more fully.' },
    { name: 'Coherence & Cohesion', key: 'cc',
      icon: <Layers size={15}/>, color: '#8b5cf6', bgColor: '#f5f3ff',
      tip: result.cc >= 7 ? 'Good linking words used.' : 'Add more transitions.' },
    { name: 'Lexical Resource', key: 'lr',
      icon: <BookOpen size={15}/>, color: '#10b981', bgColor: '#f0fdf4',
      tip: result.lr >= 7 ? 'Strong vocabulary range.' : 'Vary your word choices.' },
    { name: 'Grammatical Range', key: 'gr',
      icon: <Brain size={15}/>, color: '#f59e0b', bgColor: '#fffbeb',
      tip: result.gr >= 7 ? 'Good sentence complexity.' : 'Use more complex structures.' },
  ]

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Task header + ScoreCircle */}
      <div className="wt-task-label-row">
        <div>
          <div className="wt-task-eyebrow">{task.type}</div>
          <div className="wt-task-name">{task.label} Results</div>
          <div className="wt-task-meta">{result.wc} words written</div>
        </div>
        <div className="wt-score-card-wrap" style={{ minWidth: 130, padding: '16px 20px' }}>
          <p className="wt-score-lbl">Band Score</p>
          <ScoreCircle score={result.overall}/>
        </div>
      </div>

      {/* 4 Criteria grid */}
      <div className="wt-crit-grid" style={{ marginBottom: 16 }}>
        {criteria.map(c => (
          <CriteriaCard key={c.key} name={c.name} score={result[c.key]}
            icon={c.icon} color={c.color} bgColor={c.bgColor} tip={c.tip}/>
        ))}
      </div>

      {/* Feedback */}
      <div className="wt-feedback-box">
        <div className="wt-fb-hdr"><Search size={15}/><span>Detailed Feedback</span></div>
        {result.fb.map((f, i) => (
          <div key={i} className="wt-fb-item">
            <div className="wt-fb-dot" style={{ background: f.type==='good'?'#dcfce7':'#fff7ed', color: f.type==='good'?'#16a34a':'#d97706' }}>
              {f.type==='good'?'✓':'!'}
            </div>
            <span className="wt-fb-txt">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
const WritingTest = ({ test, onComplete, onExit }) => {
  const [activeTask, setActiveTask] = useState(0)
  const [answers, setAnswers] = useState({ 0: '', 1: '' })
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [phase, setPhase] = useState('test') // 'test' | 'analyzing' | 'result'
  const [results, setResults] = useState({ 0: null, 1: null })
  const textareaRef = useRef(null)

  // Timer
  useEffect(() => {
    if (phase !== 'test') return
    if (timeLeft <= 0) { handleFinish(); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [phase, timeLeft])

  const formatTime = (s) => {
    const m = Math.floor(s / 60), sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }
  const timeColor = timeLeft < 300 ? '#ef4444' : timeLeft < 600 ? '#f59e0b' : '#007bff'

  const countWords = (txt) => txt.trim().split(/\s+/).filter(Boolean).length

  const handleFinish = async () => {
    setPhase('analyzing')
    const [r0, r1] = await Promise.all([
      analyzeEssay(answers[0], 1, TASKS[0].minWords),
      analyzeEssay(answers[1], 2, TASKS[1].minWords),
    ])
    setResults({ 0: r0, 1: r1 })
    setPhase('result')
    // Save to backend
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        const avgBand = ((r0.band + r1.band) / 2).toFixed(1)
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ exam_type: 'IELTS', section: 'writing', score: Math.round(parseFloat(avgBand) * 11.1), max_score: 100, band_score: parseFloat(avgBand), answers: { task1_band: r0.band, task2_band: r1.band } })
        }).catch(() => {})
      }
    } catch {}
  }

  const overallBand = results[0] && results[1]
    ? Math.round(((results[0].overall + results[1].overall) / 2) * 2) / 2
    : 0

  // ── ANALYZING ──
  if (phase === 'analyzing') return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans,sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg,#007bff,#00bfff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 12px 32px rgba(0,123,255,0.3)',
          animation: 'wt-spin 1.2s linear infinite'
        }}>
          <Loader2 size={36} color="white" />
        </div>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>
          Analysing your essays...
        </h2>
        <p style={{ color: '#64748b', fontSize: 15 }}>Scoring all 4 IELTS criteria for each task</p>
        <style>{`@keyframes wt-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  // ── RESULT ──
  if (phase === 'result') return (
    <div style={{ minHeight:'100vh', background:'#f5f7fa', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'32px 20px', fontFamily:'Inter,sans-serif' }}>
      <ResultStyles/>
      <div className="wt-result-wrap">

        {/* Header */}
        <div className="wt-rd-hdr">
          <div>
            <h2 className="wt-rd-title">Analysis Report</h2>
            <p className="wt-rd-sub">IELTS Writing Assessment · 2 Tasks</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div className="wt-rd-badge">WRITING</div>
            <div style={{ background:'#eff6ff', borderRadius:14, padding:'10px 18px', textAlign:'center' }}>
              <div style={{ fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1 }}>Overall</div>
              <div style={{ fontSize:28, fontWeight:900, color:'#3b82f6', fontFamily:'Inter,sans-serif', lineHeight:1 }}>{overallBand}</div>
            </div>
          </div>
        </div>

        {/* Task 1 */}
        {results[0] && <TaskResult task={TASKS[0]} result={results[0]}/>}

        <div className="wt-section-divider"/>

        {/* Task 2 */}
        {results[1] && <TaskResult task={TASKS[1]} result={results[1]}/>}

        {/* Back button */}
        <div style={{ textAlign:'center', marginTop:8 }}>
          <button className="wt-btn-primary" onClick={onComplete}>
            <CheckCircle2 size={18}/> Back to Test Menu
          </button>
        </div>
      </div>
    </div>
  )

  // ── TEST INTERFACE ──
  const task = TASKS[activeTask]
  const currentAnswer = answers[activeTask]
  const wc = countWords(currentAnswer)
  const wcOk = wc >= task.minWords

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      fontFamily: 'DM Sans,sans-serif', background: '#f5f7fa', minHeight: '100vh'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .wt-textarea { resize: none; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .wt-textarea:focus { border-color: #007bff !important; box-shadow: 0 0 0 3px rgba(0,123,255,0.1) !important; }
        .wt-table td, .wt-table th { padding: 9px 14px; border: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; }
        .wt-table th { background: #f0f8ff; color: #007bff; font-weight: 800; text-align: center; font-size: 13px; }
        .wt-table td:first-child { font-weight: 700; color: #334155; background: #fafbfc; }
        .wt-table td:not(:first-child) { text-align: center; color: #1e293b; }
        .wt-tab-btn { cursor: pointer; border: none; font-family: 'DM Sans',sans-serif; transition: all 0.2s; }
        .wt-tab-btn:hover { opacity: 0.85; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '0 28px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexShrink: 0, height: 52
      }}>
        {/* Left: label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onExit} style={{
            background: 'none', border: 'none', borderRadius: 8,
            padding: '7px 8px', cursor: 'pointer', color: '#94a3b8',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
            fontFamily: 'DM Sans,sans-serif', transition: 'color 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.color = '#475569'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={14}/>
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 1.5 }}>Writing</span>
        </div>

        {/* Center: task tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {TASKS.map((t, i) => (
            <button key={i} className="wt-tab-btn" onClick={() => setActiveTask(i)} style={{
              padding: '6px 18px', borderRadius: 7, fontSize: 13, fontWeight: 700,
              background: i === activeTask ? '#007bff' : '#f1f5f9',
              color: i === activeTask ? 'white' : '#64748b',
              border: 'none',
            }}>
              {t.label}
              <span style={{ marginLeft: 6, opacity: 0.75, fontSize: 11 }}>
                {countWords(answers[i])}/{t.minWords}
              </span>
            </button>
          ))}
        </div>

        {/* Right: timer + finish */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            color: timeLeft < 300 ? '#ef4444' : '#475569',
            fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <Clock size={15} color={timeLeft < 300 ? '#ef4444' : '#94a3b8'}/> {formatTime(timeLeft)}
          </div>
          <button onClick={handleFinish} style={{
            background: '#007bff',
            color: 'white', border: 'none', borderRadius: 8,
            padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s'
          }}
            onMouseOver={e => { e.currentTarget.style.background = '#0062cc'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseOut={e => { e.currentTarget.style.background = '#007bff'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Finish
          </button>
        </div>
      </div>

      {/* ── INSTRUCTION BAR ── */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e8edf2',
        padding: '10px 28px', flexShrink: 0,
        fontSize: 13, color: '#475569', fontWeight: 500
      }}>
        <strong style={{ color: '#1e293b' }}>{task.label}.</strong> {task.instruction}
      </div>

      {/* ── MAIN LAYOUT — chap: prompt, o'ng: editor ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>

        {/* LEFT — Prompt pane */}
        <div style={{
          overflowY: 'auto', padding: '28px 30px',
          borderRight: '1px solid #e8edf2',
          background: 'white'
        }}>
          {/* Task title */}
          <div style={{ fontSize: 14, fontWeight: 900, color: '#1e293b', marginBottom: 8, fontFamily: 'Outfit,sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Writing {task.label}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 20 }}>
            {task.instruction}
          </div>

          {/* Prompt box — skrin kabi italic border box */}
          <div style={{
            border: '1.5px solid #cbd5e1', borderRadius: 12,
            padding: '18px 20px', marginBottom: 18,
            background: 'rgba(255,255,255,0.9)'
          }}>
            <p style={{ fontStyle: 'italic', fontWeight: 700, color: '#1e293b', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
              {task.prompt}
            </p>
            <p style={{ fontStyle: 'italic', fontWeight: 700, color: '#1e293b', fontSize: 14, lineHeight: 1.7 }}>
              {task.task}
            </p>
          </div>

          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 20 }}>
            Write at least {task.minWords} words.
          </div>

          {/* Task 1: Table */}
          {activeTask === 0 && task.table && (
            <div style={{ overflowX: 'auto' }}>
              <table className="wt-table" style={{
                width: '100%', borderCollapse: 'collapse',
                borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
              }}>
                <thead>
                  <tr>
                    <th colSpan={4} style={{ background: '#f0f8ff', color: '#007bff', fontWeight: 900, fontSize: 14, padding: '12px', borderBottom: '2px solid #e2e8f0' }}>
                      {task.table.title}
                    </th>
                  </tr>
                  <tr>
                    {task.table.cols.map((c, i) => <th key={i}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {task.table.rows.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'white' : 'rgba(240,248,255,0.4)' }}>
                      {row.map((cell, j) => <td key={j}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Task 2: Tips */}
          {activeTask === 1 && task.tips && (
            <div style={{
              background: 'rgba(239,246,255,0.8)', borderRadius: 16,
              padding: '18px 20px', border: '1.5px solid rgba(0,123,255,0.1)'
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#007bff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Tips for Task 2
              </div>
              {task.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 9, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#007bff', flexShrink: 0, marginTop: 6 }}/>
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 600, lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Editor pane */}
        <div style={{
          display: 'flex', flexDirection: 'column', padding: '28px 30px',
          background: '#f8f9fb'
        }}>
          {/* Editor label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2 }}>
            <Type size={14}/> Write your response
          </div>

          {/* Textarea — takes all remaining space */}
          <textarea
            ref={textareaRef}
            className="wt-textarea"
            value={currentAnswer}
            onChange={e => setAnswers(p => ({ ...p, [activeTask]: e.target.value }))}
            placeholder={`Write ${task.label} here...`}
            style={{
              flex: 1, width: '100%', padding: '20px',
              border: '1.5px solid #e2e8f0', borderRadius: 20,
              fontSize: 15, lineHeight: 1.75, color: '#1e293b',
              background: 'white',
              fontFamily: 'DM Sans,sans-serif', fontWeight: 500,
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.04)'
            }}
          />

          {/* Footer: word count + nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            {/* Word count badge */}
            <div style={{
              background: wcOk ? '#dcfce7' : 'white',
              border: `1.5px solid ${wcOk ? '#86efac' : '#e2e8f0'}`,
              borderRadius: 12, padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 13, fontWeight: 800,
              color: wcOk ? '#16a34a' : '#64748b'
            }}>
              <FileText size={15}/>
              Words: {wc}
              <span style={{ fontWeight: 600, opacity: 0.7 }}>/ {task.minWords}</span>
              {wcOk && <CheckCircle2 size={13}/>}
            </div>

            {/* Task navigation */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="wt-tab-btn" onClick={() => setActiveTask(0)}
                disabled={activeTask === 0}
                style={{
                  padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                  background: activeTask === 0 ? '#f1f5f9' : 'rgba(255,255,255,0.9)',
                  color: activeTask === 0 ? '#cbd5e1' : '#007bff',
                  border: `1.5px solid ${activeTask === 0 ? '#f1f5f9' : '#007bff'}`,
                  cursor: activeTask === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5
                }}>
                <ChevronLeft size={15}/> Task 1
              </button>
              <button className="wt-tab-btn" onClick={() => setActiveTask(1)}
                disabled={activeTask === 1}
                style={{
                  padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                  background: activeTask === 1 ? '#f1f5f9' : '#007bff',
                  color: activeTask === 1 ? '#cbd5e1' : 'white',
                  border: 'none',
                  cursor: activeTask === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: activeTask === 1 ? 'none' : '0 4px 14px rgba(0,123,255,0.25)'
                }}>
                Task 2 <ChevronRight size={15}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #e8edf2',
        padding: '10px 28px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700
      }}>
        <span style={{ color: activeTask === 0 ? '#007bff' : '#94a3b8', cursor: 'pointer' }}
          onClick={() => setActiveTask(0)}>
          Part 1
        </span>
        <span style={{ color: '#94a3b8' }}>
          Part 2 &nbsp;{countWords(answers[1])} of {TASKS[1].minWords}
        </span>
      </div>
    </div>
  )
}

export default WritingTest
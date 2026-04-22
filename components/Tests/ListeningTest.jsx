'use client'
// components/Tests/ListeningTest.jsx
// Cambridge IELTS Online screen — aynan shu ko'rinish, EP #007bff ranglari

import React, { useState, useRef, useEffect } from 'react'
import { CheckCircle2, Search, HelpCircle } from 'lucide-react'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PARTS = [
  {
    id: 1, label: 'Part 1',
    sectionLabel: 'Part 1',
    subTitle: 'Listen and answer questions 1 - 10.',
    questionsLabel: 'Questions 1 – 10',
    instruction: <>Complete the notes below. Choose <strong>ONE WORD OR A NUMBER</strong> from the passage for each answer. Write your answers in boxes 1–10 on your answer sheet.</>,
    passageTitle: 'Asia-Pacific Tours – Activity Holidays',
    content: [
      { type: 'heading', text: 'Tour:  example : Vietnam' },
      { type: 'bullet', text: 'a cookery course at a 5-star hotel' },
      { type: 'gap',    before: 'either ', qId: 1, after: ' lessons' },
      { type: 'gap',    before: 'or a one-day trek in the ', qId: 2, after: '' },
      { type: 'gap',    before: 'attend a ', qId: 3, after: ' performance' },
      { type: 'gap',    before: 'Cost: £', qId: 4, after: '' },
      { type: 'heading', text: 'Tour: Hong Kong' },
      { type: 'gap',    before: 'go to the hills to look at ', qId: 5, after: ' in a country park' },
      { type: 'gap',    before: 'followed by ', qId: 6, after: ' in a monastery' },
      { type: 'gap',    before: 'visit an ', qId: 7, after: ' factory within the chance to shop' },
      { type: 'bullet', text: 'Cost: £ 1,320' },
      { type: 'heading-gap', before: 'Tour : ', qId: 8, after: '' },
      { type: 'gap',    before: 'visit a museum of traditional ', qId: 9, after: '' },
      { type: 'gap',    before: 'Tour of a big ', qId: 10, after: ' market' },
    ],
    answers: { 1:'morning', 2:'northern', 3:'cultural', 4:'1200', 5:'wildlife', 6:'meditation', 7:'electronics', 8:'Thailand', 9:'performing', 10:'floating' }
  },
  {
    id: 2, label: 'Part 2',
    sectionLabel: 'Part 2',
    subTitle: 'Listen and answer questions 11 - 20.',
    questionsLabel: 'Questions 11 – 20',
    instruction: <>Choose the correct letter, <strong>A, B or C</strong>.</>,
    passageTitle: 'Community Radio Station — Volunteer Information',
    content: [
      { type: 'mcq', qId: 11, text: 'The radio station was founded in', options: ['A.  1995', 'B.  2001', 'C.  2008'], correct: 'B' },
      { type: 'mcq', qId: 12, text: 'The main purpose of the station is to', options: ['A.  entertain local residents', 'B.  provide news updates', 'C.  support community events'], correct: 'C' },
      { type: 'mcq', qId: 13, text: 'Volunteers must work a minimum of', options: ['A.  4 hours per week', 'B.  6 hours per week', 'C.  8 hours per week'], correct: 'A' },
      { type: 'mcq', qId: 14, text: 'Training for new volunteers takes place', options: ['A.  online', 'B.  at the station', 'C.  at a local college'], correct: 'B' },
      { type: 'mcq', qId: 15, text: 'The most popular volunteer role is', options: ['A.  presenting', 'B.  sound engineering', 'C.  producing'], correct: 'A' },
      { type: 'mcq', qId: 16, text: 'To apply, volunteers should first', options: ['A.  attend an open day', 'B.  complete an online form', 'C.  contact the manager'], correct: 'B' },
      { type: 'mcq', qId: 17, text: 'The station broadcasts', options: ['A.  12 hours a day', 'B.  18 hours a day', 'C.  24 hours a day'], correct: 'C' },
      { type: 'mcq', qId: 18, text: 'Volunteers receive', options: ['A.  a monthly payment', 'B.  free training courses', 'C.  discounts at local shops'], correct: 'B' },
      { type: 'mcq', qId: 19, text: 'The station is located', options: ['A.  in the town centre', 'B.  near the university', 'C.  on an industrial estate'], correct: 'A' },
      { type: 'mcq', qId: 20, text: 'The next volunteer evening is', options: ['A.  this Friday', 'B.  next Tuesday', 'C.  next Thursday'], correct: 'B' },
    ],
    answers: { 11:'B',12:'C',13:'A',14:'B',15:'A',16:'B',17:'C',18:'B',19:'A',20:'B' }
  },
  {
    id: 3, label: 'Part 3',
    sectionLabel: 'Part 3',
    subTitle: 'Listen and answer questions 21 - 30.',
    questionsLabel: 'Questions 21 – 30',
    instruction: <>Do the following statements agree with what the speakers say? Write <strong>TRUE</strong>, <strong>FALSE</strong> or <strong>NOT GIVEN</strong>.</>,
    passageTitle: 'University Discussion — Climate Change Research',
    content: [
      { type: 'tfn', qId: 21, text: 'The research project began three years ago.' },
      { type: 'tfn', qId: 22, text: 'The team has collected data from over 20 countries.' },
      { type: 'tfn', qId: 23, text: 'Funding comes entirely from the government.' },
      { type: 'tfn', qId: 24, text: 'The professor believes temperatures will rise by 2°C by 2050.' },
      { type: 'tfn', qId: 25, text: 'The students disagree with the professor\'s conclusion.' },
      { type: 'tfn', qId: 26, text: 'A new paper will be published next month.' },
      { type: 'tfn', qId: 27, text: 'Ocean temperatures have risen faster than air temperatures.' },
      { type: 'tfn', qId: 28, text: 'The research uses satellite data exclusively.' },
      { type: 'tfn', qId: 29, text: 'The professor has worked in this field for 15 years.' },
      { type: 'tfn', qId: 30, text: 'The next phase will focus on Arctic regions.' },
    ],
    answers: { 21:'TRUE',22:'FALSE',23:'NOT GIVEN',24:'TRUE',25:'FALSE',26:'NOT GIVEN',27:'TRUE',28:'FALSE',29:'NOT GIVEN',30:'TRUE' }
  },
  {
    id: 4, label: 'Part 4',
    sectionLabel: 'Part 4',
    subTitle: 'Listen and answer questions 31 - 40.',
    questionsLabel: 'Questions 31 – 40',
    instruction: <>Complete the sentences below. Write <strong>NO MORE THAN TWO WORDS</strong> for each answer.</>,
    passageTitle: 'The History of Urban Planning',
    content: [
      { type: 'gap', before: 'Urban planning arose from ', qId: 31, after: ' conditions in 19th-century cities.' },
      { type: 'gap', before: 'The first planned cities featured wide ', qId: 32, after: ' for air circulation.' },
      { type: 'gap', before: 'Green spaces improved residents\' ', qId: 33, after: ' and wellbeing.' },
      { type: 'gap', before: 'The concept of ', qId: 34, after: ' cities became popular early in the 20th century.' },
      { type: 'gap', before: 'Post-war planners prioritised ', qId: 35, after: ' housing to address shortages.' },
      { type: 'gap', before: 'Modern planning emphasises ', qId: 36, after: ' development to protect the environment.' },
      { type: 'gap', before: 'Many cities invest in ', qId: 37, after: ' transport to reduce car use.' },
      { type: 'gap', before: 'Smart city technology uses ', qId: 38, after: ' to manage traffic and energy.' },
      { type: 'gap', before: 'Community involvement is seen as ', qId: 39, after: ' to successful planning.' },
      { type: 'gap', before: 'Future cities must balance growth with ', qId: 40, after: ' of existing neighbourhoods.' },
    ],
    answers: { 31:'overcrowded',32:'boulevards',33:'health',34:'garden',35:'affordable',36:'sustainable',37:'public',38:'data',39:'essential',40:'preservation' }
  }
]

const getBand = (n) => {
  if (n>=39) return 9.0; if (n>=37) return 8.5; if (n>=35) return 8.0
  if (n>=33) return 7.5; if (n>=30) return 7.0; if (n>=27) return 6.5
  if (n>=23) return 6.0; if (n>=20) return 5.5; if (n>=16) return 5.0
  if (n>=13) return 4.5; return 4.0
}
const fmt = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

// ─── INLINE GAP INPUT ─────────────────────────────────────────────────────────
const GapInput = ({ qId, value, onChange }) => (
  <span style={{ display:'inline-flex', alignItems:'center', position:'relative', margin:'0 1px' }}>
    <span style={{ position:'absolute', top:-9, left:3, fontSize:9, fontWeight:700, color:'#007bff', background:'white', padding:'0 2px', lineHeight:'12px', pointerEvents:'none', zIndex:1 }}>{qId}</span>
    <input
      value={value || ''}
      onChange={e => onChange(qId, e.target.value)}
      style={{
        width: 90, height: 24,
        border: '1.5px solid #94a3b8',
        borderRadius: 3,
        outline: 'none',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        color: '#1e293b',
        textAlign: 'center',
        padding: '0 4px',
        background: 'white',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = '#007bff'}
      onBlur={e => e.target.style.borderColor = '#94a3b8'}
    />
  </span>
)

// ─── PASSAGE RENDERER ─────────────────────────────────────────────────────────
const PassageContent = ({ items, answers, onChange }) => (
  <div style={{ fontSize: 14, color: '#1e293b', lineHeight: 2.1, fontFamily: 'inherit' }}>
    {items.map((item, i) => {
      if (item.type === 'heading') return (
        <div key={i} style={{ fontWeight: 700, marginTop: 14, marginBottom: 2, textDecoration: 'underline' }}>
          {item.text}
        </div>
      )
      if (item.type === 'bullet') return (
        <div key={i} style={{ paddingLeft: 20, display: 'flex', gap: 8 }}>
          <span>•</span><span>{item.text}</span>
        </div>
      )
      if (item.type === 'gap') return (
        <div key={i} style={{ paddingLeft: 20, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3, minHeight: 32 }}>
          <span>•</span>
          <span>{item.before}</span>
          <GapInput qId={item.qId} value={answers[item.qId]} onChange={onChange}/>
          <span>{item.after}</span>
        </div>
      )
      if (item.type === 'heading-gap') return (
        <div key={i} style={{ fontWeight: 700, marginTop: 14, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <span style={{ textDecoration: 'underline' }}>{item.before}</span>
          <GapInput qId={item.qId} value={answers[item.qId]} onChange={onChange}/>
        </div>
      )
      if (item.type === 'mcq') return (
        <div key={i} style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 14, color: '#1e293b' }}>
            <span style={{ fontWeight: 700 }}>{item.qId}. </span>{item.text}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 16 }}>
            {item.options.map(opt => {
              const key = opt.trim()[0]
              const sel = answers[item.qId] === key
              return (
                <button key={opt} onClick={() => onChange(item.qId, key)} style={{
                  textAlign: 'left', padding: '8px 14px', border: sel ? '2px solid #007bff' : '1.5px solid #cbd5e1',
                  borderRadius: 6, background: sel ? '#eff6ff' : 'white',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                  fontWeight: sel ? 700 : 400, color: sel ? '#0062cc' : '#334155',
                  transition: 'all 0.15s',
                }}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )
      if (item.type === 'tfn') return (
        <div key={i} style={{ marginBottom: 16, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white' }}>
          <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
            <span style={{ fontWeight: 700 }}>{item.qId}. </span>{item.text}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['TRUE','FALSE','NOT GIVEN'].map(opt => {
              const sel = answers[item.qId] === opt
              const col = opt==='TRUE'?'#10b981':opt==='FALSE'?'#ef4444':'#f59e0b'
              return (
                <button key={opt} onClick={() => onChange(item.qId, opt)} style={{
                  padding: '5px 14px', borderRadius: 6,
                  border: sel ? `2px solid ${col}` : '1.5px solid #cbd5e1',
                  background: sel ? `${col}15` : 'white',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 12, fontWeight: 700, color: sel ? col : '#64748b',
                  transition: 'all 0.15s',
                }}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )
      return null
    })}
  </div>
)

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
const ListeningTest = ({ test, onComplete, onExit }) => {
  const [currentPart, setCurrentPart] = useState(0)
  const [answers,     setAnswers]     = useState({})
  const [phase,       setPhase]       = useState('test')
  const [results,     setResults]     = useState(null)
  const [timeLeft,    setTimeLeft]    = useState(40 * 60)
  const [volume,      setVolume]      = useState(80)
  const audioRef = useRef(null)

  const part = PARTS[currentPart]

  useEffect(() => {
    if (phase !== 'test') return
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(t); handleFinish(); return 0 } return p - 1 }), 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

  const handleAnswer = (qId, val) => setAnswers(p => ({ ...p, [qId]: val }))

  const getPartAnswered = (partIdx) => {
    const p = PARTS[partIdx]
    const qIds = p.content.filter(c => c.qId).map(c => c.qId)
    return qIds.filter(id => answers[id]).length
  }

  const handleFinish = () => {
    let correct = 0
    PARTS.forEach(p => {
      Object.entries(p.answers).forEach(([qId, correctAns]) => {
        const given = (answers[parseInt(qId)] || '').trim().toLowerCase()
        if (given === correctAns.toLowerCase()) correct++
      })
    })
    const band = getBand(correct)
    const secScores = PARTS.map(p => {
      let sc = 0
      Object.entries(p.answers).forEach(([qId, correctAns]) => {
        if ((answers[parseInt(qId)]||'').trim().toLowerCase() === correctAns.toLowerCase()) sc++
      })
      return sc
    })
    setResults({ correct, band, secScores })
    setPhase('result')
    // Save to backend
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ exam_type: test?.exam_type || 'IELTS', section: 'listening', score: Math.round(band * 11.1), max_score: 100, band_score: band, answers: { correct_count: correct } })
        }).catch(() => {})
      }
    } catch {}
  }

  const timeColor = timeLeft < 300 ? '#ef4444' : timeLeft < 600 ? '#f59e0b' : '#1e293b'

  // ── RESULT ──────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const { correct, band, secScores } = results
    const pct = (band / 9) * 100
    const bc  = band >= 7 ? '#10b981' : band >= 6 ? '#007bff' : '#f59e0b'
    const crit = [
      { name:'Part 1\nNote Completion', score:secScores[0], color:'#007bff', bg:'#eff6ff', tip: secScores[0]>=8?'Excellent gap fill.':'Practise catching specific words/numbers.' },
      { name:'Part 2\nMultiple Choice', score:secScores[1], color:'#8b5cf6', bg:'#f5f3ff', tip: secScores[1]>=8?'Strong MCQ performance.':'Eliminate wrong options while listening.' },
      { name:'Part 3\nTrue/False/NG',   score:secScores[2], color:'#10b981', bg:'#f0fdf4', tip: secScores[2]>=8?'Good opinion tracking.':'Distinguish stated vs implied vs not mentioned.' },
      { name:'Part 4\nSentence Compl.', score:secScores[3], color:'#f59e0b', bg:'#fffbeb', tip: secScores[3]>=8?'Great academic listening.':'Focus on academic vocabulary and paraphrase.' },
    ]
    return (
      <div style={{ minHeight:'100vh', background:'#f5f7fa', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'28px 16px', fontFamily:"'Noto Sans','Arial',sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          .lr{background:rgba(255,255,255,.93);backdrop-filter:blur(24px);padding:clamp(20px,4vw,40px);border-radius:clamp(20px,4vw,36px);width:100%;max-width:860px;box-shadow:0 30px 80px rgba(0,123,255,.12);border:1px solid white;overflow-y:auto;max-height:95vh;font-family:'Inter',sans-serif;}
          .lr-sr{display:grid;grid-template-columns:165px 1fr;gap:16px;margin-bottom:16px;}
          .lr-sc{background:white;padding:18px;border-radius:18px;border:1px solid #f1f5f9;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
          .lr-cw{position:relative;width:118px;height:118px;}
          .lr-svg{display:block;width:100%;height:100%;}
          .lr-bg{fill:none;stroke:#f1f5f9;stroke-width:2.8;}
          .lr-fg{fill:none;stroke-width:2.8;stroke-linecap:round;animation:lrP 1.2s ease-out forwards;}
          @keyframes lrP{from{stroke-dasharray:0 100;}}
          .lr-inn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
          .lr-cg{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
          .lr-cc{background:white;padding:14px 16px;border-radius:14px;border:1px solid #f1f5f9;}
          .lr-ci{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;font-weight:800;}
          .lr-bb{height:5px;background:#f1f5f9;border-radius:4px;overflow:hidden;margin-top:6px;}
          .lr-bf{height:100%;border-radius:4px;transition:width 1.2s ease;}
          .lr-fb{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:18px;margin-bottom:20px;}
          .lr-fi{display:flex;gap:9px;margin-bottom:9px;padding-bottom:9px;border-bottom:1px solid #f1f5f9;align-items:flex-start;}
          .lr-fi:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none;}
          .lr-fd{width:19px;height:19px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;margin-top:2px;}
          .lr-ac{display:flex;gap:12px;}
          .lr-btn{flex:1;padding:13px;border-radius:13px;font-weight:700;font-size:14px;border:none;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:7px;transition:.2s;font-family:'Inter',sans-serif;}
          .lr-btn.p{background:linear-gradient(135deg,#007bff,#0062cc);color:white;box-shadow:0 8px 20px rgba(0,123,255,.24);}
          .lr-btn.p:hover{transform:translateY(-2px);}
          .lr-btn.s{background:white;color:#64748b;border:2px solid #f1f5f9;}
          @media(max-width:560px){.lr-sr{grid-template-columns:1fr;}.lr-cg{grid-template-columns:1fr;}.lr-ac{flex-direction:column;}}
        `}</style>
        <div className="lr">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
            <div>
              <h2 style={{ fontSize:'clamp(20px,5vw,26px)', fontWeight:800, color:'#1e293b', margin:0 }}>Analysis Report</h2>
              <p style={{ color:'#64748b', fontSize:13, marginTop:3 }}>IELTS Listening · 4 Parts · 40 Questions</p>
            </div>
            <div style={{ background:'#eff6ff', color:'#007bff', padding:'4px 12px', borderRadius:8, fontWeight:800, fontSize:11 }}>LISTENING</div>
          </div>
          <div className="lr-sr">
            <div className="lr-sc">
              <p style={{ fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.8px', marginBottom:10 }}>Overall Band</p>
              <div className="lr-cw">
                <svg viewBox="0 0 36 36" className="lr-svg">
                  <path className="lr-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path className="lr-fg" stroke={bc} strokeDasharray={`${pct},100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                </svg>
                <div className="lr-inn">
                  <span style={{ fontSize:32, fontWeight:900, color:bc, lineHeight:1, display:'block' }}>{band.toFixed(1)}</span>
                  <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>/9.0</span>
                </div>
              </div>
              <div style={{ marginTop:9, fontSize:11, color:'#94a3b8', fontWeight:600 }}>{correct}/40 correct</div>
            </div>
            <div className="lr-cg">
              {crit.map((c,i) => (
                <div key={i} className="lr-cc">
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                    <div className="lr-ci" style={{ background:c.bg, color:c.color }}>{i+1}</div>
                    <span style={{ fontSize:10, fontWeight:800, color:'#475569', whiteSpace:'pre-line', lineHeight:1.3 }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize:17, fontWeight:900, color:'#1e293b' }}>
                    {c.score}<span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>/10</span>
                  </div>
                  <div className="lr-bb"><div className="lr-bf" style={{ width:`${c.score*10}%`, background:c.color }}/></div>
                  <p style={{ fontSize:10, color:'#64748b', marginTop:5, lineHeight:1.4 }}>{c.tip}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lr-fb">
            <div style={{ display:'flex', alignItems:'center', gap:7, color:'#007bff', fontWeight:700, marginBottom:12, fontSize:13 }}>
              <Search size={14}/><span>Detailed Feedback</span>
            </div>
            {[
              correct>=30?`✅ Strong result: ${correct}/40 correct. Band ${band.toFixed(1)} reflects solid listening skills.`:`⚠️ Score: ${correct}/40. Focus on listening for specific details and paraphrased ideas.`,
              `💡 Always read questions before the audio begins — predict the type of answer needed.`,
              `💡 In gap-fill tasks, the recording uses paraphrases — the exact words may differ from the question.`,
              secScores[1]>=7?`✅ MCQ (Part 2): ${secScores[1]}/10 — good ability to identify speakers' opinions.`:`⚠️ MCQ (Part 2): ${secScores[1]}/10 — practise eliminating distractors before selecting your answer.`,
              `💡 For True/False/NG, be careful: "NOT GIVEN" means the recording neither confirms nor denies.`,
            ].map((text,i) => {
              const g=text.startsWith('✅'), tip=text.startsWith('💡')
              return (
                <div key={i} className="lr-fi">
                  <div className="lr-fd" style={{ background:g?'#dcfce7':tip?'#eff6ff':'#fff7ed', color:g?'#16a34a':tip?'#007bff':'#d97706' }}>{g?'✓':tip?'i':'!'}</div>
                  <span style={{ fontSize:13, color:'#334155', lineHeight:1.7 }}>{text}</span>
                </div>
              )
            })}
          </div>
          <div className="lr-ac">
            <button className="lr-btn s" onClick={onExit}>← Back to Home</button>
            <button className="lr-btn p" onClick={onComplete}><CheckCircle2 size={14}/> Back to Test Menu</button>
          </div>
        </div>
      </div>
    )
  }

  // ── TEST — Cambridge screen layout ──────────────────────────────────────────
  const answered = Object.keys(answers).length
  const partAnswered = getPartAnswered(currentPart)

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', background:'white', fontFamily:"'Noto Sans','Arial',sans-serif", fontSize:14, overflow:'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .lt-scroll::-webkit-scrollbar { width: 6px; }
        .lt-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .lt-qnum { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #007bff; color: #007bff; font-weight: 800; font-size: 12px; cursor: pointer; flex-shrink: 0; transition: all .15s; }
        .lt-qnum:hover { background: #eff6ff; }
        .lt-qnum.done { background: #007bff; color: white; border-color: #007bff; }
        .lt-qnum.active { background: #eff6ff; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ height: 52, background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
        {/* Left: LISTENING label */}
        <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', letterSpacing: 1.5, textTransform: 'uppercase' }}>Listening</span>

        {/* Center: Timer + Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: timeLeft < 300 ? '#ef4444' : '#475569' }}>
            {fmt(timeLeft)} left
          </span>
          {/* Volume slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🔈</span>
            <input type="range" min={0} max={100} value={volume} onChange={e=>setVolume(+e.target.value)}
              style={{ width: 80, accentColor: '#007bff', cursor: 'pointer' }}/>
            <span style={{ fontSize: 14 }}>🔊</span>
          </div>
        </div>

        {/* Right: Submit button */}
        <button onClick={handleFinish} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = '#0062cc'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseOut={e => { e.currentTarget.style.background = '#007bff'; e.currentTarget.style.transform = 'translateY(0)' }}>
          Submit Test
        </button>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="lt-scroll" style={{ flex: 1, overflowY: 'auto', background: '#f5f7fa' }}>
        {/* Part header — grey band */}
        <div style={{ background: 'white', borderBottom: '1px solid #e8edf2', padding: '10px 28px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{part.sectionLabel}</div>
          <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{part.subTitle}</div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 28px' }}>

          {/* Questions header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{part.questionsLabel}</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <HelpCircle size={14}/> Help
            </button>
          </div>

          {/* Instruction */}
          <p style={{ fontSize: 13, color: '#334155', marginBottom: 18, lineHeight: 1.7 }}>{part.instruction}</p>

          {/* Audio player */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#00bfff,#007bff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🎧</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>{part.sectionLabel} Recording</div>
              <audio
                ref={audioRef}
                src={`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${currentPart+1}.mp3`}
                controls
                style={{ width: '100%', height: 32, borderRadius: 6 }}
              />
            </div>
          </div>

          {/* Passage box — white card exactly like Cambridge */}
          <div style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: 8, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            {part.passageTitle && (
              <h4 style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
                {part.passageTitle}
              </h4>
            )}
            <PassageContent items={part.content} answers={answers} onChange={handleAnswer}/>
          </div>

        </div>
      </div>

      {/* ── BOTTOM NAV BAR ── */}
      <div style={{ height: 52, background: 'white', borderTop: '1px solid #e8edf2', display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0, overflowX: 'auto', gap: 0 }}>
        {PARTS.map((p, pi) => {
          const qStart   = pi * 10 + 1
          const partAns  = getPartAnswered(pi)
          const isActive = pi === currentPart

          return (
            <div key={pi} style={{ display: 'flex', alignItems: 'center', borderRight: pi < 3 ? '1px solid #e2e8f0' : 'none', padding: '0 12px', gap: 5, flexShrink: 0 }}>

              {/* Part label */}
              <button onClick={() => setCurrentPart(pi)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: isActive ? 800 : 600,
                color: isActive ? '#007bff' : '#64748b',
                padding: '3px 4px', fontFamily: 'inherit', flexShrink: 0,
                textDecoration: isActive ? 'underline' : 'none',
              }}>
                {p.label}
              </button>

              {/* Raqamlar: FAQAT shu part aktiv bo'lganda render qilinadi */}
              {pi === currentPart && [1,2,3,4,5,6,7,8,9,10].map(i => {
                const qId = pi * 10 + i
                const done = !!answers[qId]
                return (
                  <div key={qId} style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    border: done ? 'none' : '2px solid #007bff',
                    background: done ? '#007bff' : 'white',
                    color: done ? 'white' : '#007bff',
                  }}>
                    {qId}
                  </div>
                )
              })}

              {/* answered count */}
              <span style={{ fontSize: 11, fontWeight: 600, flexShrink: 0, color: isActive ? '#007bff' : '#94a3b8' }}>
                {partAns} of 10
              </span>
            </div>
          )
        })}

        <button onClick={onExit} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', flexShrink: 0, padding: '0 8px' }}>
          Exit
        </button>
      </div>
    </div>
  )
}

export default ListeningTest
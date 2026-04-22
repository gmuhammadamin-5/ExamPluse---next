"use client";
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  Headphones, BookOpen, PenTool, Mic, BarChart3,
  CheckCircle2, Clock, ChevronRight, ArrowLeft,
  LogOut, Trophy, FileText, Calculator,
  AlertTriangle, Zap, Star, Award, Target,
  Play, TrendingUp, Users, Lock, Unlock
} from 'lucide-react'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const EXAMS = {
  IELTS: {
    color:'#0057FF', dark:'#0041CC', pale:'#E8F0FF',
    emoji:'🎓', tag:'Academic & General Training',
    sections:[
      { id:'listening', label:'Listening', icon:Headphones, time:'30 min', desc:'4 recordings · 40 questions' },
      { id:'reading',   label:'Reading',   icon:BookOpen,   time:'60 min', desc:'3 passages · 40 questions' },
      { id:'writing',   label:'Writing',   icon:PenTool,    time:'60 min', desc:'Task 1 + Task 2 essay' },
      { id:'speaking',  label:'Speaking',  icon:Mic,        time:'15 min', desc:'3-part oral exam' },
    ]
  },
  TOEFL: {
    color:'#0057FF', dark:'#0041CC', pale:'#E8F0FF',
    emoji:'🌐', tag:'iBT · Internet-Based Test',
    sections:[
      { id:'reading',   label:'Reading',   icon:BookOpen,   time:'54–72 min', desc:'3–4 passages' },
      { id:'listening', label:'Listening', icon:Headphones, time:'41–57 min', desc:'Lectures & conversations' },
      { id:'speaking',  label:'Speaking',  icon:Mic,        time:'17 min',    desc:'4 integrated tasks' },
      { id:'writing',   label:'Writing',   icon:PenTool,    time:'50 min',    desc:'Integrated + Discussion' },
    ]
  },
  SAT: {
    color:'#0057FF', dark:'#0041CC', pale:'#E8F0FF',
    emoji:'📐', tag:'College Board · USA Admissions',
    sections:[
      { id:'math',    label:'Math',              icon:Calculator, time:'70 min', desc:'Algebra · Data · Advanced' },
      { id:'reading', label:'Reading & Writing', icon:BookOpen,   time:'64 min', desc:'Craft & Expression' },
      { id:'essay',   label:'Essay (Optional)',  icon:FileText,   time:'50 min', desc:'Evidence-based argument' },
    ]
  }
}

const TESTS = {
  IELTS:[
    { id:'i1', title:'Mock Test 1', type:'mock',     band:'Band 7+',  questions:160, time:'165 min', difficulty:3 },
    { id:'i2', title:'Mock Test 2', type:'mock',     band:'Band 8+',  questions:160, time:'165 min', difficulty:4 },
    { id:'i3', title:'Cambridge 17',type:'official', band:'Band 7+',  questions:160, time:'165 min', difficulty:4 },
    { id:'i4', title:'Cambridge 16',type:'official', band:'Band 6.5+',questions:160, time:'165 min', difficulty:3 },
    { id:'i5', title:'Listening Pro',type:'skill',   band:'All Levels',questions:40, time:'30 min',  difficulty:2 },
    { id:'i6', title:'Writing Focus',type:'skill',   band:'Band 7+',  questions:2,   time:'60 min',  difficulty:4 },
  ],
  TOEFL:[
    { id:'t1', title:'iBT Mock 1',   type:'mock',     band:'100+',    questions:144, time:'185 min', difficulty:3 },
    { id:'t2', title:'iBT Mock 2',   type:'mock',     band:'110+',    questions:144, time:'185 min', difficulty:4 },
    { id:'t3', title:'ETS Official', type:'official', band:'100+',    questions:144, time:'185 min', difficulty:4 },
    { id:'t4', title:'Speaking Set', type:'skill',    band:'24–30',   questions:4,   time:'17 min',  difficulty:3 },
    { id:'t5', title:'Writing Set',  type:'skill',    band:'24–30',   questions:2,   time:'50 min',  difficulty:3 },
  ],
  SAT:[
    { id:'s1', title:'Practice 1',   type:'mock',     band:'1400+',   questions:98,  time:'134 min', difficulty:3 },
    { id:'s2', title:'Practice 2',   type:'mock',     band:'1500+',   questions:98,  time:'134 min', difficulty:4 },
    { id:'s3', title:'College Board',type:'official', band:'1400–1600',questions:98, time:'134 min', difficulty:5 },
    { id:'s4', title:'Math Drill',   type:'skill',    band:'700–800', questions:44,  time:'70 min',  difficulty:4 },
    { id:'s5', title:'Verbal Drill', type:'skill',    band:'700–800', questions:54,  time:'64 min',  difficulty:3 },
  ]
}

/* ─────────────────────────────────────────────
   TILT CARD
───────────────────────────────────────────── */
function TiltCard({ children, style, onClick, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotX = useTransform(y, [-0.5,0.5], [4,-4])
  const rotY = useTransform(x, [-0.5,0.5], [-4,4])

  const handleMove = e => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top)  / r.height - 0.5)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ ...style, rotateX:rotX, rotateY:rotY, transformStyle:'preserve-3d', transformPerspective:800 }}
      onMouseMove={handleMove} onMouseLeave={handleLeave} onClick={onClick} className={className}>
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   DIFFICULTY DOTS
───────────────────────────────────────────── */
function Dots({ n, max=5 }) {
  return (
    <div style={{display:'flex',gap:3}}>
      {Array.from({length:max}).map((_,i)=>(
        <div key={i} style={{width:6,height:6,borderRadius:'50%',
          background:i<n?'#0057FF':'#E2E8F0',
          boxShadow:i<n?'0 0 6px rgba(0,87,255,0.5)':'none',
          transition:'all .2s'}}/>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function MasterTestDashboard() {
  const [exam, setExam]         = useState('IELTS')
  const [tab, setTab]           = useState('mock')
  const [currentTest, setTest]  = useState(null)
  const [activeSection, setSec] = useState(null)
  const [completed, setDone]    = useState({})
  const [modal, setModal]       = useState(null)
  const [hovered, setHovered]   = useState(null)

  const E = EXAMS[exam]
  const sections = E.sections
  const doneList = currentTest ? (completed[currentTest.id]||[]) : []

  useEffect(() => {
    document.body.style.overflow = currentTest ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [currentTest])

  const handleDone = id => {
    setDone(p => ({ ...p, [currentTest.id]: [...(p[currentTest.id]||[]), id] }))
    setSec(null)
  }
  const exitTest = () => setModal({
    title:'Exit Test?', msg:'Your completed sections will be saved.',
    ok:'Exit', cancel:'Stay',
    onOk:() => { setModal(null); setTest(null); setSec(null) }
  })
  const backToSel = () => setModal({
    title:'Leave Section?', msg:'Progress in this section will be lost.',
    ok:'Go Back', cancel:'Keep Working',
    onOk:() => { setModal(null); setSec(null) }
  })

  const filtered = TESTS[exam].filter(t =>
    tab==='mock' ? t.type==='mock' : tab==='official' ? t.type==='official' : t.type==='skill'
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');

        .mtd { --blue:#0057FF; --dark:#0A0F1E; --pale:#EEF3FF; --muted:#6B7280; }
        .mtd * { box-sizing:border-box; }
        .mtd, .mtd-full { font-family:'DM Sans',system-ui,sans-serif; color:#0A0F1E; }

        /* PAGE BG — linen white with very subtle blue dot pattern */
        .mtd-page {
          min-height:calc(100vh - 70px);
          background:#FAFBFF;
          padding:48px 32px 80px;
          position:relative;
          background-image:
            radial-gradient(circle at 15% 15%, rgba(0,87,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 85% 80%, rgba(0,87,255,0.04) 0%, transparent 45%),
            radial-gradient(#E2EDFF 1px, transparent 1px);
          background-size:100% 100%, 100% 100%, 28px 28px;
        }

        .mtd-full {
          position:fixed; top:0; left:0; width:100vw; height:100vh;
          z-index:9999; overflow-y:auto; display:flex; flex-direction:column;
          background:#FAFBFF;
          background-image:
            radial-gradient(circle at 15% 15%, rgba(0,87,255,0.05) 0%, transparent 50%),
            radial-gradient(#E2EDFF 1px, transparent 1px);
          background-size:100% 100%, 28px 28px;
        }

        /* Typography */
        .font-display { font-family:'Syne',sans-serif; }
        .font-mono    { font-family:'Space Mono',monospace; }

        /* Hover effects */
        .hover-lift { transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s; cursor:pointer; }
        .hover-lift:hover { transform:translateY(-5px); }

        /* Section card */
        .sec-card {
          background:#fff;
          border:1.5px solid #E8EFFF;
          border-radius:20px;
          padding:26px;
          cursor:pointer;
          transition:all .25s cubic-bezier(.34,1.56,.64,1);
          position:relative; overflow:hidden;
        }
        .sec-card:hover {
          border-color:#0057FF;
          box-shadow:0 0 0 4px rgba(0,87,255,0.08), 0 16px 40px rgba(0,87,255,0.12);
          transform:translateY(-4px);
        }
        .sec-card.done { opacity:.55; cursor:default; }
        .sec-card.done:hover { transform:none; box-shadow:none; border-color:#E8EFFF; }

        /* Test card */
        .test-card {
          background:#fff;
          border:1.5px solid #EEF2FF;
          border-radius:24px;
          padding:28px;
          cursor:pointer;
          transition:all .25s cubic-bezier(.34,1.56,.64,1);
          position:relative; overflow:hidden;
        }
        .test-card:hover {
          border-color:#0057FF;
          box-shadow:0 0 0 4px rgba(0,87,255,0.06), 0 20px 50px rgba(0,87,255,0.10);
          transform:translateY(-6px);
        }

        /* Exam pill */
        .exam-pill {
          border-radius:14px; padding:16px 20px;
          cursor:pointer; transition:all .22s; border:1.5px solid #EEF2FF;
          background:#fff; text-align:center;
          position:relative; overflow:hidden;
        }
        .exam-pill.active {
          background:#0057FF; border-color:#0057FF;
          box-shadow:0 8px 24px rgba(0,87,255,0.30);
        }
        .exam-pill:not(.active):hover { border-color:#0057FF; transform:translateY(-2px); }

        /* Tab */
        .mtd-tab {
          padding:9px 20px; border-radius:10px; border:1.5px solid #EEF2FF;
          background:#fff; cursor:pointer; font-family:'DM Sans',sans-serif;
          font-weight:600; font-size:13px; color:#6B7280; transition:all .18s;
          display:flex; align-items:center; gap:6px;
        }
        .mtd-tab.active { background:#0057FF; border-color:#0057FF; color:#fff; box-shadow:0 4px 14px rgba(0,87,255,0.28); }
        .mtd-tab:not(.active):hover { border-color:#0057FF; color:#0057FF; }

        /* Progress bar */
        @keyframes progGlow {
          0%,100% { box-shadow:0 0 6px rgba(0,87,255,0.4); }
          50%      { box-shadow:0 0 14px rgba(0,87,255,0.7); }
        }
        .prog-fill { animation:progGlow 2s ease infinite; }

        /* Number badge */
        .num-badge {
          font-family:'Space Mono',monospace;
          font-size:11px; font-weight:700;
          color:#0057FF; background:#EEF3FF;
          padding:3px 8px; border-radius:6px;
          border:1px solid #DBEAFE;
          letter-spacing:1px;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,87,255,0.18); border-radius:4px; }
      `}</style>

      {/* ══ MODAL ══ */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,background:'rgba(10,15,30,0.60)',backdropFilter:'blur(18px)',zIndex:999999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
            <motion.div initial={{scale:.88,y:28}} animate={{scale:1,y:0}} exit={{scale:.9,y:16}}
              transition={{type:'spring',stiffness:420,damping:28}}
              style={{background:'#fff',borderRadius:28,padding:'48px 40px',width:440,maxWidth:'92vw',textAlign:'center',boxShadow:'0 40px 80px rgba(0,0,0,0.15)',border:'1.5px solid #EEF2FF'}}>
              <div style={{width:68,height:68,borderRadius:'50%',background:'linear-gradient(135deg,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px',boxShadow:'0 12px 30px rgba(245,158,11,0.30)'}}>
                <AlertTriangle size={30} color="#fff"/>
              </div>
              <div className="font-display" style={{fontSize:24,fontWeight:800,color:'#0A0F1E',marginBottom:10}}>{modal.title}</div>
              <div style={{fontSize:14,color:'#6B7280',marginBottom:32,lineHeight:1.75}}>{modal.msg}</div>
              <div style={{display:'flex',gap:10}}>
                <button onClick={()=>setModal(null)} style={{flex:1,padding:'14px',borderRadius:14,border:'1.5px solid #EEF2FF',background:'#FAFBFF',color:'#6B7280',fontWeight:600,fontSize:14,cursor:'pointer',fontFamily:'inherit'}}>{modal.cancel}</button>
                <button onClick={modal.onOk} style={{flex:1,padding:'14px',borderRadius:14,border:'none',background:'#0057FF',color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 6px 18px rgba(0,87,255,0.30)'}}>{modal.ok}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ACTIVE TEST ══ */}
      {currentTest && (
        <div className="mtd mtd-full">
          {/* Header */}
          <div style={{background:'rgba(255,255,255,0.95)',backdropFilter:'blur(20px)',borderBottom:'1.5px solid #EEF2FF',padding:'14px 32px',display:'flex',alignItems:'center',gap:16,flexShrink:0}}>
            <button onClick={activeSection ? backToSel : exitTest}
              style={{width:40,height:40,borderRadius:12,border:'1.5px solid #EEF2FF',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#6B7280',flexShrink:0,transition:'all .18s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#fecaca';e.currentTarget.style.color='#ef4444';e.currentTarget.style.background='#fff5f5'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#EEF2FF';e.currentTarget.style.color='#6B7280';e.currentTarget.style.background='#fff'}}>
              <ArrowLeft size={16}/>
            </button>
            <div style={{flex:1}}>
              <div className="font-display" style={{fontSize:17,fontWeight:800,color:'#0A0F1E',letterSpacing:'-0.3px'}}>{currentTest.title}</div>
              <div style={{fontSize:12,color:'#9CA3AF',marginTop:1,fontWeight:500}}>
                {activeSection ? `${sections.find(s=>s.id===activeSection)?.label} — In progress` : `${doneList.length} / ${sections.length} complete`}
              </div>
            </div>
            <div className="num-badge">{exam}</div>
            <div style={{display:'flex',gap:8}}>
              {sections.map(s=>{
                const Icon=s.icon; const done=doneList.includes(s.id)
                return(
                  <motion.div key={s.id} whileHover={{scale:1.1}}
                    style={{width:36,height:36,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',
                      background:done?'#0057FF':'#FAFBFF',
                      border:done?'none':'1.5px solid #EEF2FF',
                      color:done?'#fff':'#C7D2FE',
                      boxShadow:done?'0 4px 14px rgba(0,87,255,0.30)':'none',
                      transition:'all .25s'}}>
                    {done?<CheckCircle2 size={15}/>:<Icon size={14}/>}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!activeSection ? (
              <motion.div key="sel" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-18}}
                transition={{duration:.28,ease:[.22,1,.36,1]}}
                style={{flex:1,padding:'52px 40px',maxWidth:980,margin:'0 auto',width:'100%'}}>

                <div style={{marginBottom:36}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                    <div className="num-badge">{exam} EXAM</div>
                  </div>
                  <h2 className="font-display" style={{fontSize:36,fontWeight:900,color:'#0A0F1E',letterSpacing:'-1px',lineHeight:1,marginBottom:8}}>
                    Select a Section
                  </h2>
                  <p style={{fontSize:15,color:'#9CA3AF',fontWeight:500}}>Any order. Any pace. Your test.</p>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                  {sections.map((s,i)=>{
                    const Icon=s.icon; const done=doneList.includes(s.id)
                    return(
                      <motion.div key={s.id}
                        initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                        transition={{delay:i*.08,duration:.34,ease:[.22,1,.36,1]}}
                        className={`sec-card${done?' done':''}`}
                        onClick={()=>!done&&setSec(s.id)}>

                        {/* Left blue stripe */}
                        <div style={{position:'absolute',left:0,top:0,bottom:0,width:4,borderRadius:'20px 0 0 20px',background:done?'#34C759':'#0057FF'}}/>

                        <div style={{paddingLeft:12}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
                            <div style={{width:52,height:52,borderRadius:16,background:'#EEF3FF',border:'1.5px solid #DBEAFE',display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <Icon size={22} color='#0057FF' strokeWidth={2}/>
                            </div>
                            {done ? (
                              <div style={{display:'flex',alignItems:'center',gap:5,background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:700,color:'#16a34a'}}>
                                <CheckCircle2 size={11}/>Done
                              </div>
                            ) : (
                              <div style={{display:'flex',alignItems:'center',gap:4,background:'#EEF3FF',border:'1px solid #DBEAFE',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:700,color:'#0057FF'}}>
                                <Clock size={11}/>{s.time}
                              </div>
                            )}
                          </div>
                          <div className="font-display" style={{fontSize:20,fontWeight:800,color:'#0A0F1E',marginBottom:4,letterSpacing:'-0.3px'}}>{s.label}</div>
                          <div style={{fontSize:13,color:'#9CA3AF',marginBottom:16}}>{s.desc}</div>
                          {!done && (
                            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:13,fontWeight:700,color:'#0057FF'}}>
                              Start now <ChevronRight size={14} strokeWidth={2.5}/>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}

                  {/* Results */}
                  <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                    transition={{delay:sections.length*.08,duration:.34}}
                    onClick={()=>setSec('results')}
                    style={{gridColumn:'1/-1',background:'#0057FF',borderRadius:20,padding:'22px 28px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all .25s',boxShadow:'0 8px 28px rgba(0,87,255,0.25)'}}
                    whileHover={{scale:1.01,boxShadow:'0 14px 40px rgba(0,87,255,0.35)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:18}}>
                      <div style={{width:50,height:50,borderRadius:15,background:'rgba(255,255,255,0.15)',border:'1.5px solid rgba(255,255,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <BarChart3 size={22} color="#fff"/>
                      </div>
                      <div>
                        <div className="font-display" style={{fontSize:18,fontWeight:800,color:'#fff',letterSpacing:'-0.3px'}}>View Results</div>
                        <div style={{fontSize:13,color:'rgba(255,255,255,0.65)',marginTop:1}}>Performance breakdown & {exam} score estimate</div>
                      </div>
                    </div>
                    <ChevronRight size={22} color="rgba(255,255,255,0.6)" strokeWidth={2.5}/>
                  </motion.div>
                </div>

                <div style={{marginTop:32,textAlign:'center'}}>
                  <button onClick={exitTest}
                    style={{padding:'9px 22px',borderRadius:11,border:'1.5px solid #EEF2FF',background:'transparent',cursor:'pointer',color:'#9CA3AF',fontWeight:600,fontSize:13,display:'inline-flex',alignItems:'center',gap:7,fontFamily:'inherit',transition:'all .18s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#fecaca';e.currentTarget.style.color='#ef4444'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#EEF2FF';e.currentTarget.style.color='#9CA3AF'}}>
                    <LogOut size={14}/>Exit
                  </button>
                </div>
              </motion.div>

            ) : (
              <motion.div key={activeSection} initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}
                transition={{duration:.28,ease:[.22,1,.36,1]}}
                style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,gap:20}}>
                {activeSection==='results' ? (
                  <>
                    <div style={{width:80,height:80,borderRadius:24,background:'#0057FF',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 14px 36px rgba(0,87,255,0.28)'}}>
                      <Trophy size={36} color="#fff"/>
                    </div>
                    <div className="font-display" style={{fontSize:26,fontWeight:900,color:'#0A0F1E',letterSpacing:'-0.5px'}}>Results Dashboard</div>
                    <div style={{fontSize:14,color:'#9CA3AF'}}>Detailed analysis loads here</div>
                    <button onClick={()=>setSec(null)} style={{padding:'11px 26px',background:'#EEF3FF',border:'none',borderRadius:12,color:'#0057FF',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>← Back</button>
                  </>
                ) : (() => {
                  const s=sections.find(x=>x.id===activeSection); const Icon=s?.icon||BookOpen
                  return (
                    <>
                      <div style={{width:84,height:84,borderRadius:26,background:'#EEF3FF',border:'2px solid #DBEAFE',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Icon size={38} color='#0057FF' strokeWidth={1.8}/>
                      </div>
                      <div className="font-display" style={{fontSize:28,fontWeight:900,color:'#0A0F1E',letterSpacing:'-0.5px'}}>{s?.label}</div>
                      <div style={{fontSize:14,color:'#9CA3AF',fontWeight:500}}>{currentTest.title} · {s?.time}</div>
                      <div className="num-badge" style={{fontSize:12}}>{s?.desc}</div>
                      <motion.button onClick={()=>handleDone(activeSection)}
                        whileHover={{scale:1.03}} whileTap={{scale:.97}}
                        style={{padding:'15px 44px',background:'#0057FF',border:'none',borderRadius:16,color:'#fff',fontWeight:800,fontSize:16,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 10px 28px rgba(0,87,255,0.28)',display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                        <CheckCircle2 size={18}/>Mark Complete
                      </motion.button>
                    </>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ══ DASHBOARD ══ */}
      {!currentTest && (
        <div className="mtd mtd-page">
          <div style={{maxWidth:1120,margin:'0 auto'}}>

            {/* ── HERO ── */}
            <div style={{marginBottom:56}}>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}}>
                {/* Big number + title side by side */}
                <div style={{display:'flex',alignItems:'flex-start',gap:32,flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:280}}>
                    <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:20,background:'#EEF3FF',border:'1px solid #DBEAFE',borderRadius:8,padding:'5px 14px'}}>
                      <Zap size={12} color='#0057FF' fill='#0057FF'/>
                      <span className="font-mono" style={{fontSize:10,fontWeight:700,color:'#0057FF',letterSpacing:'2px'}}>EXAM PREP PLATFORM</span>
                    </div>
                    <h1 className="font-display" style={{fontSize:64,fontWeight:900,color:'#0A0F1E',letterSpacing:'-3px',lineHeight:.95,marginBottom:18}}>
                      Practice.<br/>
                      <span style={{color:'#0057FF'}}>Score.</span><br/>
                      Repeat.
                    </h1>
                    <p style={{fontSize:16,color:'#6B7280',fontWeight:500,lineHeight:1.6,maxWidth:400}}>
                      AI-powered mock tests for IELTS, TOEFL and SAT — built to get you to band 9.
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,minWidth:300,flex:'0 0 auto'}}>
                    {[
                      { val:'12K+',  label:'Students',    sub:'actively learning' },
                      { val:'98.7%', label:'Accuracy',    sub:'score prediction' },
                      { val:'150+',  label:'Mock Tests',  sub:'across 3 exams' },
                      { val:'+1.5',  label:'Band Gain',   sub:'avg improvement' },
                    ].map((s,i)=>(
                      <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.07}}
                        style={{background:'#fff',borderRadius:18,padding:'18px 16px',border:'1.5px solid #EEF2FF',boxShadow:'0 2px 10px rgba(0,87,255,0.05)'}}>
                        <div className="font-display" style={{fontSize:28,fontWeight:900,color:'#0057FF',letterSpacing:'-1px',lineHeight:1}}>{s.val}</div>
                        <div style={{fontSize:12,fontWeight:700,color:'#0A0F1E',marginTop:4}}>{s.label}</div>
                        <div style={{fontSize:11,color:'#9CA3AF',marginTop:2}}>{s.sub}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── EXAM SELECTOR ── */}
            <div style={{marginBottom:32}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                <div className="font-display" style={{fontSize:20,fontWeight:800,color:'#0A0F1E',letterSpacing:'-0.3px'}}>Choose Your Exam</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                {Object.entries(EXAMS).map(([key,val],i)=>{
                  const active=exam===key
                  return(
                    <motion.div key={key}
                      initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                      transition={{delay:i*.07,duration:.34,ease:[.22,1,.36,1]}}
                      onClick={()=>setExam(key)}
                      className={`exam-pill${active?' active':''}`}
                      whileHover={!active?{y:-3}:{}}
                      whileTap={{scale:.97}}>
                      <div style={{fontSize:34,marginBottom:8}}>{val.emoji}</div>
                      <div className="font-display" style={{fontSize:22,fontWeight:900,color:active?'#fff':'#0A0F1E',letterSpacing:'-0.5px',marginBottom:3}}>{key}</div>
                      <div style={{fontSize:11,color:active?'rgba(255,255,255,0.65)':'#9CA3AF',fontWeight:500,marginBottom:12}}>{val.tag}</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:5,justifyContent:'center'}}>
                        {val.sections.map(s=>(
                          <span key={s.id} style={{fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:20,
                            background:active?'rgba(255,255,255,0.18)':'#EEF3FF',
                            color:active?'rgba(255,255,255,0.90)':'#0057FF',
                            border:active?'1px solid rgba(255,255,255,0.20)':'1px solid #DBEAFE'}}>
                            {s.label}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* ── TABS ── */}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24}}>
              <div className="font-display" style={{fontSize:20,fontWeight:800,color:'#0A0F1E',letterSpacing:'-0.3px',marginRight:8}}>Tests</div>
              {[
                {id:'mock',     label:'AI Mock',    icon:<Zap size={13}/>},
                {id:'official', label:'Official',   icon:<Award size={13}/>},
                {id:'skill',    label:'Skills',     icon:<Target size={13}/>},
              ].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className={`mtd-tab${tab===t.id?' active':''}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* ── TEST CARDS ── */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))',gap:20}}>
              {filtered.map((test,i)=>{
                const done=completed[test.id]||[]
                const pct=Math.round(done.length/sections.length*100)
                const isHov=hovered===test.id
                return(
                  <motion.div key={test.id}
                    initial={{opacity:0,y:28}} animate={{opacity:1,y:0}}
                    transition={{delay:i*.08,duration:.38,ease:[.22,1,.36,1]}}
                    className="test-card"
                    onHoverStart={()=>setHovered(test.id)}
                    onHoverEnd={()=>setHovered(null)}
                    onClick={()=>setTest(test)}>

                    {/* Left accent bar */}
                    <div style={{position:'absolute',left:0,top:0,bottom:0,width:4,borderRadius:'24px 0 0 24px',background:pct>0?'#0057FF':'#EEF2FF',transition:'background .3s'}}/>

                    <div style={{paddingLeft:12}}>
                      {/* Top row */}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                        <div>
                          <div className="font-display" style={{fontSize:18,fontWeight:800,color:'#0A0F1E',letterSpacing:'-0.3px'}}>{test.title}</div>
                          <div style={{fontSize:11,color:'#9CA3AF',marginTop:4,fontWeight:500}}>{test.sub||''}</div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                          <span className="num-badge">{tab==='mock'?'MOCK':tab==='official'?'OFFICIAL':'SKILL'}</span>
                          <Dots n={test.difficulty}/>
                        </div>
                      </div>

                      {/* Meta pills */}
                      <div style={{display:'flex',gap:7,marginBottom:16,flexWrap:'wrap'}}>
                        <div style={{display:'flex',alignItems:'center',gap:4,background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:700,color:'#15803d'}}>
                          <Star size={10} fill='#15803d' color='#15803d'/>{test.band}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:4,background:'#EEF3FF',border:'1px solid #DBEAFE',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:700,color:'#0057FF'}}>
                          <Clock size={10}/>{test.time}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:4,background:'#F8FAFC',border:'1px solid #EEF2FF',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:600,color:'#6B7280'}}>
                          {test.questions} q
                        </div>
                      </div>

                      {/* Progress */}
                      <div style={{marginBottom:14}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,fontWeight:700,marginBottom:7}}>
                          <span style={{color:'#9CA3AF'}}>Progress</span>
                          <span style={{color:'#0057FF',fontFamily:'Space Mono,monospace'}}>{done.length}/{sections.length}</span>
                        </div>
                        <div style={{height:6,background:'#F1F5F9',borderRadius:10,overflow:'hidden'}}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:.9,ease:[.34,1.56,.64,1]}}
                            className="prog-fill"
                            style={{height:'100%',background:'#0057FF',borderRadius:10}}/>
                        </div>
                      </div>

                      {/* Section rows */}
                      <div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:20}}>
                        {sections.map(s=>{
                          const Icon=s.icon; const isDone=done.includes(s.id)
                          return(
                            <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 10px',borderRadius:10,
                              background:isDone?'#F0FDF4':'#FAFBFF',
                              border:isDone?'1px solid #BBF7D0':'1px solid #EEF2FF',
                              transition:'all .15s'}}>
                              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:600,color:'#374151'}}>
                                <div style={{width:26,height:26,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',
                                  background:isDone?'#DCFCE7':'#EEF3FF',
                                  border:`1px solid ${isDone?'#BBF7D0':'#DBEAFE'}`}}>
                                  <Icon size={12} color={isDone?'#16a34a':'#0057FF'} strokeWidth={2.2}/>
                                </div>
                                {s.label}
                              </div>
                              {isDone
                                ? <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,fontWeight:700,color:'#16a34a'}}><CheckCircle2 size={11}/>Done</div>
                                : <div style={{fontSize:11,color:'#C7D2FE',fontWeight:500,fontFamily:'Space Mono,monospace'}}>—</div>
                              }
                            </div>
                          )
                        })}
                      </div>

                      {/* CTA */}
                      <motion.button onClick={e=>{e.stopPropagation();setTest(test)}}
                        whileHover={{scale:1.02}} whileTap={{scale:.97}}
                        style={{width:'100%',padding:'13px',background:'#0057FF',border:'none',borderRadius:14,color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 6px 18px rgba(0,87,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
                        {done.length>0 ? (
                          <><TrendingUp size={15}/>Continue</>
                        ) : (
                          <><Play size={14} fill='#fff'/>Start Test</>
                        )}
                        <ChevronRight size={14} strokeWidth={2.5}/>
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
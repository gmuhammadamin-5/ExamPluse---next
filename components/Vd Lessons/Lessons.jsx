"use client";
import React, { useState } from 'react';
import { Play, Clock, ChevronRight, Search, CheckCircle, Headphones, BookOpen, Mic, PenTool, Hash, X, GraduationCap, Flame, Trophy, Star } from 'lucide-react';

const SMETA = {
  'Listening':         { icon:<Headphones size={20}/> },
  'Reading':           { icon:<BookOpen size={20}/> },
  'Writing':           { icon:<PenTool size={20}/> },
  'Speaking':          { icon:<Mic size={20}/> },
  'Math':              { icon:<Hash size={20}/> },
  'Reading & Writing': { icon:<BookOpen size={20}/> },
}

const COURSES = {
  IELTS: { sections:[
    { id:'il', title:'Listening', lessons:[
      { id:1,  title:'Listening Complete Overview',        dur:'12:30', lv:1, watched:true,  vid:'cJtL8vWNZ4A' },
      { id:2,  title:'Section 1 & 2 Conversation',        dur:'18:45', lv:2, watched:true,  vid:'PKGAuOCensY' },
      { id:3,  title:'Section 3 & 4 Academic Listening',  dur:'22:10', lv:2, watched:false, vid:'5kfMNHi2PO0' },
      { id:4,  title:'Note Completion & Map Labelling',    dur:'15:00', lv:3, watched:false, vid:'rHTQ0iJ4sRQ' },
    ]},
    { id:'ir', title:'Reading', lessons:[
      { id:5,  title:'Reading Band 7+ Full Strategy',      dur:'20:00', lv:2, watched:false, vid:'gA2NJNVLB6A' },
      { id:6,  title:'True False Not Given Master Guide',  dur:'16:20', lv:2, watched:false, vid:'ukKcV5qeXts' },
      { id:7,  title:'Matching Headings Step by Step',     dur:'14:15', lv:3, watched:false, vid:'jNmQBLwwmLQ' },
      { id:8,  title:'Speed Reading & Skimming',           dur:'19:30', lv:3, watched:false, vid:'Okg5X4cBNLg' },
    ]},
    { id:'iw', title:'Writing', lessons:[
      { id:9,  title:'Task 1 Graph & Chart Description',   dur:'25:00', lv:2, watched:false, vid:'DPFgUZNtqkI' },
      { id:10, title:'Task 2 Band 7 Essay Structure',      dur:'30:00', lv:2, watched:false, vid:'cbTskdFTGNY' },
      { id:11, title:'Coherence & Cohesion Full Guide',    dur:'22:45', lv:3, watched:false, vid:'g9Rf9IUNHck' },
      { id:12, title:'Lexical Resource Advanced',          dur:'18:00', lv:3, watched:false, vid:'0J_tOBpBGKw' },
    ]},
    { id:'is', title:'Speaking', lessons:[
      { id:13, title:'Part 1 Topics & Model Answers',      dur:'16:00', lv:1, watched:false, vid:'AxcJEIxNGD4' },
      { id:14, title:'Part 2 Cue Card Full Strategy',      dur:'20:30', lv:2, watched:false, vid:'JFGHkTcxzA8' },
      { id:15, title:'Part 3 Discussion Questions',        dur:'24:00', lv:3, watched:false, vid:'IuakHXz_kJY' },
      { id:16, title:'Pronunciation Fluency Intonation',   dur:'19:15', lv:3, watched:false, vid:'fMRgJ8XFLeE' },
    ]},
  ]},
  TOEFL: { sections:[
    { id:'tr', title:'Reading', lessons:[
      { id:17, title:'Reading All Question Types',         dur:'18:00', lv:2, watched:false, vid:'8cONMoNQ7o4' },
      { id:18, title:'Inference & Purpose Questions',      dur:'14:30', lv:2, watched:false, vid:'ZqTrI2EFHOM' },
      { id:19, title:'Vocabulary in Context',              dur:'16:45', lv:3, watched:false, vid:'uFcDNLMFJnI' },
    ]},
    { id:'tl', title:'Listening', lessons:[
      { id:20, title:'Listening Lecture & Conversation',   dur:'20:00', lv:2, watched:false, vid:'pLRSaQiGZwI' },
      { id:21, title:'Note-taking Strategies',             dur:'17:20', lv:2, watched:false, vid:'MKJfVnhXIBU' },
    ]},
    { id:'ts', title:'Speaking', lessons:[
      { id:22, title:'Speaking All 4 Tasks Complete',      dur:'22:00', lv:2, watched:false, vid:'Y-BaWEWGXEY' },
      { id:23, title:'Independent Task High Score',        dur:'18:45', lv:3, watched:false, vid:'Fmh3A4kHfwQ' },
    ]},
    { id:'tw', title:'Writing', lessons:[
      { id:24, title:'Writing Integrated Task Complete',   dur:'25:00', lv:2, watched:false, vid:'MTJ7VNMMlKU' },
      { id:25, title:'Independent Essay Score 24+',        dur:'28:00', lv:3, watched:false, vid:'PGxSJQEVFiU' },
    ]},
  ]},
  SAT: { sections:[
    { id:'sm', title:'Math', lessons:[
      { id:26, title:'Math Heart of Algebra',              dur:'30:00', lv:2, watched:false, vid:'G30f9EPFRpk' },
      { id:27, title:'Problem Solving & Data Analysis',    dur:'26:00', lv:2, watched:false, vid:'aFaUABJkYkc' },
      { id:28, title:'Advanced Math Full Guide',           dur:'35:00', lv:3, watched:false, vid:'WwqTQrb5LCI' },
    ]},
    { id:'srw', title:'Reading & Writing', lessons:[
      { id:29, title:'Reading Evidence-Based Strategy',    dur:'22:00', lv:2, watched:false, vid:'GV5P9Kxm7_A' },
      { id:30, title:'Writing Grammar Mastery',            dur:'20:30', lv:2, watched:false, vid:'0zCb8t4wApE' },
      { id:31, title:'SAT Essay Perfect Score Guide',      dur:'28:00', lv:3, watched:false, vid:'rRNtFHPR3OY' },
    ]},
  ]},
}

const LV = ['','Beginner','Intermediate','Advanced']
const LV_COLOR = ['','#22c55e','#3b82f6','#f59e0b']

export default function Lessons() {
  const [exam, setExam]       = useState('IELTS')
  const [open, setOpen]       = useState(null)
  const [playing, setPlaying] = useState(null)
  const [search, setSearch]   = useState('')
  const [watched, setWatched] = useState({1:true,2:true})

  const course  = COURSES[exam]
  const allL    = course.sections.flatMap(s=>s.lessons)
  const wCount  = allL.filter(l=>watched[l.id]||l.watched).length
  const pct     = Math.round(wCount/allL.length*100)
  const markW   = id => setWatched(p=>({...p,[id]:true}))

  const filtered = search
    ? course.sections.map(s=>({...s,lessons:s.lessons.filter(l=>l.title.toLowerCase().includes(search.toLowerCase()))})).filter(s=>s.lessons.length>0)
    : course.sections

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .ls *{box-sizing:border-box;font-family:'Inter',system-ui,sans-serif}
        .ls-card{cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1)}
        .ls-card:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(37,99,235,0.18)!important}
        .ls-card:hover .ls-img{transform:scale(1.08)}
        .ls-card:hover .ls-ov{opacity:1!important}
        .ls-sec-hd{cursor:pointer;transition:all .15s}
        .ls-sec-hd:hover{background:rgba(37,99,235,0.04)!important}
        .ls-tab{border:none;cursor:pointer;font-family:inherit;transition:all .2s}
        .ls-inp:focus{outline:none;border-color:#2563eb!important;box-shadow:0 0 0 4px rgba(37,99,235,0.10)}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .ls-overlay{animation:fadeIn .2s ease}
        .ls-modal{animation:slideUp .28s cubic-bezier(.34,1.4,.64,1)}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:rgba(37,99,235,0.2);border-radius:5px}
      `}</style>

      <div className="ls" style={{
        minHeight:'calc(100vh - 70px)',
        background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
        padding:'40px 28px',
        position:'relative',
        overflow:'hidden',
      }}>
        {/* bg blobs */}
        <div style={{position:'fixed',top:-200,left:-200,width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'fixed',bottom:-100,right:-100,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.10) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'fixed',top:'40%',right:'-5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(147,197,253,0.10) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>

          {/* ═══ TOP PROGRESS BAR (center) ═══ */}
          <div style={{
            background:'rgba(255,255,255,0.65)',
            backdropFilter:'blur(20px)',
            WebkitBackdropFilter:'blur(20px)',
            border:'1px solid rgba(255,255,255,0.90)',
            borderRadius:24,
            padding:'28px 36px',
            marginBottom:32,
            boxShadow:'0 8px 32px rgba(37,99,235,0.08)',
            display:'flex',
            alignItems:'center',
            gap:32,
          }}>
            {/* Left — title */}
            <div style={{flex:1}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(37,99,235,0.10)',border:'1px solid rgba(37,99,235,0.20)',borderRadius:30,padding:'4px 14px',marginBottom:12}}>
                <GraduationCap size={12} color='#2563eb'/>
                <span style={{fontSize:11,fontWeight:700,color:'#2563eb',letterSpacing:'1.5px'}}>PREMIUM COURSE</span>
              </div>
              <h1 style={{fontSize:30,fontWeight:800,color:'#0f172a',letterSpacing:'-0.5px',margin:'0 0 6px'}}>
                Video Lessons
              </h1>
              <p style={{fontSize:13,color:'#64748b',margin:0}}>
                Expert-level IELTS · TOEFL · SAT preparation videos
              </p>
            </div>

            {/* Center — big progress */}
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,flex:1}}>
              {/* SVG circle */}
              <div style={{position:'relative',width:100,height:100}}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(37,99,235,0.10)" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#pg)" strokeWidth="8"
                    strokeDasharray={`${2*Math.PI*42}`}
                    strokeDashoffset={`${2*Math.PI*42*(1-pct/100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{transition:'stroke-dashoffset 1s ease'}}/>
                  <defs>
                    <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb"/>
                      <stop offset="100%" stopColor="#60a5fa"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:22,fontWeight:800,color:'#2563eb',lineHeight:1}}>{pct}%</span>
                  <span style={{fontSize:9,color:'#94a3b8',fontWeight:600,marginTop:2}}>DONE</span>
                </div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#0f172a'}}>{wCount} / {allL.length} Lessons</div>
                <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>Keep going! 🚀</div>
              </div>
            </div>

            {/* Right — stats */}
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:10}}>
              {[
                { icon:<Trophy size={15} color='#f59e0b'/>, label:'Current exam', val:exam },
                { icon:<Flame size={15} color='#ef4444'/>,  label:'Streak',        val:'5 days 🔥' },
                { icon:<Star size={15} color='#8b5cf6'/>,   label:'Total lessons',  val:allL.length+' videos' },
              ].map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,background:'rgba(37,99,235,0.05)',borderRadius:12,padding:'9px 14px'}}>
                  <div style={{width:30,height:30,borderRadius:9,background:'rgba(255,255,255,0.80)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:'#94a3b8',fontWeight:600}}>{s.label}</div>
                    <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ TABS + SEARCH ═══ */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28,flexWrap:'wrap'}}>
            {['IELTS','TOEFL','SAT'].map(k=>(
              <button key={k} className="ls-tab"
                onClick={()=>{setExam(k);setOpen(null);setPlaying(null)}}
                style={{
                  padding:'11px 32px',borderRadius:14,fontSize:14,fontWeight:700,
                  background:exam===k?'linear-gradient(135deg,#2563eb,#1d4ed8)':'rgba(255,255,255,0.70)',
                  color:exam===k?'#fff':'#64748b',
                  border:exam===k?'none':'1px solid rgba(255,255,255,0.90)',
                  backdropFilter:'blur(12px)',
                  boxShadow:exam===k?'0 8px 24px rgba(37,99,235,0.30)':'0 2px 8px rgba(0,0,0,0.05)',
                  transform:exam===k?'translateY(-1px)':'none',
                }}>
                {k}
              </button>
            ))}
            <div style={{marginLeft:'auto',position:'relative'}}>
              <Search size={13} color="#94a3b8" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
              <input className="ls-inp" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search lessons..."
                style={{padding:'11px 14px 11px 34px',border:'1px solid rgba(255,255,255,0.90)',borderRadius:14,fontSize:13,background:'rgba(255,255,255,0.70)',backdropFilter:'blur(12px)',width:220,color:'#0f172a',transition:'all .2s'}}/>
            </div>
          </div>

          {/* ═══ SECTIONS ═══ */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {filtered.map((sec,si)=>{
              const isOpen = open===sec.id||!!search
              const meta   = SMETA[sec.title]||{icon:<BookOpen size={20}/>}
              const sW     = sec.lessons.filter(l=>watched[l.id]||l.watched).length
              const sPct   = Math.round(sW/sec.lessons.length*100)
              return(
                <div key={sec.id} style={{
                  background:'rgba(255,255,255,0.65)',
                  backdropFilter:'blur(20px)',
                  WebkitBackdropFilter:'blur(20px)',
                  border:'1px solid rgba(255,255,255,0.90)',
                  borderRadius:20,
                  overflow:'hidden',
                  boxShadow:'0 4px 20px rgba(37,99,235,0.07)',
                }}>
                  {/* Section header */}
                  <div className="ls-sec-hd"
                    onClick={()=>setOpen(isOpen&&!search?null:sec.id)}
                    style={{display:'flex',alignItems:'center',gap:16,padding:'20px 26px',borderBottom:isOpen?'1px solid rgba(37,99,235,0.08)':'none'}}>

                    <div style={{width:52,height:52,borderRadius:16,background:'linear-gradient(135deg,#eff6ff,#dbeafe)',border:'1px solid rgba(37,99,235,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#2563eb',flexShrink:0,boxShadow:'0 4px 12px rgba(37,99,235,0.10)'}}>
                      {meta.icon}
                    </div>

                    <div style={{flex:1}}>
                      <div style={{fontSize:17,fontWeight:700,color:'#0f172a'}}>{sec.title}</div>
                      <div style={{fontSize:12,color:'#94a3b8',marginTop:3}}>
                        {sec.lessons.length} lessons
                        {sW>0&&<span style={{color:'#2563eb',fontWeight:600}}> · {sW} completed</span>}
                      </div>
                    </div>

                    {/* Section progress */}
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6,minWidth:120}}>
                      <div style={{fontSize:12,fontWeight:700,color:'#2563eb'}}>{sPct}% complete</div>
                      <div style={{width:120,height:5,background:'rgba(37,99,235,0.10)',borderRadius:10,overflow:'hidden'}}>
                        <div style={{width:sPct+'%',height:'100%',background:'linear-gradient(90deg,#2563eb,#60a5fa)',borderRadius:10,transition:'width .6s'}}/>
                      </div>
                    </div>

                    <div style={{width:36,height:36,borderRadius:11,background:'rgba(37,99,235,0.07)',display:'flex',alignItems:'center',justifyContent:'center',marginLeft:10,flexShrink:0}}>
                      <ChevronRight size={17} color="#3b82f6" style={{transform:isOpen?'rotate(90deg)':'none',transition:'transform .2s'}}/>
                    </div>
                  </div>

                  {/* Lessons grid */}
                  {isOpen&&(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:18,padding:'22px 26px'}}>
                      {sec.lessons.map((l,idx)=>{
                        const isW  = watched[l.id]||l.watched
                        const thumb= 'https://img.youtube.com/vi/'+l.vid+'/hqdefault.jpg'
                        return(
                          <div key={l.id} className="ls-card"
                            onClick={()=>{setPlaying(l);markW(l.id)}}
                            style={{borderRadius:18,overflow:'hidden',background:'rgba(255,255,255,0.85)',border:'1px solid rgba(255,255,255,0.95)',boxShadow:'0 4px 18px rgba(37,99,235,0.08)'}}>

                            {/* Thumb */}
                            <div style={{position:'relative',paddingTop:'56.25%',overflow:'hidden',background:'#1e3a8a'}}>
                              <img className="ls-img" src={thumb} alt=""
                                style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.88,transition:'transform .4s ease'}}
                                onError={e=>e.target.style.display='none'}/>
                              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(30,58,138,0.55) 0%,transparent 55%)'}}/>

                              {/* Number badge */}
                              <div style={{position:'absolute',top:10,left:10,background:'linear-gradient(135deg,#2563eb,#1d4ed8)',borderRadius:10,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',boxShadow:'0 4px 12px rgba(37,99,235,0.45)'}}>
                                {String(idx+1).padStart(2,'0')}
                              </div>

                              {/* Watched */}
                              {isW&&(
                                <div style={{position:'absolute',top:10,right:10,background:'rgba(34,197,94,0.92)',backdropFilter:'blur(6px)',borderRadius:9,padding:'3px 9px',fontSize:10,fontWeight:700,color:'#fff',display:'flex',alignItems:'center',gap:3}}>
                                  <CheckCircle size={9}/>Completed
                                </div>
                              )}

                              {/* Play overlay */}
                              <div className="ls-ov" style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,58,138,0.28)',opacity:0,transition:'opacity .2s'}}>
                                <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,0.95)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 10px 30px rgba(37,99,235,0.35)'}}>
                                  <Play size={22} fill='#2563eb' color='#2563eb' style={{marginLeft:3}}/>
                                </div>
                              </div>

                              {/* Duration */}
                              <div style={{position:'absolute',bottom:10,right:10,background:'rgba(15,23,42,0.68)',backdropFilter:'blur(6px)',borderRadius:9,padding:'4px 9px',fontSize:11,fontWeight:600,color:'#fff',display:'flex',alignItems:'center',gap:4}}>
                                <Clock size={10}/>{l.dur}
                              </div>
                            </div>

                            {/* Info */}
                            <div style={{padding:'14px 16px 16px'}}>
                              <div style={{fontSize:13,fontWeight:600,color:'#0f172a',lineHeight:1.45,marginBottom:12}}>
                                {l.title}
                              </div>
                              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                <div style={{display:'flex',alignItems:'center',gap:6}}>
                                  {[1,2,3].map(i=>(
                                    <div key={i} style={{width:7,height:7,borderRadius:'50%',background:i<=l.lv?LV_COLOR[l.lv]:'rgba(37,99,235,0.12)',transition:'background .2s'}}/>
                                  ))}
                                  <span style={{fontSize:10,fontWeight:600,color:LV_COLOR[l.lv],marginLeft:3}}>{LV[l.lv]}</span>
                                </div>
                                <div style={{fontSize:10,fontWeight:700,color:'#2563eb',background:'rgba(37,99,235,0.08)',border:'1px solid rgba(37,99,235,0.15)',padding:'3px 9px',borderRadius:8}}>{exam}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══ VIDEO MODAL ═══ */}
      {playing&&(
        <div className="ls-overlay" onClick={()=>setPlaying(null)}
          style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.82)',backdropFilter:'blur(16px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div className="ls-modal" onClick={e=>e.stopPropagation()}
            style={{width:'100%',maxWidth:920,background:'rgba(255,255,255,0.97)',backdropFilter:'blur(20px)',borderRadius:24,overflow:'hidden',boxShadow:'0 40px 120px rgba(37,99,235,0.30)',border:'1px solid rgba(255,255,255,0.95)'}}>

            <div style={{position:'relative',paddingTop:'56.25%'}}>
              <iframe src={'https://www.youtube.com/embed/'+playing.vid+'?autoplay=1&rel=0'}
                style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none'}}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
            </div>

            <div style={{padding:'18px 24px',display:'flex',alignItems:'center',gap:16,borderTop:'1px solid rgba(37,99,235,0.08)',background:'rgba(255,255,255,0.98)'}}>
              <div style={{width:46,height:46,borderRadius:14,background:'linear-gradient(135deg,#eff6ff,#dbeafe)',border:'1px solid rgba(37,99,235,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#2563eb',flexShrink:0}}>
                {SMETA[course.sections.find(s=>s.lessons.find(ll=>ll.id===playing.id))?.title]?.icon||<Play size={18}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,color:'#0f172a'}}>{playing.title}</div>
                <div style={{fontSize:12,color:'#94a3b8',marginTop:3,display:'flex',gap:14}}>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Clock size={11}/>{playing.dur}</span>
                  <span style={{color:LV_COLOR[playing.lv],fontWeight:600}}>{LV[playing.lv]}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <div style={{background:'#dcfce7',border:'1px solid #bbf7d0',borderRadius:11,padding:'8px 16px',fontSize:12,fontWeight:700,color:'#16a34a',display:'flex',alignItems:'center',gap:5}}>
                  <CheckCircle size={13}/>Completed
                </div>
                <button onClick={()=>setPlaying(null)}
                  style={{background:'#f8fafc',border:'1.5px solid #e2e8f0',borderRadius:11,width:40,height:40,cursor:'pointer',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'inherit'}}>
                  <X size={16}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
"use client";
import { useState, useRef, useEffect } from 'react';
import { Flag, CheckCircle, X, ChevronUp, ChevronDown, Mic, Clock } from 'lucide-react';
import { READING_PASSAGE, CAMBRIDGE_QUESTIONS, WRITING_TASKS, SPEAKING_PARTS } from './ExamData';
import SpeakingTest from '../SpeakingTest';

const BRAND = '#007bff';
const TABS = ['Reading','Writing','Listening','Speaking'];

function useTimer(s){ const [v,setV]=useState(s); useEffect(()=>{ if(v<=0)return; const t=setTimeout(()=>setV(x=>x-1),1000); return()=>clearTimeout(t); },[v]); return `${String(Math.floor(v/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`; }

/* ─── Reading ─── */
function ReadingSection({ onComplete }) {
  const [answers,setAnswers]=useState({});
  const [flagged,setFlagged]=useState(new Set());
  const [fontSize,setFontSize]=useState(14);
  const [highlights,setHighlights]=useState([]);
  const [activeQ,setActiveQ]=useState(1);
  const timer=useTimer(75*60);
  const ref=useRef();

  const toggleFlag=(n)=>setFlagged(p=>{ const s=new Set(p); s.has(n)?s.delete(n):s.add(n); return s; });

  const handleMouseUp=()=>{
    const sel=window.getSelection();
    if(!sel||sel.isCollapsed) return;
    const t=sel.toString().trim();
    if(t) setHighlights(h=>[...h,t]);
    sel.removeAllRanges();
  };

  const done=Object.keys(answers).length;

  return(
    <div style={{display:'grid',gridTemplateColumns:'240px 1fr',height:'calc(100vh - 56px)'}}>
      {/* LEFT SIDEBAR nav */}
      <div style={{background:'white',borderRight:'1px solid #e8edf2',display:'flex',flexDirection:'column',overflowY:'auto'}}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid #e2e8f0'}}>
          <div style={{fontSize:11,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:8}}>Questions</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4}}>
            {CAMBRIDGE_QUESTIONS.map((_,i)=>{
              const n=i+1;
              return(
                <button key={n} onClick={()=>setActiveQ(n)} style={{aspectRatio:'1',borderRadius:6,border:`1.5px solid ${activeQ===n?BRAND:flagged.has(n)?'#f59e0b':answers[n]?'#059669':'#e2e8f0'}`,background:activeQ===n?BRAND:answers[n]?'#dcfce7':'#fff',color:activeQ===n?'#fff':answers[n]?'#059669':'#64748b',fontSize:11,fontWeight:700,cursor:'pointer',position:'relative'}}>
                  {n}{flagged.has(n)&&<span style={{position:'absolute',top:-3,right:-3,fontSize:8}}>🚩</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{padding:'14px 16px',borderBottom:'1px solid #e2e8f0'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:8}}>Progress</div>
          <div style={{background:'#e2e8f0',borderRadius:99,height:6,overflow:'hidden'}}>
            <div style={{width:`${(done/CAMBRIDGE_QUESTIONS.length)*100}%`,height:'100%',background:BRAND,borderRadius:99,transition:'width .3s'}}/>
          </div>
          <div style={{fontSize:11,color:'#64748b',marginTop:6}}>{done}/{CAMBRIDGE_QUESTIONS.length} answered</div>
        </div>
        <div style={{padding:'14px 16px',borderBottom:'1px solid #e2e8f0'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:8}}>Font Size</div>
          <div style={{display:'flex',gap:4}}>
            {[12,14,16].map(s=>(
              <button key={s} onClick={()=>setFontSize(s)} style={{flex:1,padding:'5px',borderRadius:6,border:`1.5px solid ${fontSize===s?BRAND:'#e2e8f0'}`,background:fontSize===s?BRAND:'#fff',color:fontSize===s?'#fff':'#64748b',fontSize:11,fontWeight:700,cursor:'pointer'}}>A{s===12?'':'+'+(s-12)}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1,padding:'14px 16px'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:8}}>Timer</div>
          <div style={{display:'flex',alignItems:'center',gap:6,background:'#fff',border:`1px solid ${BRAND}`,borderRadius:8,padding:'6px 10px'}}>
            <Clock size={12} color={BRAND}/>
            <span style={{fontSize:13,fontWeight:800,color:'#0f172a',fontVariantNumeric:'tabular-nums'}}>{timer}</span>
          </div>
        </div>
        <div style={{padding:'14px 16px',borderTop:'1px solid #e2e8f0'}}>
          <button onClick={onComplete} style={{width:'100%',padding:'10px',borderRadius:10,border:'none',background:'#059669',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>Submit ✓</button>
        </div>
      </div>

      {/* RIGHT — single scrollable page */}
      <div ref={ref} onMouseUp={handleMouseUp} style={{overflowY:'auto',background:'#fff',padding:'32px 48px'}}>
        {/* passage */}
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <h2 style={{fontSize:22,fontWeight:900,color:'#0f172a',marginBottom:6}}>{READING_PASSAGE.title}</h2>
          <p style={{fontSize:11,color:'#94a3b8',marginBottom:28}}>{READING_PASSAGE.source}</p>
          {READING_PASSAGE.text.split('\n\n').map((para,i)=>{
            let html=para;
            highlights.forEach(h=>{html=html.replaceAll(h,`<mark style="background:#FFF9C4;padding:1px 2px">${h}</mark>`);});
            return <p key={i} style={{fontSize,lineHeight:1.9,color:'#1e293b',marginBottom:20}} dangerouslySetInnerHTML={{__html:html}}/>;
          })}

          {/* embedded questions */}
          <div style={{borderTop:'2px solid #f1f5f9',paddingTop:32,marginTop:32}}>
            <h3 style={{fontSize:16,fontWeight:900,color:'#0f172a',marginBottom:24}}>Questions 1–{CAMBRIDGE_QUESTIONS.length}</h3>
            {CAMBRIDGE_QUESTIONS.map((q,i)=>{
              const n=i+1;
              const isActive=activeQ===n;
              return(
                <div key={n} id={`q${n}`} onClick={()=>setActiveQ(n)}
                  style={{marginBottom:20,padding:'20px',borderRadius:16,border:`2px solid ${isActive?BRAND:answers[n]?'#059669':'#f1f5f9'}`,background:isActive?'rgba(0,177,193,0.03)':'#fff',transition:'all .2s',cursor:'pointer'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                    <span style={{fontSize:12,fontWeight:800,color:BRAND}}>Question {n}</span>
                    <button onClick={e=>{e.stopPropagation();toggleFlag(n);}} style={{display:'flex',alignItems:'center',gap:4,padding:'4px 10px',borderRadius:6,border:'1.5px solid',borderColor:flagged.has(n)?'#f59e0b':'#e2e8f0',background:flagged.has(n)?'#fffbeb':'#fff',color:flagged.has(n)?'#f59e0b':'#94a3b8',fontSize:10,fontWeight:700,cursor:'pointer'}}>
                      <Flag size={10}/>{flagged.has(n)?'Flagged':'Flag'}
                    </button>
                  </div>
                  <p style={{fontSize:13,color:'#1e293b',lineHeight:1.65,marginBottom:14,fontWeight:500}}>{q.text}</p>

                  {q.type==='multiple_choice'&&q.options&&(
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {q.options.map((opt,oi)=>{
                        const sel=answers[n]===opt;
                        return(
                          <button key={oi} onClick={e=>{e.stopPropagation();setAnswers(a=>({...a,[n]:opt}));}} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,border:`1.5px solid ${sel?BRAND:'#e2e8f0'}`,background:sel?'rgba(0,177,193,0.08)':'#fff',cursor:'pointer',textAlign:'left',transition:'all .15s'}}>
                            <span style={{width:22,height:22,borderRadius:'50%',border:`2px solid ${sel?BRAND:'#cbd5e1'}`,background:sel?BRAND:'transparent',color:sel?'#fff':'#94a3b8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,flexShrink:0}}>{['A','B','C','D'][oi]}</span>
                            <span style={{fontSize:13,color:'#1e293b'}}>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {(q.type==='open_cloze'||q.type==='gapped_text')&&q.options&&(
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      {q.options.map((opt,oi)=>{
                        const sel=answers[n]===opt;
                        return(
                          <button key={oi} onClick={e=>{e.stopPropagation();setAnswers(a=>({...a,[n]:opt}));}} style={{padding:'8px 16px',borderRadius:99,border:`1.5px solid ${sel?BRAND:'#e2e8f0'}`,background:sel?BRAND:'#fff',color:sel?'#fff':'#475569',fontWeight:700,fontSize:13,cursor:'pointer',transition:'all .15s'}}>{opt}</button>
                        );
                      })}
                    </div>
                  )}
                  {q.type==='open_cloze'&&!q.options&&(
                    <input value={answers[n]||''} onChange={e=>{e.stopPropagation();setAnswers(a=>({...a,[n]:e.target.value}));}} placeholder="Type your answer..."
                      style={{width:'100%',padding:'10px 14px',border:`1.5px solid ${answers[n]?BRAND:'#e2e8f0'}`,borderRadius:10,fontSize:13,outline:'none',boxSizing:'border-box'}}/>
                  )}
                  {answers[n]&&<div style={{display:'flex',alignItems:'center',gap:6,marginTop:10,color:'#059669',fontSize:11,fontWeight:700}}><CheckCircle size={12}/>Answered</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Writing ─── */
function WritingSection({ onComplete }) {
  const [task,setTask]=useState(1);
  const [t1,setT1]=useState('');
  const [t2,setT2]=useState('');
  const timer=useTimer(90*60);
  const text=task===1?t1:t2;
  const setText=task===1?setT1:setT2;
  const wc=text.trim().split(/\s+/).filter(Boolean).length;
  const taskData=WRITING_TASKS.CAMBRIDGE;

  return(
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 56px)'}}>
      <div style={{background:'#f8fafc',borderBottom:'1.5px solid #e2e8f0',padding:'8px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',gap:4}}>
          {[1,2].map(t=>(
            <button key={t} onClick={()=>setTask(t)} style={{padding:'6px 16px',borderRadius:8,border:'none',background:task===t?BRAND:'#e2e8f0',color:task===t?'#fff':'#64748b',fontWeight:700,fontSize:12,cursor:'pointer'}}>Part {t}</button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:700,color:'#0f172a'}}>
          <Clock size={14} color={BRAND}/> {timer}
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',padding:'28px 40px',gap:16,overflowY:'auto',background:'#fff',maxWidth:820,margin:'0 auto',width:'100%'}}>
        <div style={{background:'rgba(0,177,193,0.06)',border:`1px solid ${BRAND}`,borderRadius:12,padding:'16px 20px',fontSize:13,color:'#1e293b',lineHeight:1.7}}>
          <strong>Part {task}: </strong>{task===1?taskData.task1.prompt:taskData.task2.prompt}
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Begin writing here..."
          style={{flex:1,minHeight:320,padding:'20px',border:`1.5px solid ${wc>=220?'#059669':'#e2e8f0'}`,borderRadius:14,fontSize:14,lineHeight:1.9,color:'#1e293b',resize:'none',outline:'none',fontFamily:'Georgia,serif',transition:'border .2s'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <span style={{fontSize:14,fontWeight:800,color:wc<220?'#f59e0b':'#059669'}}>Words: {wc}</span>
            <span style={{fontSize:12,color:'#94a3b8',marginLeft:8}}>/ 220–260 required</span>
            {wc>=220&&<CheckCircle size={14} color="#059669" style={{marginLeft:8,verticalAlign:'middle'}}/>}
          </div>
          {task===1?<button onClick={()=>setTask(2)} style={{padding:'10px 24px',borderRadius:10,border:'none',background:BRAND,color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>Next Part →</button>
            :<button onClick={onComplete} style={{padding:'10px 24px',borderRadius:10,border:'none',background:'#059669',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>Submit ✓</button>}
        </div>
      </div>
    </div>
  );
}

/* ─── Speaking ─── (face-to-face simulation) */
function SpeakingSection({ onComplete }) {
  const [partIdx,setPartIdx]=useState(0);
  const [recording,setRecording]=useState(false);
  const [done,setDone]=useState(false);
  const [recSecs,setRecSecs]=useState(0);
  const part=SPEAKING_PARTS.IELTS[partIdx];

  const start=()=>{ setRecording(true); setRecSecs(120); };
  useEffect(()=>{ if(!recording) return; const t=setInterval(()=>setRecSecs(s=>{ if(s<=1){clearInterval(t);setRecording(false);setDone(true);return 0;} return s-1; }),1000); return()=>clearInterval(t); },[recording]);

  const next=()=>{ if(partIdx<SPEAKING_PARTS.IELTS.length-1){setPartIdx(i=>i+1);setDone(false);}else onComplete(); };

  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 56px)',padding:32,background:'linear-gradient(135deg,#f0fdff,#e0f9fb)'}}>
      <div style={{maxWidth:520,width:'100%',textAlign:'center'}}>
        {/* Examiner avatar */}
        <div style={{width:80,height:80,borderRadius:'50%',background:`linear-gradient(135deg,${BRAND},#0072CF)`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:28,boxShadow:`0 8px 24px rgba(0,177,193,0.3)`}}>👩‍💼</div>
        <div style={{fontSize:13,fontWeight:700,color:BRAND,marginBottom:4}}>Cambridge Examiner</div>
        <div style={{fontSize:12,color:'#64748b',marginBottom:28}}>Face-to-face speaking test — live assessment</div>

        <div style={{background:'#fff',borderRadius:20,border:`2px solid ${recording?BRAND:'#e2e8f0'}`,padding:28,boxShadow:'0 8px 32px rgba(0,0,0,0.08)',transition:'border .3s'}}>
          <div style={{fontSize:11,fontWeight:800,color:BRAND,textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>{part.title}</div>
          {part.type==='cue_card'&&<>
            <p style={{fontSize:14,fontWeight:700,color:'#0f172a',marginBottom:12}}>{part.topic}</p>
            <ul style={{textAlign:'left',paddingLeft:20,color:'#64748b',fontSize:13,lineHeight:2,marginBottom:20}}>{part.bullets.map((b,i)=><li key={i}>{b}</li>)}</ul>
          </>}
          {part.type!=='cue_card'&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>{part.questions?.map((q,i)=><div key={i} style={{padding:'10px 14px',borderRadius:10,background:'#f8fafc',border:'1px solid #e2e8f0',fontSize:13,color:'#1e293b',textAlign:'left'}}>{q}</div>)}</div>}
          {!recording&&!done&&<button onClick={start} style={{width:'100%',padding:'13px',borderRadius:12,border:'none',background:BRAND,color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}><Mic size={16} style={{marginRight:8,verticalAlign:'middle'}}/>Start Recording</button>}
          {recording&&<div style={{textAlign:'center'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',animation:'cam-pulse 1s ease-in-out infinite'}}><Mic size={28} color="#fff"/></div>
            <div style={{fontSize:32,fontWeight:900,color:'#ef4444',fontVariantNumeric:'tabular-nums'}}>{recSecs}s</div>
          </div>}
          {done&&<div style={{textAlign:'center'}}><CheckCircle size={40} color="#059669" style={{marginBottom:12}}/><p style={{color:'#059669',fontWeight:700,marginBottom:16}}>Part complete</p>
            <button onClick={next} style={{padding:'12px 28px',borderRadius:12,border:'none',background:partIdx<2?BRAND:'#059669',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>{partIdx<2?'Next Part →':'Finish ✓'}</button>
          </div>}
        </div>
      </div>
      <style>{`@keyframes cam-pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 16px rgba(239,68,68,0)}}`}</style>
    </div>
  );
}

function Results({ onRestart }) {
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 56px)',padding:32}}>
      <div style={{maxWidth:480,width:'100%',textAlign:'center'}}>
        <div style={{width:120,height:120,borderRadius:'50%',background:`linear-gradient(135deg,${BRAND},#0072CF)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:`0 16px 40px rgba(0,177,193,0.3)`}}>
          <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>C1</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.75)'}}>Advanced</div>
        </div>
        <h2 style={{fontSize:22,fontWeight:900,marginBottom:8}}>Exam Complete</h2>
        <p style={{color:'#64748b',marginBottom:28}}>Results typically available within 28 days.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:28}}>
          {['Reading','Writing','Listening','Speaking'].map(k=>(
            <div key={k} style={{background:'#f8fafc',borderRadius:12,padding:'14px 8px',border:'1px solid #e2e8f0'}}>
              <div style={{fontSize:9,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:6}}>{k}</div>
              <div style={{fontSize:22,fontWeight:900,color:BRAND}}>B+</div>
            </div>
          ))}
        </div>
        <button onClick={onRestart} style={{padding:'13px 32px',borderRadius:12,border:`2px solid ${BRAND}`,background:'#fff',color:BRAND,fontWeight:800,fontSize:14,cursor:'pointer'}}>Retake</button>
      </div>
    </div>
  );
}

function Header({ tabIdx, setTab, onExit, done }) {
  return(
    <div style={{background:'white',borderBottom:'1px solid #e2e8f0',padding:'0 24px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:30,height:30,borderRadius:8,background:'#007bff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff'}}>C</div>
        <span style={{fontSize:14,fontWeight:900,color:'#1e293b',letterSpacing:'-0.5px'}}>Cambridge English</span>
      </div>
      {!done&&(
        <div style={{display:'flex',gap:0}}>
          {TABS.map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} style={{padding:'0 16px',height:52,border:'none',background:'none',color:i===tabIdx?'#007bff':'#94a3b8',fontWeight:i===tabIdx?800:600,fontSize:13,cursor:'pointer',borderBottom:`2px solid ${i===tabIdx?'#007bff':'transparent'}`,marginBottom:-1,transition:'all .2s'}}>
              {t}{i<tabIdx&&' ✓'}
            </button>
          ))}
        </div>
      )}
      <button onClick={onExit} style={{background:'white',border:'1.5px solid #e2e8f0',borderRadius:8,color:'#64748b',fontSize:12,padding:'6px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontWeight:700}}>
        <X size={13}/> Exit
      </button>
    </div>
  );
}

export default function CambridgeEngine({ onExit }) {
  const [tabIdx,setTabIdx]=useState(0);
  const [done,setDone]=useState(false);
  const next=()=>{ if(tabIdx<TABS.length-1) setTabIdx(i=>i+1); else setDone(true); };
  return(
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh'}}>
      <Header tabIdx={tabIdx} setTab={setTabIdx} onExit={onExit} done={done}/>
      {done?<Results onRestart={()=>{setTabIdx(0);setDone(false);}}/>:
        tabIdx===0?<ReadingSection onComplete={next}/>:
        tabIdx===1?<WritingSection onComplete={next}/>:
        tabIdx===2?<ListeningSection onComplete={next}/>:
        <SpeakingTest onComplete={next} onExit={onExit}/>}
    </div>
  );
}

function ListeningSection({ onComplete }) {
  const [progress,setProgress]=useState(0);
  const [answers,setAnswers]=useState({});
  const [phase,setPhase]=useState('playing');
  const timer=useTimer(40*60);
  useEffect(()=>{
    if(phase!=='playing') return;
    if(progress>=100){setPhase('answering');return;}
    const t=setInterval(()=>setProgress(p=>Math.min(100,p+0.5)),300);
    return ()=>clearInterval(t);
  },[phase,progress]);
  return(
    <div style={{flex:1,padding:'32px',maxWidth:700,margin:'0 auto',width:'100%',minHeight:'calc(100vh - 56px)'}}>
      <div style={{background:'linear-gradient(135deg,#0072CF,#00B1C1)',borderRadius:16,padding:'24px',marginBottom:24,color:'#fff'}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>🎧 Listening — Part 1</div>
        <div style={{background:'rgba(255,255,255,0.15)',borderRadius:99,height:8,overflow:'hidden'}}>
          <div style={{width:`${progress}%`,height:'100%',background:'#fff',borderRadius:99,transition:'width .3s'}}/>
        </div>
      </div>
      {phase==='answering'&&CAMBRIDGE_QUESTIONS.slice(0,4).map((q,i)=>(
        <div key={q.id} style={{marginBottom:16,padding:'16px 20px',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0'}}>
          <p style={{fontSize:13,fontWeight:600,color:'#0f172a',marginBottom:10}}>{i+1}. {q.text}</p>
          {q.options&&<div style={{display:'flex',flexDirection:'column',gap:6}}>{q.options.map((opt,oi)=>{const sel=answers[q.id]===opt;return<button key={oi} onClick={()=>setAnswers(a=>({...a,[q.id]:opt}))} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:8,border:`1.5px solid ${sel?BRAND:'#e2e8f0'}`,background:sel?'rgba(0,177,193,0.08)':'#fff',cursor:'pointer',textAlign:'left',fontSize:12,color:'#1e293b'}}><span style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${sel?BRAND:'#cbd5e1'}`,background:sel?BRAND:'transparent',color:sel?'#fff':'#94a3b8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,flexShrink:0}}>{['A','B','C','D'][oi]}</span>{opt}</button>;})}</div>}
          {!q.options&&<input value={answers[q.id]||''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} placeholder="Answer..." style={{width:'100%',padding:'8px 12px',border:`1.5px solid ${answers[q.id]?BRAND:'#e2e8f0'}`,borderRadius:8,fontSize:12,outline:'none',boxSizing:'border-box'}}/>}
        </div>
      ))}
      {phase==='answering'&&<button onClick={onComplete} style={{width:'100%',padding:'14px',borderRadius:12,border:'none',background:'#059669',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer',marginTop:8}}>Submit ✓</button>}
    </div>
  );
}

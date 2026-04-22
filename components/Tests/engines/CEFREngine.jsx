"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Mic, CheckCircle, ChevronRight } from 'lucide-react';
import { SPEAKING_PARTS } from './ExamData';
import SpeakingTest from '../SpeakingTest';

const SPEAKING_TYPES = new Set(['read_aloud', 'speak_photo', 'interactive_speak']);

const BRAND = '#58CC02';
const BLUE  = '#1CB0F6';
const DARK  = '#4B4B4B';

const QUESTIONS = [
  { id:1, type:'read_aloud',      title:'Read Aloud', instruction:'Read the sentence aloud as naturally as possible.', content:'The development of sustainable urban transportation is one of the most pressing challenges facing modern city planners today.', prepSecs:20, recSecs:20 },
  { id:2, type:'listen_type',     title:'Listen and Type', instruction:'You will hear a sentence. Type exactly what you hear.', audio:'Urban mobility solutions require integrated approaches combining public and private transportation networks.', prepSecs:0, recSecs:60 },
  { id:3, type:'speak_photo',     title:'Speak About the Photo', instruction:'Describe what you see in the image in as much detail as possible.', content:'A busy city intersection showing cyclists in dedicated green lanes, an electric tram, pedestrians at a crosswalk, and solar-powered bus stops in the background.', prepSecs:20, recSecs:90 },
  { id:4, type:'read_select',     title:'Read and Select', instruction:'Select all the REAL English words. Tap each word that is a real word.', words:[{w:'transit',r:true},{w:'mobulation',r:false},{w:'infrastructure',r:true},{w:'velotram',r:false},{w:'sustainable',r:true},{w:'flumbery',r:false},{w:'congestion',r:true},{w:'trafficize',r:false}], prepSecs:0, recSecs:45 },
  { id:5, type:'write_photo',     title:'Write About the Photo', instruction:'Write a description of the image. Include as much detail as possible.', content:'A modern electric bus at a charging station. Several passengers are boarding. In the background, a city skyline with solar panels is visible.', prepSecs:0, recSecs:60 },
  { id:6, type:'interactive_speak',title:'Interactive Speaking', instruction:'Answer the question as completely as possible.', content:'What do you think is the most important advantage of using public transportation in big cities? Give specific reasons and examples.', prepSecs:0, recSecs:35 },
  { id:7, type:'interactive_write',title:'Interactive Writing', instruction:'Write a response to the prompt. Aim for 50–100 words.', content:'Some people believe that private cars should be banned from city centres. Do you agree or disagree? Support your view with reasons and examples.', prepSecs:0, recSecs:300 },
];

/* ─── Circular Timer ─── */
function CircularTimer({ secs, total, color=BRAND, size=80 }) {
  const r=32, circ=2*Math.PI*r;
  const pct=Math.max(0,secs/total);
  const dash=circ*pct;
  const timerColor=pct>0.5?color:pct>0.25?'#FFC200':'#ef4444';
  return(
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0,transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={timerColor} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:'stroke-dasharray .9s linear,stroke .3s'}}/>
      </svg>
      <div style={{fontSize:16,fontWeight:900,color:timerColor,fontVariantNumeric:'tabular-nums'}}>{secs}</div>
    </div>
  );
}

/* ─── Waveform ─── */
function Waveform({ recording }) {
  const [bars,setBars]=useState(Array(24).fill(8));
  useEffect(()=>{
    if(!recording){setBars(Array(24).fill(8));return;}
    const t=setInterval(()=>setBars(Array(24).fill(0).map(()=>8+Math.random()*28)),120);
    return()=>clearInterval(t);
  },[recording]);
  return(
    <div style={{display:'flex',gap:3,alignItems:'center',height:44,justifyContent:'center'}}>
      {bars.map((h,i)=><div key={i} style={{width:4,borderRadius:2,background:recording?BRAND:'#e2e8f0',height:`${h}px`,transition:'height .12s ease'}}/>)}
    </div>
  );
}

/* ─── Question Shell ─── */
function QuestionCard({ q, onNext, qIdx, total }) {
  const [phase,setPhase]=useState('intro'); // intro | prep | active | done
  const [secs,setSecsState]=useState(0);
  const [text,setText]=useState('');
  const [selected,setSelected]=useState(new Set());
  const [recording,setRecording]=useState(false);

  const startPrep=()=>{
    if(q.prepSecs>0){
      setPhase('prep');setSecsState(q.prepSecs);
    } else { startActive(); }
  };

  const startActive=()=>{
    setPhase('active');setSecsState(q.recSecs);setRecording(true);
  };

  useEffect(()=>{
    if(phase==='prep'||phase==='active'){
      if(secs<=0){
        if(phase==='prep') startActive();
        else { setRecording(false); setPhase('done'); }
        return;
      }
      const t=setTimeout(()=>setSecsState(s=>s-1),1000);
      return()=>clearTimeout(t);
    }
  },[phase,secs]);

  const totalSecs=phase==='prep'?q.prepSecs:q.recSecs;

  const isText=q.type==='listen_type'||q.type==='write_photo'||q.type==='interactive_write';
  const isRecord=q.type==='read_aloud'||q.type==='speak_photo'||q.type==='interactive_speak';
  const isSelect=q.type==='read_select';

  return(
    <div style={{maxWidth:560,width:'100%',margin:'0 auto'}}>
      {/* question type badge */}
      <div style={{display:'inline-flex',alignItems:'center',gap:6,background:BRAND+'22',border:`1px solid ${BRAND}44`,borderRadius:99,padding:'4px 14px',marginBottom:16}}>
        <span style={{fontSize:11,fontWeight:800,color:BRAND,textTransform:'uppercase',letterSpacing:'1px'}}>{q.title}</span>
      </div>

      <div style={{background:'#fff',borderRadius:24,border:'2px solid #f1f5f9',boxShadow:'0 8px 32px rgba(0,0,0,0.06)',padding:28,transition:'border .3s',borderColor:phase==='active'?BRAND:phase==='done'?'#059669':'#f1f5f9'}}>
        <p style={{fontSize:13,color:'#64748b',lineHeight:1.6,marginBottom:20}}>{q.instruction}</p>

        {/* content */}
        {q.content&&<div style={{background:'#f8fafc',borderRadius:14,padding:'16px 20px',marginBottom:20,border:'1px solid #e2e8f0'}}>
          {q.type==='speak_photo'||q.type==='write_photo'
            ? <div style={{background:'linear-gradient(135deg,#e0f9fb,#d5f0ff)',borderRadius:12,padding:'20px',fontSize:13,color:'#475569',lineHeight:1.65,fontStyle:'italic'}}>📷 {q.content}</div>
            : <p style={{fontSize:14,color:'#1e293b',lineHeight:1.75,fontWeight:500,margin:0}}>{q.content}</p>
          }
        </div>}

        {/* timer display */}
        {(phase==='prep'||phase==='active')&&(
          <div style={{textAlign:'center',marginBottom:20}}>
            <CircularTimer secs={secs} total={totalSecs} color={phase==='prep'?BLUE:BRAND}/>
            <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginTop:8,textTransform:'uppercase',letterSpacing:'0.8px'}}>
              {phase==='prep'?'Preparation time':'Recording time'}
            </div>
          </div>
        )}

        {/* read_select */}
        {isSelect&&(
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:20}}>
            {(q.words||[]).map((item,i)=>{
              const sel=selected.has(i);
              return<button key={i} onClick={()=>setSelected(s=>{const n=new Set(s);sel?n.delete(i):n.add(i);return n;})} style={{padding:'9px 18px',borderRadius:99,border:`2px solid ${sel?BRAND:'#e2e8f0'}`,background:sel?BRAND:'#fff',color:sel?'#fff':'#475569',fontWeight:700,fontSize:13,cursor:'pointer',transition:'all .15s'}}>{item.w}</button>;
            })}
          </div>
        )}

        {/* text input */}
        {isText&&phase==='active'&&(
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={q.type==='listen_type'?'Type what you heard...':'Write here...'}
            style={{width:'100%',minHeight:q.type==='interactive_write'?140:80,padding:'14px',border:`1.5px solid ${BRAND}`,borderRadius:12,fontSize:13,lineHeight:1.7,color:'#1e293b',resize:'none',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
        )}
        {isText&&text&&phase==='active'&&<div style={{fontSize:11,color:'#94a3b8',marginTop:6}}>Words: {text.trim().split(/\s+/).filter(Boolean).length}</div>}

        {/* recording */}
        {isRecord&&(phase==='prep'||phase==='active')&&(
          <div style={{textAlign:'center',marginBottom:12}}>
            <Waveform recording={phase==='active'}/>
            {phase==='active'&&<div style={{fontSize:12,fontWeight:700,color:'#ef4444',marginTop:8,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:'#ef4444',display:'inline-block',animation:'cefr-blink 1s infinite'}}/>
              Recording...
            </div>}
          </div>
        )}

        {/* done state */}
        {phase==='done'&&(
          <div style={{textAlign:'center',marginBottom:8}}>
            <CheckCircle size={36} color="#059669" style={{marginBottom:8}}/>
            <p style={{color:'#059669',fontWeight:700,fontSize:14}}>Response submitted</p>
          </div>
        )}

        {/* CTA buttons */}
        {phase==='intro'&&(
          isSelect
            ? <button onClick={()=>setPhase('active')} style={{width:'100%',padding:'14px',borderRadius:12,border:'none',background:BRAND,color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>Start ▶</button>
            : <button onClick={startPrep} style={{width:'100%',padding:'14px',borderRadius:12,border:'none',background:BRAND,color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>{q.prepSecs>0?'Prepare →':'Start ▶'}</button>
        )}

        {isText&&phase==='active'&&(
          <button onClick={()=>{setRecording(false);setPhase('done');}} style={{width:'100%',padding:'12px',borderRadius:12,border:'none',background:'#059669',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer',marginTop:12}}>Submit Response ✓</button>
        )}

        {isSelect&&phase==='active'&&(
          <button onClick={()=>setPhase('done')} style={{width:'100%',padding:'12px',borderRadius:12,border:'none',background:'#059669',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer',marginTop:8}}>Confirm Selection ✓</button>
        )}

        {phase==='done'&&(
          <button onClick={onNext} style={{width:'100%',padding:'14px',borderRadius:12,border:'none',background:qIdx<total-1?BRAND:'#059669',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {qIdx<total-1?<>Continue <ChevronRight size={18}/></>:'Finish Test ✓'}
          </button>
        )}
      </div>
    </div>
  );
}

function Results({ onRestart }) {
  const levels=['A1','A2','B1','B2','C1','C2'];
  const result='B2';
  const score=68;
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 56px)',padding:32,background:'#fff'}}>
      <div style={{maxWidth:440,width:'100%',textAlign:'center'}}>
        <div style={{width:120,height:120,borderRadius:'50%',background:`linear-gradient(135deg,${BRAND},#55A51C)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:`0 16px 40px ${BRAND}44`}}>
          <div style={{fontSize:36,fontWeight:900,color:'#fff'}}>{score}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>/160</div>
        </div>
        <div style={{fontSize:20,fontWeight:900,color:'#0f172a',marginBottom:4}}>{result} Level</div>
        <div style={{fontSize:13,color:'#64748b',marginBottom:28}}>Upper Intermediate — CEFR {result}</div>
        <div style={{display:'flex',gap:4,justifyContent:'center',marginBottom:28}}>
          {levels.map(l=>(
            <div key={l} style={{padding:'6px 14px',borderRadius:99,border:`2px solid ${l===result?BRAND:'#e2e8f0'}`,background:l===result?BRAND:'#fff',color:l===result?'#fff':'#94a3b8',fontWeight:800,fontSize:13}}>{l}</div>
          ))}
        </div>
        <p style={{color:'#94a3b8',fontSize:12,marginBottom:24}}>Results available within 48 hours · No test center required</p>
        <button onClick={onRestart} style={{padding:'13px 32px',borderRadius:12,border:`2px solid ${BRAND}`,background:'#fff',color:BRAND,fontWeight:800,fontSize:14,cursor:'pointer'}}>Retake Test</button>
      </div>
    </div>
  );
}

function Header({ qIdx, total, onExit, done }) {
  const pct=(qIdx/total)*100;
  return(
    <div style={{background:'#fff',borderBottom:'1px solid #e2e8f0',position:'sticky',top:0,zIndex:200}}>
      <div style={{padding:'0 24px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:BRAND,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🦉</div>
          <span style={{fontSize:14,fontWeight:900,color:DARK}}>Duolingo English Test</span>
        </div>
        {!done&&<span style={{fontSize:12,fontWeight:700,color:'#94a3b8'}}>{qIdx} of {total} completed</span>}
        <button onClick={onExit} style={{background:'none',border:'1.5px solid #e2e8f0',borderRadius:8,color:'#94a3b8',fontSize:12,padding:'5px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
          <X size={13}/> Exit
        </button>
      </div>
      {!done&&(
        <div style={{height:6,background:'#f1f5f9'}}>
          <div style={{width:`${pct}%`,height:'100%',background:BRAND,borderRadius:'0 99px 99px 0',transition:'width .4s ease'}}/>
        </div>
      )}
    </div>
  );
}

export default function CEFREngine({ onExit }) {
  const [qIdx,setQIdx]=useState(0);
  const [done,setDone]=useState(false);

  const next=()=>{ if(qIdx<QUESTIONS.length-1) setQIdx(i=>i+1); else setDone(true); };

  return(
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh',background:'#fff'}}>
      <Header qIdx={qIdx} total={QUESTIONS.length} onExit={onExit} done={done}/>
      <div style={{padding: SPEAKING_TYPES.has(QUESTIONS[qIdx]?.type) && !done ? '0' : '32px 20px', minHeight:'calc(100vh - 58px)',display:'flex',alignItems:'flex-start',justifyContent:'center'}}>
        {done
          ? <Results onRestart={()=>{setQIdx(0);setDone(false);}}/>
          : SPEAKING_TYPES.has(QUESTIONS[qIdx]?.type)
            ? <SpeakingTest onComplete={next} onExit={onExit}/>
            : <QuestionCard key={qIdx} q={QUESTIONS[qIdx]} onNext={next} qIdx={qIdx} total={QUESTIONS.length}/>
        }
      </div>
      <style>{`@keyframes cefr-blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

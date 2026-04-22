"use client";
import { useState, useRef, useCallback } from 'react';
import { X, Flag, CheckCircle, BookOpen, Calculator, FileText, Eye, EyeOff } from 'lucide-react';
import { SAT_QUESTIONS, READING_PASSAGE } from './ExamData';

const BRAND = '#003087';
const ACCENT = '#005FAD';

function useTimer(s){ const [v,setV]=useState(s); const [show,setShow]=useState(true);
  useState(()=>{ const t=setInterval(()=>setV(x=>x>0?x-1:0),1000); return()=>clearInterval(t); });
  const fmt=`${String(Math.floor(v/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`;
  const warn=v<300;
  return{fmt,show,toggle:()=>setShow(x=>!x),warn,v};
}

/* draggable divider */
function useDivider(init=50){
  const [pct,setPct]=useState(init);
  const dragging=useRef(false);
  const start=useCallback(()=>{ dragging.current=true; }, []);
  const move=useCallback((e)=>{ if(!dragging.current) return; const p=Math.max(25,Math.min(75,e.clientX/window.innerWidth*100)); setPct(p); },[]);
  const end=useCallback(()=>{ dragging.current=false; },[]);
  return{pct,start,move,end};
}

/* Reference sheet modal */
function RefSheet({ onClose }){
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#fff',borderRadius:16,padding:28,maxWidth:500,width:'90%',maxHeight:'80vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h3 style={{fontSize:16,fontWeight:900,color:'#0f172a'}}>SAT Math Reference Sheet</h3>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer'}}><X size={18}/></button>
        </div>
        {[
          {name:'Circle Area',f:'A = πr²'},{name:'Circle Circumference',f:'C = 2πr'},
          {name:'Rectangle Area',f:'A = lw'},{name:'Triangle Area',f:'A = ½bh'},
          {name:'Pythagorean Theorem',f:'a² + b² = c²'},{name:'Quadratic Formula',f:'x = (-b ± √(b²-4ac)) / 2a'},
          {name:'Slope',f:'m = (y₂-y₁)/(x₂-x₁)'},{name:'Distance',f:'d = √((x₂-x₁)² + (y₂-y₁)²)'},
        ].map(r=>(
          <div key={r.name} style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',borderRadius:10,background:'#f8fafc',marginBottom:6,border:'1px solid #f1f5f9'}}>
            <span style={{fontSize:13,color:'#475569',fontWeight:600}}>{r.name}</span>
            <span style={{fontSize:14,fontWeight:800,color:BRAND,fontFamily:'monospace'}}>{r.f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Desmos-like calculator modal */
function CalcModal({ onClose }){
  const [display,setDisplay]=useState('0');
  const [prev,setPrev]=useState(null);
  const [op,setOp]=useState(null);
  const press=(v)=>{
    if(v==='C'){setDisplay('0');setPrev(null);setOp(null);return;}
    if(v==='='){
      if(op&&prev!==null){
        const a=parseFloat(prev),b=parseFloat(display);
        const r=op==='+'?a+b:op==='-'?a-b:op==='×'?a*b:op==='÷'?a/b:0;
        setDisplay(String(parseFloat(r.toFixed(8))));setPrev(null);setOp(null);
      }
      return;
    }
    if(['+','-','×','÷'].includes(v)){setPrev(display);setOp(v);setDisplay('0');return;}
    setDisplay(d=>d==='0'?v:d.length>10?d:d+v);
  };
  const btns=['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','=','+','C'];
  return(
    <div style={{position:'fixed',top:80,right:24,width:220,background:'#1a1a1a',borderRadius:16,boxShadow:'0 24px 60px rgba(0,0,0,0.4)',zIndex:999,overflow:'hidden',border:'1px solid #333'}}>
      <div style={{padding:'8px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #333'}}>
        <span style={{fontSize:12,fontWeight:700,color:'#888'}}>Calculator</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#666',cursor:'pointer'}}><X size={14}/></button>
      </div>
      <div style={{padding:'12px',textAlign:'right'}}>
        <div style={{fontSize:28,fontWeight:800,color:'#fff',fontVariantNumeric:'tabular-nums',marginBottom:8,minHeight:40,overflow:'hidden'}}>{display}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
          {btns.map(b=>(
            <button key={b} onClick={()=>press(b)} style={{padding:'12px',borderRadius:8,border:'none',background:b==='='?ACCENT:['+','-','×','÷'].includes(b)?'#333':'#252525',color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer',transition:'opacity .15s',gridColumn:b==='C'?'span 2':undefined}}>
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Reading & Writing Module ─── */
function RWModule({ onComplete }) {
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [flagged,setFlagged]=useState(new Set());
  const [eliminated,setEliminated]=useState({});
  const [annot,setAnnot]=useState([]);
  const div=useDivider(52);
  const timer=useTimer(32*60);
  const q=SAT_QUESTIONS.find((_,i)=>i===qIdx)||SAT_QUESTIONS[0];

  const toggleFlag=()=>setFlagged(p=>{const s=new Set(p);s.has(qIdx)?s.delete(qIdx):s.add(qIdx);return s;});
  const toggleElim=(letter)=>setEliminated(e=>({...e,[qIdx]:{...(e[qIdx]||{}),[letter]:!(e[qIdx]||{})[letter]}}));

  const handleMouseUp=()=>{
    const sel=window.getSelection();
    if(!sel||sel.isCollapsed) return;
    const t=sel.toString().trim();
    if(t) setAnnot(a=>[...a,t]);
    sel.removeAllRanges();
  };

  const passageHtml=()=>{
    let html=q.passage||READING_PASSAGE.text.split('\n\n')[0];
    annot.forEach(a=>{html=html.replaceAll(a,`<mark style="background:#FFD700;padding:1px 2px">${a}</mark>`);});
    return html;
  };

  return(
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 56px)'}} onMouseMove={div.move} onMouseUp={div.end}>
      {/* toolbar */}
      <div style={{background:'#f1f5f9',borderBottom:'1px solid #e2e8f0',padding:'4px 16px',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        {timer.show&&<span style={{fontSize:13,fontWeight:800,color:timer.warn?'#ef4444':BRAND,fontVariantNumeric:'tabular-nums',background:timer.warn?'#FEF2F2':'#EFF6FF',padding:'3px 10px',borderRadius:6}}>{timer.fmt}</span>}
        <button onClick={timer.toggle} style={{background:'none',border:'1px solid #e2e8f0',borderRadius:6,color:'#64748b',fontSize:10,padding:'3px 8px',cursor:'pointer',display:'flex',alignItems:'center',gap:3}}>
          {timer.show?<EyeOff size={10}/>:<Eye size={10}/>}{timer.show?'Hide':'Show'}
        </button>
        <div style={{flex:1}}/>
        <span style={{fontSize:11,fontWeight:700,color:'#64748b'}}>Question {qIdx+1} of {SAT_QUESTIONS.length}</span>
        <button onClick={toggleFlag} style={{padding:'4px 10px',borderRadius:6,border:`1.5px solid ${flagged.has(qIdx)?'#f59e0b':'#e2e8f0'}`,background:flagged.has(qIdx)?'#fffbeb':'#fff',color:flagged.has(qIdx)?'#f59e0b':'#64748b',fontSize:10,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
          <Flag size={10}/>{flagged.has(qIdx)?'Flagged':'Flag'}
        </button>
      </div>

      {/* split panes */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {/* LEFT — passage */}
        <div onMouseUp={handleMouseUp} style={{width:`${div.pct}%`,overflowY:'auto',padding:'24px 28px',background:'#fff',flexShrink:0}}>
          <p style={{fontSize:13,lineHeight:1.85,color:'#1e293b'}} dangerouslySetInnerHTML={{__html:passageHtml()}}/>
        </div>

        {/* DIVIDER — draggable */}
        <div onMouseDown={div.start} style={{width:6,background:'#f1f5f9',cursor:'col-resize',borderLeft:'1px solid #e2e8f0',borderRight:'1px solid #e2e8f0',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:2,height:40,background:'#cbd5e1',borderRadius:99}}/>
        </div>

        {/* RIGHT — question */}
        <div style={{flex:1,overflowY:'auto',padding:'24px 28px',background:'#fafbfc'}}>
          <p style={{fontSize:14,color:'#1e293b',lineHeight:1.7,marginBottom:24,fontWeight:500}}>{q.question}</p>

          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {q.options.map((opt,i)=>{
              const letter=['A','B','C','D'][i];
              const sel=answers[qIdx]===letter;
              const elim=(eliminated[qIdx]||{})[letter];
              return(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8}}>
                  <button onClick={()=>setAnswers(a=>({...a,[qIdx]:letter}))} style={{flex:1,display:'flex',alignItems:'flex-start',gap:12,padding:'12px 16px',borderRadius:10,border:`2px solid ${sel?BRAND:'#e2e8f0'}`,background:sel?'#EFF6FF':'#fff',cursor:'pointer',textAlign:'left',transition:'all .15s',opacity:elim?0.35:1}}>
                    <span style={{width:24,height:24,borderRadius:'50%',border:`2px solid ${sel?BRAND:'#cbd5e1'}`,background:sel?BRAND:'transparent',color:sel?'#fff':'#94a3b8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,flexShrink:0}}>{letter}</span>
                    <span style={{fontSize:13,color:'#1e293b',lineHeight:1.6,textDecoration:elim?'line-through':undefined,color:elim?'#94a3b8':'#1e293b'}}>{opt}</span>
                  </button>
                  {/* eliminator button */}
                  <button onClick={()=>toggleElim(letter)} title="Eliminate" style={{width:28,height:28,borderRadius:8,border:'1.5px solid #e2e8f0',background:elim?'#fee2e2':'#fff',color:elim?'#ef4444':'#94a3b8',fontSize:11,fontWeight:800,cursor:'pointer',flexShrink:0,marginTop:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {elim?'↩':'✕'}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{display:'flex',justifyContent:'space-between',marginTop:32}}>
            <button onClick={()=>setQIdx(i=>Math.max(0,i-1))} disabled={qIdx===0} style={{padding:'10px 20px',borderRadius:10,border:'1.5px solid #e2e8f0',background:'#fff',color:qIdx===0?'#cbd5e1':'#475569',fontWeight:700,fontSize:13,cursor:qIdx===0?'not-allowed':'pointer'}}>← Back</button>
            {qIdx<SAT_QUESTIONS.length-1
              ?<button onClick={()=>setQIdx(i=>i+1)} style={{padding:'10px 20px',borderRadius:10,border:'none',background:BRAND,color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>Next →</button>
              :<button onClick={onComplete} style={{padding:'10px 24px',borderRadius:10,border:'none',background:'#059669',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>Submit Module ✓</button>
            }
          </div>
        </div>
      </div>

      {/* BOTTOM NAV BAR */}
      <div style={{background:'#1a1a1a',padding:'8px 16px',display:'flex',alignItems:'center',gap:6,overflowX:'auto',flexShrink:0}}>
        <span style={{fontSize:10,fontWeight:700,color:'#555',flexShrink:0,marginRight:4}}>Q:</span>
        {SAT_QUESTIONS.map((_,i)=>{
          const answered=answers[i];
          const fl=flagged.has(i);
          const cur=qIdx===i;
          return(
            <button key={i} onClick={()=>setQIdx(i)} style={{width:30,height:30,borderRadius:5,border:cur?`2px solid ${ACCENT}`:'none',background:cur?ACCENT:answered?'#374151':'#2d2d2d',color:answered||cur?'#fff':'#555',fontSize:11,fontWeight:700,cursor:'pointer',position:'relative',flexShrink:0}}>
              {i+1}{fl&&<span style={{position:'absolute',top:-4,right:-4,fontSize:9}}>🚩</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Math Module ─── */
function MathModule({ onComplete }) {
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [showCalc,setShowCalc]=useState(false);
  const [showRef,setShowRef]=useState(false);
  const [eliminated,setEliminated]=useState({});
  const div=useDivider(52);
  const timer=useTimer(35*60);
  const q=SAT_QUESTIONS.find((_,i)=>i===qIdx)||SAT_QUESTIONS[0];
  const toggleElim=(letter)=>setEliminated(e=>({...e,[qIdx]:{...(e[qIdx]||{}),[letter]:!(e[qIdx]||{})[letter]}}));

  return(
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 56px)'}} onMouseMove={div.move} onMouseUp={div.end}>
      <div style={{background:'#f1f5f9',borderBottom:'1px solid #e2e8f0',padding:'4px 16px',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        {timer.show&&<span style={{fontSize:13,fontWeight:800,color:timer.warn?'#ef4444':BRAND,fontVariantNumeric:'tabular-nums',background:timer.warn?'#FEF2F2':'#EFF6FF',padding:'3px 10px',borderRadius:6}}>{timer.fmt}</span>}
        <button onClick={timer.toggle} style={{background:'none',border:'1px solid #e2e8f0',borderRadius:6,color:'#64748b',fontSize:10,padding:'3px 8px',cursor:'pointer'}}>
          {timer.show?'Hide':'Show'} Time
        </button>
        <div style={{flex:1}}/>
        <button onClick={()=>setShowRef(true)} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:8,border:'1.5px solid #e2e8f0',background:'#fff',fontSize:11,fontWeight:700,color:'#475569',cursor:'pointer'}}>
          <FileText size={13}/> Reference
        </button>
        <button onClick={()=>setShowCalc(p=>!p)} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 12px',borderRadius:8,border:`1.5px solid ${showCalc?BRAND:'#e2e8f0'}`,background:showCalc?'#EFF6FF':'#fff',fontSize:11,fontWeight:700,color:showCalc?BRAND:'#475569',cursor:'pointer'}}>
          <Calculator size={13}/> Calculator
        </button>
        <span style={{fontSize:11,fontWeight:700,color:'#64748b'}}>Math — Q{qIdx+1}/{SAT_QUESTIONS.length}</span>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'32px',background:'#fff',display:'flex',flexDirection:'column',gap:24,maxWidth:700,margin:'0 auto',width:'100%'}}>
        <div style={{background:'#f8fafc',border:`2px solid ${BRAND}`,borderRadius:14,padding:'20px 24px',fontSize:14,color:'#1e293b',lineHeight:1.75,fontWeight:500}}>
          {q.question}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {q.options.map((opt,i)=>{
            const letter=['A','B','C','D'][i];
            const sel=answers[qIdx]===letter;
            const elim=(eliminated[qIdx]||{})[letter];
            return(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                <button onClick={()=>setAnswers(a=>({...a,[qIdx]:letter}))} style={{flex:1,display:'flex',alignItems:'center',gap:12,padding:'13px 18px',borderRadius:12,border:`2px solid ${sel?BRAND:'#e2e8f0'}`,background:sel?'#EFF6FF':'#fff',cursor:'pointer',textAlign:'left',transition:'all .15s',opacity:elim?0.35:1}}>
                  <span style={{width:28,height:28,borderRadius:'50%',border:`2px solid ${sel?BRAND:'#cbd5e1'}`,background:sel?BRAND:'transparent',color:sel?'#fff':'#94a3b8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,flexShrink:0}}>{letter}</span>
                  <span style={{fontSize:14,color:elim?'#94a3b8':'#1e293b',textDecoration:elim?'line-through':undefined}}>{opt}</span>
                </button>
                <button onClick={()=>toggleElim(letter)} style={{width:30,height:30,borderRadius:8,border:'1.5px solid #e2e8f0',background:elim?'#fee2e2':'#fff',color:elim?'#ef4444':'#94a3b8',fontWeight:800,fontSize:12,cursor:'pointer',flexShrink:0}}>
                  {elim?'↩':'✕'}
                </button>
              </div>
            );
          })}
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <button onClick={()=>setQIdx(i=>Math.max(0,i-1))} disabled={qIdx===0} style={{padding:'11px 22px',borderRadius:10,border:'1.5px solid #e2e8f0',background:'#fff',color:qIdx===0?'#cbd5e1':'#475569',fontWeight:700,fontSize:13,cursor:qIdx===0?'not-allowed':'pointer'}}>← Back</button>
          {qIdx<SAT_QUESTIONS.length-1
            ?<button onClick={()=>setQIdx(i=>i+1)} style={{padding:'11px 22px',borderRadius:10,border:'none',background:BRAND,color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>Next →</button>
            :<button onClick={onComplete} style={{padding:'11px 24px',borderRadius:10,border:'none',background:'#059669',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>Submit ✓</button>}
        </div>
      </div>

      {/* bottom nav */}
      <div style={{background:'#1a1a1a',padding:'8px 16px',display:'flex',gap:5,overflowX:'auto',flexShrink:0}}>
        {SAT_QUESTIONS.map((_,i)=><button key={i} onClick={()=>setQIdx(i)} style={{width:30,height:30,borderRadius:5,border:qIdx===i?`2px solid ${ACCENT}`:'none',background:qIdx===i?ACCENT:answers[i]?'#374151':'#2d2d2d',color:answers[i]||qIdx===i?'#fff':'#555',fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}}>{i+1}</button>)}
      </div>

      {showCalc&&<CalcModal onClose={()=>setShowCalc(false)}/>}
      {showRef&&<RefSheet onClose={()=>setShowRef(false)}/>}
    </div>
  );
}

function Results({ onRestart }) {
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 56px)',padding:32}}>
      <div style={{maxWidth:440,width:'100%',textAlign:'center'}}>
        <div style={{width:120,height:120,borderRadius:'50%',background:`linear-gradient(135deg,${BRAND},${ACCENT})`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 16px 40px rgba(0,48,135,0.3)'}}>
          <div style={{fontSize:40,fontWeight:900,color:'#fff'}}>1420</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>/ 1600</div>
        </div>
        <h2 style={{fontSize:22,fontWeight:900,marginBottom:8}}>SAT Complete</h2>
        <p style={{color:'#64748b',marginBottom:28}}>Scores reported within 2 weeks.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:28}}>
          {[['Reading & Writing','720 / 800'],['Math','700 / 800']].map(([k,v])=>(
            <div key={k} style={{background:'#f8fafc',borderRadius:14,padding:'18px',border:'1.5px solid #f1f5f9'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:6}}>{k}</div>
              <div style={{fontSize:26,fontWeight:900,color:BRAND}}>{v}</div>
            </div>
          ))}
        </div>
        <button onClick={onRestart} style={{padding:'13px 32px',borderRadius:12,border:`2px solid ${BRAND}`,background:'#fff',color:BRAND,fontWeight:800,fontSize:14,cursor:'pointer'}}>Retake SAT</button>
      </div>
    </div>
  );
}

function Header({ module, onExit, done }) {
  return(
    <div style={{background:BRAND,padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200}}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <span style={{fontSize:15,fontWeight:900,color:'#fff',letterSpacing:'-0.5px'}}>SAT</span>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>|</span>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.6)',fontWeight:600}}>College Board · Bluebook</span>
      </div>
      {!done&&<span style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.8)',background:'rgba(255,255,255,0.12)',padding:'4px 14px',borderRadius:20}}>{module==='rw'?'Reading & Writing':'Math'} Module</span>}
      <button onClick={onExit} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,color:'rgba(255,255,255,0.7)',fontSize:12,padding:'5px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
        <X size={13}/> Exit
      </button>
    </div>
  );
}

export default function SATEngine({ onExit }) {
  const [module,setModule]=useState('rw'); // rw | math | done
  return(
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh',background:'#fff'}}>
      <Header module={module} onExit={onExit} done={module==='done'}/>
      {module==='rw'&&<RWModule onComplete={()=>setModule('math')}/>}
      {module==='math'&&<MathModule onComplete={()=>setModule('done')}/>}
      {module==='done'&&<Results onRestart={()=>setModule('rw')}/>}
    </div>
  );
}

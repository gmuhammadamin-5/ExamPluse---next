"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import SpeakingTest from '../SpeakingTest';
import {
  ChevronLeft, ChevronRight, Clock, X, Eye, EyeOff,
  BookOpen, Headphones, PenTool, MessageSquare,
  Volume2, VolumeX, FileText, AlertCircle, CheckSquare,
  HelpCircle, Maximize2
} from 'lucide-react';
import { READING_PASSAGE, TOEFL_QUESTIONS, WRITING_TASKS, SPEAKING_PARTS } from './ExamData';

const BRAND   = '#1a56db';
const DARK    = '#0f172a';
const SUCCESS = '#059669';

const SECTIONS = [
  { id:'reading',   label:'Reading',   icon:BookOpen,     time:54*60, desc:'Read 3 passages and answer questions about them.' },
  { id:'listening', label:'Listening', icon:Headphones,   time:41*60, desc:'Listen to lectures and conversations, then answer questions.' },
  { id:'speaking',  label:'Speaking',  icon:MessageSquare,time:17*60, desc:'Express your opinions on familiar topics.' },
  { id:'writing',   label:'Writing',   icon:PenTool,      time:29*60, desc:'Write responses based on reading and listening materials.' },
];

/* ─── Timer hook ─── */
function useTimer(totalSecs) {
  const [secs, setSecs]   = useState(totalSecs);
  const [visible, setVis] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, paused]);
  const fmt = `${String(Math.floor(secs / 60)).padStart(2,'0')}:${String(secs % 60).padStart(2,'0')}`;
  return { secs, fmt, visible, toggle: () => setVis(v => !v), pause: () => setPaused(true), resume: () => setPaused(false) };
}

/* ─── Top Navbar ─── */
function TopNav({ sectionIdx, onExit, done, timer, extraLeft, extraRight }) {
  const sec = SECTIONS[sectionIdx];
  const urgent = timer && timer.secs < 300;
  return (
    <div style={{
      position:'sticky', top:0, zIndex:500,
      background:'#fff', borderBottom:'1px solid #e2e8f0',
      height:52, display:'flex', alignItems:'center',
      padding:'0 20px', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,0.06)'
    }}>
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginRight:8 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:BRAND, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:11, fontWeight:900, color:'#fff' }}>TG</span>
        </div>
        <span style={{ fontSize:13, fontWeight:800, color:DARK }}>TestGlider <span style={{ color:'#94a3b8', fontWeight:400 }}>TOEFL iBT</span></span>
      </div>

      <div style={{ width:1, height:24, background:'#e2e8f0' }}/>

      {/* Section tabs */}
      {!done && (
        <div style={{ display:'flex', gap:0, flex:1, justifyContent:'center' }}>
          {SECTIONS.map((s, i) => {
            const done2 = i < sectionIdx;
            const active = i === sectionIdx;
            return (
              <div key={s.id} style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'0 14px', height:52, cursor:'default',
                borderBottom:`3px solid ${active ? BRAND : 'transparent'}`,
                marginBottom:-1
              }}>
                {done2
                  ? <CheckSquare size={13} color={SUCCESS}/>
                  : <s.icon size={13} color={active ? BRAND : '#cbd5e1'}/>
                }
                <span style={{ fontSize:12, fontWeight:active?700:500, color:active?BRAND:done2?SUCCESS:'#94a3b8' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Timer + Exit */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto' }}>
        {timer && (
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Clock size={13} color={urgent ? '#ef4444' : '#94a3b8'}/>
            {timer.visible
              ? <span style={{ fontSize:13, fontWeight:700, color:urgent?'#ef4444':DARK, fontVariantNumeric:'tabular-nums', minWidth:42 }}>{timer.fmt}</span>
              : <span style={{ fontSize:12, color:'#94a3b8' }}>Hidden</span>
            }
            <button onClick={timer.toggle} style={{ border:'none', background:'none', padding:0, cursor:'pointer', color:'#94a3b8', display:'flex' }}>
              {timer.visible ? <EyeOff size={13}/> : <Eye size={13}/>}
            </button>
          </div>
        )}
        {extraLeft}
        <button onClick={onExit} style={{
          display:'flex', alignItems:'center', gap:5,
          padding:'5px 12px', borderRadius:7, border:'1.5px solid #e2e8f0',
          background:'#fff', color:'#64748b', fontWeight:600, fontSize:12, cursor:'pointer'
        }}>
          <X size={12}/> Exit
        </button>
      </div>
    </div>
  );
}

/* ─── Section Intro Screen ─── */
function SectionIntro({ section, onStart }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 52px)', background:'#f8fafc', padding:32 }}>
      <div style={{ maxWidth:520, width:'100%', textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:20, background:`${BRAND}15`, border:`2px solid ${BRAND}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <section.icon size={28} color={BRAND}/>
        </div>
        <h2 style={{ fontSize:22, fontWeight:900, color:DARK, marginBottom:8 }}>
          {section.label} Section
        </h2>
        <p style={{ fontSize:14, color:'#475569', lineHeight:1.7, marginBottom:8 }}>{section.desc}</p>
        <p style={{ fontSize:13, color:'#94a3b8', marginBottom:32 }}>
          Time allowed: <strong style={{ color:DARK }}>{Math.floor(section.time / 60)} minutes</strong>
        </p>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'20px 24px', marginBottom:28, textAlign:'left' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>Directions</div>
          {section.id === 'reading'   && <p style={{ fontSize:13, color:'#475569', lineHeight:1.7 }}>Read the passage. Then answer the questions. Click <strong>Next</strong> to move forward and <strong>Back</strong> to revisit. You may review your answers before submitting.</p>}
          {section.id === 'listening' && <p style={{ fontSize:13, color:'#475569', lineHeight:1.7 }}>You will hear recordings. Headphones are required. Listen carefully — you may take notes. After each recording you will answer questions.</p>}
          {section.id === 'speaking'  && <p style={{ fontSize:13, color:'#475569', lineHeight:1.7 }}>You will record spoken responses. Use your preparation time wisely. Speak clearly into your microphone.</p>}
          {section.id === 'writing'   && <p style={{ fontSize:13, color:'#475569', lineHeight:1.7 }}>Write responses based on reading and listening materials. Type into the text box. You may cut, copy, and paste text.</p>}
        </div>
        <button onClick={onStart} style={{ padding:'14px 48px', borderRadius:10, border:'none', background:BRAND, color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:`0 4px 16px ${BRAND}40` }}>
          Start {section.label} →
        </button>
      </div>
    </div>
  );
}

/* ─── Notepad Panel ─── */
function Notepad({ visible, onClose }) {
  const [notes, setNotes] = useState('');
  if (!visible) return null;
  return (
    <div style={{ position:'fixed', bottom:20, right:20, width:300, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:600, overflow:'hidden' }}>
      <div style={{ padding:'10px 14px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:12, fontWeight:700, color:DARK }}>Scratch Paper</span>
        <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><X size={14}/></button>
      </div>
      <textarea value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="Use this area to take notes..."
        style={{ width:'100%', height:180, padding:'12px 14px', border:'none', outline:'none', resize:'none', fontSize:12, lineHeight:1.7, color:DARK, fontFamily:'inherit', boxSizing:'border-box' }}
      />
    </div>
  );
}

/* ─── Review Screen ─── */
function ReviewScreen({ answers, total, onGo, onSubmit }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 52px)', background:'#f8fafc', padding:32 }}>
      <div style={{ maxWidth:480, width:'100%' }}>
        <h2 style={{ fontSize:18, fontWeight:900, color:DARK, marginBottom:4 }}>Review Your Answers</h2>
        <p style={{ fontSize:13, color:'#64748b', marginBottom:24 }}>Click a number to return to that question.</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:28 }}>
          {Array.from({ length:total }, (_, i) => {
            const answered = answers[i + 1] !== undefined;
            return (
              <button key={i} onClick={() => onGo(i)} style={{
                width:40, height:40, borderRadius:8,
                border:`2px solid ${answered ? BRAND : '#e2e8f0'}`,
                background:answered ? BRAND : '#fff',
                color:answered ? '#fff' : '#94a3b8',
                fontWeight:700, fontSize:13, cursor:'pointer'
              }}>{i + 1}</button>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:16, fontSize:12, color:'#64748b', marginBottom:28 }}>
          <span><span style={{ display:'inline-block', width:14, height:14, borderRadius:3, background:BRAND, verticalAlign:'middle', marginRight:6 }}/>Answered: {Object.keys(answers).length}</span>
          <span><span style={{ display:'inline-block', width:14, height:14, borderRadius:3, border:'2px solid #e2e8f0', verticalAlign:'middle', marginRight:6 }}/>Unanswered: {total - Object.keys(answers).length}</span>
        </div>
        <button onClick={onSubmit} style={{ width:'100%', padding:'14px', borderRadius:10, border:'none', background:SUCCESS, color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer' }}>
          Submit Section ✓
        </button>
      </div>
    </div>
  );
}

/* ─── Glossary data ─── */
const GLOSSARY = {
  traction:'gaining acceptance or popularity',
  'per-capita':'calculated per person in population',
  autonomy:'self-governance or independence',
  retrofit:'add new technology to existing systems',
  congestion:'excessive crowding, especially traffic',
  infrastructure:'basic physical systems of a city',
  emissions:'gases released into the atmosphere',
  subsidize:'support financially with public funds',
};

/* ─── Reading Section ─── */
function ReadingSection({ onComplete }) {
  const [qIdx,    setQIdx]    = useState(0);
  const [answers, setAnswers] = useState({});
  const [review,  setReview]  = useState(false);
  const [notepad, setNotepad] = useState(false);
  const [popup,   setPopup]   = useState(null);
  const timer = useTimer(54 * 60);
  const q = TOEFL_QUESTIONS[qIdx];

  const go = (i) => { setQIdx(i); setReview(false); };

  if (review) return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', top:0, right:20, paddingTop:16 }}>
        <button onClick={() => setNotepad(v => !v)} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:7, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' }}>
          <FileText size={13}/> Notes
        </button>
      </div>
      <ReviewScreen answers={answers} total={TOEFL_QUESTIONS.length} onGo={go} onSubmit={onComplete}/>
      <Notepad visible={notepad} onClose={() => setNotepad(false)}/>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 52px)', position:'relative' }}>
      {/* Sub-header */}
      <div style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0', padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ fontSize:12, fontWeight:600, color:'#64748b' }}>
          <strong style={{ color:DARK }}>Reading</strong> · Question {qIdx + 1} of {TOEFL_QUESTIONS.length}
        </span>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setNotepad(v => !v)} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:6, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:11, fontWeight:600, color:'#64748b', cursor:'pointer' }}>
            <FileText size={12}/> Notes
          </button>
          <button onClick={() => setReview(true)} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:6, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:11, fontWeight:600, color:'#64748b', cursor:'pointer' }}>
            <CheckSquare size={12}/> Review
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', flex:1, overflow:'hidden' }}>
        {/* LEFT — Questions */}
        <div style={{ overflowY:'auto', padding:'24px 28px', background:'#fff', borderRight:'2px solid #f1f5f9' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16 }}>
            Question {qIdx + 1} of {TOEFL_QUESTIONS.length}
          </div>
          <p style={{ fontSize:14, color:DARK, lineHeight:1.85, marginBottom:24, fontWeight:500 }}>{q.text}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {q.options.map((opt, i) => {
              const letter = ['A','B','C','D'][i];
              const sel = answers[qIdx + 1] === letter;
              return (
                <button key={i} onClick={() => setAnswers(a => ({ ...a, [qIdx + 1]: letter }))} style={{
                  display:'flex', alignItems:'flex-start', gap:12, padding:'13px 16px',
                  borderRadius:10, border:`2px solid ${sel ? BRAND : '#e2e8f0'}`,
                  background:sel ? `${BRAND}0d` : '#fff', cursor:'pointer', textAlign:'left', transition:'all .15s'
                }}>
                  <span style={{
                    width:26, height:26, borderRadius:'50%',
                    border:`2px solid ${sel ? BRAND : '#cbd5e1'}`,
                    background:sel ? BRAND : '#fff',
                    color:sel ? '#fff' : '#94a3b8',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:11, fontWeight:800, flexShrink:0
                  }}>{letter}</span>
                  <span style={{ fontSize:13, color:DARK, lineHeight:1.65 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32, paddingTop:20, borderTop:'1px solid #f1f5f9' }}>
            <button onClick={() => setQIdx(i => Math.max(0, i - 1))} disabled={qIdx === 0}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:9, border:'1.5px solid #e2e8f0', background:'#fff', color:qIdx===0?'#cbd5e1':DARK, fontWeight:700, fontSize:13, cursor:qIdx===0?'not-allowed':'pointer' }}>
              <ChevronLeft size={16}/> Back
            </button>

            {/* Q number dots */}
            <div style={{ display:'flex', gap:4 }}>
              {TOEFL_QUESTIONS.map((_, i) => (
                <button key={i} onClick={() => setQIdx(i)} style={{
                  width:8, height:8, borderRadius:'50%', border:'none', cursor:'pointer',
                  background:i === qIdx ? BRAND : answers[i+1] !== undefined ? `${BRAND}60` : '#e2e8f0',
                  padding:0, transition:'all .15s'
                }}/>
              ))}
            </div>

            {qIdx < TOEFL_QUESTIONS.length - 1
              ? <button onClick={() => setQIdx(i => i + 1)} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:9, border:'none', background:BRAND, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  Next <ChevronRight size={16}/>
                </button>
              : <button onClick={() => setReview(true)} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:SUCCESS, color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer' }}>
                  Review →
                </button>
            }
          </div>
        </div>

        {/* RIGHT — Passage */}
        <div style={{ overflowY:'auto', padding:'24px 28px', background:'#fafbfc', position:'relative' }}
          onClick={e => {
            const word = e.target.closest('[data-word]')?.dataset.word;
            if (word && GLOSSARY[word]) setPopup({ word, def:GLOSSARY[word], x:e.clientX, y:e.clientY });
          }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:6 }}>Passage</div>
          <h3 style={{ fontSize:16, fontWeight:900, color:DARK, marginBottom:4 }}>{READING_PASSAGE.title}</h3>
          <p style={{ fontSize:11, color:'#94a3b8', marginBottom:20, fontStyle:'italic' }}>{READING_PASSAGE.source}</p>
          <div style={{ fontSize:14, color:'#1e293b', lineHeight:1.95, fontFamily:"'Georgia',serif" }}>
            {READING_PASSAGE.text.split('\n\n').map((para, pi) => (
              <p key={pi} style={{ marginBottom:18 }}>
                {para.split(/\s+/).map((w, wi) => {
                  const clean = w.replace(/[.,;:!?]/g,'').toLowerCase();
                  return GLOSSARY[clean]
                    ? <span key={wi} data-word={clean} style={{ textDecoration:'underline', textDecorationColor:`${BRAND}80`, textDecorationStyle:'dotted', cursor:'help', color:BRAND }}>{w} </span>
                    : w + ' ';
                })}
              </p>
            ))}
          </div>
          <p style={{ fontSize:11, color:'#94a3b8', marginTop:8, fontStyle:'italic' }}>
            Underlined words have glossary definitions. Click to view.
          </p>
        </div>
      </div>

      {/* Glossary popup */}
      {popup && (
        <div onClick={() => setPopup(null)} style={{ position:'fixed', top:popup.y + 10, left:Math.min(popup.x, window.innerWidth - 260), background:DARK, color:'#fff', borderRadius:10, padding:'12px 16px', maxWidth:240, zIndex:800, boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize:12, fontWeight:800, color:`${BRAND}cc`, marginBottom:4 }}>{popup.word}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', lineHeight:1.5 }}>{popup.def}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:6 }}>Click to dismiss</div>
        </div>
      )}

      <Notepad visible={notepad} onClose={() => setNotepad(false)}/>
    </div>
  );
}

/* ─── Listening Section ─── */
function ListeningSection({ onComplete }) {
  const [phase,   setPhase]   = useState('intro');   // intro | playing | transition | answering | review
  const [progress,setProgress]= useState(0);
  const [answers, setAnswers] = useState({});
  const [qIdx,    setQIdx]    = useState(0);
  const [volume,  setVolume]  = useState(80);
  const [muted,   setMuted]   = useState(false);
  const [notepad, setNotepad] = useState(false);
  const timer = useTimer(41 * 60);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (progress >= 100) { setPhase('transition'); return; }
    const t = setInterval(() => setProgress(p => Math.min(100, p + 0.35)), 300);
    return () => clearInterval(t);
  }, [phase, progress]);

  useEffect(() => {
    if (phase !== 'transition') return;
    const t = setTimeout(() => setPhase('answering'), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  const Qs = TOEFL_QUESTIONS.slice(0, 4);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 52px)' }}>
      {/* Sub-header */}
      <div style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0', padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ fontSize:12, fontWeight:600, color:'#64748b' }}><strong style={{ color:DARK }}>Listening</strong> · Lecture 1 of 2</span>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {phase === 'answering' && (
            <>
              <button onClick={() => setNotepad(v => !v)} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:6, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:11, fontWeight:600, color:'#64748b', cursor:'pointer' }}>
                <FileText size={12}/> Notes
              </button>
              <span style={{ fontSize:12, fontWeight:600, color:'#64748b' }}>
                Q {qIdx + 1} of {Qs.length}
              </span>
            </>
          )}
          {phase === 'playing' && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => setMuted(m => !m)} style={{ border:'none', background:'none', cursor:'pointer', color:'#64748b', display:'flex' }}>
                {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
              </button>
              <input type="range" min={0} max={100} value={muted?0:volume} onChange={e => setVolume(+e.target.value)}
                style={{ width:80, accentColor:BRAND }}/>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', background:'#fff' }}>
        {/* Intro */}
        {phase === 'intro' && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100%', padding:32 }}>
            <div style={{ maxWidth:500, textAlign:'center' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:`${BRAND}15`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <Headphones size={32} color={BRAND}/>
              </div>
              <h3 style={{ fontSize:18, fontWeight:800, color:DARK, marginBottom:8 }}>Listening: Lecture</h3>
              <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, marginBottom:8 }}>You will hear an academic lecture. Take notes while listening. You <strong>cannot</strong> replay the audio.</p>
              <p style={{ fontSize:12, color:'#94a3b8', marginBottom:28 }}>Make sure your headphones or speakers are working before you begin.</p>
              <button onClick={() => setPhase('playing')} style={{ padding:'13px 40px', borderRadius:10, border:'none', background:BRAND, color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer' }}>
                Play Audio →
              </button>
            </div>
          </div>
        )}

        {/* Playing */}
        {phase === 'playing' && (
          <div style={{ maxWidth:620, margin:'40px auto', padding:'0 24px' }}>
            <div style={{ borderRadius:20, background:DARK, overflow:'hidden', marginBottom:24 }}>
              <div style={{ padding:'32px', textAlign:'center' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:`${BRAND}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <Headphones size={28} color={BRAND}/>
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:4 }}>Urban Transportation Trends</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Professor A. Martinez · Environmental Studies</div>
              </div>

              {/* Waveform bars */}
              <div style={{ display:'flex', gap:2, alignItems:'center', justifyContent:'center', height:52, padding:'0 24px', background:'rgba(255,255,255,0.04)' }}>
                {Array.from({length:60},(_,i)=>(
                  <div key={i} style={{
                    flex:1, borderRadius:2,
                    background: i < progress * 0.6 ? BRAND : 'rgba(255,255,255,0.12)',
                    height:`${12 + Math.sin(i*0.5)*8 + (i%3===0?10:0)}px`,
                    transition:'background .3s'
                  }}/>
                ))}
              </div>

              {/* Progress */}
              <div style={{ padding:'16px 24px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>
                  <span>{String(Math.floor(progress*15/100/60)).padStart(2,'0')}:{String(Math.floor(progress*15/100%60)).padStart(2,'0')}</span>
                  <span>15:00</span>
                </div>
                <div style={{ height:4, borderRadius:99, background:'rgba(255,255,255,0.1)', overflow:'hidden', cursor:'pointer' }}>
                  <div style={{ width:`${progress}%`, height:'100%', background:BRAND, borderRadius:99, transition:'width .3s' }}/>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 20px', background:`${BRAND}08`, border:`1px solid ${BRAND}30`, borderRadius:12 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', animation:'listen-blink 1s ease infinite' }}/>
              <span style={{ fontSize:13, color:DARK, fontWeight:600 }}>Listening — take notes if needed. Questions will appear after the audio finishes.</span>
            </div>
          </div>
        )}

        {/* Transition */}
        {phase === 'transition' && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100%', padding:32, textAlign:'center' }}>
            <div>
              <div style={{ width:64, height:64, borderRadius:'50%', background:`${SUCCESS}15`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <CheckSquare size={28} color={SUCCESS}/>
              </div>
              <h3 style={{ fontSize:16, fontWeight:800, color:DARK, marginBottom:8 }}>Audio Complete</h3>
              <p style={{ fontSize:13, color:'#64748b' }}>Preparing questions...</p>
            </div>
          </div>
        )}

        {/* Answering */}
        {phase === 'answering' && (
          <div style={{ maxWidth:640, margin:'32px auto', padding:'0 24px' }}>
            <p style={{ fontSize:14, fontWeight:600, color:DARK, lineHeight:1.8, marginBottom:20 }}>{Qs[qIdx]?.text}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
              {Qs[qIdx]?.options.map((opt, i) => {
                const letter = ['A','B','C','D'][i];
                const sel = answers[qIdx] === letter;
                return (
                  <button key={i} onClick={() => setAnswers(a => ({...a,[qIdx]:letter}))} style={{
                    display:'flex', alignItems:'flex-start', gap:12, padding:'13px 16px',
                    borderRadius:10, border:`2px solid ${sel?BRAND:'#e2e8f0'}`,
                    background:sel?`${BRAND}0d`:'#fff', cursor:'pointer', textAlign:'left'
                  }}>
                    <span style={{ width:26,height:26,borderRadius:'50%',border:`2px solid ${sel?BRAND:'#cbd5e1'}`,background:sel?BRAND:'#fff',color:sel?'#fff':'#94a3b8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,flexShrink:0 }}>{letter}</span>
                    <span style={{ fontSize:13,color:DARK,lineHeight:1.65 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <button onClick={() => setQIdx(i => Math.max(0,i-1))} disabled={qIdx===0}
                style={{ display:'flex',alignItems:'center',gap:6,padding:'10px 20px',borderRadius:9,border:'1.5px solid #e2e8f0',background:'#fff',color:qIdx===0?'#cbd5e1':DARK,fontWeight:700,fontSize:13,cursor:qIdx===0?'not-allowed':'pointer' }}>
                <ChevronLeft size={16}/> Back
              </button>
              {qIdx < Qs.length - 1
                ? <button onClick={() => setQIdx(i=>i+1)} style={{ display:'flex',alignItems:'center',gap:6,padding:'10px 20px',borderRadius:9,border:'none',background:BRAND,color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer' }}>Next <ChevronRight size={16}/></button>
                : <button onClick={onComplete} style={{ padding:'10px 24px',borderRadius:9,border:'none',background:SUCCESS,color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer' }}>Submit ✓</button>
              }
            </div>
          </div>
        )}
      </div>

      <Notepad visible={notepad} onClose={() => setNotepad(false)}/>
      <style>{`@keyframes listen-blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
    </div>
  );
}

/* ─── Writing Section ─── */
function WritingSection({ onComplete }) {
  const [taskType, setTaskType] = useState('integrated');
  const [text, setText] = useState('');
  const [showReading, setShowReading] = useState(true);
  const timer = useTimer(29 * 60);
  const wc = text.trim().split(/\s+/).filter(Boolean).length;
  const minWords = taskType === 'integrated' ? 150 : 100;
  const taskData = WRITING_TASKS.TOEFL;

  useEffect(() => {
    if (taskType !== 'integrated') return;
    const t = setTimeout(() => setShowReading(false), 180000);
    return () => clearTimeout(t);
  }, [taskType]);

  const execCmd = (cmd) => {
    try { document.execCommand(cmd); } catch {}
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 52px)' }}>
      {/* Sub-header */}
      <div style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0', padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', gap:4 }}>
          {['integrated','discussion'].map(t => (
            <button key={t} onClick={() => { setTaskType(t); setText(''); }} style={{
              padding:'5px 14px', borderRadius:6, border:`1.5px solid ${taskType===t?BRAND:'#e2e8f0'}`,
              background:taskType===t?BRAND:'#fff', color:taskType===t?'#fff':'#64748b',
              fontWeight:700, fontSize:11, cursor:'pointer'
            }}>
              {t === 'integrated' ? 'Task 1 — Integrated' : 'Task 2 — Discussion'}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12, fontWeight:700, color:wc<minWords?'#ef4444':SUCCESS }}>
            Words: {wc} / {minWords}+
          </span>
        </div>
      </div>

      <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
        {taskType === 'integrated' && (
          <>
            {showReading && (
              <div style={{ width:'42%', overflowY:'auto', padding:'24px', background:'#fafbfc', borderRight:'1px solid #e2e8f0', flexShrink:0 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>Reading Passage · 3 minutes</div>
                <p style={{ fontSize:13.5, color:'#1e293b', lineHeight:1.85, fontFamily:"'Georgia',serif" }}>{taskData.integrated.reading}</p>
              </div>
            )}
            <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'20px', overflow:'hidden' }}>
              <div style={{ background:`${BRAND}08`, border:`1px solid ${BRAND}20`, borderRadius:10, padding:'12px 16px', marginBottom:14 }}>
                <p style={{ fontSize:13, color:'#1e293b', lineHeight:1.7, margin:0 }}>{taskData.integrated.prompt}</p>
              </div>
              <div style={{ display:'flex', gap:4, marginBottom:10 }}>
                {[['Cut','cut'],['Copy','copy'],['Paste','paste'],['Undo','undo'],['Redo','redo']].map(([label,cmd]) => (
                  <button key={cmd} onClick={() => execCmd(cmd)} style={{ padding:'4px 10px', borderRadius:6, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:11, fontWeight:600, color:'#475569', cursor:'pointer' }}>{label}</button>
                ))}
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Begin your response here..."
                style={{ flex:1, padding:'16px', border:`1.5px solid ${wc>=minWords?SUCCESS:'#e2e8f0'}`, borderRadius:12, fontSize:14, lineHeight:1.9, color:DARK, resize:'none', outline:'none', fontFamily:"'Georgia',serif", transition:'border .2s' }}/>
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
                <button onClick={onComplete} style={{ padding:'11px 28px', borderRadius:9, border:'none', background:SUCCESS, color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer' }}>Submit ✓</button>
              </div>
            </div>
          </>
        )}

        {taskType === 'discussion' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9', background:'#fafbfc' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Professor</div>
              <p style={{ fontSize:13.5, color:DARK, lineHeight:1.75 }}>{taskData.discussion.prompt}</p>
            </div>

            {/* Posts */}
            <div style={{ padding:'16px 24px', display:'flex', flexDirection:'column', gap:12 }}>
              {[taskData.discussion.post1, taskData.discussion.post2].map((post, i) => (
                <div key={i} style={{ display:'flex', gap:12, maxWidth:'70%' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:BRAND, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 }}>
                    {post.author.split(' ').map(x=>x[0]).join('')}
                  </div>
                  <div style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:'4px 14px 14px 14px', padding:'12px 16px' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:BRAND, marginBottom:6 }}>{post.author}</div>
                    <div style={{ fontSize:13, color:'#1e293b', lineHeight:1.65 }}>{post.text}</div>
                  </div>
                </div>
              ))}

              {/* Reply box */}
              <div style={{ maxWidth:'75%', alignSelf:'flex-end', width:'100%' }}>
                <div style={{ background:'#fff', border:`2px solid ${BRAND}`, borderRadius:'14px 4px 14px 14px', overflow:'hidden' }}>
                  <div style={{ padding:'8px 14px', background:`${BRAND}10`, borderBottom:`1px solid ${BRAND}30`, fontSize:11, fontWeight:700, color:BRAND }}>Your Reply</div>
                  <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Contribute to the discussion..."
                    style={{ width:'100%', minHeight:120, padding:'12px 14px', border:'none', outline:'none', fontSize:13, lineHeight:1.7, resize:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
                  <div style={{ padding:'8px 14px', background:'#f8fafc', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:11, color:wc<minWords?'#ef4444':SUCCESS, fontWeight:700 }}>Words: {wc} / {minWords} min</span>
                    <button onClick={onComplete} style={{ padding:'7px 18px', borderRadius:8, border:'none', background:BRAND, color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer' }}>Post Reply →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Results ─── */
function Results({ onRestart, onExit }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 52px)', background:'#f8fafc', padding:32 }}>
      <div style={{ maxWidth:500, width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:120, height:120, borderRadius:'50%', background:`linear-gradient(135deg,${BRAND},#0056b3)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:`0 12px 40px ${BRAND}40` }}>
            <div style={{ fontSize:40, fontWeight:900, color:'#fff', lineHeight:1 }}>98</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>/ 120</div>
          </div>
          <h2 style={{ fontSize:22, fontWeight:900, color:DARK, marginBottom:6 }}>Great Score!</h2>
          <p style={{ fontSize:13, color:'#64748b' }}>Official TOEFL scores are available within 6 days.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          {[['Reading','27','30'],['Listening','25','30'],['Speaking','23','30'],['Writing','23','30']].map(([k,v,max]) => (
            <div key={k} style={{ background:'#fff', borderRadius:14, padding:'18px', border:'1.5px solid #e2e8f0', textAlign:'center' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>{k}</div>
              <div style={{ fontSize:30, fontWeight:900, color:BRAND, lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>/ {max}</div>
              <div style={{ height:4, borderRadius:99, background:'#f1f5f9', marginTop:10, overflow:'hidden' }}>
                <div style={{ width:`${(+v/+max)*100}%`, height:'100%', background:BRAND, borderRadius:99 }}/>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:14, padding:'16px 20px', marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Score Breakdown</div>
          <p style={{ fontSize:13, color:'#475569', lineHeight:1.7 }}>
            Your Reading score indicates strong comprehension. Speaking showed excellent fluency. Writing feedback will include AI scoring within 48 hours.
          </p>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onRestart} style={{ flex:1, padding:'13px', borderRadius:10, border:`2px solid ${BRAND}`, background:'#fff', color:BRAND, fontWeight:800, fontSize:13, cursor:'pointer' }}>
            Retake Test
          </button>
          <button onClick={onExit} style={{ flex:1, padding:'13px', borderRadius:10, border:'none', background:BRAND, color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer' }}>
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Engine ─── */
export default function TOEFLEngine({ onExit }) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [showIntro,  setShowIntro]  = useState(true);
  const [done,       setDone]       = useState(false);
  const timer = useTimer(SECTIONS[sectionIdx]?.time ?? 54 * 60);

  const next = () => {
    if (sectionIdx < SECTIONS.length - 1) {
      setSectionIdx(i => i + 1);
      setShowIntro(true);
    } else {
      setDone(true);
    }
  };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", minHeight:'100vh', background:'#fff' }}>
      <TopNav
        sectionIdx={sectionIdx}
        onExit={onExit}
        done={done}
        timer={!done && !showIntro ? timer : null}
      />

      {done ? (
        <Results onRestart={() => { setSectionIdx(0); setShowIntro(true); setDone(false); }} onExit={onExit}/>
      ) : showIntro ? (
        <SectionIntro section={SECTIONS[sectionIdx]} onStart={() => setShowIntro(false)}/>
      ) : sectionIdx === 0 ? (
        <ReadingSection onComplete={next}/>
      ) : sectionIdx === 1 ? (
        <ListeningSection onComplete={next}/>
      ) : sectionIdx === 2 ? (
        <SpeakingTest onComplete={next} onExit={onExit}/>
      ) : (
        <WritingSection onComplete={next}/>
      )}
    </div>
  );
}

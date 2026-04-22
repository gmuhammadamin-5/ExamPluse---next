"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Flag, ChevronLeft, ChevronRight, Volume2, Mic, MicOff, BookOpen, Headphones, PenTool, MessageSquare, CheckCircle, X, Clock } from 'lucide-react';
import { READING_PASSAGE, IELTS_QUESTIONS, WRITING_TASKS, SPEAKING_PARTS } from './ExamData';
import SpeakingTest from '../SpeakingTest';

const BRAND = '#007bff';
const SECTIONS = [
  { id: 'listening', label: 'Listening', icon: Headphones, time: 30 },
  { id: 'reading',   label: 'Reading',   icon: BookOpen,   time: 60 },
  { id: 'writing',   label: 'Writing',   icon: PenTool,    time: 60 },
  { id: 'speaking',  label: 'Speaking',  icon: MessageSquare, time: 15 },
];

function useTimer(initialSeconds, onExpire) {
  const [secs, setSecs] = useState(initialSeconds);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    if (secs <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, running]);
  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  return { secs, fmt: fmt(secs), pause: () => setRunning(false), resume: () => setRunning(true) };
}

/* ─── Timer Display ─── */
function TimerChip({ secs, fmt }) {
  const warn = secs < 300;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, background: warn ? '#FFF1F1' : 'white', border:`1px solid ${warn ? BRAND : '#e2e8f0'}`, borderRadius:8, padding:'5px 12px' }}>
      <Clock size={13} color={warn ? BRAND : '#64748b'} />
      <span style={{ fontSize:13, fontWeight:800, color: warn ? BRAND : '#1e293b', fontVariantNumeric:'tabular-nums' }}>{fmt}</span>
    </div>
  );
}

/* ─── Question Navigator (bottom bar) ─── */
function NavBar({ total, current, answers, flagged, onJump }) {
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'white', borderTop:`2px solid ${BRAND}`, padding:'8px 16px', display:'flex', alignItems:'center', gap:6, overflowX:'auto', zIndex:100 }}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const answered = answers[n];
        const isFlagged = flagged.has(n);
        const isCurrent = current === n;
        return (
          <button key={n} onClick={() => onJump(n)} style={{
            width:32, height:32, borderRadius:6, border: isCurrent ? `2px solid #fff` : '1.5px solid #444',
            background: isCurrent ? BRAND : answered ? '#dcfce7' : '#f8f9fb',
            color: isCurrent ? '#fff' : answered ? '#16a34a' : '#475569',
            fontSize:11, fontWeight:700, cursor:'pointer', position:'relative', flexShrink:0,
            transition:'all .15s',
          }}>
            {n}
            {isFlagged && <span style={{ position:'absolute', top:-4, right:-4, fontSize:8 }}>🚩</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Highlight context menu ─── */
function HighlightMenu({ x, y, onHighlight, onClose }) {
  return (
    <div style={{ position:'fixed', top:y, left:x, background:'white', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', border:'1px solid #e2e8f0', zIndex:999, overflow:'hidden' }}>
      <button onClick={onHighlight} style={{ display:'block', width:'100%', padding:'8px 16px', background:'none', border:'none', color:'#1e293b', fontSize:12, fontWeight:700, cursor:'pointer', textAlign:'left' }}>🖊 Highlight</button>
      <button onClick={onClose} style={{ display:'block', width:'100%', padding:'8px 16px', background:'none', border:'none', color:'#94a3b8', fontSize:12, cursor:'pointer', textAlign:'left' }}>Cancel</button>
    </div>
  );
}

/* ═══════════════════════ READING SECTION ═══════════════════════ */
function ReadingSection({ onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [highlights, setHighlights] = useState([]);
  const [menu, setMenu] = useState(null);
  const timer = useTimer(60 * 60, onComplete);
  const passageRef = useRef();

  const q = IELTS_QUESTIONS[qIdx];

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (!text) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setMenu({ x: rect.left, y: rect.bottom + 8, text });
  };

  const applyHighlight = () => {
    if (menu?.text) setHighlights(h => [...h, menu.text]);
    setMenu(null);
    window.getSelection()?.removeAllRanges();
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const s = new Set(prev);
      s.has(qIdx+1) ? s.delete(qIdx+1) : s.add(qIdx+1);
      return s;
    });
  };

  const answer = (val) => setAnswers(a => ({ ...a, [qIdx+1]: val }));

  const passageHtml = READING_PASSAGE.text.split('\n\n').map((p, i) => {
    let html = p;
    highlights.forEach(h => { html = html.replaceAll(h, `<mark style="background:#FFD700;padding:1px 0">${h}</mark>`); });
    return `<p style="margin-bottom:16px;line-height:1.85">${html}</p>`;
  }).join('');

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 108px)' }}>
      {/* top bar */}
      <div style={{ background:'white', borderBottom:'1px solid #e8edf2', padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ color:'#475569', fontSize:12, fontWeight:600 }}>READING — Question {qIdx+1} of {IELTS_QUESTIONS.length}</span>
        <TimerChip secs={timer.secs} fmt={timer.fmt} />
      </div>

      {/* split pane */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', flex:1, overflow:'hidden' }}>
        {/* LEFT — passage */}
        <div ref={passageRef} onMouseUp={handleMouseUp} style={{ overflowY:'auto', padding:'24px 28px', borderRight:'2px solid #f1f5f9', background:'#fff' }}>
          <h3 style={{ fontSize:16, fontWeight:900, color:'#0f172a', marginBottom:6 }}>{READING_PASSAGE.title}</h3>
          <p style={{ fontSize:11, color:'#94a3b8', marginBottom:20 }}>{READING_PASSAGE.source}</p>
          <div style={{ fontSize:14, color:'#1e293b', lineHeight:1.85 }} dangerouslySetInnerHTML={{ __html: passageHtml }} />
        </div>

        {/* RIGHT — questions */}
        <div style={{ overflowY:'auto', padding:'24px 28px', background:'#fafbfc' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>Question {qIdx+1}</div>
            <button onClick={toggleFlag} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:8, border:'1.5px solid #e2e8f0', background: flagged.has(qIdx+1) ? '#FFF1F1' : '#fff', color: flagged.has(qIdx+1) ? BRAND : '#64748b', fontSize:11, fontWeight:700, cursor:'pointer' }}>
              <Flag size={12} /> {flagged.has(qIdx+1) ? 'Flagged' : 'Flag'}
            </button>
          </div>

          <p style={{ fontSize:14, color:'#1e293b', lineHeight:1.7, marginBottom:20, fontWeight:500 }}>{q.text}</p>

          {q.type === 'multiple_choice' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.options.map((opt, i) => {
                const letter = ['A','B','C','D'][i];
                const sel = answers[qIdx+1] === letter;
                return (
                  <button key={i} onClick={() => answer(letter)} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 16px', borderRadius:10, border:`2px solid ${sel ? BRAND : '#e2e8f0'}`, background: sel ? '#FFF1F1' : '#fff', cursor:'pointer', textAlign:'left', transition:'all .15s' }}>
                    <span style={{ width:24, height:24, borderRadius:'50%', border:`2px solid ${sel ? BRAND : '#cbd5e1'}`, background: sel ? BRAND : 'transparent', color: sel ? '#fff' : '#64748b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, flexShrink:0 }}>{letter}</span>
                    <span style={{ fontSize:13, color:'#1e293b', lineHeight:1.6 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === 'true_false_ng' && (
            <div style={{ display:'flex', gap:10 }}>
              {['True','False','Not Given'].map(opt => {
                const sel = answers[qIdx+1] === opt;
                return (
                  <button key={opt} onClick={() => answer(opt)} style={{ flex:1, padding:'12px', borderRadius:10, border:`2px solid ${sel ? BRAND : '#e2e8f0'}`, background: sel ? BRAND : '#fff', color: sel ? '#fff' : '#475569', fontWeight:800, fontSize:12, cursor:'pointer', transition:'all .15s' }}>{opt}</button>
                );
              })}
            </div>
          )}

          {q.type === 'short_answer' && (
            <input value={answers[qIdx+1] || ''} onChange={e => answer(e.target.value)}
              placeholder="Type your answer..."
              style={{ width:'100%', padding:'12px 16px', border:`2px solid ${answers[qIdx+1] ? BRAND : '#e2e8f0'}`, borderRadius:10, fontSize:13, color:'#1e293b', outline:'none', boxSizing:'border-box' }} />
          )}

          {/* nav buttons */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:32 }}>
            <button onClick={() => setQIdx(i => Math.max(0,i-1))} disabled={qIdx===0}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:10, border:'1.5px solid #e2e8f0', background:'#fff', color: qIdx===0 ? '#cbd5e1' : '#475569', fontWeight:700, fontSize:13, cursor: qIdx===0 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft size={16}/> Previous
            </button>
            {qIdx < IELTS_QUESTIONS.length - 1 ? (
              <button onClick={() => setQIdx(i => i+1)}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:10, border:'none', background:BRAND, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                Next <ChevronRight size={16}/>
              </button>
            ) : (
              <button onClick={onComplete}
                style={{ padding:'10px 24px', borderRadius:10, border:'none', background:'#059669', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer' }}>
                Submit Section ✓
              </button>
            )}
          </div>
        </div>
      </div>

      <NavBar total={IELTS_QUESTIONS.length} current={qIdx+1} answers={answers} flagged={flagged} onJump={i => setQIdx(i-1)} />
      {menu && <HighlightMenu x={menu.x} y={menu.y} onHighlight={applyHighlight} onClose={() => setMenu(null)} />}
    </div>
  );
}

/* ═══════════════════════ WRITING SECTION ═══════════════════════ */
function WritingSection({ onComplete }) {
  const [task, setTask] = useState(1);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const timer = useTimer(60 * 60, onComplete);
  const wc = (t) => t.trim().split(/\s+/).filter(Boolean).length;

  const current = task === 1 ? text1 : text2;
  const setCurrent = task === 1 ? setText1 : setText2;
  const minWords = task === 1 ? 150 : 250;
  const taskData = task === 1 ? WRITING_TASKS.IELTS.task1 : WRITING_TASKS.IELTS.task2;
  const words = wc(current);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 108px)' }}>
      {/* top bar */}
      <div style={{ background:'white', borderBottom:'1px solid #e8edf2', padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', gap:2 }}>
          {[1,2].map(t => (
            <button key={t} onClick={() => setTask(t)} style={{ padding:'5px 14px', borderRadius:6, border:'none', background: task===t ? BRAND : '#f1f5f9', color: task===t ? '#fff' : '#64748b', fontWeight:700, fontSize:12, cursor:'pointer' }}>
              Task {t}
            </button>
          ))}
        </div>
        <TimerChip secs={timer.secs} fmt={timer.fmt} />
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'24px 32px', gap:16, overflowY:'auto', background:'#fff' }}>
        <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px 20px', fontSize:13, color:'#475569', lineHeight:1.7 }}>
          <strong style={{ color:'#0f172a' }}>Task {task}: </strong>{taskData.prompt}
        </div>

        {/* toolbar */}
        <div style={{ display:'flex', gap:4, padding:'4px 8px', background:'#f1f5f9', borderRadius:8, alignSelf:'flex-start' }}>
          {['Cut','Copy','Paste','Undo'].map(a => (
            <button key={a} style={{ padding:'4px 10px', borderRadius:6, border:'1px solid #e2e8f0', background:'#fff', fontSize:11, fontWeight:600, color:'#475569', cursor:'pointer' }}>{a}</button>
          ))}
        </div>

        <textarea
          value={current}
          onChange={e => setCurrent(e.target.value)}
          placeholder="Begin writing here..."
          style={{ flex:1, minHeight:320, padding:'16px', border:`1.5px solid ${words >= minWords ? '#059669' : '#e2e8f0'}`, borderRadius:12, fontSize:14, lineHeight:1.85, color:'#1e293b', resize:'none', outline:'none', fontFamily:'Georgia, serif', transition:'border .2s' }}
        />

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:13, fontWeight:700, color: words < minWords ? '#ef4444' : '#059669' }}>
              Word count: {words}
            </span>
            <span style={{ fontSize:11, color:'#94a3b8' }}>/ minimum {minWords}</span>
            {words >= minWords && <CheckCircle size={14} color="#059669" />}
          </div>
          {task === 2 && (
            <button onClick={onComplete} style={{ padding:'10px 24px', borderRadius:10, border:'none', background:'#059669', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer' }}>
              Submit ✓
            </button>
          )}
          {task === 1 && (
            <button onClick={() => setTask(2)} style={{ padding:'10px 24px', borderRadius:10, border:'none', background:BRAND, color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer' }}>
              Next → Task 2
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ LISTENING SECTION ═══════════════════════ */
function ListeningSection({ onComplete }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | playing | answering
  const timer = useTimer(30 * 60, onComplete);

  const listeningQs = IELTS_QUESTIONS.slice(0, 6);

  useEffect(() => {
    if (!playing) return;
    if (progress >= 100) { setPlaying(false); setPhase('answering'); return; }
    const t = setInterval(() => setProgress(p => Math.min(100, p + 0.5)), 300);
    return () => clearInterval(t);
  }, [playing, progress]);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 108px)' }}>
      <div style={{ background:'white', borderBottom:'1px solid #e8edf2', padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ color:'#aaa', fontSize:12, fontWeight:600 }}>LISTENING — Section {Math.ceil((qIdx+1)/10)} of 4</span>
        <TimerChip secs={timer.secs} fmt={timer.fmt} />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'32px', background:'#fff' }}>
        {phase === 'intro' && (
          <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'#FFF1F1', border:`3px solid ${BRAND}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
              <Headphones size={36} color={BRAND} />
            </div>
            <h3 style={{ fontSize:22, fontWeight:900, color:'#0f172a', marginBottom:12 }}>Listening Section</h3>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, marginBottom:24 }}>You will hear four recordings. You will only hear each recording once. Answer the questions as you listen.</p>
            <button onClick={() => { setPhase('playing'); setPlaying(true); }} style={{ padding:'14px 32px', borderRadius:12, border:'none', background:BRAND, color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer' }}>
              ▶ Start Listening
            </button>
          </div>
        )}

        {(phase === 'playing' || phase === 'answering') && (
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            {/* audio visual */}
            <div style={{ background:'linear-gradient(135deg,#1a1a2e,#2d1a1a)', borderRadius:16, padding:'24px', marginBottom:28, position:'relative', overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <Volume2 size={20} color={BRAND} />
                <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>Section 1 — A conversation about travel arrangements</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:99, height:8, overflow:'hidden' }}>
                <div style={{ width:`${progress}%`, height:'100%', background:BRAND, borderRadius:99, transition:'width .3s' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>{Math.floor(progress*1.8/60)}:{String(Math.floor(progress*1.8%60)).padStart(2,'0')}</span>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>3:00</span>
              </div>
              {/* waveform bars */}
              <div style={{ display:'flex', alignItems:'center', gap:2, marginTop:12, justifyContent:'center' }}>
                {Array.from({length:40},(_,i)=>(
                  <div key={i} style={{ width:3, borderRadius:2, background: playing ? BRAND : '#444', opacity: playing ? 0.4+Math.random()*0.6 : 0.3, height: playing ? `${8+Math.random()*24}px` : '8px', transition:'height .15s' }} />
                ))}
              </div>
            </div>

            {/* questions */}
            <h4 style={{ fontSize:14, fontWeight:800, color:'#0f172a', marginBottom:16 }}>Questions 1–6</h4>
            {listeningQs.map((q, i) => (
              <div key={q.id} style={{ marginBottom:20, padding:'16px', background:'#f8fafc', borderRadius:12, border:'1px solid #e2e8f0' }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', marginBottom:12 }}>{i+1}. {q.text}</p>
                {q.type === 'multiple_choice' && q.options && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {q.options.map((opt, oi) => {
                      const letter = ['A','B','C','D'][oi];
                      const sel = answers[q.id] === letter;
                      return (
                        <button key={oi} onClick={() => setAnswers(a=>({...a,[q.id]:letter}))} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderRadius:8, border:`1.5px solid ${sel?BRAND:'#e2e8f0'}`, background:sel?'#FFF1F1':'#fff', cursor:'pointer', textAlign:'left' }}>
                          <span style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${sel?BRAND:'#cbd5e1'}`, background:sel?BRAND:'transparent', color:sel?'#fff':'#94a3b8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0 }}>{letter}</span>
                          <span style={{ fontSize:12, color:'#1e293b' }}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {(q.type === 'true_false_ng' || q.type === 'short_answer') && (
                  <input value={answers[q.id]||''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} placeholder="Answer..." style={{ width:'100%', padding:'9px 14px', border:`1.5px solid ${answers[q.id]?BRAND:'#e2e8f0'}`, borderRadius:8, fontSize:12, outline:'none', boxSizing:'border-box' }} />
                )}
              </div>
            ))}
            <button onClick={onComplete} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:'#059669', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', marginTop:8 }}>
              Submit Section ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════ SPEAKING SECTION ═══════════════════════ */
function SpeakingSection({ onComplete }) {
  const [partIdx, setPartIdx] = useState(0);
  const [phase, setPhase] = useState('prep'); // prep | recording | done
  const [recording, setRecording] = useState(false);
  const [prepSecs, setPrepSecs] = useState(0);
  const [recSecs, setRecSecs] = useState(0);
  const [qIdx, setQIdx] = useState(0);

  const part = SPEAKING_PARTS.IELTS[partIdx];

  const startRecord = () => { setPhase('recording'); setRecording(true); setRecSecs(part.speakTime); };

  useEffect(() => {
    if (phase !== 'prep' || part.prepTime === 0) return;
    setPrepSecs(part.prepTime);
    const interval = setInterval(() => {
      setPrepSecs(s => { if (s <= 1) { clearInterval(interval); startRecord(); return 0; } return s - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [partIdx, phase]);

  useEffect(() => {
    if (!recording) return;
    const interval = setInterval(() => {
      setRecSecs(s => { if (s <= 1) { clearInterval(interval); setRecording(false); setPhase('done'); return 0; } return s - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [recording]);

  const next = () => {
    if (partIdx < SPEAKING_PARTS.IELTS.length - 1) {
      setPartIdx(i => i+1);
      setPhase('prep');
      setQIdx(0);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 108px)', padding:32, background:'#fff' }}>
      <div style={{ maxWidth:600, width:'100%' }}>
        {/* part indicator */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:32 }}>
          {SPEAKING_PARTS.IELTS.map((p,i) => (
            <div key={i} style={{ width:40, height:4, borderRadius:99, background: i===partIdx ? BRAND : i<partIdx ? '#059669' : '#e2e8f0', transition:'all .3s' }} />
          ))}
        </div>

        <div style={{ background:'#fff', borderRadius:20, border:`2px solid ${phase==='recording'?BRAND:'#f1f5f9'}`, boxShadow:'0 8px 32px rgba(0,0,0,0.08)', padding:'32px', transition:'border .3s' }}>
          <div style={{ fontSize:11, fontWeight:800, color:BRAND, textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>{part.title}</div>

          {part.type === 'cue_card' && (
            <>
              <p style={{ fontSize:15, fontWeight:700, color:'#0f172a', marginBottom:12 }}>{part.topic}</p>
              <ul style={{ paddingLeft:20, margin:'0 0 20px', color:'#64748b', fontSize:13, lineHeight:2 }}>
                {part.bullets.map((b,i) => <li key={i}>{b}</li>)}
              </ul>
            </>
          )}

          {part.type === 'intro' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
              {part.questions.map((q,i) => (
                <div key={i} onClick={() => setQIdx(i)} style={{ padding:'12px 16px', borderRadius:10, background: qIdx===i ? '#FFF1F1' : '#f8fafc', border:`1.5px solid ${qIdx===i?BRAND:'#f1f5f9'}`, fontSize:13, color:'#1e293b', cursor:'pointer', transition:'all .15s' }}>
                  {i+1}. {q}
                </div>
              ))}
            </div>
          )}

          {part.type === 'discussion' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
              {part.questions.map((q,i) => (
                <div key={i} style={{ padding:'12px 16px', borderRadius:10, background:'#f8fafc', border:'1px solid #e2e8f0', fontSize:13, color:'#1e293b', lineHeight:1.6 }}>
                  {i+1}. {q}
                </div>
              ))}
            </div>
          )}

          {/* recording UI */}
          <div style={{ textAlign:'center' }}>
            {phase === 'prep' && part.prepTime > 0 && (
              <>
                <div style={{ fontSize:48, fontWeight:900, color:BRAND, fontVariantNumeric:'tabular-nums' }}>{prepSecs}</div>
                <div style={{ fontSize:13, color:'#94a3b8', marginBottom:20 }}>Preparation time remaining</div>
              </>
            )}

            {phase === 'prep' && part.prepTime === 0 && (
              <button onClick={startRecord} style={{ padding:'14px 32px', borderRadius:14, border:'none', background:BRAND, color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', marginBottom:16 }}>
                <Mic size={18} style={{ marginRight:8, verticalAlign:'middle' }} /> Start Speaking
              </button>
            )}

            {phase === 'recording' && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:BRAND, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 ${(SPEAKING_PARTS.IELTS[partIdx].speakTime - recSecs) % 2 === 0 ? 16 : 8}px rgba(200,16,46,0.2)`, transition:'box-shadow .5s' }}>
                  <Mic size={32} color="#fff" />
                </div>
                <div style={{ fontSize:32, fontWeight:900, color:BRAND, fontVariantNumeric:'tabular-nums' }}>{recSecs}s</div>
                <div style={{ fontSize:12, color:'#94a3b8' }}>Recording in progress...</div>
                {/* waveform */}
                <div style={{ display:'flex', gap:3, alignItems:'center', height:40 }}>
                  {Array.from({length:24},(_,i)=>(
                    <div key={i} style={{ width:4, borderRadius:2, background:BRAND, height:`${8+Math.random()*28}px`, opacity:0.6+Math.random()*0.4, animation:`wave${i%4} 0.${3+i%5}s ease-in-out infinite alternate` }} />
                  ))}
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                <CheckCircle size={48} color="#059669" />
                <p style={{ color:'#059669', fontWeight:700 }}>Recording complete</p>
                <button onClick={next} style={{ padding:'12px 28px', borderRadius:12, border:'none', background: partIdx < SPEAKING_PARTS.IELTS.length-1 ? BRAND : '#059669', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer' }}>
                  {partIdx < SPEAKING_PARTS.IELTS.length-1 ? 'Next Part →' : 'Finish Test ✓'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ RESULTS ═══════════════════════ */
function Results({ onRestart }) {
  const scores = { Listening: 7.0, Reading: 7.5, Writing: 6.5, Speaking: 7.0 };
  const overall = (Object.values(scores).reduce((a,b)=>a+b,0) / 4).toFixed(1);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 108px)', padding:32, background:'#fff' }}>
      <div style={{ maxWidth:520, width:'100%', textAlign:'center' }}>
        <div style={{ width:120, height:120, borderRadius:'50%', background:`linear-gradient(135deg,${BRAND},#8B0000)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:`0 16px 40px rgba(200,16,46,0.3)` }}>
          <div style={{ fontSize:40, fontWeight:900, color:'#fff', lineHeight:1 }}>{overall}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>Band Score</div>
        </div>
        <h2 style={{ fontSize:24, fontWeight:900, color:'#0f172a', marginBottom:8 }}>Test Complete</h2>
        <p style={{ color:'#64748b', marginBottom:32 }}>Official results are typically available within 13 days.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
          {Object.entries(scores).map(([k,v]) => (
            <div key={k} style={{ background:'#f8fafc', borderRadius:14, padding:'16px', border:'1.5px solid #f1f5f9' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>{k}</div>
              <div style={{ fontSize:28, fontWeight:900, color:BRAND }}>{v}</div>
            </div>
          ))}
        </div>
        <button onClick={onRestart} style={{ padding:'13px 32px', borderRadius:12, border:`2px solid ${BRAND}`, background:'#fff', color:BRAND, fontWeight:800, fontSize:14, cursor:'pointer' }}>
          Try Again
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN IELTS ENGINE ═══════════════════════ */
export default function IELTSEngine({ onExit }) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [done, setDone] = useState(false);

  const nextSection = () => {
    if (sectionIdx < SECTIONS.length - 1) setSectionIdx(i => i+1);
    else setDone(true);
  };

  if (done) return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Header sectionIdx={sectionIdx} onExit={onExit} done />
      <Results onRestart={() => { setSectionIdx(0); setDone(false); }} />
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", minHeight:'100vh', background:'#fff' }}>
      <Header sectionIdx={sectionIdx} onExit={onExit} />
      {sectionIdx === 0 && <ListeningSection onComplete={nextSection} />}
      {sectionIdx === 1 && <ReadingSection   onComplete={nextSection} />}
      {sectionIdx === 2 && <WritingSection   onComplete={nextSection} />}
      {sectionIdx === 3 && <SpeakingTest onComplete={nextSection} onExit={onExit} />}
      <style>{`@keyframes wave0{to{height:32px}}@keyframes wave1{to{height:20px}}@keyframes wave2{to{height:36px}}@keyframes wave3{to{height:16px}}`}</style>
    </div>
  );
}

function Header({ sectionIdx, onExit, done }) {
  return (
    <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:200 }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <span style={{ fontSize:14, fontWeight:900, color:'#007bff', letterSpacing:'1px', textTransform:'uppercase' }}>IELTS</span>
        <span style={{ fontSize:11, color:'#cbd5e1' }}>|</span>
        <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>Computer-Based Test</span>
      </div>
      {!done && (
        <div style={{ display:'flex', gap:0 }}>
          {SECTIONS.map((s,i) => (
            <div key={s.id} style={{ padding:'0 16px', height:52, display:'flex', alignItems:'center', gap:6, borderBottom:`2px solid ${i===sectionIdx?'#007bff':'transparent'}`, marginBottom:-1 }}>
              <s.icon size={13} color={i===sectionIdx?'#007bff':i<sectionIdx?'#059669':'#94a3b8'} />
              <span style={{ fontSize:12, fontWeight:700, color:i===sectionIdx?'#007bff':i<sectionIdx?'#059669':'#94a3b8' }}>{s.label}</span>
              {i < sectionIdx && <CheckCircle size={11} color="#059669" />}
            </div>
          ))}
        </div>
      )}
      <button onClick={onExit} style={{ background:'white', border:'1.5px solid #e2e8f0', borderRadius:8, color:'#64748b', fontSize:12, padding:'6px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontWeight:700 }}>
        <X size={13} /> Exit
      </button>
    </div>
  );
}

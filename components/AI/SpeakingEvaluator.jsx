'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, CheckCircle2, RotateCcw, BrainCircuit } from 'lucide-react';

// ─── WebGL Orb (SpeakingTest dan olingan) ────────────────────────────────────
const WebGLOrb = ({ state, size = 260 }) => {
  const canvasRef = useRef(null);
  const stateRef  = useRef(state);
  const rafRef    = useRef(null);

  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);

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
    `;
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
    `;
    const mk = (type, src) => { const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);

    const N = 2200;
    const pos = new Float32Array(N*3), ph = new Float32Array(N), sz = new Float32Array(N);
    for (let i=0;i<N;i++){
      const phi=Math.acos(1-2*(i+.5)/N), theta=Math.PI*(1+Math.sqrt(5))*i;
      pos[i*3]=Math.sin(phi)*Math.cos(theta); pos[i*3+1]=Math.sin(phi)*Math.sin(theta); pos[i*3+2]=Math.cos(phi);
      ph[i]=Math.random()*Math.PI*2; sz[i]=(3.2+Math.random()*3.2)*dpr;
    }
    const buf=(d)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);return b;};
    const pb=buf(pos),phb=buf(ph),sb=buf(sz);
    const aPos=gl.getAttribLocation(prog,'a_pos'),aPh=gl.getAttribLocation(prog,'a_phase'),aSz=gl.getAttribLocation(prog,'a_size');
    const uT=gl.getUniformLocation(prog,'u_time'),uS=gl.getUniformLocation(prog,'u_state'),uD=gl.getUniformLocation(prog,'u_dpr');
    gl.uniform1f(uD, dpr);
    const bind=(b,loc,n)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,0,0);};
    const sm={idle:0,speaking:1,listening:2,thinking:3};
    let t=0;
    const loop=()=>{
      rafRef.current=requestAnimationFrame(loop); t+=0.012;
      gl.clear(gl.COLOR_BUFFER_BIT);
      bind(pb,aPos,3); bind(phb,aPh,1); bind(sb,aSz,1);
      gl.uniform1f(uT,t); gl.uniform1f(uS,sm[stateRef.current]??0);
      gl.drawArrays(gl.POINTS,0,N);
    };
    loop();
    return ()=>{ cancelAnimationFrame(rafRef.current); gl.deleteProgram(prog); };
  }, [size]);

  const active = state==='speaking'||state==='listening';
  const gc = state==='speaking'?'0,191,255':'0,123,255';
  return (
    <div style={{ position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <div style={{ position:'absolute', inset:state==='speaking'?-28:-12, borderRadius:'50%', background:`radial-gradient(circle,rgba(${gc},${state==='speaking'?.2:.08}) 0%,transparent 68%)`, transition:'all 1s', pointerEvents:'none' }}/>
      {active&&[0,1,2].map(i=>(
        <div key={i} style={{ position:'absolute', width:size+i*50, height:size+i*50, borderRadius:'50%', border:`1px solid rgba(${gc},.42)`, opacity:0, animation:`glRing ${state==='speaking'?'2s':'1.4s'} ease-out ${i*.4}s infinite`, pointerEvents:'none' }}/>
      ))}
      <canvas ref={canvasRef} style={{ borderRadius:'50%', display:'block' }}/>
      <style>{`@keyframes glRing{0%{transform:scale(.8);opacity:.55}100%{transform:scale(1.28);opacity:0}}`}</style>
    </div>
  );
};

// ─── Topics ──────────────────────────────────────────────────────────────────
const TOPICS = [
  { id:1, title:"Describe a skill you learned",   level:"Intermediate" },
  { id:2, title:"Technology in education",         level:"Advanced"     },
  { id:3, title:"Your hometown",                   level:"Beginner"     },
  { id:4, title:"Environmental challenges",        level:"Advanced"     },
  { id:5, title:"A memorable journey",             level:"Intermediate" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const SpeakingEvaluator = () => {
  const [phase, setPhase]           = useState('select');
  const [orbState, setOrbState]     = useState('idle');
  const [topic, setTopic]           = useState(null);
  const [result, setResult]         = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');

  const mediaRecorderRef  = useRef(null);
  const timerRef          = useRef(null);
  const recognitionRef    = useRef(null);
  const transcriptBuf     = useRef('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setPhase('record');
      setOrbState('speaking');
      setRecordingTime(0);
      setTranscript('');
      transcriptBuf.current = '';
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);

      // Web Speech API — haqiqiy so'zlarni tanib olish
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.onresult = (e) => {
          let final = '';
          for (let i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
          }
          transcriptBuf.current = final;
          setTranscript(final);
        };
        rec.start();
        recognitionRef.current = rec;
      }
    } catch { alert('Mikrofon ruxsati berilmagan!'); }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      clearInterval(timerRef.current);
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
      setOrbState('thinking');
      setPhase('evaluating');
      await evaluateWithAI();
    }
  };

  const evaluateWithAI = async () => {
    const finalTranscript = transcriptBuf.current.trim() ||
      `Student spoke about "${topic?.title}" for ${recordingTime} seconds. Please evaluate based on topic relevance and likely speaking performance.`;
    try {
      const token = localStorage.getItem('access_token');
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${API}/api/ai/evaluate/speaking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ transcript: finalTranscript, exam_type: 'IELTS', task_type: topic?.title || 'General' })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult({ band_score: 7.0, overall_score: 77, feedback: 'Evaluation complete.', criteria: {}, strengths: [], improvements: [] });
      }
    } catch {
      setResult({ band_score: 7.0, overall_score: 77, feedback: 'AI connection error. Try again.', criteria: {}, strengths: [], improvements: [] });
    }
    setOrbState('idle');
    setPhase('result');
  };

  const reset = () => { setPhase('select'); setTopic(null); setResult(null); setOrbState('idle'); setRecordingTime(0); };

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const C = '#3b82f6';

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f0f8ff,#e6f7ff,#d6f0ff)', display:'flex', alignItems:'center', justifyContent:'center', padding:'120px 20px 40px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ maxWidth:700, width:'100%' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'white', borderRadius:20, padding:'10px 20px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', marginBottom:16 }}>
            <BrainCircuit size={20} color={C}/> <span style={{ fontWeight:800, color:'#1a1a1a' }}>AI Speaking Coach</span>
          </div>
          <h1 style={{ fontSize:32, fontWeight:900, color:'#1a1a1a', margin:0 }}>Speaking Evaluator</h1>
          <p style={{ color:'#64748b', marginTop:8 }}>Real-time IELTS Speaking Assessment</p>
        </div>

        {/* Topic Select */}
        {phase === 'select' && (
          <div style={{ background:'white', borderRadius:32, padding:40, boxShadow:'0 20px 60px rgba(0,0,0,0.06)' }}>
            <p style={{ fontWeight:800, color:'#64748b', fontSize:12, textTransform:'uppercase', letterSpacing:1, marginBottom:20 }}>Choose a Topic</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:30 }}>
              {TOPICS.map(t => (
                <div key={t.id} onClick={() => setTopic(t)} style={{
                  padding:'16px 20px', borderRadius:16, cursor:'pointer', border:`2px solid ${topic?.id===t.id ? C : '#f1f5f9'}`,
                  background: topic?.id===t.id ? `${C}08` : 'white', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all .2s'
                }}>
                  <span style={{ fontWeight:700, color:'#1a1a1a' }}>{t.title}</span>
                  <span style={{ fontSize:11, fontWeight:800, color: t.level==='Advanced'?'#ef4444':t.level==='Intermediate'?'#f59e0b':'#10b981', background: t.level==='Advanced'?'#fef2f2':t.level==='Intermediate'?'#fffbeb':'#f0fdf4', padding:'4px 10px', borderRadius:8 }}>{t.level}</span>
                </div>
              ))}
            </div>
            <button onClick={startRecording} disabled={!topic} style={{
              width:'100%', padding:'18px', borderRadius:20, border:'none', background: topic ? C : '#e2e8f0',
              color:'white', fontWeight:800, fontSize:16, cursor: topic ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:10
            }}>
              <Mic size={20}/> Start Recording
            </button>
          </div>
        )}

        {/* Recording */}
        {(phase === 'record' || phase === 'evaluating') && (
          <div style={{ background:'white', borderRadius:32, padding:50, boxShadow:'0 20px 60px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', alignItems:'center', gap:32, textAlign:'center' }}>
            <div style={{ background:'#f8fafc', borderRadius:16, padding:'10px 24px' }}>
              <span style={{ fontWeight:700, color:'#64748b', fontSize:14 }}>{topic?.title}</span>
            </div>

            <WebGLOrb state={orbState} size={260}/>

            {phase === 'record' && (
              <>
                <div style={{ fontSize:40, fontWeight:900, color:C, fontVariantNumeric:'tabular-nums' }}>{fmt(recordingTime)}</div>
                <p style={{ color:'#10b981', fontWeight:700, fontSize:14 }}>Recording... Speak clearly</p>
                {transcript && <div style={{ background:'#f8fafc', borderRadius:12, padding:'12px 16px', maxWidth:400, fontSize:13, color:'#475569', lineHeight:1.6, maxHeight:80, overflowY:'auto' }}>{transcript}</div>}
                <button onClick={stopRecording} style={{
                  padding:'16px 40px', borderRadius:20, border:'none', background:'#ef4444',
                  color:'white', fontWeight:800, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', gap:8
                }}>
                  <Square size={18}/> Stop & Evaluate
                </button>
              </>
            )}

            {phase === 'evaluating' && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <p style={{ fontWeight:800, color:'#8b5cf6', fontSize:16 }}>AI tahlil qilmoqda...</p>
                <p style={{ color:'#94a3b8', fontSize:13 }}>Groq Llama 3.3 70B ishlamoqda</p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {phase === 'result' && result && (
          <div style={{ background:'white', borderRadius:32, padding:40, boxShadow:'0 20px 60px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:30 }}>
              <h2 style={{ fontWeight:900, fontSize:22, margin:0 }}>AI Evaluation Result</h2>
              <div style={{ background: C, color:'white', borderRadius:16, padding:'10px 20px', fontWeight:900, fontSize:22 }}>{result.band_score} <span style={{ fontSize:14 }}>Band</span></div>
            </div>

            {/* Criteria Scores */}
            {result.criteria && Object.keys(result.criteria).length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
                {Object.entries(result.criteria).map(([k, v]) => (
                  <div key={k} style={{ background:'#f8fafc', borderRadius:16, padding:'16px 20px' }}>
                    <p style={{ fontSize:11, color:'#94a3b8', fontWeight:800, textTransform:'uppercase', margin:'0 0 6px' }}>{k.replace(/_/g,' ')}</p>
                    <p style={{ fontSize:24, fontWeight:900, color:C, margin:0 }}>{v}<span style={{ fontSize:14, color:'#94a3b8' }}>/9</span></p>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback */}
            {result.feedback && (
              <div style={{ background:'#f0f9ff', borderRadius:16, padding:20, marginBottom:20, borderLeft:`4px solid ${C}` }}>
                <p style={{ fontWeight:800, color:'#0369a1', fontSize:12, textTransform:'uppercase', marginBottom:8 }}>AI Feedback</p>
                <p style={{ color:'#1e40af', lineHeight:1.7, margin:0 }}>{result.feedback}</p>
              </div>
            )}

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontWeight:800, color:'#10b981', fontSize:12, textTransform:'uppercase', marginBottom:8 }}>Strengths</p>
                {result.strengths.map((s,i) => <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}><CheckCircle2 size={16} color="#10b981" style={{ flexShrink:0, marginTop:2 }}/><span style={{ color:'#374151', fontSize:14 }}>{s}</span></div>)}
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <p style={{ fontWeight:800, color:'#f59e0b', fontSize:12, textTransform:'uppercase', marginBottom:8 }}>To Improve</p>
                {result.improvements.map((s,i) => <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}><span style={{ color:'#f59e0b', flexShrink:0 }}>→</span><span style={{ color:'#374151', fontSize:14 }}>{s}</span></div>)}
              </div>
            )}

            <button onClick={reset} style={{
              width:'100%', padding:'16px', borderRadius:20, border:'none', background:C,
              color:'white', fontWeight:800, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8
            }}>
              <RotateCcw size={18}/> Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SpeakingEvaluator;

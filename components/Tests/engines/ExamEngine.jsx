"use client";
import dynamic from 'next/dynamic';

const IELTSEngine     = dynamic(() => import('./IELTSEngine'),     { ssr: false });
const TOEFLEngine     = dynamic(() => import('./TOEFLEngine'),     { ssr: false });
const CambridgeEngine = dynamic(() => import('./CambridgeEngine'), { ssr: false });
const SATEngine       = dynamic(() => import('./SATEngine'),       { ssr: false });
const CEFREngine      = dynamic(() => import('./CEFREngine'),      { ssr: false });

const ENGINE_MAP = {
  IELTS:     IELTSEngine,
  TOEFL:     TOEFLEngine,
  CAMBRIDGE: CambridgeEngine,
  SAT:       SATEngine,
  CEFR:      CEFREngine,
};

export default function ExamEngine({ examType, testId, onExit }) {
  const Engine = ENGINE_MAP[examType?.toUpperCase()];

  if (!Engine) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'system-ui' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🚫</div>
          <div style={{ fontSize:18, fontWeight:700, color:'#0f172a', marginBottom:8 }}>Unknown exam type: {examType}</div>
          <button onClick={onExit} style={{ padding:'10px 24px', borderRadius:10, border:'none', background:'#2563eb', color:'#fff', fontWeight:700, cursor:'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  return <Engine onExit={onExit} testId={testId} />;
}

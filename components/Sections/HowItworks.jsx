"use client";
import { useRef, useState, useEffect } from 'react';
import { Play, ArrowRight, CheckCircle } from 'lucide-react';

const STEPS = [
  { n:'01', title:'Create a Free Account', desc:'Sign up in 30 seconds. No credit card required.' },
  { n:'02', title:'Choose Your Exam',      desc:'IELTS, Cambridge, TOEFL, CEFR or SAT — pick the mock test you need.' },
  { n:'03', title:'Take a Mock Test',      desc:'Complete a full test or individual sections in a real exam environment.' },
  { n:'04', title:'Get AI Feedback',       desc:'Receive your strengths, weaknesses, band score and personalised tips.' },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="hiw-section" style={{
      padding: '100px 20px',
      background: '#fff',
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    }}>
      <style>{`
        @keyframes hiw-pulse {
          0%,100% { transform:translate(-50%,-50%) scale(1);   opacity:.5; }
          50%      { transform:translate(-50%,-50%) scale(1.18); opacity:.2; }
        }
        @keyframes hiw-float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
        @media(max-width:900px){
          .hiw-layout { grid-template-columns:1fr!important; gap:32px!important; }
          .hiw-video  { max-width:100%!important; margin:0 auto!important; animation:none!important; }
          .hiw-section { padding:60px 20px!important; }
        }
        @media(max-width:480px){
          .hiw-section { padding:48px 16px!important; }
        }
      `}</style>

      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* header */}
        <div style={{
          textAlign:'center', marginBottom:64,
          opacity: visible?1:0, transform: visible?'none':'translateY(20px)',
          transition:'all .6s cubic-bezier(.4,0,.2,1)',
        }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'#eff6ff',border:'1px solid rgba(0,123,255,0.2)',borderRadius:30,padding:'4px 14px',marginBottom:14 }}>
            <CheckCircle size={11} color="#2563eb"/>
            <span style={{ fontSize:11,fontWeight:800,color:'#007bff',letterSpacing:'1.5px' }}>HOW IT WORKS</span>
          </div>
          <h2 style={{ fontSize:36,fontWeight:900,color:'#0f172a',marginBottom:12,letterSpacing:'-0.5px' }}>
            Reach your goal in 4 simple steps
          </h2>
          <p style={{ fontSize:15,color:'#64748b',maxWidth:480,margin:'0 auto',lineHeight:1.7 }}>
            From sign-up to results — a simple and effective process.
          </p>
        </div>

        <div className="hiw-layout" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }}>

          {/* steps */}
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{
                display:'flex', alignItems:'flex-start', gap:18,
                opacity: visible?1:0,
                transform: visible?'none':'translateX(-20px)',
                transition:`all .5s cubic-bezier(.4,0,.2,1) ${i*100+200}ms`,
              }}>
                {/* number + line */}
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0 }}>
                  <div style={{
                    width:44,height:44,borderRadius:13,
                    background: i===0?'linear-gradient(135deg,#2563eb,#1d4ed8)':'#f8fafc',
                    border: i===0?'none':'1.5px solid #f1f5f9',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:13,fontWeight:900,
                    color: i===0?'#fff':'#94a3b8',
                    boxShadow: i===0?'0 8px 20px rgba(0,123,255,0.25)':'none',
                    transition:'all .3s',
                  }}>{s.n}</div>
                  {i < STEPS.length-1 && (
                    <div style={{ width:2,height:28,background:'linear-gradient(180deg,#e2e8f0,transparent)',margin:'6px 0' }}/>
                  )}
                </div>
                <div style={{ paddingTop:8 }}>
                  <div style={{ fontSize:15,fontWeight:800,color:'#0f172a',marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:13,color:'#64748b',lineHeight:1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}

            <div style={{
              marginTop:8,
              opacity: visible?1:0, transition:'all .5s .65s',
            }}>
              <a href="/tests" style={{
                display:'inline-flex',alignItems:'center',gap:8,
                padding:'13px 24px',
                background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color:'#fff',border:'none',borderRadius:13,
                fontSize:14,fontWeight:800,cursor:'pointer',
                boxShadow:'0 8px 24px rgba(0,123,255,0.28)',
                transition:'all .2s', textDecoration:'none',
              }}>
                Get Started <ArrowRight size={15}/>
              </a>
            </div>
          </div>

          {/* video mockup */}
          <div className="hiw-video" style={{
            position:'relative',
            opacity: visible?1:0, transform: visible?'none':'translateX(20px)',
            transition:'all .7s .15s cubic-bezier(.4,0,.2,1)',
            animation: visible?'hiw-float 4s ease-in-out infinite':'none',
          }}>
            {/* glow */}
            <div style={{ position:'absolute',top:'20%',left:'10%',width:'80%',height:'60%',background:'#007bff',filter:'blur(80px)',opacity:.15,zIndex:0,borderRadius:'50%' }}/>

            {/* browser frame */}
            <div style={{
              position:'relative',zIndex:1,
              background:'#fff',borderRadius:20,overflow:'hidden',
              boxShadow:'0 32px 80px rgba(0,123,255,0.18), 0 4px 16px rgba(0,0,0,0.08)',
              border:'1.5px solid #f1f5f9',
            }}>
              {/* browser bar */}
              <div style={{ padding:'12px 18px',background:'#f8fafc',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ display:'flex',gap:6 }}>
                  {['#ef4444','#f59e0b','#22c55e'].map(c=>(
                    <div key={c} style={{ width:10,height:10,borderRadius:'50%',background:c }}/>
                  ))}
                </div>
                <div style={{ flex:1,background:'#fff',borderRadius:8,padding:'5px 12px',fontSize:11,color:'#94a3b8',border:'1px solid #f1f5f9',textAlign:'center' }}>
                  exampulse.uz/tests
                </div>
              </div>

              {/* content area */}
              <div style={{ background:'linear-gradient(135deg,#1e3a6e,#1d4ed8,#7c3aed)',aspectRatio:'16/9',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden' }}>
                {/* pulse ring */}
                <div style={{ position:'absolute',top:'50%',left:'50%',width:130,height:130,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.4)',animation:'hiw-pulse 2.5s ease-in-out infinite' }}/>
                <div style={{ position:'absolute',top:'50%',left:'50%',width:170,height:170,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.2)',animation:'hiw-pulse 2.5s ease-in-out .4s infinite' }}/>

                {/* play button */}
                <div style={{ position:'relative',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',gap:16 }}>
                  <div style={{ width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.92)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 40px rgba(0,0,0,0.2)',cursor:'pointer' }}>
                    <Play size={28} fill="#2563eb" color="#2563eb" style={{ marginLeft:4 }}/>
                  </div>
                  <span style={{ color:'rgba(255,255,255,0.85)',fontSize:13,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase' }}>
                    See how it works
                  </span>
                </div>

                {/* floating badges */}
                <div style={{ position:'absolute',top:16,right:16,background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',borderRadius:10,padding:'6px 12px',fontSize:11,fontWeight:800,color:'#fff',border:'1px solid rgba(255,255,255,0.2)' }}>
                  🎓 IELTS Mock
                </div>
                <div style={{ position:'absolute',bottom:16,left:16,background:'rgba(5,150,105,0.85)',backdropFilter:'blur(8px)',borderRadius:10,padding:'6px 12px',fontSize:11,fontWeight:800,color:'#fff' }}>
                  ✅ Band 7.5 Achieved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

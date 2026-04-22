// components/AI/AITutor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Target, Zap, BarChart3, Clock, 
  CheckCircle2, TrendingUp, ChevronRight, BrainCircuit, 
  MessageSquare, ShieldCheck 
} from 'lucide-react';

// 1. RANGNI TEPADA E'LON QILAMIZ (Shunda styles uni ko'radi)
const BRAND_COLOR = '#3b82f6';

const AITutor = () => {
  const [conversation, setConversation] = useState([
    {
      type: 'ai',
      text: "## 🛰️ Neural Link Established\n\nWelcome back! I've synced your latest mock test results. Your **Reading** is excellent, but we should focus on **Writing Task 2 Cohesion** today. \n\nReady to start your personalized session?",
      timestamp: new Date(),
      id: 'init-msg'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [conversation]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    const userMsg = { type: 'user', text: userInput, timestamp: new Date(), id: Date.now() };
    setConversation(prev => [...prev, userMsg]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const history = conversation.slice(-10).map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${API}/api/ai/tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: currentInput, history, context: null })
      });
      const data = await res.json();
      const aiMsg = {
        type: 'ai',
        text: data.reply || 'Xatolik yuz berdi. Qayta urinib ko\'ring.',
        timestamp: new Date(),
        id: Date.now() + 1
      };
      setConversation(prev => [...prev, aiMsg]);
    } catch (err) {
      setConversation(prev => [...prev, {
        type: 'ai',
        text: 'Backend bilan ulanishda xatolik. Server ishlaётganini tekshiring.',
        timestamp: new Date(),
        id: Date.now() + 1
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.appContainer}>
        
        {/* LEFT: SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.brandBox}>
            <div style={styles.epIcon}><BrainCircuit size={22} color="white" /></div>
            <div>
              <h3 style={styles.brandName}>ExamPulse AI</h3>
              <span style={styles.brandTag}>Neural Mentor</span>
            </div>
          </div>

          <div style={styles.premiumStatCard}>
            <div style={styles.glassEffect} />
            <p style={styles.premiumLabel}>Current Progress</p>
            <div style={styles.statRow}>
               <div style={styles.glassScoreCircle}>
                  <span style={styles.scoreNum}>7.5</span>
               </div>
               <div style={styles.statInfo}>
                  <div style={styles.statValue}><TrendingUp size={14} /> +0.5 Band</div>
                  <div style={styles.statValue}><Target size={14} /> Goal: 8.5</div>
               </div>
            </div>
          </div>

          <nav style={styles.sideNav}>
            <p style={styles.sectionLabel}>Learning Tracks</p>
            {[
              { n: 'Grammar Precision', i: <Zap size={16}/>, c: BRAND_COLOR },
              { n: 'Vocabulary Labs', i: <Sparkles size={16}/>, c: '#8b5cf6' },
              { n: 'Mock Analysis', i: <BarChart3 size={16}/>, c: '#10b981' }
            ].map((item, idx) => (
              <div key={idx} style={styles.navItem}>
                <div style={{...styles.navIcon, color: item.c, backgroundColor: `${item.c}10` }}>{item.i}</div>
                <span style={styles.navText}>{item.n}</span>
                <ChevronRight size={14} color="#cbd5e1" />
              </div>
            ))}
          </nav>
        </aside>

        {/* RIGHT: CHAT */}
        <main style={styles.chatWindow}>
          <header style={styles.chatHeader}>
            <div style={styles.aiStatus}>
              <div style={styles.pulseDot} />
              <div>
                <h4 style={styles.aiName}>ExamPulse Intelligence</h4>
                <p style={styles.aiSub}>Online • Analyzing Data</p>
              </div>
            </div>
            <ShieldCheck size={20} color={BRAND_COLOR} />
          </header>

          <div style={styles.msgContainer}>
            {conversation.map((msg) => (
              <div key={msg.id} style={{
                ...styles.messageRow,
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  ...styles.bubble,
                  background: msg.type === 'user' ? BRAND_COLOR : 'rgba(255, 255, 255, 0.9)',
                  color: msg.type === 'user' ? '#ffffff' : '#1a1a1a',
                  backdropFilter: msg.type === 'ai' ? 'blur(10px)' : 'none',
                  border: msg.type === 'ai' ? '1px solid rgba(255, 255, 255, 0.5)' : 'none',
                  borderRadius: msg.type === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                  boxShadow: msg.type === 'ai' ? '0 10px 30px rgba(0,0,0,0.03)' : '0 15px 35px rgba(59,130,246,0.18)'
                }}>
                  <div style={styles.textContent}>
                    {msg.text.split('\n').map((line, i) => (
                      <div key={i}>
                        {line.startsWith('## ') ? <h3 style={styles.h2}>{line.replace('## ', '')}</h3> :
                         line.startsWith('• ') ? <div style={styles.li}>{line}</div> :
                         line}
                      </div>
                    ))}
                  </div>
                  {msg.type === 'ai' && (
                    <div style={styles.metaInfo}>
                      <CheckCircle2 size={10} color={BRAND_COLOR} />
                      Verified AI Mentor
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && <div style={styles.loader}>AI is formulating response...</div>}
            <div ref={messagesEndRef} />
          </div>

          <footer style={styles.footer}>
            <div style={styles.inputWrapper}>
              <MessageSquare size={18} color="#94a3b8" />
              <input 
                style={styles.input} 
                placeholder="Ask your IELTS mentor anything..." 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button style={{...styles.sendBtn, background: userInput.trim() ? BRAND_COLOR : '#cbd5e1'}} onClick={handleSendMessage}>
                <Send size={18} color="white" />
              </button>
            </div>
          </footer>
        </main>

      </div>
    </div>
  );
};

const styles = {
  page: { padding: '120px 0 40px 0', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  appContainer: { maxWidth: '1300px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '340px 1fr', gap: '30px', height: '82vh' },
  sidebar: { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(25px)', borderRadius: '40px', padding: '35px', border: '1px solid #fff', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' },
  brandBox: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' },
  epIcon: { width: '45px', height: '45px', background: BRAND_COLOR, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' },
  brandName: { fontSize: '20px', fontWeight: '900', color: '#1a1a1a', margin: 0 },
  brandTag: { fontSize: '11px', color: BRAND_COLOR, fontWeight: '800', textTransform: 'uppercase' },
  premiumStatCard: { position: 'relative', overflow: 'hidden', padding: '25px', borderRadius: '30px', background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)', border: '1px solid rgba(255, 255, 255, 0.8)', marginBottom: '30px' },
  glassEffect: { position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', pointerEvents: 'none' },
  premiumLabel: { fontSize: '10px', fontWeight: '900', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '15px', position: 'relative', zIndex: 2 },
  statRow: { display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 2 },
  glassScoreCircle: { width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
  scoreNum: { fontSize: '24px', fontWeight: '900', color: '#1a1a1a' },
  statInfo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  statValue: { fontSize: '12px', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' },
  sectionLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' },
  sideNav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '18px', background: '#fff', cursor: 'pointer', border: '1px solid #f1f5f9' },
  navIcon: { width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navText: { flex: 1, fontSize: '13px', fontWeight: '700', color: '#4b5563' },
  chatWindow: { background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(35px)', borderRadius: '45px', border: '1px solid #fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' },
  chatHeader: { padding: '25px 40px', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  aiStatus: { display: 'flex', alignItems: 'center', gap: '15px' },
  pulseDot: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px #10b981' },
  aiName: { fontSize: '17px', fontWeight: '800', margin: 0 },
  aiSub: { fontSize: '11px', color: BRAND_COLOR, fontWeight: '700' },
  msgContainer: { flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '30px' },
  messageRow: { display: 'flex' },
  bubble: { maxWidth: '72%', padding: '22px 28px' },
  textContent: { fontSize: '14px', lineHeight: '1.7' },
  h2: { fontSize: '18px', fontWeight: '900', color: BRAND_COLOR, marginBottom: '12px' },
  li: { marginBottom: '6px', paddingLeft: '12px', borderLeft: `2px solid ${BRAND_COLOR}` },
  metaInfo: { marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' },
  loader: { fontSize: '12px', color: '#94a3b8', paddingLeft: '40px', fontWeight: '700', fontStyle: 'italic' },
  footer: { padding: '30px 40px', background: '#fff' },
  inputWrapper: { display: 'flex', alignItems: 'center', gap: '15px', background: '#f8fafc', padding: '10px 12px 10px 20px', borderRadius: '24px', border: '1px solid #f1f5f9' },
  input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a' },
  sendBtn: { width: '50px', height: '50px', borderRadius: '18px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.4s' }
};

export default AITutor;
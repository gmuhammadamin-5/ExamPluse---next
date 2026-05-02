"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, Target, Zap, BarChart3, Clock,
  CheckCircle2, TrendingUp, ChevronRight, BrainCircuit,
  MessageSquare, ShieldCheck, Crown, Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BRAND_COLOR = '#3b82f6';

// ─── Paywall Screen ───────────────────────────────────────────────────────────
function ProWall({ isAuthenticated, openAuthModal }) {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f0f8ff,#e6f7ff)', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#f59e0b,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Crown size={32} color="#fff" />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>AI Tutor — Pro Feature</h2>
        <p style={{ fontSize: 15, color: '#64748b', margin: '0 0 32px', lineHeight: 1.7 }}>
          {isAuthenticated
            ? 'Get personalized AI coaching, instant feedback, and adaptive lesson plans. Upgrade to Pro to unlock.'
            : 'Sign up for free and upgrade to Pro to get AI-powered personalized IELTS coaching.'}
        </p>
        <div style={{ background: '#f8faff', borderRadius: 16, padding: '20px 24px', marginBottom: 28, textAlign: 'left' }}>
          {[
            'Personalized learning plan based on your results',
            'Unlimited AI chat sessions',
            'Writing & Speaking AI evaluation',
            'Progress tracking & band score prediction',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 3 ? 12 : 0 }}>
              <CheckCircle2 size={16} color={BRAND_COLOR} />
              <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{f}</span>
            </div>
          ))}
        </div>
        {isAuthenticated ? (
          <a href="/pricing" style={{ display: 'block', background: BRAND_COLOR, color: '#fff', borderRadius: 14, padding: '15px 0', fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
            Upgrade to Pro
          </a>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => openAuthModal('register')} style={{ background: BRAND_COLOR, color: '#fff', border: 'none', borderRadius: 14, padding: '15px 0', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
              Register Free
            </button>
            <button onClick={() => openAuthModal('login')} style={{ background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
              Already have an account? Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AITutor = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const isPro = user?.plan === 'pro' || user?.is_premium || user?.is_admin || false;

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
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [conversation]);

  if (!isAuthenticated || !isPro) {
    return <ProWall isAuthenticated={isAuthenticated} openAuthModal={openAuthModal} />;
  }

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
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API}/api/ai/tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: currentInput, history, context: null })
      });
      const data = await res.json();
      setConversation(prev => [...prev, {
        type: 'ai',
        text: data.reply || "Xatolik yuz berdi. Qayta urinib ko'ring.",
        timestamp: new Date(),
        id: Date.now() + 1
      }]);
    } catch {
      setConversation(prev => [...prev, {
        type: 'ai',
        text: 'Backend bilan ulanishda xatolik.',
        timestamp: new Date(),
        id: Date.now() + 1
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: isMobile ? '80px 0 20px' : '120px 0 40px', minHeight: '100vh', background: 'linear-gradient(135deg,#f0f8ff,#e6f7ff,#d6f0ff)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{
        maxWidth: 1300, margin: '0 auto', padding: isMobile ? '0 12px' : '0 40px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '340px 1fr',
        gap: 20,
        height: isMobile ? 'auto' : '82vh',
      }}>

        {/* SIDEBAR — hidden on mobile */}
        {!isMobile && (
          <aside style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(25px)', borderRadius: 40, padding: 35, border: '1px solid #fff', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 35 }}>
              <div style={{ width: 45, height: 45, background: BRAND_COLOR, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59,130,246,0.3)' }}>
                <BrainCircuit size={22} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>ExamPulse AI</h3>
                <span style={{ fontSize: 11, color: BRAND_COLOR, fontWeight: 800, textTransform: 'uppercase' }}>Neural Mentor</span>
              </div>
            </div>

            <div style={{ position: 'relative', overflow: 'hidden', padding: 25, borderRadius: 30, background: 'linear-gradient(135deg,rgba(186,230,253,0.6),rgba(255,255,255,0.4))', border: '1px solid rgba(255,255,255,0.8)', marginBottom: 30 }}>
              <p style={{ fontSize: 10, fontWeight: 900, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 15 }}>Current Progress</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a' }}>7.5</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} /> +0.5 Band</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}><Target size={14} /> Goal: 8.5</div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 }}>Learning Tracks</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { n: 'Grammar Precision', i: <Zap size={16}/>, c: BRAND_COLOR },
                { n: 'Vocabulary Labs', i: <Sparkles size={16}/>, c: '#8b5cf6' },
                { n: 'Mock Analysis', i: <BarChart3 size={16}/>, c: '#10b981' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', borderRadius: 18, background: '#fff', cursor: 'pointer', border: '1px solid #f1f5f9' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.c, backgroundColor: `${item.c}10` }}>{item.i}</div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#4b5563' }}>{item.n}</span>
                  <ChevronRight size={14} color="#cbd5e1" />
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* CHAT WINDOW */}
        <main style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(35px)', borderRadius: isMobile ? 24 : 45, border: '1px solid #fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.06)', height: isMobile ? '75vh' : 'auto' }}>
          <header style={{ padding: isMobile ? '16px 20px' : '25px 40px', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px #10b981' }} />
              <div>
                <h4 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, margin: 0 }}>ExamPulse Intelligence</h4>
                <p style={{ fontSize: 11, color: BRAND_COLOR, fontWeight: 700, margin: 0 }}>Online • Analyzing Data</p>
              </div>
            </div>
            <ShieldCheck size={20} color={BRAND_COLOR} />
          </header>

          <div style={{ flex: 1, padding: isMobile ? '20px 16px' : '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {conversation.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: isMobile ? '88%' : '72%',
                  padding: isMobile ? '14px 18px' : '22px 28px',
                  background: msg.type === 'user' ? BRAND_COLOR : 'rgba(255,255,255,0.9)',
                  color: msg.type === 'user' ? '#fff' : '#1a1a1a',
                  borderRadius: msg.type === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                  boxShadow: msg.type === 'ai' ? '0 10px 30px rgba(0,0,0,0.03)' : '0 15px 35px rgba(59,130,246,0.18)',
                }}>
                  <div style={{ fontSize: isMobile ? 13 : 14, lineHeight: 1.7 }}>
                    {msg.text.split('\n').map((line, i) => (
                      <div key={i}>
                        {line.startsWith('## ') ? <h3 style={{ fontSize: 16, fontWeight: 900, color: BRAND_COLOR, marginBottom: 10 }}>{line.replace('## ', '')}</h3> :
                         line.startsWith('• ') ? <div style={{ marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${BRAND_COLOR}` }}>{line}</div> :
                         line}
                      </div>
                    ))}
                  </div>
                  {msg.type === 'ai' && (
                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: 10, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={10} color={BRAND_COLOR} /> Verified AI Mentor
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, fontStyle: 'italic' }}>AI is formulating response...</div>}
            <div ref={messagesEndRef} />
          </div>

          <footer style={{ padding: isMobile ? '12px 16px' : '30px 40px', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: '8px 10px 8px 18px', borderRadius: 24, border: '1px solid #f1f5f9' }}>
              <MessageSquare size={18} color="#94a3b8" />
              <input
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit' }}
                placeholder="Ask your IELTS mentor anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                style={{ width: 46, height: 46, borderRadius: 16, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: userInput.trim() ? BRAND_COLOR : '#cbd5e1', transition: '0.3s', flexShrink: 0 }}
                onClick={handleSendMessage}
              >
                <Send size={18} color="white" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AITutor;

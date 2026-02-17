// components/Speaking/SpeakingEvaluator.jsx
import React, { useState, useRef, useEffect } from 'react';
// IMPORT QISMI TO'G'IRLANDI: BookOpen qo'shildi
import { 
  Mic, StopCircle, Play, ChevronRight, Zap, Target, 
  BarChart3, Activity, Clock, Trash2, BrainCircuit, 
  Volume2, CheckCircle2, MessageSquare, Info, ShieldCheck,
  BookOpen 
} from 'lucide-react';

const SpeakingEvaluator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isPlayingPrompt, setIsPlayingPrompt] = useState(false);

  const brandColor = '#3b82f6';
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  const speakingTopics = [
    { id: 1, title: "Describe a skill you learned", level: "Intermediate", prompts: ["What skill did you learn?", "How did you learn it?", "What were the challenges?"] },
    { id: 2, title: "Your favorite book", level: "Intermediate", prompts: ["What is the book called?", "What is the main message?", "Which character impressed you?"] },
    { id: 3, title: "Technology in education", level: "Advanced", prompts: ["Benefits of tech?", "Main challenges?", "Future developments?"] }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b) / data.length;
        setAudioLevel(avg / 255);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) { alert("Microphone access denied!"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
      setAudioLevel(0);
      clearInterval(timerRef.current);
      simulateEvaluation();
    }
  };

  const simulateEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setEvaluation({
        overall: 7.5,
        fluency: 7.0,
        pronunciation: 8.0,
        vocab: 7.5,
        grammar: 7.0,
        transcript: "I believe that technology has a profound impact on modern education systems globally..."
      });
      setIsEvaluating(false);
    }, 2500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <header style={styles.header}>
          <div style={styles.logoBox}><Mic size={22} color="white" /></div>
          <div>
            <h1 style={styles.title}>AI Speaking Coach</h1>
            <p style={styles.subtitle}>Real-time IELTS Fluency & Pronunciation Analysis</p>
          </div>
        </header>

        <div style={styles.mainLayout}>
          <section style={styles.sideCol}>
            <div style={styles.glassCard}>
              <p style={styles.sectionLabel}>Select Practice Topic</p>
              <div style={styles.topicList}>
                {speakingTopics.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTopic(t)}
                    style={{...styles.topicCard, border: selectedTopic?.id === t.id ? `2px solid ${brandColor}` : '1px solid #f1f5f9'}}
                  >
                    <div style={styles.topicInfo}>
                      <h4 style={styles.topicTitle}>{t.title}</h4>
                      <span style={{...styles.levelBadge, background: t.level === 'Advanced' ? '#dbeafe' : '#fef3c7', color: t.level === 'Advanced' ? '#1e40af' : '#92400e'}}>
                        {t.level}
                      </span>
                    </div>
                    <ChevronRight size={16} color="#cbd5e1" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <main style={styles.coachCol}>
            {!selectedTopic ? (
              <div style={styles.emptyCoach}>
                <BrainCircuit size={60} color="#cbd5e1" />
                <h2>Ready to speak?</h2>
                <p>Choose a topic on the left to activate the AI Coach.</p>
              </div>
            ) : (
              <div style={styles.activeCoach}>
                
                <div style={styles.promptBox}>
                  <div style={styles.promptHeader}>
                    <span style={styles.promptStep}>Question {currentPromptIndex + 1} of 3</span>
                    <button style={styles.volumeBtn}><Volume2 size={18} /></button>
                  </div>
                  <h2 style={styles.promptText}>{selectedTopic.prompts[currentPromptIndex]}</h2>
                </div>

                <div style={styles.recordZone}>
                  <div style={styles.timerDisplay}>{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</div>
                  
                  <div style={styles.visualizer}>
                    {[...Array(20)].map((_, i) => (
                      <div key={i} style={{
                        ...styles.waveBar,
                        height: isRecording ? `${20 + (audioLevel * 60 * Math.random())}px` : '4px',
                        backgroundColor: isRecording ? brandColor : '#e2e8f0',
                        transition: 'height 0.1s ease'
                      }} />
                    ))}
                  </div>

                  <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    style={{...styles.micBtn, background: isRecording ? '#ef4444' : brandColor}}
                  >
                    {isRecording ? <StopCircle size={32} color="white" /> : <Mic size={32} color="white" />}
                  </button>
                  <p style={styles.micStatus}>{isRecording ? 'Listening carefully...' : 'Tap to start speaking'}</p>
                </div>

                {evaluation && (
                  <div style={styles.resultFadeIn}>
                    <div style={styles.premiumScoreCard}>
                      <div style={styles.glassEffect} />
                      <div style={styles.scoreContent}>
                        <div style={styles.scoreCircle}>
                          <span style={styles.bigScore}>{evaluation.overall}</span>
                          <span style={styles.scoreMax}>/ 9.0</span>
                        </div>
                        <div style={styles.scoreInfo}>
                          <h3 style={styles.bandTitle}>Good Speaker</h3>
                          <p style={styles.bandDesc}>Effective communication with natural flow.</p>
                          <div style={styles.verifiedTag}><ShieldCheck size={12}/> AI Verified Assessment</div>
                        </div>
                      </div>
                    </div>

                    <div style={styles.metricsGrid}>
                      {[
                        { l: 'Fluency', s: evaluation.fluency, i: <Activity size={14}/> },
                        { l: 'Pronunciation', s: evaluation.pronunciation, i: <Volume2 size={14}/> },
                        { l: 'Vocabulary', s: evaluation.vocab, i: <BookOpen size={14}/> },
                        { l: 'Grammar', s: evaluation.grammar, i: <Zap size={14}/> },
                      ].map((m, idx) => (
                        <div key={idx} style={styles.metricCard}>
                          <div style={styles.metricHeader}>
                             <div style={styles.metricLabel}>{m.i} {m.l}</div>
                             <div style={styles.metricValue}>{m.s}</div>
                          </div>
                          <div style={styles.barContainer}><div style={{...styles.barFill, width: `${(m.s/9)*100}%`}} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '120px 0 60px', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  container: { maxWidth: '1300px', margin: '0 auto', padding: '0 30px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' },
  logoBox: { width: '50px', height: '50px', background: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' },
  title: { fontSize: '32px', fontWeight: '900', color: '#1a1a1a', margin: 0, letterSpacing: '-1px' },
  subtitle: { fontSize: '14px', color: '#64748b', fontWeight: '600' },
  mainLayout: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px', alignItems: 'start' },
  sideCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
  glassCard: { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: '25px', border: '1px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
  sectionLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' },
  topicList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  topicCard: { background: '#fff', padding: '15px 20px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s' },
  topicTitle: { fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 5px 0' },
  levelBadge: { fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '100px' },
  coachCol: { minHeight: '600px' },
  emptyCoach: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '15px' },
  activeCoach: { display: 'flex', flexDirection: 'column', gap: '30px' },
  promptBox: { background: '#fff', padding: '35px', borderRadius: '35px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' },
  promptHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  promptStep: { fontSize: '12px', fontWeight: '800', color: '#3b82f6' },
  promptText: { fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: 0, lineHeight: '1.4' },
  volumeBtn: { background: '#f8fafc', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' },
  recordZone: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px', background: 'rgba(255,255,255,0.4)', borderRadius: '40px', border: '1px solid #fff' },
  timerDisplay: { fontSize: '48px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-2px' },
  visualizer: { display: 'flex', alignItems: 'center', gap: '4px', height: '100px' },
  waveBar: { width: '6px', borderRadius: '10px' },
  micBtn: { width: '80px', height: '80px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)', transition: '0.3s' },
  micStatus: { fontSize: '13px', fontWeight: '700', color: '#64748b' },
  premiumScoreCard: { position: 'relative', overflow: 'hidden', padding: '40px', borderRadius: '40px', background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.5) 0%, rgba(255, 255, 255, 0.4) 100%)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255, 255, 255, 0.7)', marginBottom: '25px' },
  glassEffect: { position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', pointerEvents: 'none' },
  scoreContent: { position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '35px' },
  scoreCircle: { width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #fff' },
  bigScore: { fontSize: '42px', fontWeight: '900', lineHeight: 1 },
  scoreMax: { fontSize: '12px', fontWeight: '700', color: '#94a3b8' },
  bandTitle: { fontSize: '24px', fontWeight: '900', margin: '0 0 5px 0', color: '#1a1a1a' },
  bandDesc: { fontSize: '14px', color: '#475569', margin: 0 },
  verifiedTag: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '800', color: '#3b82f6', marginTop: '12px', textTransform: 'uppercase' },
  metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  metricCard: { background: '#fff', padding: '20px', borderRadius: '25px', border: '1px solid #f1f5f9' },
  metricHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  metricLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#64748b' },
  metricValue: { fontSize: '14px', fontWeight: '800', color: '#1a1a1a' },
  barContainer: { height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
  barFill: { height: '100%', background: '#3b82f6', borderRadius: '10px' },
  resultFadeIn: { animation: 'fadeIn 0.6s ease-out' }
};

export default SpeakingEvaluator;
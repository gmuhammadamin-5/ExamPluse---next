import React, { useState, useRef, useEffect } from 'react';
// CheckCircle2 va boshqa barcha kerakli ikonkalarni import qilamiz
import { 
  Mic, Square, Clock, ChevronRight, 
  RotateCcw, Send, User, Headset, CheckCircle2 
} from 'lucide-react';

const SpeakingElite = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);
  const [status, setStatus] = useState('idle'); // idle, prepping, recording, reviewing
  const [timeLeft, setTimeLeft] = useState(14 * 60); 
  const [taskTimer, setTaskTimer] = useState(0); 
  const [audioUrl, setAudioUrl] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const logoRef = useRef(null);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (testStarted && !isFinished) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        if (status === 'prepping' || status === 'recording') {
          setTaskTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, isFinished, status]);

  // Avtomatik Start Recording (Prep tugasa)
  useEffect(() => {
    if (status === 'prepping' && taskTimer === 0) {
      startRecording();
    }
  }, [taskTimer, status]);

  // --- AUDIO FUNCTIONS ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.current.start();
      setStatus('recording');
      // IELTS Standard: Part 2da 2 minut, qolganlarida 1 minut
      setTaskTimer(currentPart === 2 ? 120 : 60); 
    } catch (err) {
      alert("Mikrofonga ruxsat berilmadi!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) mediaRecorder.current.stop();
    setStatus('reviewing');
  };

  const startPrep = () => {
    setStatus('prepping');
    setTaskTimer(60); // Part 2 uchun 1 minut tayyorgarlik
  };

  const handleSend = () => {
    setAudioUrl(null);
    if (currentPart < 3) {
      setCurrentPart(currentPart + 1);
      setStatus('idle');
    } else {
      setIsFinished(true);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const speakingTasks = {
    1: { title: "Part 1: Personal Questions", text: "Let's talk about your hometown. What do you like most about your hometown?", tip: "Aim for 20-30 seconds." },
    2: { title: "Part 2: Cue Card", text: "Describe a job you would like to do in the future. You should say: What the job is, What qualifications you need, and explain why you would like to do it.", tip: "1 min prep | 2 min speak" },
    3: { title: "Part 3: Discussion", text: "What are the most popular jobs for young people in your country? Why is that?", tip: "Provide abstract and detailed answers." }
  };

  return (
    <div className="speaking-elite-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .speaking-elite-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; justify-content: center; align-items: center; padding: 20px;
        }

        .main-card {
          width: 100%; max-width: 1100px; height: 90vh;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px); border-radius: 35px;
          border: 2.5px solid #ffffff;
          box-shadow: 0 25px 60px rgba(0, 123, 255, 0.1);
          display: flex; flex-direction: column; overflow: hidden;
        }

        .ep-logo {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #00bfff 0%, #007bff 100%);
          color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-weight: 900; box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          cursor: pointer; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ep-logo:hover { transform: rotate(360deg) scale(1.1); }

        .layout { display: grid; grid-template-columns: 420px 1fr; flex: 1; overflow: hidden; }

        .examiner-pane {
          padding: 40px; background: white; border-right: 2px solid #f0f8ff;
          display: flex; flex-direction: column; color: #000;
        }

        .control-pane { padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fbfcfe; }

        .mic-btn {
          width: 110px; height: 110px; border-radius: 50%; border: none;
          background: ${status === 'recording' ? '#ef4444' : 'linear-gradient(135deg, #007bff, #00bfff)'};
          color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.4s; margin-bottom: 25px;
          box-shadow: 0 15px 35px ${status === 'recording' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 123, 255, 0.3)'};
        }

        .btn-luxury {
          background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
          color: white; border: none; padding: 15px 40px; border-radius: 12px;
          font-weight: 800; cursor: pointer; transition: 0.3s;
        }
        .btn-luxury:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 123, 255, 0.2); }

        .q-text { color: #000000; font-weight: 800; font-size: 20px; line-height: 1.5; }
      `}</style>

      <div className="main-card">
        {!testStarted ? (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <div className="ep-logo" style={{ width: 100, height: 100, fontSize: 40, margin: '0 auto 30px' }}>EP</div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#000', margin: 0 }}>ExamPluse</h1>
            <p style={{ color: '#64748b', fontSize: '20px', marginBottom: '40px' }}>Professional Speaking Assessment</p>
            <button className="btn-luxury" style={{ fontSize: '20px' }} onClick={() => setTestStarted(true)}>TAKE TEST</button>
          </div>
        ) : isFinished ? (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <CheckCircle2 size={80} color="#007bff" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#000' }}>Interview Completed</h2>
            <button className="btn-luxury" onClick={() => window.location.reload()}>TRY AGAIN</button>
          </div>
        ) : (
          <>
            <div style={{ padding: '20px 40px', background: 'white', borderBottom: '2px solid #f0f8ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div className="ep-logo" ref={logoRef} style={{ width: 45, height: 45, fontSize: 18 }}>EP</div>
                <h3 style={{ margin: 0, fontWeight: 800, color: '#000' }}>{speakingTasks[currentPart].title}</h3>
              </div>
              <div style={{ color: '#007bff', background: '#f0f9ff', padding: '10px 20px', borderRadius: '12px', fontWeight: 900 }}>
                <Clock size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> {formatTime(timeLeft)}
              </div>
            </div>

            <div className="layout">
              <div className="examiner-pane">
                <div style={{ background: '#f8fbff', padding: '25px', borderRadius: '25px', border: '2px solid #e0f2fe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                    <span style={{ fontWeight: 800, color: '#007bff', fontSize: '14px' }}>EXAMINER</span>
                  </div>
                  <p className="q-text">"{speakingTasks[currentPart].text}"</p>
                </div>
                <div style={{ marginTop: 'auto', padding: '20px', background: '#fff', borderRadius: '15px', border: '1.5px solid #f0f8ff' }}>
                   <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>IELTS TIP:</span>
                   <p style={{ margin: '5px 0 0 0', fontWeight: 700, fontSize: '14px', color: '#000' }}>{speakingTasks[currentPart].tip}</p>
                </div>
              </div>

              <div className="control-pane">
                {status === 'idle' && (
                  <div style={{ textAlign: 'center' }}>
                    {currentPart === 2 ? (
                      <button className="btn-luxury" onClick={startPrep}>START PREP (1 min)</button>
                    ) : (
                      <button className="mic-btn" onClick={startRecording}><Mic size={45} /></button>
                    )}
                    <p style={{ marginTop: 15, fontWeight: 700, color: '#64748b' }}>{currentPart === 2 ? 'Click to prepare' : 'Click to record'}</p>
                  </div>
                )}

                {status === 'prepping' && (
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ color: '#64748b' }}>PREPARATION TIME</h4>
                    <div style={{ fontSize: '72px', fontWeight: 900, color: '#007bff' }}>{taskTimer}s</div>
                  </div>
                )}

                {status === 'recording' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#ef4444', marginBottom: 20 }}>{formatTime(taskTimer)}</div>
                    <button className="mic-btn" onClick={stopRecording}><Square size={40} /></button>
                    <p style={{ fontWeight: 700, color: '#ef4444' }}>RECORDING...</p>
                  </div>
                )}

                {status === 'reviewing' && audioUrl && (
                  <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '25px', borderRadius: '25px', border: '2px solid #e0f2fe', textAlign: 'center' }}>
                    <Headset size={30} color="#007bff" style={{ marginBottom: 10 }} />
                    <h4 style={{ marginBottom: 20, fontWeight: 800 }}>REVIEW RESPONSE</h4>
                    <audio src={audioUrl} controls style={{ width: '100%', marginBottom: 20 }} />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#fff1f2', color: '#ef4444', border: 'none', fontWeight: 800, cursor: 'pointer' }} onClick={() => setStatus('idle')}>RETRY</button>
                      <button className="btn-luxury" style={{ flex: 1 }} onClick={handleSend}>SEND <ChevronRight size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpeakingElite;
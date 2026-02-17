import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronRight, ChevronLeft, Type, FileText, CheckCircle2, BarChart3, Image as ImageIcon } from 'lucide-react';

const WritingTestPro = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [activeTask, setActiveTask] = useState(0); // 0: Task 1, 1: Task 2
  const [answers, setAnswers] = useState({ task1: '', task2: '' });
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);

  // --- LOGO ROTATION ENGINE ---
  const logoRef = useRef(null);
  useEffect(() => {
    const logo = logoRef.current;
    if (logo) {
      let rotation = 0;
      const interval = setInterval(() => {
        if (rotation >= 360) rotation = 0;
        // Bu faqat statik holat uchun, hoverda CSS ishlaydi
      }, 100);
      return () => clearInterval(interval);
    }
  }, [testStarted]);

  // --- WORD COUNTER ---
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (testStarted && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) setIsFinished(true);
  }, [testStarted, isFinished, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const tasks = [
    {
      id: 1,
      type: "Academic Task 1",
      title: "Data Analysis",
      instruction: "Spend about 20 minutes. Write at least 150 words.",
      prompt: "The graph below shows the average carbon dioxide (CO2) emissions per person in four European countries from 1967 to 2007. Summarise the information by selecting and reporting the main features.",
      imageUrl: "https://www.ieltsbuddy.com/images/xco2_emissions_graph.png.pagespeed.ic.8uU_Y-8C-S.png" // Namuna rasm
    },
    {
      id: 2,
      type: "Academic Task 2",
      title: "Opinion Essay",
      instruction: "Spend about 40 minutes. Write at least 250 words.",
      prompt: "In many countries, very few young people read newspapers or watch TV news on a regular basis. What are the causes of this? What solutions can you suggest to encourage more young people to follow the news?"
    }
  ];

  return (
    <div className="elite-writing-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .elite-writing-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; justify-content: center; align-items: center; padding: 20px;
        }

        .main-card {
          width: 100%; max-width: 1100px; height: 90vh;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px); border-radius: 35px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 50px rgba(0, 123, 255, 0.1);
          display: flex; flex-direction: column; overflow: hidden;
        }

        .header {
          padding: 15px 40px; border-bottom: 2.5px solid #f0f8ff;
          display: flex; justify-content: space-between; align-items: center; background: white;
        }

        .ep-logo {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #00bfff 0%, #007bff 100%);
          color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 20px; box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          cursor: pointer; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ep-logo:hover { transform: rotate(360deg) scale(1.1); }

        .layout { display: grid; grid-template-columns: 1fr 1fr; flex: 1; overflow: hidden; }

        /* PROMPT SIDE */
        .prompt-pane {
          padding: 35px; overflow-y: auto; background: white; border-right: 2.5px solid #f0f8ff;
          color: #000000;
        }
        .instruction-tag { 
          background: #f0f8ff; color: #007bff; padding: 12px 20px; 
          border-radius: 12px; font-size: 13px; font-weight: 800; margin-bottom: 25px;
          border: 1px solid #e0f2fe;
        }
        .prompt-title { font-weight: 800; font-size: 22px; margin-bottom: 15px; color: #000; }
        .prompt-body { font-size: 17px; line-height: 1.8; font-weight: 700; color: #000; margin-bottom: 30px; }

        /* DIAGRAM AREA */
        .diagram-container {
          background: #fbfcfe; border: 2px dashed #e0f2fe; border-radius: 20px;
          padding: 20px; margin-top: 20px; text-align: center;
        }
        .diagram-img { max-width: 100%; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

        /* EDITOR SIDE */
        .editor-pane { padding: 35px; display: flex; flex-direction: column; background: #fbfcfe; }
        .editor-label { display: flex; alignItems: center; gap: 10px; margin-bottom: 15px; font-weight: 800; color: #64748b; font-size: 13px; letter-spacing: 0.5px; }

        .writing-area {
          flex: 1; width: 100%; padding: 25px; border: 2px solid #eef2f6;
          border-radius: 24px; font-size: 17px; font-family: 'Plus Jakarta Sans', sans-serif;
          resize: none; outline: none; transition: 0.3s; line-height: 1.7; color: #000;
          background: white; box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
        }
        .writing-area:focus { border-color: #007bff; box-shadow: 0 5px 25px rgba(0, 123, 255, 0.08); }

        .footer-tools {
          display: flex; justify-content: space-between; align-items: center; margin-top: 20px;
        }
        .word-badge {
          background: white; border: 2px solid #f0f8ff; padding: 10px 20px;
          border-radius: 12px; color: #007bff; font-weight: 800; font-size: 14px;
          display: flex; align-items: center; gap: 8px;
        }

        /* BUTTONS - LISTENING BILAN BIR XIL */
        .btn-action {
          background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
          color: white; border: none; padding: 12px 30px; border-radius: 12px;
          font-weight: 800; cursor: pointer; transition: 0.3s;
        }
        .btn-action:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 123, 255, 0.2); }
        .btn-action:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-outline {
          background: white; color: #007bff; border: 2px solid #007bff;
          padding: 10px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s;
        }
        .btn-outline:hover { background: #f0f8ff; }
      `}</style>

      <div className="main-card">
        {!testStarted ? (
          /* --- START PAGE (LISTENING BILAN 1:1) --- */
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <div className="ep-logo" style={{ width: 100, height: 100, fontSize: 40, margin: '0 auto 30px' }}>EP</div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#000', margin: 0 }}>ExamPluse</h1>
            <p style={{ color: '#64748b', fontSize: '20px', marginBottom: '40px' }}>Academic Writing • Task 1 & Task 2</p>
            <button className="btn-action" style={{ padding: '20px 60px', fontSize: '20px' }} onClick={() => setTestStarted(true)}>
              TAKE TEST
            </button>
          </div>
        ) : isFinished ? (
          /* --- RESULT PAGE --- */
          <div style={{ margin: 'auto', textAlign: 'center', padding: '40px' }}>
            <CheckCircle2 size={70} color="#007bff" style={{ margin: '0 auto 25px' }} />
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#000' }}>Writing Submitted</h2>
            <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '500px', margin: '0 auto 40px' }}>Your responses have been securely saved for examiner review. You will receive your results shortly.</p>
            
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                <div style={{ background: 'white', padding: '25px 40px', borderRadius: '20px', border: '2px solid #f0f8ff' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>TASK 1</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#000' }}>{countWords(answers.task1)} words</div>
                </div>
                <div style={{ background: 'white', padding: '25px 40px', borderRadius: '20px', border: '2px solid #f0f8ff' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>TASK 2</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#000' }}>{countWords(answers.task2)} words</div>
                </div>
            </div>
            <button className="btn-action" style={{ marginTop: '50px' }} onClick={() => window.location.reload()}>RETRY EXAM</button>
          </div>
        ) : (
          /* --- WRITING TEST INTERFACE --- */
          <>
            <div className="header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div className="ep-logo" ref={logoRef} style={{ width: 45, height: 45, fontSize: 18 }}>EP</div>
                <div>
                   <h3 style={{ margin: 0, fontWeight: 800, color: '#000' }}>{tasks[activeTask].type}</h3>
                   <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{tasks[activeTask].title}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 25, alignItems: 'center' }}>
                <div style={{ color: '#007bff', background: '#f0f8ff', padding: '10px 20px', borderRadius: '12px', fontWeight: 900 }}>
                  <Clock size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> {formatTime(timeLeft)}
                </div>
                <button className="btn-action" style={{ padding: '10px 30px' }} onClick={() => setIsFinished(true)}>FINISH</button>
              </div>
            </div>

            <div className="layout">
              {/* LEFT SIDE: PROMPT & DIAGRAMS */}
              <div className="prompt-pane">
                <div className="instruction-tag">
                    {tasks[activeTask].instruction}
                </div>
                <h2 className="prompt-title">Question Prompt</h2>
                <p className="prompt-body">{tasks[activeTask].prompt}</p>
                
                {activeTask === 0 && (
                  <div className="diagram-container">
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#007bff', fontWeight: 800, fontSize: '12px' }}>
                        <BarChart3 size={16} /> VISUAL DATA REFERENCE
                    </div>
                    {/* Bu yerda haqiqiy IELTS diagrammasi rasm bo'lib chiqadi */}
                    
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>*Click to enlarge diagram</p>
                  </div>
                )}

                {activeTask === 1 && (
                    <div style={{ marginTop: '40px', padding: '25px', background: '#f8fbff', borderRadius: '20px', border: '1.5px solid #e0f2fe' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800, color: '#007bff' }}>TIPS FOR TASK 2:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569', fontWeight: 600, lineHeight: 1.6 }}>
                            <li>State your opinion clearly in the introduction.</li>
                            <li>Use 4-5 paragraphs in total.</li>
                            <li>Support your points with relevant examples.</li>
                        </ul>
                    </div>
                )}
              </div>

              {/* RIGHT SIDE: PROFESSIONAL EDITOR */}
              <div className="editor-pane">
                <div className="editor-label">
                    <Type size={18} /> TYPE YOUR RESPONSE BELOW
                </div>
                
                <textarea 
                  className="writing-area"
                  placeholder="Start writing your response here..."
                  value={activeTask === 0 ? answers.task1 : answers.task2}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAnswers(prev => activeTask === 0 ? {...prev, task1: val} : {...prev, task2: val});
                  }}
                />

                <div className="footer-tools">
                    <div className="word-badge">
                        <FileText size={18} /> Words: {countWords(activeTask === 0 ? answers.task1 : answers.task2)}
                    </div>
                    
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn-outline" 
                                style={{ borderColor: activeTask === 0 ? '#e2e8f0' : '#007bff', color: activeTask === 0 ? '#94a3b8' : '#007bff' }} 
                                disabled={activeTask === 0} 
                                onClick={() => setActiveTask(0)}>
                            Task 1
                        </button>
                        <button className="btn-action" 
                                disabled={activeTask === 1} 
                                onClick={() => setActiveTask(1)}>
                            Task 2 <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WritingTestPro;
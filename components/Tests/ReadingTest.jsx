import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronRight, Highlighter, Eraser } from 'lucide-react';

const ReadingTest = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0); // 3 ta Passage
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); 
  const [activeColor, setActiveColor] = useState('#fef08a'); // Sariq default

  // --- HIGHLIGHTER ENGINE ---
  const applyHighlight = (color) => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = color;
    span.style.borderRadius = '4px';
    span.className = 'reading-marker';
    try {
      range.surroundContents(span);
    } catch (e) { console.warn("Selection overlap"); }
    selection.removeAllRanges();
  };

  const clearHighlights = () => {
    const markers = document.querySelectorAll('.reading-marker');
    markers.forEach(m => {
      const parent = m.parentNode;
      while(m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (testStarted && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) setIsFinished(true);
  }, [testStarted, isFinished, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // --- 40 QUESTIONS GENERATION ---
  const questions = Array.from({ length: 40 }, (_, i) => {
    const id = i + 1;
    const passageIdx = id <= 13 ? 0 : id <= 27 ? 1 : 2;
    let type = 'GAP_FILL';
    if (id > 13 && id <= 27) type = 'MCQ';
    else if (id > 27) type = 'TFN';
    return { id, passage: passageIdx, type, text: `Question ${id}: Complete the sentence below.`, options: type === 'MCQ' ? ['A. City', 'B. Village', 'C. Town'] : ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 'A' };
  });

  return (
    <div className="login-mirror-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        .login-mirror-body {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; justify-content: center; align-items: center; padding: 20px;
        }

        .main-card {
          width: 100%; max-width: 1100px; height: 90vh;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px); border-radius: 35px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 50px rgba(0, 123, 255, 0.1);
          display: flex; flex-direction: column; overflow: hidden;
        }

        .header {
          padding: 15px 40px; border-bottom: 2px solid rgba(0, 123, 255, 0.1);
          display: flex; justify-content: space-between; align-items: center; background: white;
        }

        /* EP LOGO - HOVERDA AYLANADI */
        .ep-logo {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #00bfff 0%, #007bff 100%);
          color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 20px; box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          cursor: pointer; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ep-logo:hover { transform: rotate(360deg) scale(1.1); }

        .layout { display: grid; grid-template-columns: 1fr 1fr; flex: 1; overflow: hidden; }

        .passage-pane {
          padding: 40px; overflow-y: auto; background: white; border-right: 2px solid #f0f8ff;
          color: #000000; font-size: 17px; line-height: 1.8;
        }
        .passage-pane h2 { font-weight: 800; font-size: 26px; margin: 10px 0 20px 0; color: #000; }

        .question-pane { padding: 40px; overflow-y: auto; background: #fbfcfe; }

        .toolbar {
          display: flex; gap: 12px; background: #f8fbff; padding: 10px 20px;
          border-radius: 50px; position: sticky; top: 0; z-index: 10; margin-bottom: 20px;
          border: 1.5px solid #e0f2fe; width: fit-content;
        }
        .dot { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
        .dot.active { border-color: #007bff; transform: scale(1.1); }

        .q-text { color: #000000; font-weight: 800; font-size: 17px; margin-bottom: 12px; }

        .option-item {
          width: 100%; text-align: left; padding: 14px 22px; border: 2px solid #eef2f6;
          border-radius: 14px; background: white; margin-top: 10px; cursor: pointer;
          font-weight: 700; color: #000000; transition: 0.3s;
        }
        .option-item:hover { border-color: #007bff; background: #f0f8ff; }
        .option-item.active { background: #e0f2fe; border-color: #007bff; }

        .btn-action {
          background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
          color: white; border: none; padding: 12px 35px; border-radius: 12px;
          font-weight: 800; cursor: pointer; transition: 0.3s;
        }
        .btn-action:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 123, 255, 0.2); }

        .nav-square {
          width: 35px; height: 35px; border-radius: 8px; border: 1.5px solid #eef2f6;
          display: flex; align-items: center; justify-content: center; font-size: 12px;
          cursor: pointer; font-weight: 800; background: white; color: #64748b;
        }
        .nav-square.done { background: #007bff; color: white; border-color: #007bff; }
      `}</style>

      <div className="main-card">
        {!testStarted ? (
          /* START SCREEN - LISTENING BILAN 1:1 */
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <div className="ep-logo" style={{ width: 100, height: 100, fontSize: 40, margin: '0 auto 30px' }}>EP</div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#000', margin: 0 }}>ExamPluse</h1>
            <p style={{ color: '#64748b', fontSize: '20px', marginBottom: '40px' }}>Professional Reading Assessment</p>
            <button className="btn-action" style={{ padding: '20px 60px', fontSize: '20px' }} onClick={() => setTestStarted(true)}>
              TAKE TEST
            </button>
          </div>
        ) : isFinished ? (
          /* RESULT SCREEN */
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#000' }}>Results Analysis</h2>
            <div style={{ position: 'relative', width: '220px', height: '220px', margin: '30px auto' }}>
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f8ff" strokeWidth="12" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#007bff" strokeWidth="12" strokeDasharray="565" strokeDashoffset="150" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#64748b' }}>BAND</span>
                <div style={{ fontSize: '64px', fontWeight: 900, color: '#000' }}>7.5</div>
              </div>
            </div>
            <button className="btn-action" onClick={() => window.location.reload()}>RETRY EXAM</button>
          </div>
        ) : (
          <>
            <div className="header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div className="ep-logo" style={{ width: 45, height: 45, fontSize: 18 }}>EP</div>
                <div>
                   <h3 style={{ margin: 0, fontWeight: 800, color: '#000', lineHeight: 1 }}>Passage {currentSection + 1}</h3>
                   <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Academic Reading</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ color: '#007bff', background: '#f0f8ff', padding: '10px 20px', borderRadius: '12px', fontWeight: 900 }}>
                  <Clock size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> {formatTime(timeLeft)}
                </div>
                <button className="btn-action" style={{ padding: '10px 25px' }} onClick={() => setIsFinished(true)}>FINISH</button>
              </div>
            </div>

            <div className="layout">
              <div className="passage-pane" onMouseUp={() => applyHighlight(activeColor)}>
                <div className="toolbar">
                  <div className={`dot ${activeColor === '#fef08a' ? 'active' : ''}`} style={{ background: '#fef08a' }} onClick={() => setActiveColor('#fef08a')}></div>
                  <div className={`dot ${activeColor === '#bbf7d0' ? 'active' : ''}`} style={{ background: '#bbf7d0' }} onClick={() => setActiveColor('#bbf7d0')}></div>
                  <div className={`dot ${activeColor === '#fecaca' ? 'active' : ''}`} style={{ background: '#fecaca' }} onClick={() => setActiveColor('#fecaca')}></div>
                  <div style={{ width: 1, height: 20, background: '#e0f2fe', margin: '0 5px' }}></div>
                  <Eraser size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={clearHighlights} />
                </div>
                <h2>The Impact of Urban Green Spaces</h2>
                <p>Recent studies in environmental science have highlighted the critical role that urban green spaces play in enhancing the quality of life for city dwellers. These areas, ranging from large public parks to small community gardens, provide essential ecosystem services...</p>
                <p>One of the primary benefits is the mitigation of the "urban heat island" effect. Concrete and asphalt absorb and re-emit the sun's heat more than natural landscapes. Trees and plants provide shade and release moisture through evapotranspiration, which can significantly lower city temperatures.</p>
              </div>

              <div className="question-pane">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, marginBottom: 30 }}>
                  {questions.map(q => (
                    <div key={q.id} className={`nav-square ${answers[q.id] ? 'done' : ''}`}>{q.id}</div>
                  ))}
                </div>

                {questions.filter(q => q.passage === currentSection).map(q => (
                  <div key={q.id} style={{ marginBottom: 35 }}>
                    <p className="q-text">{q.id}. {q.text}</p>
                    {q.type === 'GAP_FILL' ? (
                      <div style={{ background: 'linear-gradient(135deg, #f0f8ff 0%, #d6f0ff 100%)', padding: 2, borderRadius: 12 }}>
                        <input className="option-item" style={{ border: 'none', margin: 0, width: '100%' }} placeholder="Type your answer..." value={answers[q.id] || ''} onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} />
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: 8 }}>
                        {q.options.map(opt => (
                          <button key={opt} className={`option-item ${answers[q.id] === opt.split('.')[0] ? 'active' : ''}`} onClick={() => setAnswers({...answers, [q.id]: opt.split('.')[0]})}>{opt}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
                  <button className="option-item" style={{ width: 'auto', border: '2px solid #007bff', color: '#007bff' }} disabled={currentSection === 0} onClick={() => setCurrentSection(s => s - 1)}>PREVIOUS</button>
                  <button className="btn-action" disabled={currentSection === 2} onClick={() => setCurrentSection(s => s + 1)}>NEXT PASSAGE</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReadingTest;
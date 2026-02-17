import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronRight, ChevronLeft, Headphones, CheckCircle2 } from 'lucide-react';

const ListeningTest = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);

  // Band Score Mapping
  const getBandScore = (correct) => {
    if (correct >= 39) return 9.0; if (correct >= 30) return 7.0;
    if (correct >= 23) return 6.0; if (correct >= 15) return 5.0;
    return 4.0;
  };

  const questions = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    type: i < 20 ? 'INPUT' : (i < 30 ? 'MCQ' : 'TFN'),
    text: i < 20 ? `Write the missing word: The speaker works as a ________.` : `Choose the correct option:`,
    options: i < 30 ? ['A. Teacher', 'B. Doctor', 'C. Engineer'] : ['TRUE', 'FALSE', 'NOT GIVEN'],
    correct: 'A'
  }));

  const calculateResult = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id]?.toString().trim().toLowerCase() === q.correct.toLowerCase()) score++;
    });
    return { score, band: getBandScore(score) };
  };

  useEffect(() => {
    if (testStarted && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) setIsFinished(true);
  }, [testStarted, isFinished, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const results = isFinished ? calculateResult() : null;

  return (
    <div className="login-mirror-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        /* LOGIN GRADIENT BACKROUND */
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

        /* EP LOGO - Luxury Hover */
        .ep-logo {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #00bfff 0%, #007bff 100%);
          color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 20px; box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ep-logo:hover { transform: scale(1.1) rotate(180deg); }

        .header {
          padding: 20px 40px; border-bottom: 2px solid rgba(0, 123, 255, 0.1);
          display: flex; justify-content: space-between; align-items: center; background: white;
        }

        /* SAVOL MATNLARI - QOP-QORA */
        .q-text { color: #000000; font-weight: 800; font-size: 17px; margin-bottom: 12px; }

        /* OPTIONLAR - LOGIN RANGIDAGI HOVER VA SELECTED */
        .option-item {
          width: 100%; text-align: left; padding: 15px 25px; margin-top: 10px;
          border: 2px solid #eef2f6; border-radius: 14px; background: white;
          cursor: pointer; transition: 0.3s; font-weight: 700; color: #000000;
        }
        .option-item:hover { border-color: #007bff; background: #f0f8ff; }
        
        /* LOGINDAGI OCH KO'K RANG (ABS BOSGANDA) */
        .option-item.active {
          background: #e0f2fe; border-color: #007bff; color: #000000;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
        }

        /* INPUT STYLE */
        .input-wrap {
          background: linear-gradient(135deg, #f0f8ff 0%, #d6f0ff 100%);
          padding: 2px; border-radius: 12px; margin-top: 10px; transition: 0.3s;
        }
        .input-wrap:focus-within { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2); }
        .input-field {
          width: 100%; padding: 14px; border: none; border-radius: 10px; 
          background: white; outline: none; font-weight: 700; color: #000;
        }

        /* NAVIGATION TUGMALARI */
        .btn-action {
          background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
          color: white; border: none; padding: 14px 30px; border-radius: 12px;
          font-weight: 800; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px;
        }
        .btn-action:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3); }

        .btn-outline {
          background: white; color: #007bff; border: 2.5px solid #007bff;
          padding: 12px 25px; border-radius: 12px; font-weight: 800; cursor: pointer;
        }

        .nav-square {
          width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #eef2f6;
          display: flex; align-items: center; justify-content: center; font-size: 13px;
          cursor: pointer; font-weight: 800; transition: 0.2s; background: white; color: #64748b;
        }
        .nav-square.done { background: #007bff; color: white; border-color: #007bff; }
      `}</style>

      <div className="main-card">
        {!testStarted ? (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <div className="ep-logo" style={{ width: 100, height: 100, fontSize: 40, margin: '0 auto 30px' }}>EP</div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#000', margin: 0 }}>ExamPluse</h1>
            <p style={{ color: '#64748b', fontSize: '20px', marginBottom: '40px' }}>Professional IELTS Assessment</p>
            <button className="btn-action" style={{ padding: '20px 60px', fontSize: '20px', margin: '0 auto' }} onClick={() => setTestStarted(true)}>
              TAKE TEST
            </button>
          </div>
        ) : isFinished ? (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#000' }}>Results Analysis</h2>
            <div style={{ position: 'relative', width: '220px', height: '220px', margin: '30px auto' }}>
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f8ff" strokeWidth="12" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#007bff" strokeWidth="12" 
                  strokeDasharray="565" strokeDashoffset={565 - (565 * results.score) / 40}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: '1.5s ease-out' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#64748b' }}>BAND</span>
                <div style={{ fontSize: '64px', fontWeight: 900, color: '#000' }}>{results.band.toFixed(1)}</div>
              </div>
            </div>
            <button className="btn-action" style={{ margin: '0 auto' }} onClick={() => window.location.reload()}>RETRY EXAM</button>
          </div>
        ) : (
          <>
            <div className="header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div className="ep-logo" style={{ width: 45, height: 45, fontSize: 18 }}>EP</div>
                <h3 style={{ margin: 0, fontWeight: 800, color: '#000' }}>IELTS Mock Section {currentSection + 1}</h3>
              </div>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ color: '#007bff', background: '#f0f8ff', padding: '10px 20px', borderRadius: '12px', fontWeight: 900, display: 'flex', gap: 8 }}>
                  <Clock size={20} /> {formatTime(timeLeft)}
                </div>
                <button className="btn-action" style={{ padding: '10px 25px' }} onClick={() => setIsFinished(true)}>FINISH</button>
              </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '330px', background: '#f8fbff', borderRight: '2px solid #f0f8ff', padding: '30px', overflowY: 'auto' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '2px solid #f0f8ff', marginBottom: '25px' }}>
                  <Headphones size={24} color="#007bff" style={{ marginBottom: '10px' }} />
                  <audio controls style={{ width: '100%' }} src="https://www.soundhelix.com/examples/mp3-examples/SoundHelix-Song-1.mp3" />
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 900, color: '#64748b', marginBottom: '15px' }}>NAVIGATOR</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {questions.map(q => (
                    <div key={q.id} className={`nav-square ${answers[q.id] ? 'done' : ''}`} onClick={() => document.getElementById(`q-${q.id}`).scrollIntoView({ behavior: 'smooth' })}>{q.id}</div>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, padding: '45px', overflowY: 'auto', background: 'white' }}>
                {questions.slice(currentSection * 10, (currentSection + 1) * 10).map((q) => (
                  <div key={q.id} id={`q-${q.id}`} style={{ marginBottom: '45px', animation: 'slideIn 0.5s ease' }}>
                    <p className="q-text">{q.id}. {q.text}</p>
                    
                    {q.type === 'GAP_FILL' ? (
                      <div className="input-wrap">
                        <input className="input-field" placeholder="Type answer..." value={answers[q.id] || ''} onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} />
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {q.options.map(opt => (
                          <button 
                            key={opt} 
                            className={`option-item ${answers[q.id] === opt.split('.')[0] ? 'active' : ''}`}
                            onClick={() => setAnswers({...answers, [q.id]: opt.split('.')[0]})}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '15px', marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #f0f8ff' }}>
                  <button className="btn-outline" disabled={currentSection === 0} onClick={() => setCurrentSection(s => s - 1)}>PREVIOUS</button>
                  <button className="btn-action" disabled={currentSection === 3} onClick={() => setCurrentSection(s => s + 1)}>
                    NEXT SECTION <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListeningTest;
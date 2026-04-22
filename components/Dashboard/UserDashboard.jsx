"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp, Target, Clock, BookOpen,
  Mic, PenTool, Headphones, ChevronRight,
  Award, Calendar, User, Zap, CheckCircle2,
  BarChart3, Info, Bell, LogOut, ArrowUpRight,
  Activity, Sparkles, ListTodo, CheckCircle, Circle,
  History, TrendingDown, BrainCircuit
} from 'lucide-react';
import { dashboardApi, resultsApi } from '../../app/lib/api';
import { useAuth } from '../../contexts/AuthContext';

const ExamPluseEliteFinal = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDay, setActiveDay] = useState('Mon');
  const [completedTasks, setCompletedTasks] = useState([1]);
  const [stats, setStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const logoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, r] = await Promise.all([dashboardApi.stats(), resultsApi.list({ limit: 6 })]);
        setStats(s);
        setRecentResults(r);
      } catch { /* backend offline — show empty state */ }
      finally { setLoadingStats(false); }
    };
    fetchData();
  }, []);

  const userData = {
    name: user?.full_name || user?.email?.split('@')[0] || "Student",
    id: `EP-${user?.id || '0000'}`,
    targetScore: 8.5,
    currentAverage: stats ? (stats.average_score / 11.1).toFixed(1) : '—',
    daysLeft: 30,
  };

  const resultsData = recentResults.length > 0
    ? recentResults.map((r, i) => ({
        id: i + 1,
        date: new Date(r.created_at || r.date || Date.now()).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
        module: r.section?.charAt(0).toUpperCase() + r.section?.slice(1) || 'Test',
        raw: r.score ? `${r.score}/100` : 'N/A',
        band: r.band_score || (r.score / 11.1).toFixed(1),
        status: r.score >= 75 ? 'Improvement' : r.score >= 55 ? 'Stable' : 'Needs Focus',
      }))
    : [
        { id: 1, date: '—', module: 'Listening', raw: '—', band: '—', status: 'No data' },
        { id: 2, date: '—', module: 'Reading',   raw: '—', band: '—', status: 'No data' },
        { id: 3, date: '—', module: 'Writing',   raw: '—', band: '—', status: 'No data' },
        { id: 4, date: '—', module: 'Speaking',  raw: '—', band: '—', status: 'No data' },
      ];

  const aiInsights = [
    { label: 'Grammatical Range', score: 72, color: '#007bff', feedback: 'Focus on complex structures.' },
    { label: 'Lexical Resource', score: 85, color: '#10b981', feedback: 'Great use of academic collocations.' },
    { label: 'Fluency & Coherence', score: 68, color: '#f59e0b', feedback: 'Reduce hesitation in Part 2.' },
    { label: 'Pronunciation', score: 90, color: '#8b5cf6', feedback: 'Native-like intonation detected.' },
  ];

  const weeklyStudyData = {
    Mon: { tasks: [{id: 'm1', task: 'Listening: Section 1 & 2 Strategy', duration: '40 min', module: 'Listening'}, {id: 'm2', task: 'Reading: Skimming Techniques', duration: '45 min', module: 'Reading'}] },
    Tue: { tasks: [{id: 't1', task: 'Writing: Task 1 Line Graph', duration: '60 min', module: 'Writing'}, {id: 't2', task: 'Speaking: Part 1 Fluency', duration: '30 min', module: 'Speaking'}] },
    Wed: { tasks: [{id: 'w1', task: 'Reading: Full Test Passage 1-3', duration: '60 min', module: 'Reading'}, {id: 'w2', task: 'Listening: Section 3 Discussions', duration: '30 min', module: 'Listening'}] },
    Thu: { tasks: [{id: 'th1', task: 'Writing: Task 2 Essay Planning', duration: '45 min', module: 'Writing'}, {id: 'th2', task: 'Vocabulary: Band 8.0 Idioms', duration: '40 min', module: 'Vocab'}] },
    Fri: { tasks: [{id: 'f1', task: 'Speaking: Cue Card Simulation', duration: '45 min', module: 'Speaking'}, {id: 'f2', task: 'Review: Error Analysis', duration: '60 min', module: 'Review'}] },
    Sat: { tasks: [{id: 's1', task: 'FULL MOCK TEST SIMULATION', duration: '3 hours', module: 'MOCK'}] },
    Sun: { tasks: [{id: 'su1', task: 'News Reading (BBC English)', duration: '30 min', module: 'Reading'}, {id: 'su2', task: 'Next Week Planning', duration: '20 min', module: 'Planning'}] }
  };

  return (
    <div className="elite-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        
        .elite-root { min-height: 100vh; background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%); font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; color: #000; }
        
        .master-card { width: 100%; max-width: 1200px; height: 92vh; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(35px); border-radius: 45px; border: 1px solid #fff; box-shadow: 0 40px 100px -20px rgba(0, 123, 255, 0.12); display: flex; flex-direction: column; overflow: hidden; }
        
        .header { padding: 20px 45px; border-bottom: 2px solid #f0f8ff; display: flex; justify-content: space-between; align-items: center; background: white; z-index: 10; }
        
        .ep-logo-elite { width: 55px; height: 55px; background: linear-gradient(135deg, #00bfff 0%, #007bff 100%); color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; cursor: pointer; transition: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .ep-logo-elite:hover { transform: rotate(360deg) scale(1.1); }
        
        .layout { display: grid; grid-template-columns: 280px 1fr; flex: 1; overflow: hidden; }
        
        .sidebar { background: #fbfcfe; border-right: 2px solid #f0f8ff; padding: 40px 25px; display: flex; flex-direction: column; gap: 8px; }
        
        .nav-btn { display: flex; align-items: center; gap: 14px; padding: 16px 22px; border-radius: 18px; color: #64748b; font-weight: 800; cursor: pointer; transition: 0.4s; }
        .nav-btn:hover { background: #f0f8ff; color: #007bff; }
        .nav-btn.active { background: white; color: #007bff; box-shadow: 0 10px 25px rgba(0, 123, 255, 0.06); border: 1.5px solid #f0f8ff; }

        /* SCROLLNI TO'G'IRLASH: Pastda 120px bo'sh joy qoldirildi */
        .content-scroll { 
          padding: 45px 45px 120px 45px; 
          overflow-y: auto; 
          background: white; 
          scroll-behavior: smooth;
        }

        /* Scrollbar dizayni (Akkuratniy bo'lishi uchun) */
        .content-scroll::-webkit-scrollbar { width: 6px; }
        .content-scroll::-webkit-scrollbar-track { background: transparent; }
        .content-scroll::-webkit-scrollbar-thumb { background: #e0f2fe; border-radius: 10px; }
        .content-scroll::-webkit-scrollbar-thumb:hover { background: #007bff; }

        .glass-card { background: #ffffff; border: 2.5px solid #f0f8ff; border-radius: 35px; padding: 30px; margin-bottom: 25px; transition: 0.4s; }
        
        .blue-gradient-card { background: linear-gradient(135deg, #00bfff 0%, #007bff 100%); border-radius: 35px; padding: 30px; color: white; text-align: center; box-shadow: 0 15px 35px rgba(0, 123, 255, 0.2); }
        
        .day-tab { flex: 1; padding: 15px 5px; text-align: center; border-radius: 15px; cursor: pointer; font-weight: 800; background: #f8fbff; border: 1.5px solid #f0f8ff; color: #64748b; transition: 0.3s; }
        .day-tab.active { background: linear-gradient(135deg, #00bfff 0%, #007bff 100%); color: white; border-color: transparent; }
        
        .res-table { width: 100%; border-collapse: collapse; }
        .res-table th { text-align: left; padding: 15px 20px; color: #64748b; font-size: 12px; border-bottom: 2px solid #f0f8ff; }
        .res-table td { padding: 22px 20px; font-weight: 800; border-bottom: 1.5px solid #f8fbff; }
        
        .progress-bar { height: 8px; background: #f0f8ff; border-radius: 10px; overflow: hidden; margin-top: 10px; }
        .progress-fill { height: 100%; border-radius: 10px; transition: 1.5s cubic-bezier(0.1, 0, 0.2, 1); }
      `}</style>

      <div className="master-card">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div className="ep-logo-elite">EP</div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: 24 }}>ExamPluse</h2>
              <span style={{ color: '#64748b', fontWeight: 800, fontSize: 11, letterSpacing: '1px' }}>ELITE CANDIDATE PORTAL</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
            <div style={{ background: '#f8fbff', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
              <span style={{ fontWeight: 900, fontSize: 14, color: '#ef4444' }}>{userData.daysLeft} DAYS UNTIL EXAM</span>
            </div>
            <div style={{ width: 45, height: 45, borderRadius: 14, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={22} color="#007bff" />
            </div>
          </div>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <div className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><TrendingUp size={20}/> Dashboard</div>
            <div className={`nav-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}><Award size={20}/> Performance</div>
            <div className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}><Calendar size={20}/> Study Plan</div>
            <div className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}><Sparkles size={20}/> AI Analytics</div>
            <div style={{ marginTop: 'auto', color: '#ef4444', padding: '15px 22px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: 12 }}>
              <LogOut size={20}/> Sign Out
            </div>
          </aside>

          <main className="content-scroll">
            {activeTab === 'dashboard' && (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 35 }}>Performance Overview</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 25 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
                    {resultsData.map(r => (
                      <div key={r.module} className="glass-card" style={{ margin: 0, padding: 25 }}>
                        <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', marginBottom: 10 }}>{r.module.toUpperCase()}</div>
                        <div style={{ fontSize: 32, fontWeight: 900 }}>{r.band.toFixed(1)}</div>
                        <div style={{ fontSize: 12, color: '#10b981', fontWeight: 700, marginTop: 5 }}>{r.status}</div>
                      </div>
                    ))}
                  </div>
                  <div className="blue-gradient-card">
                    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
                        <svg viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                           <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                           <circle cx="70" cy="70" r="62" fill="none" stroke="white" strokeWidth="10" strokeDasharray="390" strokeDashoffset="100" strokeLinecap="round" />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div style={{ fontSize: 10, fontWeight: 800 }}>BAND</div>
                            <div style={{ fontSize: 40, fontWeight: 900 }}>7.5</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 25 }}>
                        <h3 style={{ margin: 0, fontSize: 20 }}>Target Score: {userData.targetScore}</h3>
                        <p style={{ fontSize: 12, opacity: 0.8, marginTop: 5 }}>Top 5% Global Candidate</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 30 }}>Detailed Performance</h1>
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table className="res-table">
                    <thead style={{ background: '#f8fbff' }}>
                      <tr>
                        <th>DATE</th>
                        <th>MODULE</th>
                        <th>RAW SCORE</th>
                        <th>BAND</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsData.map(res => (
                        <tr key={res.id}>
                          <td style={{ color: '#64748b' }}>{res.date}</td>
                          <td>{res.module} Practice</td>
                          <td>{res.raw}</td>
                          <td><span style={{ padding: '8px 16px', borderRadius: '10px', background: '#e0f2fe', color: '#007bff' }}>{res.band.toFixed(1)}</span></td>
                          <td><span style={{ color: res.status === 'Needs Focus' ? '#ef4444' : '#10b981' }}>{res.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 30 }}>Weekly Study Plan</h1>
                <div className="glass-card" style={{ padding: 20, display: 'flex', gap: 10, marginBottom: 25 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className={`day-tab ${activeDay === day ? 'active' : ''}`} onClick={() => setActiveDay(day)}>{day}</div>
                  ))}
                </div>
                <div className="glass-card">
                  <h3 style={{ fontWeight: 800, marginBottom: 25 }}>Tasks for {activeDay}day</h3>
                  {weeklyStudyData[activeDay].tasks.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderRadius: '20px', border: '2px solid #f8fbff', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                         <Circle size={22} color="#007bff" />
                         <div>
                            <div style={{ fontWeight: 800 }}>{item.task}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{item.duration} • {item.module}</div>
                         </div>
                      </div>
                      <ChevronRight size={18} color="#cbd5e1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 30 }}>AI Smart Insights</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                  {aiInsights.map((skill, i) => (
                    <div key={i} className="glass-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800 }}>{skill.label}</span>
                        <span style={{ fontWeight: 900, color: skill.color }}>{skill.score}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${skill.score}%`, background: skill.color }}></div>
                      </div>
                      <p style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 15 }}>
                        <Zap size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} /> {skill.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCROLL SPACER - Bu pastda qo'shimcha joy yaratadi */}
            <div style={{ height: '50px' }}></div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExamPluseEliteFinal;
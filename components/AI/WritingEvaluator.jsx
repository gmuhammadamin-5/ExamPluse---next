import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Zap, ChevronRight, BarChart3, Search, 
    Clock, BookOpen, Layers, CheckCircle2, 
    AlertTriangle, X, RefreshCw, Home, ArrowLeft, Sparkles
} from 'lucide-react'

// --- 1. ULTRA-PREMIUM KEYBOARD (FROSTED GLASS EFFECT) ---
const VirtualKeyboard = ({ activeKeys }) => {
    const rows = [
        [
            { l: 'q', c: 'KeyQ' }, { l: 'w', c: 'KeyW' }, { l: 'e', c: 'KeyE' }, { l: 'r', c: 'KeyR' }, { l: 't', c: 'KeyT' }, { l: 'y', c: 'KeyY' }, { l: 'u', c: 'KeyU' }, { l: 'i', c: 'KeyI' }, { l: 'o', c: 'KeyO' }, { l: 'p', c: 'KeyP' }, { l: '⌫', c: 'Backspace', w: 1.5 }
        ],
        [
            { l: 'a', c: 'KeyA' }, { l: 's', c: 'KeyS' }, { l: 'd', c: 'KeyD' }, { l: 'f', c: 'KeyF' }, { l: 'g', c: 'KeyG' }, { l: 'h', c: 'KeyH' }, { l: 'j', c: 'KeyJ' }, { l: 'k', c: 'KeyK' }, { l: 'l', c: 'KeyL' }, { l: 'Enter', c: 'Enter', w: 1.8 }
        ],
        [
            { l: 'z', c: 'KeyZ' }, { l: 'x', c: 'KeyX' }, { l: 'c', c: 'KeyC' }, { l: 'v', c: 'KeyV' }, { l: 'b', c: 'KeyB' }, { l: 'n', c: 'KeyN' }, { l: 'm', c: 'KeyM' }, { l: ',', c: 'Comma' }, { l: '.', c: 'Period' }
        ],
        [
            { l: 'Space', c: 'Space', w: 6 }
        ]
    ];

    return (
        <div className="keyboard-base">
            {rows.map((row, rIdx) => (
                <div key={rIdx} className="k-row">
                    {row.map((key) => {
                        const isActive = activeKeys.has(key.c);
                        return (
                            <div 
                                key={key.c} 
                                className={`k-key ${isActive ? 'active' : ''}`}
                                style={{ flex: key.w || 1 }}
                            >
                                {key.l}
                            </div>
                        )
                    })}
                </div>
            ))}
            <style jsx>{`
                .keyboard-base {
                    width: 100%; max-width: 900px;
                    padding: 25px;
                    /* FROSTED GLASS (Muzlagan Oyna Effekti) */
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 30px; 
                    border: 1px solid rgba(255,255,255,0.5);
                    display: flex; flex-direction: column; gap: 10px;
                    user-select: none;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
                }
                .k-row { display: flex; gap: 10px; justify-content: center; }
                
                .k-key {
                    height: 55px; display: flex; align-items: center; justify-content: center;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 12px;
                    color: #475569; font-weight: 700; font-size: 20px; 
                    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
                    border-bottom: 4px solid #cbd5e1; /* 3D Clicky Look */
                    text-transform: uppercase;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }

                /* ACTIVE NEON STATE */
                .k-key.active {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white; 
                    border-bottom-width: 0px;
                    transform: translateY(4px);
                    box-shadow: 0 0 25px rgba(59, 130, 246, 0.7); /* KUCHLI NEON GLOW */
                    border: none;
                }
            `}</style>
        </div>
    )
}

// --- 2. PREMIUM CUSTOM MODAL ---
const CustomConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="modal-box"
            >
                <div className="modal-header-icon">
                    <AlertTriangle size={32} color="#fff" />
                </div>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                
                <div className="modal-actions">
                    <button className="modal-btn cancel-btn" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="modal-btn confirm-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </motion.div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);
                    z-index: 9999999; display: flex; justify-content: center; align-items: center;
                }
                .modal-box {
                    background: white; padding: 40px 30px; border-radius: 24px; width: 400px;
                    text-align: center; position: relative; overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .modal-header-icon {
                    width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b, #d97706);
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 20px auto; box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
                }
                .modal-title { margin: 0 0 10px 0; color: #1e293b; font-size: 22px; font-weight: 800; }
                .modal-message { color: #64748b; font-size: 15px; margin-bottom: 30px; line-height: 1.6; }
                .modal-actions { display: flex; gap: 12px; }
                .modal-btn { flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; font-size: 14px; transition: 0.2s; }
                .cancel-btn { background: #f1f5f9; color: #475569; }
                .cancel-btn:hover { background: #e2e8f0; }
                .confirm-btn { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
                .confirm-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
            `}</style>
        </div>
    );
};

// --- 3. ASOSIY COMPONENT ---
const EnhancedWritingTest = ({ onExit }) => { 
    // onExit prop agar parent componentdan berilsa ishlaydi, bo'lmasa '/' ga qaytadi
    const [gameState, setGameState] = useState('setup');
    const [topic, setTopic] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('task2');
    const [targetWords, setTargetWords] = useState(250);
    const [text, setText] = useState('');
    const [activeKeys, setActiveKeys] = useState(new Set());
    const [timer, setTimer] = useState(0);
    const [aiResult, setAiResult] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const textareaRef = useRef(null);
    const timerInterval = useRef(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const levels = [
        { id: 'beginner', label: 'Beginner Practice', target: 100 },
        { id: 'task1', label: 'IELTS Task 1 (Report)', target: 150 },
        { id: 'task2', label: 'IELTS Task 2 (Essay)', target: 250 },
        { id: 'advanced', label: 'Advanced Challenge', target: 500 },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => setActiveKeys(prev => new Set(prev).add(e.code));
        const handleKeyUp = (e) => setActiveKeys(prev => { const next = new Set(prev); next.delete(e.code); return next; });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); }
    }, []);

    useEffect(() => {
        if (gameState === 'writing') timerInterval.current = setInterval(() => setTimer(t => t + 1), 1000);
        else clearInterval(timerInterval.current);
        return () => clearInterval(timerInterval.current);
    }, [gameState]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    }

    const handleLevelChange = (e) => {
        const lvl = levels.find(l => l.id === e.target.value);
        setSelectedLevel(lvl.id);
        setTargetWords(lvl.target);
    }

    const startWriting = () => {
        if(!topic.trim()) { alert("Please enter a topic first!"); return; }
        setGameState('writing');
        setTimer(0);
    }

    const triggerConfirm = (title, message, confirmAction) => {
        setModalConfig({
            isOpen: true,
            title, message,
            onConfirm: () => {
                confirmAction();
                setModalConfig({ ...modalConfig, isOpen: false });
            },
            cancelText: "Return to Test",
            confirmText: "Finish & Check"
        });
    };

    const finishWriting = () => {
        triggerConfirm(
            "Finish Writing?",
            "Are you sure you want to submit your essay for analysis?",
            async () => {
                setGameState('result');
                setIsEvaluating(true);
                try {
                    const token = localStorage.getItem('access_token');
                    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                    const res = await fetch(`${API}/api/ai/evaluate/writing`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify({ text, prompt: topic, exam_type: 'IELTS' })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setAiResult(data);
                    }
                } catch (e) {
                    console.error('AI eval error:', e);
                } finally {
                    setIsEvaluating(false);
                }
            }
        );
    }

    // HOMEGA QAYTISH FUNKSIYASI
    const goHome = () => {
        if (onExit) {
            onExit();
        } else {
            // Agar onExit berilmagan bo'lsa, root ga qaytamiz
            window.location.href = '/'; 
        }
    }

    const wordCount = text.trim().split(/\s+/).filter(w => w !== '').length;

    // --- RENDER SECTIONS ---

    // 1. SETUP SCREEN
    if (gameState === 'setup') {
        return (
            <div className="fullscreen-container">
                <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="setup-card">
                    <div className="icon-badge"><Sparkles size={32} color="white"/></div>
                    <h1 className="setup-title">Writing Gym</h1>
                    <p className="setup-subtitle">Select your level and enter a topic to begin your Zen Mode practice.</p>
                    
                    <div className="input-group">
                        <label>Difficulty Level</label>
                        <div className="select-wrapper">
                            <select className="premium-input" value={selectedLevel} onChange={handleLevelChange}>
                                {levels.map(l => (
                                    <option key={l.id} value={l.id}>{l.label} ({l.target} words)</option>
                                ))}
                            </select>
                            <ChevronRight className="select-icon" size={20} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Your Topic</label>
                        <textarea 
                            className="premium-input text-area-sm" 
                            rows="3"
                            placeholder="Example: The impact of social media on society..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <button className="start-btn" onClick={startWriting}>
                        Start Writing
                    </button>

                    <button className="back-link" onClick={goHome}>
                        <ArrowLeft size={16}/> Back to Dashboard
                    </button>
                </motion.div>

                <style jsx>{`
                    .fullscreen-container {
                        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                        background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
                        z-index: 99999; display: flex; justify-content: center; align-items: center;
                        font-family: 'Inter', sans-serif;
                    }
                    .setup-card {
                        background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px);
                        padding: 50px; border-radius: 30px;
                        width: 100%; max-width: 550px; text-align: center;
                        box-shadow: 0 25px 60px rgba(59, 130, 246, 0.1); border: 1px solid rgba(255,255,255,0.8);
                    }
                    .icon-badge {
                        width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #2563eb);
                        border-radius: 20px; display: flex; alignItems: center; justify-content: center;
                        margin: 0 auto 20px auto; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); transform: rotate(-5deg);
                    }
                    .setup-title { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; }
                    .setup-subtitle { color: #64748b; margin-bottom: 30px; font-size: 15px; }
                    .input-group { text-align: left; margin-bottom: 20px; }
                    .input-group label { display: block; font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
                    .select-wrapper { position: relative; }
                    .select-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #64748b; pointer-events: none; }
                    .premium-input {
                        width: 100%; padding: 16px; border-radius: 16px; border: 2px solid transparent;
                        font-size: 16px; color: #1e293b; background: white; transition: 0.3s; font-weight: 600;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.03); appearance: none;
                    }
                    .premium-input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
                    .text-area-sm { resize: none; font-family: inherit; }
                    .start-btn {
                        width: 100%; padding: 18px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        color: white; border: none; border-radius: 16px; font-weight: 700; font-size: 16px;
                        cursor: pointer; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25); transition: 0.3s; margin-top: 10px;
                    }
                    .start-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4); }
                    .back-link {
                        background: none; border: none; color: #94a3b8; font-weight: 600; margin-top: 20px;
                        cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
                    }
                    .back-link:hover { color: #64748b; }
                `}</style>
            </div>
        )
    }

    // 2. ZEN WRITING MODE (TO'LIQ EKRAN)
    if (gameState === 'writing') {
        return (
            <div className="fullscreen-container zen-layout">
                {/* Custom Modal */}
                <CustomConfirmModal 
                    isOpen={modalConfig.isOpen}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    onConfirm={modalConfig.onConfirm}
                    onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    confirmText={modalConfig.confirmText}
                    cancelText={modalConfig.cancelText}
                />

                {/* Top Bar */}
                <div className="zen-header">
                    {/* EXIT BUTTON (CHAP TOMONDA) */}
                    <button className="exit-btn-circle" onClick={goHome} title="Exit to Home">
                        <ArrowLeft size={20} />
                    </button>

                    <div className="topic-badge">
                        <span className="tb-label">TOPIC</span>
                        <p className="tb-text">{topic}</p>
                    </div>
                    
                    <div className="zen-stats">
                        <div className="stat-capsule">
                            <Clock size={16} color="#64748b"/>
                            <span>{formatTime(timer)}</span>
                        </div>
                        <div className="stat-capsule">
                            <span style={{color: wordCount >= targetWords ? '#10b981' : '#3b82f6', fontWeight: 800}}>{wordCount}</span>
                            <span style={{color: '#94a3b8'}}>/ {targetWords} words</span>
                        </div>
                        {/* PREMIUM FINISH BUTTON (KO'K GRADIENT) */}
                        <button className="finish-btn-premium" onClick={finishWriting}>Finish</button>
                    </div>
                </div>

                {/* Editor */}
                <div className="zen-editor-wrapper" onClick={() => textareaRef.current.focus()}>
                    <textarea
                        ref={textareaRef}
                        className="zen-textarea"
                        placeholder="Start typing..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        spellCheck="false"
                        autoFocus
                    />
                </div>

                {/* Keyboard (Premium Glass) */}
                <div className="zen-keyboard-wrapper">
                    <VirtualKeyboard activeKeys={activeKeys} />
                </div>

                <style jsx>{`
                    .fullscreen-container {
                        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                        background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
                        z-index: 99999; display: flex; flex-direction: column;
                        font-family: 'Inter', sans-serif;
                    }
                    .zen-header {
                        padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;
                        background: rgba(255,255,255,0.7); backdrop-filter: blur(15px);
                        border-bottom: 1px solid rgba(255,255,255,0.6);
                    }
                    /* EXIT BUTTON STYLE */
                    .exit-btn-circle {
                        width: 45px; height: 45px; border-radius: 50%; border: 1px solid #fee2e2;
                        background: #fff; color: #ef4444; display: flex; align-items: center; justify-content: center;
                        cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.03);
                    }
                    .exit-btn-circle:hover { background: #fee2e2; transform: scale(1.05); }

                    .topic-badge { display: flex; flex-direction: column; max-width: 40%; text-align: center; }
                    .tb-label { font-size: 10px; font-weight: 900; color: #94a3b8; letter-spacing: 1px; }
                    .tb-text { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                    .zen-stats { display: flex; gap: 12px; align-items: center; }
                    .stat-capsule {
                        background: white; padding: 10px 20px; border-radius: 12px;
                        display: flex; gap: 8px; align-items: center; font-weight: 600; font-size: 14px;
                        color: #1e293b; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid white;
                    }

                    /* PREMIUM FINISH BUTTON CSS */
                    .finish-btn-premium {
                        padding: 12px 28px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        color: white; border-radius: 12px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: 0.2s;
                        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                    }
                    .finish-btn-premium:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4); }

                    .zen-editor-wrapper { flex: 1; display: flex; justify-content: center; position: relative; overflow: hidden; }
                    .zen-textarea {
                        width: 100%; max-width: 900px; height: 100%; padding: 40px 0;
                        background: transparent; border: none; outline: none; resize: none;
                        font-family: 'Roboto Mono', monospace; 
                        font-size: 26px; line-height: 1.6; color: #334155;
                        caret-color: #3b82f6;
                    }
                    .zen-keyboard-wrapper { padding-bottom: 30px; display: flex; justify-content: center; }
                `}</style>
            </div>
        )
    }

    // 3. RESULT SCREEN
    if (gameState === 'result') {
        const score = aiResult ? aiResult.band_score : Math.min(9, (wordCount / targetWords) * 9).toFixed(1);
        
        return (
            <div className="fullscreen-container">
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="result-dashboard">
                    <div className="rd-header">
                        <div>
                            <h2 className="rd-title">Analysis Report</h2>
                            <p className="rd-subtitle">AI-Powered Assessment</p>
                        </div>
                        <div className="rd-badge">IELTS {selectedLevel.toUpperCase()}</div>
                    </div>

                    <div className="rd-grid">
                        <div className="rd-card score-card">
                            <h3>Estimated Band</h3>
                            <div className="score-circle">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="circle" strokeDasharray={`${(score/9)*100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="score-text">
                                    <span className="big-num">{score}</span>
                                    <span className="small-num">/9.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="rd-stats-col">
                            <div className="rd-card stat-item">
                                <div className="si-icon blue"><BookOpen size={20}/></div>
                                <div><span className="si-label">Word Count</span><div className="si-value">{wordCount} <span className="si-target">/ {targetWords}</span></div></div>
                            </div>
                            <div className="rd-card stat-item">
                                <div className="si-icon green"><Clock size={20}/></div>
                                <div><span className="si-label">Time Taken</span><div className="si-value">{formatTime(timer)}</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="rd-card feedback-box">
                        <div className="fb-header"><Search size={18} /> <span>Detailed Feedback</span></div>
                        <p className="fb-text">
                            Great effort! You wrote about <b>"{topic}"</b>. 
                            {wordCount < targetWords ? 
                                " However, you fell short of the word count. In the real exam, this would lower your score." : 
                                " You successfully met the length requirement. Good flow!"}
                            <br/><br/><i>Tip: Continue practicing to improve your typing speed and idea generation.</i>
                        </p>
                    </div>

                    <div className="rd-actions">
                        {/* RETURN HOME BUTTON */}
                        <button className="rd-btn secondary" onClick={goHome}>
                            <Home size={18}/> Return to Home
                        </button>
                        <button className="rd-btn primary" onClick={() => {setGameState('setup'); setText(''); setTimer(0);}}>
                            <RefreshCw size={18}/> Practice Again
                        </button>
                    </div>
                </motion.div>

                <style jsx>{`
                    .fullscreen-container {
                        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                        background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
                        z-index: 99999; display: flex; justify-content: center; align-items: center;
                        font-family: 'Inter', sans-serif;
                    }
                    .result-dashboard {
                        background: rgba(255,255,255,0.9); backdrop-filter: blur(20px);
                        padding: 40px; border-radius: 35px; width: 100%; max-width: 800px;
                        box-shadow: 0 30px 80px rgba(0, 123, 255, 0.15); border: 1px solid white;
                    }
                    .rd-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
                    .rd-title { font-size: 28px; font-weight: 800; color: #1e293b; margin: 0; }
                    .rd-subtitle { color: #64748b; margin: 5px 0 0 0; }
                    .rd-badge { background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 12px; }
                    .rd-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; margin-bottom: 20px; }
                    .rd-card { background: #fff; padding: 20px; border-radius: 20px; border: 1px solid #f1f5f9; }
                    .score-card { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
                    .score-card h3 { margin: 0 0 15px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                    .score-circle { position: relative; width: 140px; height: 140px; }
                    .circular-chart { display: block; margin: 0 auto; max-width: 100%; max-height: 100%; }
                    .circle-bg { fill: none; stroke: #f1f5f9; stroke-width: 2.5; }
                    .circle { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke: #3b82f6; animation: progress 1s ease-out forwards; }
                    .score-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
                    .big-num { font-size: 42px; font-weight: 800; color: #1e293b; line-height: 1; display: block; }
                    .small-num { font-size: 14px; color: #94a3b8; font-weight: 600; }
                    .rd-stats-col { display: flex; flex-direction: column; gap: 15px; }
                    .stat-item { display: flex; align-items: center; gap: 15px; padding: 15px 20px; }
                    .si-icon { width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                    .si-icon.blue { background: #eff6ff; color: #3b82f6; }
                    .si-icon.green { background: #f0fdf4; color: #10b981; }
                    .si-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
                    .si-value { font-size: 18px; font-weight: 800; color: #1e293b; }
                    .si-target { font-size: 14px; color: #cbd5e1; font-weight: 600; }
                    .feedback-box { background: #f8fafc; border: 1px solid #e2e8f0; margin-bottom: 30px; }
                    .fb-header { display: flex; align-items: center; gap: 8px; color: #3b82f6; font-weight: 700; margin-bottom: 10px; }
                    .fb-text { color: #334155; line-height: 1.6; font-size: 15px; margin: 0; }
                    .rd-actions { display: flex; gap: 15px; }
                    .rd-btn { flex: 1; padding: 15px; border-radius: 15px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; transition: 0.2s; }
                    .rd-btn.primary { background: #3b82f6; color: white; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25); }
                    .rd-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4); }
                    .rd-btn.secondary { background: white; color: #64748b; border: 2px solid #f1f5f9; }
                    .rd-btn.secondary:hover { background: #f8fafc; color: #1e293b; }
                    @keyframes progress { 0% { stroke-dasharray: 0 100; } }
                `}</style>
            </div>
        )
    }

    return null;
}

export default EnhancedWritingTest
import React, { useState, useEffect } from 'react'
import { useTests } from './TestContext'
import { motion, AnimatePresence } from 'framer-motion'
import EnhancedListeningTest from './ListeningTest'
import EnhancedReadingTest from './ReadingTest'
import EnhancedWritingTest from './WritingTest'
import EnhancedSpeakingTest from './SpeakingTest'
import ResultsDashboard from './ResultsDashboard'

// --- PREMIUM CUSTOM MODAL (Ogohlantirish oynasi) ---
const CustomConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Return to Test" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="modal-box"
            >
                <div className="modal-icon">
                    <i className="fas fa-info-circle"></i>
                </div>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                
                <div className="modal-actions">
                    {/* Qaytish tugmasi */}
                    <button className="modal-btn return-btn" onClick={onCancel}>
                        {cancelText}
                    </button>
                    
                    {/* Tasdiqlash tugmasi (Start Exam rangi bilan bir xil) */}
                    <button className="modal-btn confirm-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </motion.div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(5px);
                    z-index: 9999999; display: flex; justify-content: center; align-items: center;
                }
                .modal-box {
                    background: #ffffff; /* TOP-TOZA OQ */
                    padding: 30px; border-radius: 24px; width: 420px;
                    text-align: center; 
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255,255,255,0.5);
                }
                .modal-icon {
                    font-size: 40px; color: #007bff; margin-bottom: 15px;
                }
                .modal-title {
                    margin: 0 0 10px 0; 
                    color: #1e293b !important; /* Qora rang (Aniq ko'rinishi uchun) */
                    font-size: 22px; font-weight: 800;
                }
                .modal-message {
                    color: #64748b !important; /* To'q kulrang */
                    font-size: 15px; margin-bottom: 25px; line-height: 1.5; font-weight: 500;
                }
                .modal-actions { display: flex; gap: 15px; justify-content: center; }
                
                .modal-btn {
                    padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; flex: 1; transition: 0.2s; font-size: 14px;
                }
                
                /* Return tugmasi */
                .return-btn {
                    background: #f1f5f9; color: #475569;
                }
                .return-btn:hover { background: #e2e8f0; color: #1e293b; }

                /* Confirm tugmasi (Start Exam bilan bir xil) */
                .confirm-btn {
                    background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
                }
                .confirm-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
                }
            `}</style>
        </div>
    );
};

const MasterTestDashboard = () => {
    const { tests, currentTest, setCurrentTest, userResults } = useTests()
    
    // State
    const [activeSection, setActiveSection] = useState('listening')
    const [dashboardTab, setDashboardTab] = useState('mock')
    const [isExamStarted, setIsExamStarted] = useState(false);
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({ 
        isOpen: false, title: '', message: '', 
        confirmText: 'Yes', cancelText: 'Return to Test',
        onConfirm: null 
    });

    // Focus Mode
    useEffect(() => {
        if (currentTest) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; }
    }, [currentTest]);

    const getSectionStatusForTest = (testId, section) => {
        const result = userResults.find(r => r.testId === testId && r.section === section)
        return result ? 'Completed' : 'Not started'
    }

    // Modal chaqirish
    const triggerConfirm = (title, message, confirmAction, confirmText = "Confirm") => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            confirmText,
            cancelText: "Return to Test",
            onConfirm: () => {
                confirmAction();
                setModalConfig({ ...modalConfig, isOpen: false });
            }
        });
    };

    // Testdan chiqish
    const handleExitTest = () => {
        triggerConfirm(
            "Exit Exam?",
            "Are you sure you want to leave? Your progress will not be saved.",
            () => {
                setCurrentTest(null);
                setActiveSection('listening');
                setIsExamStarted(false);
            },
            "Yes, Exit"
        );
    }

    // Intro Screen Start
    const handleStartTest = () => {
        setIsExamStarted(true);
    }

    // Keyingi bo'lim
    const handleNextSection = () => {
        triggerConfirm(
            `Finish ${activeSection.toUpperCase()}?`,
            "You cannot return to this section once submitted. Proceed to next?",
            () => {
                const sections = ['listening', 'reading', 'writing', 'speaking', 'results'];
                const currentIndex = sections.indexOf(activeSection);
                if (activeSection === 'results') {
                    handleExitTest();
                } else {
                    setActiveSection(sections[currentIndex + 1]);
                }
            },
            "Yes, Submit"
        );
    }

    const filteredTests = tests.filter(test => {
        if (dashboardTab === 'cambridge') return test.type === 'cambridge';
        if (dashboardTab === 'mock') return test.type === 'mock' || !test.type;
        if (dashboardTab === 'skills') return test.type === 'skill';
        return true;
    });

    const renderActiveSection = () => {
        if (!currentTest) return null
        switch (activeSection) {
            case 'listening': return <EnhancedListeningTest test={currentTest} />
            case 'reading': return <EnhancedReadingTest test={currentTest} />
            case 'writing': return <EnhancedWritingTest test={currentTest} />
            case 'speaking': return <EnhancedSpeakingTest test={currentTest} />
            case 'results': return <ResultsDashboard testId={currentTest.id} />
            default: return null
        }
    }

    return (
        <>
            {/* Modal */}
            <CustomConfirmModal 
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
            />

            <style jsx>{`
                /* ANIMATSIYALAR */
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(0, 123, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); } }

                /* 1. DASHBOARD FON (GRADIENT - HAMMA JOYDA) */
                .dashboard-container, .full-screen-mode {
                    min-height: 100vh;
                    /* ORIGINAL GRADIENT */
                    background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
                    color: #0f172a;
                    font-family: 'Inter', sans-serif;
                }
                .dashboard-container { padding: 140px 20px 40px 20px; }

                /* 2. FULL SCREEN MODE */
                .full-screen-mode {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    z-index: 9999; overflow-y: auto; display: flex; flex-direction: column;
                }

                /* --- INTRO SCREEN --- */
                .intro-container {
                    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 20px; text-align: center; animation: slideUp 0.5s ease-out;
                }
                .intro-card {
                    background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);
                    padding: 50px; border-radius: 30px; 
                    box-shadow: 0 20px 60px rgba(0, 123, 255, 0.15);
                    max-width: 600px; width: 100%; border: 1px solid rgba(255, 255, 255, 0.8);
                }
                .intro-icon {
                    font-size: 50px; color: #007bff; margin-bottom: 20px;
                    background: #e0f2fe; width: 90px; height: 90px; line-height: 90px; 
                    border-radius: 50%; margin: 0 auto 30px auto;
                }
                .intro-title { font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 15px; }
                .intro-desc { font-size: 16px; color: #64748b; margin-bottom: 40px; line-height: 1.6; }
                
                .intro-actions { display: flex; gap: 20px; justify-content: center; }
                .intro-btn {
                    padding: 15px 35px; border-radius: 15px; font-weight: 700; font-size: 16px; cursor: pointer; border: none; transition: 0.2s; display: flex; align-items: center; gap: 10px;
                }
                /* START TUGMASI (Original ko'k gradient) */
                .btn-start {
                    background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
                    color: white;
                    box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3); 
                    animation: pulseGlow 2s infinite;
                }
                .btn-start:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0, 123, 255, 0.4); }
                
                .btn-back { background: white; color: #64748b; border: 2px solid #e2e8f0; }
                .btn-back:hover { background: #f8fafc; color: #1e293b; border-color: #cbd5e1; }

                /* --- TEST CONTENT (Active) --- */
                .test-content-body { flex: 1; padding: 20px; max-width: 1400px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; }

                /* RESULTS FOOTER */
                .results-footer {
                    padding: 20px; display: flex; justify-content: center; 
                    background: rgba(255,255,255,0.8); backdrop-filter: blur(10px);
                    position: fixed; bottom: 0; left: 0; width: 100%; border-top: 1px solid rgba(0,0,0,0.05);
                }
                .finish-exam-btn {
                    padding: 15px 40px; 
                    background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
                    color: white; border-radius: 12px;
                    font-weight: 700; cursor: pointer; border: none; display: flex; align-items: center; gap: 10px;
                    box-shadow: 0 10px 30px rgba(0, 123, 255, 0.2); transition: 0.2s;
                }
                .finish-exam-btn:hover { transform: translateY(-2px); }

                /* FLOATING NEXT BUTTON */
                .floating-next-btn {
                    position: fixed; bottom: 30px; right: 30px;
                    padding: 15px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white; border-radius: 50px; font-weight: 700; cursor: pointer; border: none;
                    display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                    z-index: 100; transition: 0.3s;
                }
                .floating-next-btn:hover { transform: scale(1.05); }

                /* DASHBOARD STYLES */
                .selection-screen h1 { text-align: center; color: #1e293b; font-size: 36px; font-weight: 800; margin-bottom: 10px; }
                .selection-subtitle { text-align: center; color: #64748b; margin-bottom: 40px; }
                .category-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; }
                .category-tab { background: white; border: 2px solid #e2e8f0; padding: 10px 25px; border-radius: 12px; cursor: pointer; color: #64748b; font-weight: 600; }
                .category-tab.active { background: #007bff; color: white; border-color: #007bff; }
                .test-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
                .test-card { background: white; border: 2px solid rgba(0, 123, 255, 0.15); border-radius: 20px; padding: 25px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; box-shadow: 0 5px 20px rgba(0, 123, 255, 0.1); }
                .test-card:hover { transform: translateY(-5px); }
                .test-card-header h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0; }
                .start-test-button { width: 100%; padding: 14px; background: linear-gradient(135deg, #007bff 0%, #00bfff 100%); border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer; margin-top: 20px; }
            `}</style>

            {currentTest ? (
                <div className="full-screen-mode">
                    {!isExamStarted ? (
                        /* --- 1. INTRO SCREEN (Testdan oldin) --- */
                        <div className="intro-container">
                            <div className="intro-card">
                                <div className="intro-icon">
                                    <i className="fas fa-play"></i>
                                </div>
                                <h1 className="intro-title">{currentTest.title}</h1>
                                <p className="intro-desc">
                                    You are about to start a full simulation. <br/>
                                    Please ensure you have a stable internet connection and 
                                    no distractions.
                                </p>
                                
                                <div className="intro-actions">
                                    <button className="intro-btn btn-back" onClick={handleExitTest}>
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </button>
                                    <button className="intro-btn btn-start" onClick={handleStartTest}>
                                        Start Exam <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* --- 2. ACTIVE TEST (Toza ekran) --- */
                        <div className="test-content-body">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    {/* Testning asosiy qismi */}
                                    {renderActiveSection()}

                                    {/* Next Section tugmasi (Resultsda chiqmaydi) */}
                                    {activeSection !== 'results' && (
                                        <button className="floating-next-btn" onClick={handleNextSection}>
                                            {activeSection === 'speaking' ? 'Finish Exam' : `Submit ${activeSection} & Next`}
                                            <i className="fas fa-arrow-right"></i>
                                        </button>
                                    )}

                                    {/* 3. RESULTS SCREEN EXIT BUTTON */}
                                    {activeSection === 'results' && (
                                        <div className="results-footer">
                                            <button className="finish-exam-btn" onClick={handleExitTest}>
                                                <i className="fas fa-sign-out-alt"></i> Exit Test
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            ) : (
                /* --- DASHBOARD (SELECTION) --- */
                <div className="dashboard-container">
                    <div className="selection-screen">
                        <h1>🎯 IELTS Practice Hub</h1>
                        <p className="selection-subtitle">Choose your preferred practice mode.</p>

                        <div className="category-tabs">
                            <div className={`category-tab ${dashboardTab === 'mock' ? 'active' : ''}`} onClick={() => setDashboardTab('mock')}>AI Mock Simulations</div>
                            <div className={`category-tab ${dashboardTab === 'cambridge' ? 'active' : ''}`} onClick={() => setDashboardTab('cambridge')}>Cambridge Official</div>
                            <div className={`category-tab ${dashboardTab === 'skills' ? 'active' : ''}`} onClick={() => setDashboardTab('skills')}>Skill Practice</div>
                        </div>

                        <div className="test-grid">
                            {filteredTests.map(test => (
                                <motion.div key={test.id} whileHover={{ y: -5 }} className="test-card" onClick={() => setCurrentTest(test)}>
                                    <div className="test-card-header">
                                        <h3>{test.title}</h3>
                                        <div style={{background:'#eff6ff', color:'#007bff', padding:'4px 10px', borderRadius:'10px', fontSize:'11px', fontWeight:'800'}}>MOCK</div>
                                    </div>
                                    
                                    <div style={{height:'6px', background:'#f1f5f9', borderRadius:'4px', overflow:'hidden', margin:'20px 0'}}>
                                        <div style={{width:'0%', height:'100%', background:'#007bff'}}></div>
                                    </div>

                                    <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                                        {['Listening', 'Reading', 'Writing', 'Speaking'].map(skill => (
                                            <div key={skill} style={{display:'flex', justifyContent:'space-between', fontSize:'14px', borderBottom:'1px solid #f8fafc', paddingBottom:'5px'}}>
                                                <span style={{color:'#64748b'}}>{skill}</span>
                                                <span style={{color:'#007bff', fontWeight:'600'}}>{getSectionStatusForTest(test.id, skill)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="start-test-button">Start Exam</button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MasterTestDashboard
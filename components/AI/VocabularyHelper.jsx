import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, BrainCircuit, Zap, RotateCw, List, Volume2,
  Check, X, Star, Trophy, Globe, Flame, Award, ChevronRight,
  RefreshCcw, ShieldCheck, BookmarkCheck, Heart, Target
} from 'lucide-react';

// --- MUKAMMAL DATA (MOCK DATABASE) ---
const VOCAB_DATABASE = [
  {
    id: 1, word: "Ubiquitous", pronunciation: "yoo-BIK-wi-tuhs", band: "8.5", level: "C1 Advanced", topic: "Technology",
    definition: "Found everywhere; appearing or present everywhere at once.",
    ieltsUsage: "Ideal for describing global trends or technology ubiquity.",
    synonyms: { basic: "common", medium: "widespread", elite: "omnipresent" },
    examples: ["Smartphones have become ubiquitous in modern society."],
    quiz: { q: "Academic synonym for 'Everywhere'?", options: ["Common", "Ubiquitous", "Local", "Rare"], a: 1 }
  },
  {
    id: 2, word: "Mitigate", pronunciation: "MI-ti-gayt", band: "7.5", level: "C1 Advanced", topic: "Environment",
    definition: "To make something less severe, serious, or painful.",
    ieltsUsage: "Perfect for Writing Task 2 when discussing solution measures.",
    synonyms: { basic: "lessen", medium: "alleviate", elite: "ameliorate" },
    examples: ["New laws were passed to mitigate the risk of financial collapse."],
    quiz: { q: "If you 'mitigate' a problem, what are you doing?", options: ["Worsening it", "Ignoring it", "Reducing severity", "Solving it"], a: 2 }
  },
  {
    id: 3, word: "Notwithstanding", pronunciation: "not-with-STAN-ding", band: "9.0", level: "C2 Expert", topic: "Formal",
    definition: "In spite of; nevertheless.",
    ieltsUsage: "A powerful cohesive device for Band 8+ Writing Task 2.",
    synonyms: { basic: "but", medium: "despite", elite: "nevertheless" },
    examples: ["Notwithstanding the high cost, the project was a success."],
    quiz: { q: "Function of 'Notwithstanding'?", options: ["Addition", "Contrast", "Result", "Time"], a: 1 }
  }
];

const VocabularyMasterPro = () => {
  // --- STATES ---
  const [practiceMode, setPracticeMode] = useState('flashcards');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [xp, setXp] = useState(0);
  const [savedWords, setSavedWords] = useState(new Set());
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState(null);
  const [dailyGoal] = useState(5);

  // --- LOGIC ---
  const filteredWords = useMemo(() => 
    VOCAB_DATABASE.filter(w => w.word.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const currentWord = filteredWords[currentIndex] || VOCAB_DATABASE[0];
  const userLevel = Math.floor(xp / 500) + 1;
  const progressPercent = (savedWords.size / dailyGoal) * 100;

  const handleSRS = (points) => {
    setXp(prev => prev + points);
    const newSaved = new Set(savedWords);
    if (points >= 30) newSaved.add(currentWord.id);
    setSavedWords(newSaved);
    handleNext();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedQuizOpt(null);
    setCurrentIndex(prev => (prev + 1) % filteredWords.length);
  };

  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  const toggleSave = (id) => {
    const newSaved = new Set(savedWords);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedWords(newSaved);
  };

  // --- STYLES (JSX INTERNAL) ---
  const S = {
    page: { 
      minHeight: '100vh', padding: '60px 20px',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
      fontFamily: "'Inter', sans-serif", display: 'flex', justifyContent: 'center'
    },
    container: { width: '100%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' },
    sidebar: { display: 'flex', flexDirection: 'column', gap: '25px' },
    bento: { 
      background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(15px)', 
      padding: '30px', borderRadius: '35px', border: '1px solid #fff',
      boxShadow: '0 15px 35px rgba(0,0,0,0.03)' 
    },
    main: { minHeight: '650px' },
    cardWrapper: { perspective: '1500px', height: '500px', width: '100%', cursor: 'pointer' },
    card: { 
      position: 'relative', width: '100%', height: '100%', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
    },
    cardSide: { 
      position: 'absolute', inset: 0, padding: '50px', borderRadius: '45px', 
      backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center', background: '#fff',
      boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
    },
    cardBack: { transform: 'rotateY(180deg)', textAlign: 'left', alignItems: 'flex-start' },
    btnSRS: (color, bg) => ({
      flex: 1, padding: '18px', borderRadius: '20px', border: 'none', 
      background: bg, color: color, fontWeight: '800', cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: '0.2s'
    }),
    quizBtn: (isCorrect, isSelected) => ({
      width: '100%', padding: '20px', borderRadius: '20px', border: '2px solid #f1f5f9',
      marginBottom: '12px', textAlign: 'left', fontWeight: '700', cursor: 'pointer',
      background: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : '#fff',
      color: isSelected ? '#fff' : '#1e293b', transition: '0.3s'
    })
  };

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* SIDEBAR: NEURAL DASHBOARD */}
        <aside style={S.sidebar}>
          <div style={S.bento}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'25px'}}>
              <div style={{background:'#3b82f6', padding:'10px', borderRadius:'15px'}}><BrainCircuit color="#fff" size={24}/></div>
              <div>
                <h2 style={{fontSize:'20px', fontWeight:'900', margin:0}}>Neural Lexicon</h2>
                <p style={{fontSize:'11px', fontWeight:'700', color:'#94a3b8'}}>ACADEMIC ENGINE v2.0</p>
              </div>
            </div>
            
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
              <span style={{fontSize:'12px', fontWeight:'800', color:'#475569'}}>DAILY GOAL</span>
              <span style={{fontSize:'12px', fontWeight:'800', color:'#3b82f6'}}>{savedWords.size}/{dailyGoal} WORDS</span>
            </div>
            <div style={{height:'10px', background:'#f1f5f9', borderRadius:'10px', overflow:'hidden'}}>
              <div style={{width:`${Math.min(100, progressPercent)}%`, height:'100%', background:'#3b82f6', transition:'1s'}} />
            </div>
          </div>

          <div style={S.bento}>
            <div style={{display:'flex', alignItems:'center', background:'#fff', padding:'12px 20px', borderRadius:'18px', border:'1px solid #f1f5f9'}}>
              <Search size={18} color="#94a3b8"/>
              <input 
                placeholder="Analyze intelligence..." 
                style={{border:'none', outline:'none', marginLeft:'12px', fontWeight:'700', width:'100%', color:'#1e293b'}} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={S.bento}>
            <p style={{fontSize:'10px', fontWeight:'900', color:'#94a3b8', letterSpacing:'1px', marginBottom:'15px'}}>NEURAL MODULES</p>
            <nav style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              {[
                {id:'flashcards', label:'3D Recall', icon:<RotateCw size={18}/>},
                {id:'quiz', label:'Neural Quiz', icon:<Zap size={18}/>},
                {id:'list', label:'Global Bank', icon:<List size={18}/>}
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setPracticeMode(m.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:'12px', padding:'15px', borderRadius:'18px', border:'none', 
                    fontWeight:'800', cursor:'pointer', transition:'0.3s',
                    background: practiceMode === m.id ? '#3b82f615' : 'transparent',
                    color: practiceMode === m.id ? '#3b82f6' : '#64748b'
                  }}
                >
                  {m.icon} <span>{m.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN ENGINE */}
        <main style={S.main}>
          {practiceMode === 'flashcards' && (
            <div style={{display:'flex', flexDirection:'column', gap:'30px', alignItems:'center'}}>
              <div style={S.cardWrapper} onClick={() => setIsFlipped(!isFlipped)}>
                <div style={S.card}>
                  {/* FRONT FACE */}
                  <div style={S.cardSide}>
                    <div style={{position:'absolute', top:'40px', display:'flex', gap:'15px'}}>
                      <span style={{background:'#dcfce7', color:'#16a34a', padding:'6px 15px', borderRadius:'20px', fontSize:'12px', fontWeight:'900'}}>IELTS {currentWord.band}</span>
                      <span style={{background:'#fef3c7', color:'#d97706', padding:'6px 15px', borderRadius:'20px', fontSize:'12px', fontWeight:'900'}}>{currentWord.level}</span>
                    </div>
                    <h1 style={{fontSize:'78px', fontWeight:'900', color:'#0f172a', margin:0, letterSpacing:'-4px'}}>{currentWord.word}</h1>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#94a3b8', marginTop:'15px', fontWeight:'700'}}>
                       <Volume2 size={20} style={{cursor:'pointer'}} onClick={(e) => {e.stopPropagation(); speak(currentWord.word)}}/>
                       {currentWord.pronunciation}
                    </div>
                  </div>
                  {/* BACK FACE */}
                  <div style={{...S.cardSide, ...S.cardBack}}>
                    <p style={{fontSize:'10px', fontWeight:'900', color:'#94a3b8', letterSpacing:'1.5px', marginBottom:'10px'}}>ACADEMIC DEFINITION</p>
                    <p style={{fontSize:'22px', fontWeight:'800', color:'#1e293b', marginBottom:'30px', lineHeight:'1.4'}}>{currentWord.definition}</p>
                    
                    <p style={ {fontSize:'10px', fontWeight:'900', color:'#94a3b8', letterSpacing:'1.5px', marginBottom:'10px'}}>SYNONYM PROGRESSION</p>
                    <div style={{display:'flex', gap:'10px', marginBottom:'30px'}}>
                      {Object.values(currentWord.synonyms).map(s => (
                        <span key={s} style={{background:'#f1f5f9', padding:'8px 15px', borderRadius:'12px', fontSize:'13px', fontWeight:'700', color:'#475569'}}>{s}</span>
                      ))}
                    </div>

                    <p style={{fontSize:'10px', fontWeight:'900', color:'#94a3b8', letterSpacing:'1.5px', marginBottom:'10px'}}>IELTS CONTEXT</p>
                    <p style={{fontSize:'15px', fontStyle:'italic', color:'#64748b', borderLeft:'4px solid #3b82f6', paddingLeft:'15px'}}>"{currentWord.examples[0]}"</p>
                  </div>
                </div>
              </div>

              {/* SRS CONTROL PANEL */}
              <div style={{display:'flex', gap:'15px', width:'100%', maxWidth:'600px'}}>
                <button style={S.btnSRS('#ef4444', '#fee2e2')} onClick={(e) => handleSRS(10)}>AGAIN</button>
                <button style={S.btnSRS('#f59e0b', '#fef3c7')} onClick={(e) => handleSRS(20)}>HARD</button>
                <button style={S.btnSRS('#10b981', '#dcfce7')} onClick={(e) => handleSRS(40)}>GOOD</button>
                <button style={S.btnSRS('#3b82f6', '#dbeafe')} onClick={(e) => handleSRS(60)}>EASY</button>
              </div>
            </div>
          )}

          {practiceMode === 'quiz' && (
            <div style={{background:'#fff', borderRadius:'45px', padding:'60px', boxShadow:'0 30px 60px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'40px'}}>
                <span style={{fontWeight:'900', color:'#3b82f6'}}>QUESTION {currentIndex+1}/{filteredWords.length}</span>
                <span style={{fontWeight:'900', color:'#f59e0b'}}><Trophy size={16} style={{marginBottom:'-3px'}}/> {quizScore} XP</span>
              </div>
              <h2 style={{fontSize:'28px', fontWeight:'900', color:'#0f172a', marginBottom:'40px', lineHeight:'1.3'}}>{currentWord.quiz.q}</h2>
              {currentWord.quiz.options.map((opt, i) => (
                <button 
                  key={i}
                  style={S.quizBtn(i === currentWord.quiz.a, selectedQuizOpt === i)}
                  onClick={() => {
                    setSelectedQuizOpt(i);
                    if(i === currentWord.quiz.a) setQuizScore(s => s + 50);
                    setTimeout(handleNext, 1200);
                  }}
                >
                  <span style={{marginRight:'15px', opacity:0.3}}>0{i+1}</span> {opt}
                </button>
              ))}
            </div>
          )}

          {practiceMode === 'list' && (
            <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              {filteredWords.map(w => (
                <div key={w.id} style={{background:'#fff', padding:'25px 40px', borderRadius:'30px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #f1f5f9'}}>
                  <div>
                    <h4 style={{fontSize:'20px', fontWeight:'900', margin:'0 0 5px 0', color:'#0f172a'}}>{w.word}</h4>
                    <p style={{fontSize:'14px', color:'#94a3b8', fontWeight:'500', margin:0}}>{w.definition}</p>
                  </div>
                  <div style={{display:'flex', gap:'15px'}}>
                    <Volume2 size={20} color="#94a3b8" style={{cursor:'pointer'}} onClick={() => speak(w.word)}/>
                    <Star 
                      size={20} 
                      fill={savedWords.has(w.id) ? "#f59e0b" : "none"} 
                      color={savedWords.has(w.id) ? "#f59e0b" : "#cbd5e1"} 
                      style={{cursor:'pointer'}} 
                      onClick={() => toggleSave(w.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VocabularyMasterPro;
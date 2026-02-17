import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const ListeningTest = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  
  const audioRef = useRef(null)

  // 1. DATA (Test Ma'lumotlari)
  const sections = [
    {
      id: 1,
      title: "Section 1: Conversation",
      topic: "Phone Call Enquiry",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Real URL qo'ying
      questions: [
        { id: 1, type: 'fill-blank', text: "Customer Name: Mr. ____________", label: "John" },
        { id: 2, type: 'fill-blank', text: "Contact Number: 077 ____________", label: "452 889" },
        { id: 3, type: 'radio', text: "Type of insurance required:", options: ["Car", "Home", "Travel"] },
        { id: 4, type: 'radio', text: "Policy start date:", options: ["1st January", "15th January", "1st February"] },
      ]
    },
    {
      id: 2,
      title: "Section 2: Monologue",
      topic: "Guide to Local Library",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      questions: [
        { id: 5, type: 'map', text: "The Reference Section is located in ____________" },
        { id: 6, type: 'fill-blank', text: "Opening hours on Sunday: ____________ to 4 PM" },
        { id: 7, type: 'radio', text: "Which card is required for printing?", options: ["Membership Card", "Student ID", "Guest Pass"] },
      ]
    },
    {
      id: 3,
      title: "Section 3: Discussion",
      topic: "Academic Research Project",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      questions: [
        { id: 8, type: 'radio', text: "What is the main focus of the research?", options: ["Urban Planning", "Rural Development", "Transport Systems"] },
        { id: 9, type: 'fill-blank', text: "The deadline for the first draft is ____________" },
      ]
    },
    {
      id: 4,
      title: "Section 4: Lecture",
      topic: "Marine Biology",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      questions: [
        { id: 10, type: 'fill-blank', text: "The species was first discovered in ____________" },
        { id: 11, type: 'radio', text: "The population decline is caused by:", options: ["Pollution", "Overfishing", "Climate Change"] },
      ]
    }
  ]

  // Audio Controls Logic
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="listening-container">
      <style jsx>{`
        /* --- ASOSIY CONTAINER --- */
        .listening-container {
            /* Sizning Oq/Ko'k stiliz */
            background: #f8fafc;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            padding-bottom: 50px;
        }

        /* --- 1. STICKY PLAYER (Eng muhim qismi) --- */
        .sticky-player {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e2e8f0;
            padding: 15px 20px;
            box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }

        .player-controls {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
        }

        .play-btn {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
            transition: 0.2s;
        }
        .play-btn:hover { transform: scale(1.05); }

        .progress-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .time-text {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            min-width: 40px;
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            background: #e2e8f0;
            border-radius: 10px;
            outline: none;
            cursor: pointer;
        }
        .progress-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .volume-control {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100px;
        }

        /* --- 2. SECTION TABS --- */
        .section-tabs-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 20px;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
        }

        .section-tab {
            padding: 10px 25px;
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            color: #64748b;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
        }
        
        .section-tab.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
        }

        /* --- 3. QUESTION PAPER (Oq Qog'oz) --- */
        .question-paper {
            max-width: 900px;
            margin: 30px auto;
            background: white;
            padding: 50px;
            border-radius: 20px;
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }

        .section-header h2 {
            font-size: 24px;
            color: #1e293b;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }

        .question-item {
            margin-bottom: 25px;
            padding: 15px;
            border-radius: 12px;
            transition: 0.2s;
        }
        .question-item:hover {
            background: #f8fafc;
        }

        .q-number {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: #e0f2fe;
            color: #0369a1;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            font-weight: 700;
            margin-right: 15px;
            font-size: 14px;
        }

        .q-text {
            font-size: 16px;
            color: #334155;
            font-weight: 500;
        }

        /* --- INPUT STYLES (IELTS Style) --- */
        .ielts-input {
            border: none;
            border-bottom: 2px solid #cbd5e1;
            background: transparent;
            padding: 5px 10px;
            font-size: 16px;
            color: #3b82f6;
            font-weight: 600;
            width: 200px;
            transition: 0.3s;
        }
        .ielts-input:focus {
            outline: none;
            border-bottom-color: #3b82f6;
            background: #eff6ff;
        }

        .radio-options {
            margin-top: 10px;
            margin-left: 45px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .radio-label {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid transparent;
            transition: 0.2s;
        }
        .radio-label:hover {
            background: white;
            border-color: #e2e8f0;
        }
        .radio-label input {
            accent-color: #3b82f6;
            width: 18px;
            height: 18px;
        }

      `}</style>

      {/* 1. STICKY AUDIO PLAYER */}
      <div className="sticky-player">
        <div className="player-controls">
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play" style={{marginLeft:'4px'}}></i>}
          </button>

          <div className="progress-wrapper">
            <span className="time-text">{formatTime(currentTime)}</span>
            <input 
              type="range" 
              className="progress-bar"
              min="0" 
              max={duration || 100} 
              value={currentTime}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                setCurrentTime(e.target.value);
              }}
            />
            <span className="time-text">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume-control">
          <i className="fas fa-volume-up" style={{color: '#64748b'}}></i>
          <input 
            type="range" 
            min="0" max="1" step="0.1" 
            value={volume}
            onChange={(e) => {
                setVolume(e.target.value);
                audioRef.current.volume = e.target.value;
            }}
            style={{width: '80px', accentColor: '#64748b'}}
          />
        </div>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef}
          src={sections[currentSection].audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* 2. SECTION TABS */}
      <div className="section-tabs-container">
        {sections.map((sec, idx) => (
            <button 
                key={sec.id}
                className={`section-tab ${currentSection === idx ? 'active' : ''}`}
                onClick={() => {
                    setCurrentSection(idx);
                    setIsPlaying(false);
                }}
            >
                {sec.title}
            </button>
        ))}
      </div>

      {/* 3. QUESTION PAPER */}
      <motion.div 
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="question-paper"
      >
        <div className="section-header">
            <h2>{sections[currentSection].topic}</h2>
            <p style={{color:'#64748b', marginBottom:'20px'}}>
                Listen to the audio and answer questions {sections[currentSection].questions[0].id} - {sections[currentSection].questions[sections[currentSection].questions.length-1].id}
            </p>
        </div>

        <div className="questions-list">
            {sections[currentSection].questions.map((q) => (
                <div key={q.id} className="question-item">
                    <div>
                        <span className="q-number">{q.id}</span>
                        {q.type === 'fill-blank' ? (
                            <span className="q-text">
                                {q.text.split('____________')[0]}
                                <input type="text" className="ielts-input" placeholder="answer..." />
                                {q.text.split('____________')[1]}
                            </span>
                        ) : (
                            <span className="q-text">{q.text}</span>
                        )}
                    </div>

                    {q.type === 'radio' && (
                        <div className="radio-options">
                            {q.options.map((opt, i) => (
                                <label key={i} className="radio-label">
                                    <input type="radio" name={`q-${q.id}`} />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </motion.div>

    </div>
  )
}

export default ListeningTest
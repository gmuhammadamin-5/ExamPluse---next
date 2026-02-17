import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GroupChat = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [userStatus, setUserStatus] = useState('online');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [messageSentAnim, setMessageSentAnim] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingInterval = useRef(null);
  const typingTimeout = useRef(null);
  const waveAnimationRef = useRef(null);
  const particlesRef = useRef([]);

  // Loading va animation effectlar
  useEffect(() => {
    // Fake loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    // Particle animation
    const createParticles = () => {
      particlesRef.current = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 3,
        speed: Math.random() * 0.5 + 0.2,
        color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 5)]
      }));
    };

    createParticles();

    // Animation loop
    const animateParticles = () => {
      particlesRef.current = particlesRef.current.map(p => ({
        ...p,
        y: (p.y - p.speed) % 100,
        x: (p.x + Math.sin(Date.now() * 0.001 + p.id) * 0.1) % 100
      }));
      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      if (waveAnimationRef.current) {
        cancelAnimationFrame(waveAnimationRef.current);
      }
    };
  }, []);

  // Online userlar ro'yxati
  const initialUsers = [
    { id: 'alex', name: 'Alex Johnson', avatar: '👨‍💼', country: '🇺🇸', status: 'online', color: '#4F46E5' },
    { id: 'sarah', name: 'Sarah Miller', avatar: '👩‍🎓', country: '🇬🇧', status: 'online', color: '#10B981' },
    { id: 'mike', name: 'Mike Chen', avatar: '👨‍🔬', country: '🇦🇺', status: 'online', color: '#F59E0B' },
    { id: 'lisa', name: 'Lisa Park', avatar: '👩‍🏫', country: '🇰🇷', status: 'online', color: '#EF4444' },
    { id: 'raj', name: 'Raj Patel', avatar: '👨‍💻', country: '🇮🇳', status: 'online', color: '#8B5CF6' },
  ];

  // Emojilar
  const emojis = ['😀', '😂', '😍', '🥰', '😎', '👍', '❤️', '🔥', '🎉', '👏', '🤔', '🎯', '💡', '✨', '🌟'];

  // Chatni boshlash
  useEffect(() => {
    if (isLoading) return;

    const welcomeMessages = [
      {
        id: 1,
        userId: 'system',
        userName: '💬 Global Chat',
        text: `Welcome to Global Chat! ${user?.name || 'Friend'} has joined the conversation.`,
        timestamp: new Date(),
        type: 'system',
        avatar: '💬',
        color: '#6366F1'
      },
      {
        id: 2,
        userId: 'alex',
        userName: 'Alex Johnson',
        text: "Hey everyone! How's your day going? 👋",
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        avatar: '👨‍💼',
        color: '#4F46E5',
        country: '🇺🇸'
      },
      {
        id: 3,
        userId: 'sarah',
        userName: 'Sarah Miller',
        text: "Hello! Just finished work, feeling great! 🎉",
        timestamp: new Date(Date.now() - 240000),
        type: 'text',
        avatar: '👩‍🎓',
        color: '#10B981',
        country: '🇬🇧'
      }
    ];

    setMessages(welcomeMessages);
    setFilteredMessages(welcomeMessages);
    setOnlineUsers([...initialUsers, { 
      id: user?.id || 'you', 
      name: user?.name || 'You', 
      avatar: '👤', 
      country: '🌟', 
      status: userStatus,
      color: '#EC4899'
    }]);

    // Auto-scroll
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Yangi foydalanuvchi qo'shilishi
    const joinInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const countries = ['🇨🇦', '🇩🇪', '🇫🇷', '🇯🇵', '🇸🇬', '🇧🇷'];
        const names = ['David', 'Emma', 'Sophia', 'James', 'Olivia', 'William'];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        
        const newUser = {
          id: `${name.toLowerCase()}_${Date.now()}`,
          name: `${name}`,
          avatar: '👤',
          country: country,
          status: 'online',
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        };

        setOnlineUsers(prev => {
          const updated = [...prev, newUser];
          return updated.slice(-20);
        });

        const joinMsg = {
          id: Date.now(),
          userId: 'system',
          userName: '👋 New User',
          text: `${name} ${country} has joined the chat!`,
          timestamp: new Date(),
          type: 'join',
          avatar: '👤',
          color: '#10B981'
        };

        setMessages(prev => [...prev, joinMsg]);
        setFilteredMessages(prev => [...prev, joinMsg]);
      }
    }, 30000);

    // Random xabarlar
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.8 && onlineUsers.length > 2) {
        const randomUser = onlineUsers[Math.floor(Math.random() * (onlineUsers.length - 1))];
        if (randomUser && randomUser.id !== user?.id) {
          const randomMessages = [
            "Anyone up for a quick chat? 💬",
            "What are you all working on today? 👨‍💻",
            "Beautiful weather today! ☀️",
            "Just discovered this awesome chat! 🎊",
            "How's everyone doing? 😊",
            "Any plans for the weekend? 🎯",
            "Learning new things every day! 📚",
            "Coffee break time! ☕"
          ];

          const randomMsg = {
            id: Date.now(),
            userId: randomUser.id,
            userName: randomUser.name,
            text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
            timestamp: new Date(),
            type: 'text',
            avatar: randomUser.avatar,
            color: randomUser.color,
            country: randomUser.country
          };

          setMessages(prev => [...prev, randomMsg]);
          setFilteredMessages(prev => [...prev, randomMsg]);
          setNewMessageCount(prev => prev + 1);
        }
      }
    }, 45000);

    return () => {
      clearInterval(joinInterval);
      clearInterval(messageInterval);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [user, isLoading]);

  // Avtomatik pastga scroll qilish
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  // Qidiruv
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(msg =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, messages]);

  // Ovozli xabar yozish
  const startVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      clearInterval(recordingInterval.current);
      
      if (recordingTime >= 2) {
        const voiceMessage = {
          id: Date.now(),
          userId: user?.id,
          userName: user?.name || 'You',
          text: '🎤 Voice message',
          timestamp: new Date(),
          type: 'voice',
          avatar: '🎤',
          duration: `${recordingTime}s`,
          color: '#EC4899',
          country: '🌟'
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        setFilteredMessages(prev => [...prev, voiceMessage]);
      }
      
      setRecordingTime(0);
    }
  };

  // Xabar yuborish
  const sendMessage = () => {
    if (!message.trim()) return;

    // Typing ko'rsatkichlari
    const randomTypers = onlineUsers
      .filter(u => u.id !== user?.id && Math.random() > 0.5)
      .slice(0, 2)
      .map(u => u.name);
    
    if (randomTypers.length > 0) {
      setTypingUsers(randomTypers);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setTypingUsers([]);
      }, 2000);
    }

    // Foydalanuvchi xabari
    const userMessage = {
      id: Date.now(),
      userId: user?.id,
      userName: user?.name || 'You',
      text: message,
      timestamp: new Date(),
      type: 'text',
      avatar: '👤',
      color: '#EC4899',
      country: '🌟',
      read: true
    };

    setMessages(prev => [...prev, userMessage]);
    setFilteredMessages(prev => [...prev, userMessage]);
    setMessage('');
    setShowEmojiPicker(false);
    
    // Animation effect
    setMessageSentAnim(true);
    setTimeout(() => setMessageSentAnim(false), 1000);

    // Avtomatik javoblar
    setTimeout(() => {
      setTypingUsers([]);
      
      // Boshqa foydalanuvchilardan javoblar
      const responders = onlineUsers
        .filter(u => u.id !== user?.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 1);

      responders.forEach((responder, index) => {
        setTimeout(() => {
          const responses = [
            "Great to hear! 👍",
            "Thanks for sharing! 😊",
            "That's awesome! 🎉",
            "I agree with you! 👏",
            "Interesting point! 🤔",
            "Let's continue this! 💬",
            "Wow, that's cool! ✨",
            "Nice one! 😎"
          ];

          const responseMsg = {
            id: Date.now() + index,
            userId: responder.id,
            userName: responder.name,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            type: 'text',
            avatar: responder.avatar,
            color: responder.color,
            country: responder.country,
            read: false
          };

          setMessages(prev => [...prev, responseMsg]);
          setFilteredMessages(prev => [...prev, responseMsg]);
          setNewMessageCount(prev => prev + 1);
        }, index * 1500 + 1000);
      });
    }, 1500);
  };

  // Fayl yuklash
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadProgress({ fileName: file.name, progress: 0 });
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (!prev) return null;
        
        const newProgress = prev.progress + 20;
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          
          const fileMessage = {
            id: Date.now(),
            userId: user?.id,
            userName: user?.name || 'You',
            text: `📎 ${file.name}`,
            timestamp: new Date(),
            type: 'file',
            avatar: '📎',
            color: '#06B6D4',
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          };

          setMessages(prev => [...prev, fileMessage]);
          setFilteredMessages(prev => [...prev, fileMessage]);
          
          setTimeout(() => setUploadProgress(null), 1500);
          return null;
        }
        
        return { ...prev, progress: newProgress };
      });
    }, 200);
  };

  // Reaction qo'shish
  const addReaction = (messageId, emoji) => {
    setMessageReactions(prev => {
      const current = prev[messageId] || {};
      const count = current[emoji] || 0;
      return {
        ...prev,
        [messageId]: { ...current, [emoji]: count + 1 }
      };
    });
  };

  // Vaqtni formatlash
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Ovozli xabarni ijro etish
  const playVoiceMessage = (msgId) => {
    if (playingAudio === msgId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(msgId);
      setTimeout(() => {
        setPlayingAudio(null);
      }, 3000);
    }
  };

  // Statusni o'zgartirish
  const toggleUserStatus = () => {
    setUserStatus(prev => prev === 'online' ? 'away' : 'online');
  };

  // Loading komponenti
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px'
      }}>
        <div style={{
          textAlign: 'center',
          transformStyle: 'preserve-3d'
        }}>
          {/* 3D Chat Icon */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 40px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'float3D 6s infinite linear'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transform: 'translateZ(20px)'
            }}>
              💬
            </div>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              filter: 'blur(20px)',
              transform: 'translateZ(-20px)'
            }} />
          </div>
          
          {/* Text */}
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '20px',
            position: 'relative'
          }}>
            <span style={{ 
              color: '#1e40af',
              transform: 'translateZ(10px)'
            }}>Global</span>
            {' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #3b82f6)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s infinite linear',
              transform: 'translateZ(15px)'
            }}>
              Chat
            </span>
          </div>
          
          {/* Loading Message */}
          <p style={{
            color: '#4a5568',
            fontSize: '1.2rem',
            maxWidth: '400px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
            transform: 'translateZ(5px)'
          }}>
            Connecting to worldwide conversations...
          </p>

          {/* 3D Loading Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            transformStyle: 'preserve-3d'
          }}>
            {[0, 1, 2].map(i => (
              <div 
                key={i}
                style={{
                  width: '20px',
                  height: '20px',
                  background: `linear-gradient(135deg, #3b82f6, #8b5cf6)`,
                  borderRadius: '50%',
                  animation: `float3D 2s ease-in-out infinite ${i * 0.2}s`,
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)',
                  transformStyle: 'preserve-3d'
                }}
              />
            ))}
          </div>
        </div>
        
        <style jsx="true">{`
          @keyframes float3D {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            33% { transform: rotateX(10deg) rotateY(120deg); }
            66% { transform: rotateX(-5deg) rotateY(240deg); }
            100% { transform: rotateX(0deg) rotateY(360deg); }
          }
          
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 300% 50%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Animated Background Particles */}
      <div style={styles.particlesContainer}>
        {particlesRef.current.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>
              <div style={{
                ...styles.logoIcon,
                animation: 'logoFloat 4s ease-in-out infinite',
                transformStyle: 'preserve-3d'
              }}>
                💬
              </div>
              <div style={styles.logoText}>
                <h1 style={styles.title}>Global Chat</h1>
                <p style={styles.subtitle}>Connect with people worldwide 🌍</p>
              </div>
            </div>
          </div>
          
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statIcon}>👥</div>
              <div>
                <div style={styles.statNumber}>{onlineUsers.length}</div>
                <div style={styles.statLabel}>Online</div>
              </div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statIcon}>💬</div>
              <div>
                <div style={styles.statNumber}>{messages.length}</div>
                <div style={styles.statLabel}>Messages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.main}>
        {/* Asosiy chat qismi */}
        <div style={styles.chatContainer}>
          {/* Chat header */}
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderContent}>
              <div style={styles.chatInfo}>
                <div style={{
                  ...styles.chatIcon,
                  animation: 'globeRotate 10s infinite linear'
                }}>
                  🌍
                </div>
                <div>
                  <h2 style={styles.chatTitle}>Global Chat Room</h2>
                  <div style={styles.chatStatus}>
                    <span style={styles.onlineDot}></span>
                    <span>{onlineUsers.filter(u => u.status === 'online').length} online now</span>
                  </div>
                </div>
              </div>
              
              <div style={styles.chatActions}>
                <div style={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                  <div style={styles.searchIcon}>🔍</div>
                </div>
              </div>
            </div>
          </div>

          {/* Xabarlar */}
          <div style={styles.messagesContainer} ref={chatContainerRef}>
            {filteredMessages.map((msg, index) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageWrapper,
                  flexDirection: msg.userId === user?.id ? 'row-reverse' : 'row',
                  animation: 'messageSlide 0.3s ease-out'
                }}
              >
                {/* Avatar - 3D Effect */}
                {msg.userId !== user?.id && (
                  <div 
                    style={styles.avatarContainer}
                    onMouseEnter={() => setHoveredUser(msg.userId)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <div style={{
                      ...styles.avatar,
                      backgroundColor: `${msg.color}20`,
                      color: msg.color,
                      transform: hoveredUser === msg.userId ? 'scale(1.1) rotateY(10deg)' : 'scale(1)',
                      boxShadow: hoveredUser === msg.userId ? `0 15px 30px ${msg.color}40` : '0 8px 20px rgba(0, 0, 0, 0.1)'
                    }}>
                      {msg.avatar}
                    </div>
                    {msg.country && (
                      <div style={styles.country}>{msg.country}</div>
                    )}
                  </div>
                )}

                {/* Xabar */}
                <div style={{
                  ...styles.messageContent,
                  alignItems: msg.userId === user?.id ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    ...styles.messageBubble,
                    backgroundColor: msg.userId === user?.id ? '#EC4899' : 'white',
                    borderColor: msg.userId === user?.id ? 'transparent' : '#E5E7EB',
                    transform: msg.userId === user?.id ? 'translateZ(10px)' : 'translateZ(5px)',
                    transformStyle: 'preserve-3d'
                  }}>
                    {msg.userId !== user?.id && (
                      <div style={styles.messageHeader}>
                        <span style={{...styles.senderName, color: msg.color}}>
                          {msg.userName}
                        </span>
                        <span style={styles.messageTime}>{formatTime(msg.timestamp)}</span>
                      </div>
                    )}

                    <div style={styles.messageBody}>
                      {msg.type === 'voice' ? (
                        <div style={styles.voiceMessage}>
                          <button
                            onClick={() => playVoiceMessage(msg.id)}
                            style={{
                              ...styles.playButton,
                              backgroundColor: playingAudio === msg.id ? '#EC4899' : '#EC489920',
                              transform: playingAudio === msg.id ? 'scale(1.1)' : 'scale(1)'
                            }}
                          >
                            {playingAudio === msg.id ? '⏸️' : '▶️'}
                          </button>
                          <div style={styles.voiceInfo}>
                            <div style={styles.voiceTitle}>Voice Message</div>
                            <div style={styles.voiceDuration}>{msg.duration}</div>
                          </div>
                          <div style={styles.voiceWave}>
                            {Array.from({ length: 20 }, (_, i) => (
                              <div
                                key={i}
                                style={{
                                  ...styles.voiceBar,
                                  height: `${20 + Math.random() * 40}%`,
                                  animation: playingAudio === msg.id ? `wave ${0.5 + i * 0.05}s infinite alternate` : 'none'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : msg.type === 'file' ? (
                        <div style={styles.fileMessage}>
                          <div style={styles.fileIcon}>📎</div>
                          <div style={styles.fileDetails}>
                            <div style={styles.fileName}>{msg.fileName}</div>
                            <div style={styles.fileSize}>{msg.fileSize}</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          ...styles.messageText,
                          color: msg.userId === user?.id ? 'white' : '#1F2937'
                        }}>
                          {msg.text}
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {messageReactions[msg.id] && (
                      <div style={styles.reactions}>
                        {Object.entries(messageReactions[msg.id]).map(([emoji, count]) => (
                          <div key={emoji} style={styles.reaction}>
                            {emoji} {count}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message actions */}
                    <div style={styles.messageActions}>
                      {msg.userId !== user?.id && (
                        <>
                          <button
                            onClick={() => addReaction(msg.id, '👍')}
                            style={styles.actionButton}
                          >
                            👍
                          </button>
                          <button
                            onClick={() => addReaction(msg.id, '❤️')}
                            style={styles.actionButton}
                          >
                            ❤️
                          </button>
                          <button
                            onClick={() => addReaction(msg.id, '😂')}
                            style={styles.actionButton}
                          >
                            😂
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Message status */}
                  {msg.userId === user?.id && (
                    <div style={styles.messageStatus}>
                      <span style={styles.time}>{formatTime(msg.timestamp)}</span>
                      <span style={styles.readStatus}>✓✓</span>
                    </div>
                  )}
                </div>

                {/* User avatar - 3D Effect */}
                {msg.userId === user?.id && (
                  <div style={styles.avatarContainer}>
                    <div style={{
                      ...styles.userAvatar,
                      animation: messageSentAnim ? 'bounce 0.5s ease' : 'none'
                    }}>
                      👤
                    </div>
                    <div style={styles.userStatus}>
                      {userStatus === 'online' ? '🟢' : '🟡'}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicators */}
            {typingUsers.length > 0 && (
              <div style={styles.typingIndicator}>
                <div style={styles.typingDots}>
                  <div style={{...styles.typingDot, animationDelay: '0s'}}></div>
                  <div style={{...styles.typingDot, animationDelay: '0.2s'}}></div>
                  <div style={{...styles.typingDot, animationDelay: '0.4s'}}></div>
                </div>
                <div style={styles.typingText}>
                  {typingUsers.join(', ')} is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Upload progress */}
          {uploadProgress && (
            <div style={styles.uploadProgress}>
              <div style={styles.progressBar}>
                <div
                  style={{
                    width: `${uploadProgress.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #EC4899, #8B5CF6)',
                    borderRadius: '6px',
                    transition: 'width 0.3s ease',
                    transform: 'translateZ(5px)'
                  }}
                />
              </div>
              <div style={styles.progressText}>
                📤 Uploading {uploadProgress.fileName}... {uploadProgress.progress}%
              </div>
            </div>
          )}

          {/* Voice recording */}
          {isRecording && (
            <div style={styles.recordingIndicator}>
              <div style={styles.recordingVisualization}>
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.recordingBar,
                      height: `${20 + Math.random() * 60}%`,
                      animation: `pulse ${0.2 + i * 0.02}s infinite alternate`
                    }}
                  />
                ))}
              </div>
              <div style={styles.recordingInfo}>
                <div style={styles.recordingRedDot}></div>
                <span>Recording... {recordingTime}s</span>
                <span style={styles.recordingTip}>🎤 Speak now</span>
              </div>
            </div>
          )}

          {/* Emoji picker - 3D Effect */}
          {showEmojiPicker && (
            <div style={styles.emojiPicker}>
              <div style={styles.emojiGrid}>
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    style={{
                      ...styles.emojiButton,
                      transform: 'translateZ(10px)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateZ(20px) scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(10px) scale(1)'}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{
                  ...styles.iconButton,
                  animation: showEmojiPicker ? 'emojiPulse 1s infinite' : 'none'
                }}
              >
                😊
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                style={styles.iconButton}
              >
                📎
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              
              <div style={styles.textInputWrapper}>
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  style={styles.textInput}
                  maxLength="500"
                />
                <div style={styles.charCount}>
                  {message.length}/500
                </div>
              </div>
              
              <button
                onClick={startVoiceRecording}
                style={{
                  ...styles.iconButton,
                  ...styles.voiceButton,
                  ...(isRecording && styles.recording),
                  transform: isRecording ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {isRecording ? (
                  <>
                    <div style={styles.recordingPulse}></div>
                    {recordingTime}s
                  </>
                ) : (
                  '🎤'
                )}
              </button>
              
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                style={{
                  ...styles.sendButton,
                  animation: !message.trim() ? 'none' : 'sendGlow 2s infinite'
                }}
              >
                <span>Send</span>
                <div style={styles.sendArrow}>→</div>
              </button>
            </div>
          </div>
        </div>

        {/* Online users sidebar - 3D Effect */}
        <div style={{
          ...styles.sidebar,
          transform: 'perspective(1000px) rotateY(-5deg)',
          transformStyle: 'preserve-3d'
        }}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>🌍 Online Now</h3>
            <div style={styles.onlineBadge}>
              {onlineUsers.filter(u => u.status === 'online').length}
            </div>
          </div>
          
          <div style={styles.usersList}>
            {onlineUsers.map(userItem => (
              <div 
                key={userItem.id} 
                style={{
                  ...styles.userItem,
                  transform: hoveredUser === userItem.id ? 'translateX(10px) translateZ(10px)' : 'translateZ(0)'
                }}
                onMouseEnter={() => setHoveredUser(userItem.id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div style={styles.userInfo}>
                  <div style={{
                    ...styles.userAvatar,
                    backgroundColor: `${userItem.color}20`,
                    color: userItem.color,
                    transform: hoveredUser === userItem.id ? 'rotateY(15deg)' : 'rotateY(0deg)'
                  }}>
                    {userItem.avatar}
                  </div>
                  <div style={styles.userDetails}>
                    <div style={styles.userName}>
                      {userItem.name}
                      {userItem.id === user?.id && (
                        <span style={styles.youBadge}> (You)</span>
                      )}
                    </div>
                    <div style={styles.userCountry}>{userItem.country}</div>
                  </div>
                </div>
                <div style={{
                  ...styles.statusIndicator,
                  backgroundColor: userItem.status === 'online' ? '#10B981' : '#F59E0B',
                  animation: userItem.status === 'online' ? 'statusPulse 2s infinite' : 'none'
                }} />
              </div>
            ))}
          </div>
          
          <div style={styles.sidebarFooter}>
            <button
              onClick={toggleUserStatus}
              style={styles.statusButton}
            >
              <div style={{
                ...styles.statusButtonDot,
                backgroundColor: userStatus === 'online' ? '#10B981' : '#F59E0B',
                animation: userStatus === 'online' ? 'statusPulse 2s infinite' : 'none'
              }} />
              <span>{userStatus === 'online' ? '🟢 Online' : '🟡 Away'}</span>
            </button>
            
            {newMessageCount > 0 && (
              <div style={styles.newMessageBadge}>
                🔔 {newMessageCount} new
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animatsiyalar */}
      <style jsx="true">{`
        @keyframes wave {
          0% { height: 20%; }
          100% { height: 80%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes messageSlide {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes logoFloat {
          0%, 100% { 
            transform: translateY(0) rotateY(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotateY(10deg); 
          }
        }
        
        @keyframes globeRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes statusPulse {
          0%, 100% { 
            opacity: 1; 
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          50% { 
            opacity: 0.8; 
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
        }
        
        @keyframes sendGlow {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
          }
          50% { 
            box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5);
          }
        }
        
        @keyframes emojiPulse {
          0%, 100% { 
            transform: scale(1);
            background-color: #F9FAFB;
          }
          50% { 
            transform: scale(1.1);
            background-color: #EC489910;
          }
        }
        
        @keyframes float3D {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotateX(10deg); 
          }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

// Asosiy kontener
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  particlesContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },
  header: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    padding: '24px 0',
    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
    position: 'relative',
    zIndex: 100
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transformStyle: 'preserve-3d'
  },
  logoIcon: {
    fontSize: '3rem',
    background: 'rgba(255, 255, 255, 0.2)',
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
    transformStyle: 'preserve-3d'
  },
  logoText: {
    color: 'white'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: 0,
    background: 'linear-gradient(45deg, #fff, #f0f0f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.025em',
    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '8px 0 0 0',
    fontWeight: '400',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  stats: {
    display: 'flex',
    gap: '24px'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '20px 28px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    transformStyle: 'preserve-3d',
    transform: 'translateZ(20px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
  },
  statIcon: {
    fontSize: '2rem',
    opacity: 0.9
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'white',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    letterSpacing: '0.05em',
    marginTop: '6px',
    textTransform: 'uppercase'
  },
  main: {
    flex: 1,
    display: 'flex',
    maxWidth: '1400px',
    margin: '40px auto',
    width: '100%',
    padding: '0 32px',
    gap: '32px',
    minHeight: 'calc(100vh - 180px)',
    position: 'relative',
    zIndex: 10
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: '28px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    transformStyle: 'preserve-3d'
  },
  chatHeader: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    padding: '28px'
  },
  chatHeaderContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px'
  },
  chatInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  chatIcon: {
    fontSize: '3rem',
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    backgroundColor: '#F0F9FF',
    color: '#0EA5E9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(14, 165, 233, 0.2)',
    transformStyle: 'preserve-3d'
  },
  chatTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  chatStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1rem',
    color: '#6B7280',
    marginTop: '8px',
    fontWeight: '500'
  },
  onlineDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#10B981',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
  },
  chatActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  searchBox: {
    position: 'relative'
  },
  searchInput: {
    padding: '14px 20px 14px 52px',
    backgroundColor: '#F9FAFB',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    fontSize: '1rem',
    minWidth: '300px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#3B82F6',
    fontSize: '1.1rem'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  messageWrapper: {
    display: 'flex',
    gap: '16px',
    transformStyle: 'preserve-3d'
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    transformStyle: 'preserve-3d',
    transition: 'all 0.3s ease'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
  },
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0,
    backgroundColor: '#EC4899',
    color: 'white',
    boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)'
  },
  country: {
    fontSize: '0.8rem',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '4px 10px',
    borderRadius: '10px',
    color: '#3B82F6',
    fontWeight: '600'
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '70%',
    transformStyle: 'preserve-3d'
  },
  messageBubble: {
    padding: '20px',
    borderRadius: '22px',
    position: 'relative',
    wordBreak: 'break-word',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    border: '1px solid #E5E7EB',
    transition: 'all 0.3s ease'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  senderName: {
    fontSize: '1rem',
    fontWeight: '700'
  },
  messageTime: {
    fontSize: '0.8rem',
    color: '#9CA3AF',
    fontWeight: '500'
  },
  messageBody: {
    marginBottom: '16px'
  },
  messageText: {
    fontSize: '1.05rem',
    lineHeight: 1.6
  },
  voiceMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px',
    backgroundColor: '#F3F4F6',
    borderRadius: '16px',
    border: '1px solid rgba(236, 72, 153, 0.2)'
  },
  playButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(236, 72, 153, 0.3)'
  },
  voiceInfo: {
    textAlign: 'center',
    minWidth: '100px'
  },
  voiceTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '6px'
  },
  voiceDuration: {
    fontSize: '0.9rem',
    color: '#6B7280',
    fontWeight: '500'
  },
  voiceWave: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '3px',
    height: '48px',
    flex: 1
  },
  voiceBar: {
    width: '4px',
    backgroundColor: '#EC4899',
    borderRadius: '3px',
    opacity: 0.7
  },
  fileMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#F3F4F6',
    borderRadius: '16px',
    border: '1px solid rgba(14, 165, 233, 0.2)'
  },
  fileIcon: {
    fontSize: '2rem',
    color: '#06B6D4'
  },
  fileDetails: {
    flex: 1
  },
  fileName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '6px'
  },
  fileSize: {
    fontSize: '0.9rem',
    color: '#6B7280',
    fontWeight: '500'
  },
  reactions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  reaction: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#3B82F6',
    fontWeight: '600',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  messageActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  },
  messageStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px',
    justifyContent: 'flex-end'
  },
  time: {
    fontSize: '0.8rem',
    color: '#9CA3AF',
    fontWeight: '500'
  },
  readStatus: {
    fontSize: '0.9rem',
    color: '#10B981',
    fontWeight: '700'
  },
  userStatus: {
    fontSize: '1rem'
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: 'white',
    borderRadius: '20px',
    width: 'fit-content',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    border: '1px solid #E5E7EB',
    marginLeft: '66px'
  },
  typingDots: {
    display: 'flex',
    gap: '6px'
  },
  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#EC4899',
    borderRadius: '50%',
    animation: 'bounce 1.2s infinite ease-in-out'
  },
  typingText: {
    fontSize: '1rem',
    color: '#6B7280',
    fontWeight: '600'
  },
  uploadProgress: {
    margin: '0 32px 32px 32px',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(236, 72, 153, 0.2)',
    transformStyle: 'preserve-3d'
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '12px',
    transform: 'translateZ(5px)'
  },
  progressText: {
    fontSize: '1rem',
    color: '#6B7280',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  recordingIndicator: {
    margin: '0 32px 32px 32px',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    backdropFilter: 'blur(10px)'
  },
  recordingVisualization: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '3px',
    height: '50px',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  recordingBar: {
    width: '5px',
    backgroundColor: '#EF4444',
    borderRadius: '3px'
  },
  recordingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'center',
    color: '#DC2626',
    fontSize: '1.1rem',
    fontWeight: '600'
  },
  recordingRedDot: {
    width: '14px',
    height: '14px',
    backgroundColor: '#DC2626',
    borderRadius: '50%',
    animation: 'pulse 1s infinite',
    boxShadow: '0 0 15px rgba(220, 38, 38, 0.5)'
  },
  recordingTip: {
    fontSize: '0.9rem',
    color: '#EF4444',
    marginLeft: 'auto',
    fontWeight: '500'
  },
  emojiPicker: {
    margin: '0 32px 32px 32px',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    backdropFilter: 'blur(10px)',
    transformStyle: 'preserve-3d'
  },
  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '12px'
  },
  emojiButton: {
    fontSize: '1.8rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    transformStyle: 'preserve-3d'
  },
  inputContainer: {
    padding: '32px',
    backgroundColor: 'white',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconButton: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: '#F9FAFB',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    color: '#3B82F6',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  voiceButton: {
    position: 'relative'
  },
  recording: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: '#DC2626'
  },
  recordingPulse: {
    width: '14px',
    height: '14px',
    backgroundColor: '#DC2626',
    borderRadius: '50%',
    marginRight: '10px',
    animation: 'pulse 1s infinite',
    boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
  },
  textInputWrapper: {
    flex: 1,
    position: 'relative'
  },
  textInput: {
    width: '100%',
    padding: '18px 24px',
    backgroundColor: '#F9FAFB',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    fontSize: '1.1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  charCount: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.9rem',
    color: '#9CA3AF',
    backgroundColor: 'white',
    padding: '4px 12px',
    borderRadius: '10px',
    fontWeight: '500'
  },
  sendButton: {
    padding: '18px 36px',
    background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
    boxShadow: '0 8px 30px rgba(236, 72, 153, 0.4)',
    transformStyle: 'preserve-3d'
  },
  sendArrow: {
    fontSize: '1.2rem',
    opacity: 0.9
  },
  sidebar: {
    width: '350px',
    backgroundColor: '#FFFFFF',
    borderRadius: '28px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease'
  },
  sidebarHeader: {
    padding: '28px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF'
  },
  sidebarTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  onlineBadge: {
    backgroundColor: '#10B981',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '700',
    padding: '6px 16px',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
  },
  usersList: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    transformStyle: 'preserve-3d'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '4px'
  },
  youBadge: {
    color: '#EC4899',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  userCountry: {
    fontSize: '0.9rem',
    color: '#3B82F6',
    fontWeight: '600'
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
  },
  sidebarFooter: {
    padding: '24px',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statusButton: {
    width: '100%',
    padding: '16px 20px',
    backgroundColor: '#F9FAFB',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  statusButtonDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor'
  },
  newMessageBadge: {
    backgroundColor: '#EC4899',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '16px',
    fontSize: '0.9rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
    animation: 'bounce 1s infinite'
  }
};

export default GroupChat;
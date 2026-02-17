import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProfileSettings = () => {
  const { user, updateUserProfile, deleteAccount, logout } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    targetBand: user?.targetBand || '6.5',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    emailUpdates: false,
    studyReminders: true,
    speakingPractice: true,
    writingPractice: true,
    readingPractice: true,
    listeningPractice: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC+5'
  })
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const logoRef = useRef(null)
  
  // Logo rotation effect
  useEffect(() => {
    const logo = logoRef.current
    if (logo) {
      let rotation = 0
      const interval = setInterval(() => {
        rotation += 0.5
        if (rotation >= 360) rotation = 0
        logo.style.transform = `rotate(${rotation}deg)`
      }, 20)
      return () => clearInterval(interval)
    }
  }, [])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await updateUserProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        targetBand: formData.targetBand,
        notifications: formData.notifications,
        emailUpdates: formData.emailUpdates,
        studyReminders: formData.studyReminders,
        speakingPractice: formData.speakingPractice,
        writingPractice: formData.writingPractice,
        readingPractice: formData.readingPractice,
        listeningPractice: formData.listeningPractice,
        theme: formData.theme,
        language: formData.language,
        timezone: formData.timezone
      })
      
      setMessage({ type: 'success', text: 'Profile updated successfully! 🎉' })
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile: ' + error.message })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match 🔒' })
      return
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long 📝' })
      return
    }
    
    setMessage({ type: 'success', text: 'Password changed successfully! 🔐' })
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }))
  }
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your test results? This action cannot be undone.')) {
      try {
        // LocalStorage'dan test natijalarini o'chirish
        localStorage.removeItem('ielts_test_results')
        localStorage.removeItem('ielts_progress')
        localStorage.removeItem('ielts_scores')
        localStorage.removeItem('ielts_attempts')
        localStorage.removeItem('ielts_analytics')
        
        setMessage({ type: 'success', text: 'All test results have been cleared! 🧹' })
      } catch (error) {
        setMessage({ type: 'error', text: 'Error clearing data: ' + error.message })
      }
    }
  }
  
  const handleAccountDelete = async () => {
    const confirm1 = window.confirm('⚠️ Are you sure you want to delete your account? This will permanently remove ALL your data.')
    if (confirm1) {
      const confirm2 = window.confirm('🚨 FINAL WARNING: All your progress, test results, and personal data will be lost forever.')
      if (confirm2) {
        const deleteText = prompt('Type "DELETE MY ACCOUNT" to confirm:')
        if (deleteText === 'DELETE MY ACCOUNT') {
          try {
            await deleteAccount()
            navigate('/')
          } catch (error) {
            setMessage({ type: 'error', text: 'Error deleting account: ' + error.message })
          }
        }
      }
    }
  }
  
  const handleExportData = () => {
    const userData = {
      profile: user,
      settings: formData,
      exportDate: new Date().toISOString(),
      testResults: JSON.parse(localStorage.getItem('ielts_test_results') || '[]'),
      progress: JSON.parse(localStorage.getItem('ielts_progress') || '{}'),
      scores: JSON.parse(localStorage.getItem('ielts_scores') || '{}'),
      attempts: JSON.parse(localStorage.getItem('ielts_attempts') || '{}'),
      analytics: JSON.parse(localStorage.getItem('ielts_analytics') || '{}')
    }
    
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `exampulse-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setMessage({ type: 'success', text: 'Data exported successfully! 📥' })
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(0, 123, 255, 0.3); }
          50% { box-shadow: 0 0 25px rgba(0, 123, 255, 0.5); }
        }

        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
          color: #0f172a;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
          position: relative;
          padding: 40px 20px;
        }

        /* Auth Container - KATTAROQ QILINDI */
        .auth-container {
          width: 100%;
          max-width: 900px; /* 900px ga oshirildi */
          margin: 0 auto;
          position: relative;
        }

        /* Header with Logo and Back Button */
        .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 2px solid rgba(0, 123, 255, 0.1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-rotate {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #00bfff 0%, #007bff 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 24px;
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
          animation: float 3s ease-in-out infinite;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logo-rotate:hover {
          transform: scale(1.1) rotate(180deg);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
        }

        .logo-text {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #007bff, #00bfff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 10px rgba(0, 123, 255, 0.1);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
          border: 2px solid rgba(0, 123, 255, 0.2);
          border-radius: 12px;
          color: #007bff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: linear-gradient(135deg, #e6f7ff 0%, #d6f0ff 100%);
          border-color: rgba(0, 123, 255, 0.3);
          transform: translateX(-3px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
        }

        /* Profile Form Container - UZUNROQ QILINDI */
        .profile-form-container {
          background: white;
          border: 2px solid rgba(0, 123, 255, 0.15);
          border-radius: 25px;
          padding: 40px;
          box-shadow: 0 15px 40px rgba(0, 123, 255, 0.15);
          position: relative;
          overflow: hidden;
          min-height: 600px; /* Minimal balandlik qo'shildi */
        }

        .profile-form-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(0, 123, 255, 0.05),
            transparent
          );
          transform: rotate(45deg);
          animation: slideBg 20s linear infinite;
        }

        @keyframes slideBg {
          0% { transform: rotate(45deg) translateX(-100%); }
          100% { transform: rotate(45deg) translateX(100%); }
        }

        /* User Info Section */
        .user-info-section {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-bottom: 40px;
          padding: 25px;
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.08), rgba(0, 191, 255, 0.05));
          border-radius: 20px;
          border: 2px solid rgba(0, 123, 255, 0.1);
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #007bff, #00bfff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: white;
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
          border: 3px solid white;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .user-email {
          color: #6c757d;
          font-size: 16px;
          opacity: 0.9;
          margin: 0 0 12px 0;
        }

        .user-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 15px;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(0, 123, 255, 0.1);
          min-width: 100px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #007bff;
        }

        .stat-label {
          font-size: 12px;
          color: #6c757d;
          margin-top: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Tabs Navigation - UZUNROQ */
        .profile-tabs {
          display: flex;
          gap: 15px;
          margin-bottom: 40px;
          background: rgba(0, 123, 255, 0.08);
          border-radius: 20px;
          padding: 10px;
          position: relative;
        }

        .tab-slider {
          position: absolute;
          top: 10px;
          left: 10px;
          width: calc(25% - 10px);
          height: calc(100% - 20px);
          background: linear-gradient(135deg, #007bff, #00bfff);
          border-radius: 15px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translateX(${activeTab === 'profile' ? '0' : activeTab === 'security' ? '100%' : activeTab === 'preferences' ? '200%' : '300%'});
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }

        .profile-tab {
          flex: 1;
          padding: 18px 20px;
          border: none;
          background: transparent;
          border-radius: 15px;
          font-size: 16px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          z-index: 1;
          white-space: nowrap;
        }

        .profile-tab:hover {
          color: #007bff;
          transform: translateY(-2px);
        }

        .profile-tab.active {
          color: white;
        }

        /* Main Content Layout - IKKI USTUNLI */
        .main-content {
          display: grid;
          grid-template-columns: 1fr 1fr; /* Ikkita teng ustun */
          gap: 40px;
          margin-bottom: 30px;
        }

        .content-column {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        /* Section Headers */
        .section-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(0, 123, 255, 0.1);
        }

        .section-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #007bff, #00bfff);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        /* Input Groups - KATTAROQ */
        .input-group {
          margin-bottom: 25px;
          animation: slideIn 0.6s ease forwards;
          opacity: 0;
        }

        .input-group:nth-child(1) { animation-delay: 0.1s; }
        .input-group:nth-child(2) { animation-delay: 0.2s; }
        .input-group:nth-child(3) { animation-delay: 0.3s; }
        .input-group:nth-child(4) { animation-delay: 0.4s; }

        .input-label {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          position: relative;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
          border-radius: 15px;
          padding: 3px;
          transition: all 0.3s ease;
        }

        .input-wrapper.focused {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
        }

        .input-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #007bff;
          font-size: 18px;
          z-index: 2;
        }

        .input-field {
          width: 100%;
          padding: 18px 50px 18px 50px;
          border: none;
          background: white;
          border-radius: 12px;
          font-size: 16px;
          color: #2c3e50;
          font-weight: 500;
        }

        .input-field:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        .input-field::placeholder {
          color: #adb5bd;
          font-size: 14px;
        }

        .password-toggle-btn {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          font-size: 16px;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .password-toggle-btn:hover {
          color: #007bff;
          background: rgba(0, 123, 255, 0.1);
        }

        /* Select Dropdown */
        .input-field-select {
          appearance: none;
          width: 100%;
          padding: 18px 50px 18px 50px;
          border: none;
          background: white;
          border-radius: 12px;
          font-size: 16px;
          color: #2c3e50;
          font-weight: 500;
          cursor: pointer;
        }

        .input-field-select:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        .select-arrow {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 14px;
          pointer-events: none;
        }

        /* Toggle Groups Grid */
        .toggle-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }

        .toggle-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .toggle-group:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 15px;
          color: #495057;
          font-weight: 500;
        }

        .toggle-icon {
          font-size: 20px;
          color: #007bff;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 30px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 30px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        input:checked + .toggle-slider {
          background-color: #007bff;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(30px);
        }

        /* Action Buttons */
        .action-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 30px;
        }

        .action-button {
          width: 100%;
          padding: 20px;
          border: none;
          border-radius: 15px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
          color: white;
          animation: glow 2s infinite;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid;
          border-image: linear-gradient(135deg, #007bff, #00bfff) 1;
          color: #007bff;
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.05), rgba(0, 191, 255, 0.05));
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.15);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .btn-danger:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        }

        .btn-logout {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .btn-logout:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
        }

        /* Error/Success Messages */
        .message-alert {
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 16px;
          font-weight: 500;
          animation: slideIn 0.3s ease;
          grid-column: 1 / -1;
        }

        .message-success {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          border: 2px solid #10b981;
          color: #065f46;
        }

        .message-error {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
          border: 2px solid #ef4444;
          color: #7f1d1d;
        }

        /* Loading Spinner */
        .btn-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Corner Decorations */
        .corner-decoration {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid rgba(0, 123, 255, 0.2);
        }

        .corner-tl {
          top: 20px;
          left: 20px;
          border-right: none;
          border-bottom: none;
          border-radius: 10px 0 0 0;
        }

        .corner-tr {
          top: 20px;
          right: 20px;
          border-left: none;
          border-bottom: none;
          border-radius: 0 10px 0 0;
        }

        .corner-bl {
          bottom: 20px;
          left: 20px;
          border-right: none;
          border-top: none;
          border-radius: 0 0 0 10px;
        }

        .corner-br {
          bottom: 20px;
          right: 20px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 10px 0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .auth-container {
            max-width: 95%;
          }
          
          .main-content {
            grid-template-columns: 1fr;
          }
          
          .toggle-grid {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .profile-tabs {
            flex-direction: column;
          }
          
          .tab-slider {
            width: calc(100% - 20px);
            height: calc(25% - 10px);
            transform: translateY(${activeTab === 'profile' ? '0' : activeTab === 'security' ? '100%' : activeTab === 'preferences' ? '200%' : '300%'});
          }
          
          .user-info-section {
            flex-direction: column;
            text-align: center;
          }
          
          .user-stats {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="profile-container">
        <div className="auth-container">
          {/* Header with Logo and Back Button */}
          <div className="auth-header">
            <div className="logo-section">
              <div 
                className="logo-rotate" 
                ref={logoRef}
                onClick={handleBackToHome}
              >
                EP
              </div>
              <div className="logo-text">ExamPulse - Profile Settings</div>
            </div>
            
            <button className="back-button" onClick={handleBackToHome}>
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </button>
          </div>

          {/* Profile Form Container */}
          <div className="profile-form-container">
            {/* Corner Decorations */}
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            {/* User Info Section */}
            <div className="user-info-section">
              <div className="user-avatar">
                {user?.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <h3 className="user-name">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'IELTS Student'}
                </h3>
                <p className="user-email">{user?.email || 'user@exampulse.com'}</p>
                <div className="user-stats">
                  <div className="stat-item">
                    <div className="stat-value">{user?.targetBand || '6.5'}</div>
                    <div className="stat-label">Target Band</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">24</div>
                    <div className="stat-label">Tests Taken</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">89%</div>
                    <div className="stat-label">Progress</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">42</div>
                    <div className="stat-label">Study Hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div className={`message-alert ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                {message.text}
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="profile-tabs">
              <div className="tab-slider"></div>
              <button 
                className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user-edit"></i>
                Personal Profile
              </button>
              <button 
                className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <i className="fas fa-shield-alt"></i>
                Account Security
              </button>
              <button 
                className={`profile-tab ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <i className="fas fa-sliders-h"></i>
                Preferences
              </button>
              <button 
                className={`profile-tab ${activeTab === 'data' ? 'active' : ''}`}
                onClick={() => setActiveTab('data')}
              >
                <i className="fas fa-database"></i>
                Data Management
              </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
              {/* Personal Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-user"></i>
                      </div>
                      <h3 className="section-title">Personal Information</h3>
                    </div>

                    <div className="input-group">
                      <label className="input-label">First Name</label>
                      <div className="input-wrapper">
                        <i className="fas fa-user input-icon"></i>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Last Name</label>
                      <div className="input-wrapper">
                        <i className="fas fa-user input-icon"></i>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <div className="input-wrapper">
                        <i className="fas fa-envelope input-icon"></i>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="your.email@exampulse.com"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-bullseye"></i>
                      </div>
                      <h3 className="section-title">Study Goals</h3>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Target Band Score</label>
                      <div className="input-wrapper">
                        <i className="fas fa-bullseye input-icon"></i>
                        <select
                          name="targetBand"
                          value={formData.targetBand}
                          onChange={handleChange}
                          className="input-field-select"
                        >
                          <option value="5.0">5.0 - Foundation Level</option>
                          <option value="5.5">5.5 - Basic Competence</option>
                          <option value="6.0">6.0 - Competent User</option>
                          <option value="6.5">6.5 - Good User</option>
                          <option value="7.0">7.0 - Advanced User</option>
                          <option value="7.5">7.5 - Very Good User</option>
                          <option value="8.0">8.0 - Excellent User</option>
                          <option value="8.5">8.5 - Expert User</option>
                          <option value="9.0">9.0 - Native Speaker Level</option>
                        </select>
                        <i className="fas fa-chevron-down select-arrow"></i>
                      </div>
                    </div>

                    <div className="section-header" style={{marginTop: '30px'}}>
                      <div className="section-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <h3 className="section-title">Study Schedule</h3>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Weekly Study Hours</label>
                      <div className="input-wrapper">
                        <i className="fas fa-clock input-icon"></i>
                        <select className="input-field-select">
                          <option>5-10 hours per week</option>
                          <option>10-15 hours per week</option>
                          <option>15-20 hours per week</option>
                          <option>20+ hours per week</option>
                        </select>
                        <i className="fas fa-chevron-down select-arrow"></i>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Test Date (if any)</label>
                      <div className="input-wrapper">
                        <i className="fas fa-calendar input-icon"></i>
                        <input
                          type="date"
                          className="input-field"
                          placeholder="Select test date"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Account Security Tab */}
              {activeTab === 'security' && (
                <>
                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-key"></i>
                      </div>
                      <h3 className="section-title">Change Password</h3>
                    </div>

                    <form onSubmit={handlePasswordChange}>
                      <div className="input-group">
                        <label className="input-label">Current Password</label>
                        <div className="input-wrapper">
                          <i className="fas fa-lock input-icon"></i>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                          </button>
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-label">New Password</label>
                        <div className="input-wrapper">
                          <i className="fas fa-lock input-icon"></i>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-label">Confirm New Password</label>
                        <div className="input-wrapper">
                          <i className="fas fa-lock input-icon"></i>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
                          </button>
                        </div>
                      </div>

                      <div className="action-buttons">
                        <button 
                          type="submit" 
                          className="action-button btn-primary"
                        >
                          <i className="fas fa-key"></i>
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <h3 className="section-title">Security Features</h3>
                    </div>

                    <div className="toggle-grid">
                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-bell toggle-icon"></i>
                          <span>Login Alerts</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-envelope toggle-icon"></i>
                          <span>Email Notifications</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-mobile-alt toggle-icon"></i>
                          <span>Two-Factor Auth</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-history toggle-icon"></i>
                          <span>Session History</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <>
                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-sliders-h"></i>
                      </div>
                      <h3 className="section-title">Notification Settings</h3>
                    </div>

                    <div className="toggle-grid">
                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-bell toggle-icon"></i>
                          <span>Push Notifications</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="notifications"
                            checked={formData.notifications}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-envelope toggle-icon"></i>
                          <span>Email Updates</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="emailUpdates"
                            checked={formData.emailUpdates}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-clock toggle-icon"></i>
                          <span>Study Reminders</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="studyReminders"
                            checked={formData.studyReminders}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-chart-line toggle-icon"></i>
                          <span>Progress Reports</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="section-header" style={{marginTop: '30px'}}>
                      <div className="section-icon">
                        <i className="fas fa-book"></i>
                      </div>
                      <h3 className="section-title">Study Preferences</h3>
                    </div>

                    <div className="toggle-grid">
                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-microphone toggle-icon"></i>
                          <span>Speaking Practice</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="speakingPractice"
                            checked={formData.speakingPractice}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-pencil-alt toggle-icon"></i>
                          <span>Writing Practice</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="writingPractice"
                            checked={formData.writingPractice}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-book-reader toggle-icon"></i>
                          <span>Reading Practice</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="readingPractice"
                            checked={formData.readingPractice}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-headphones-alt toggle-icon"></i>
                          <span>Listening Practice</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="listeningPractice"
                            checked={formData.listeningPractice}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-palette"></i>
                      </div>
                      <h3 className="section-title">Appearance</h3>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Theme</label>
                      <div className="input-wrapper">
                        <i className="fas fa-palette input-icon"></i>
                        <select
                          name="theme"
                          value={formData.theme}
                          onChange={handleChange}
                          className="input-field-select"
                        >
                          <option value="light">Light Mode</option>
                          <option value="dark">Dark Mode</option>
                          <option value="auto">Auto (System)</option>
                        </select>
                        <i className="fas fa-chevron-down select-arrow"></i>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Language</label>
                      <div className="input-wrapper">
                        <i className="fas fa-globe input-icon"></i>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="input-field-select"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ru">Russian</option>
                          <option value="zh">Chinese</option>
                          <option value="ar">Arabic</option>
                        </select>
                        <i className="fas fa-chevron-down select-arrow"></i>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Timezone</label>
                      <div className="input-wrapper">
                        <i className="fas fa-clock input-icon"></i>
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleChange}
                          className="input-field-select"
                        >
                          <option value="UTC-12">UTC-12:00</option>
                          <option value="UTC-8">UTC-8:00 (PST)</option>
                          <option value="UTC-5">UTC-5:00 (EST)</option>
                          <option value="UTC+0">UTC±0:00 (GMT)</option>
                          <option value="UTC+1">UTC+1:00 (CET)</option>
                          <option value="UTC+3">UTC+3:00 (MSK)</option>
                          <option value="UTC+5">UTC+5:00 (UZT)</option>
                          <option value="UTC+8">UTC+8:00 (CST)</option>
                          <option value="UTC+10">UTC+10:00 (AEST)</option>
                        </select>
                        <i className="fas fa-chevron-down select-arrow"></i>
                      </div>
                    </div>

                    <div className="section-header" style={{marginTop: '30px'}}>
                      <div className="section-icon">
                        <i className="fas fa-cogs"></i>
                      </div>
                      <h3 className="section-title">Advanced Settings</h3>
                    </div>

                    <div className="toggle-grid">
                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-sync-alt toggle-icon"></i>
                          <span>Auto-save Progress</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-group">
                        <div className="toggle-label">
                          <i className="fas fa-volume-up toggle-icon"></i>
                          <span>Sound Effects</span>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Data Management Tab */}
              {activeTab === 'data' && (
                <>
                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-download"></i>
                      </div>
                      <h3 className="section-title">Export Your Data</h3>
                    </div>

                    <div className="input-group">
                      <p style={{color: '#6c757d', fontSize: '15px', lineHeight: '1.6', margin: '0'}}>
                        Download all your test results, progress data, and account information in JSON format. This includes:
                      </p>
                      <ul style={{color: '#6c757d', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', marginTop: '10px'}}>
                        <li>All completed IELTS tests</li>
                        <li>Your progress tracking data</li>
                        <li>Band scores and analytics</li>
                        <li>Account settings and preferences</li>
                        <li>Study history and time logs</li>
                      </ul>
                    </div>

                    <div className="action-buttons">
                      <button 
                        type="button" 
                        className="action-button btn-secondary"
                        onClick={handleExportData}
                      >
                        <i className="fas fa-file-export"></i>
                        Export All Data
                      </button>
                    </div>
                  </div>

                  <div className="content-column">
                    <div className="section-header">
                      <div className="section-icon">
                        <i className="fas fa-trash-alt"></i>
                      </div>
                      <h3 className="section-title">Clear Test Results</h3>
                    </div>

                    <div className="input-group">
                      <p style={{color: '#6c757d', fontSize: '15px', lineHeight: '1.6', margin: '0'}}>
                        Permanently delete all your test history and start fresh. This action cannot be undone.
                      </p>
                      <div style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '12px',
                        padding: '15px',
                        marginTop: '15px'
                      }}>
                        <p style={{color: '#92400e', fontSize: '13px', margin: '0'}}>
                          ⚠️ Warning: This will delete all your test results, progress data, and analytics.
                        </p>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button 
                        type="button" 
                        className="action-button btn-secondary"
                        onClick={handleClearData}
                      >
                        <i className="fas fa-broom"></i>
                        Clear All Results
                      </button>
                    </div>

                    <div className="section-header" style={{marginTop: '40px'}}>
                      <div className="section-icon" style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <h3 className="section-title">Danger Zone</h3>
                    </div>

                    <div className="input-group">
                      <p style={{color: '#7f1d1d', fontSize: '15px', lineHeight: '1.6', margin: '0'}}>
                        Permanently delete your account and all associated data. This action is irreversible.
                      </p>
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '15px',
                        marginTop: '15px'
                      }}>
                        <p style={{color: '#7f1d1d', fontSize: '13px', margin: '0'}}>
                          🚨 Critical: All your data will be permanently erased and cannot be recovered.
                        </p>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button 
                        type="button" 
                        className="action-button btn-logout"
                        onClick={logout}
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Sign Out
                      </button>
                      
                      <button 
                        type="button" 
                        className="action-button btn-danger"
                        onClick={handleAccountDelete}
                      >
                        <i className="fas fa-trash-alt"></i>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Save Button for Profile Tab */}
            {activeTab === 'profile' && (
              <div className="action-buttons" style={{marginTop: '40px'}}>
                <button 
                  type="button" 
                  className="action-button btn-primary"
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  style={{gridColumn: '1 / -1'}}
                >
                  {isLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSettings
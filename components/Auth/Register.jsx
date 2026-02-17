
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    targetBand: '6.5',
    agreeToTerms: false
  })
  
  const [verifyStep, setVerifyStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [verificationError, setVerificationError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [inputFocused, setInputFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  })
  
  const logoRef = useRef(null)
  const inputRefs = useRef([])
  const { register, openAuthModal } = useAuth()

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

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFocus = (field) => {
    setInputFocused(prev => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field) => {
    setInputFocused(prev => ({ ...prev, [field]: false }))
  }

  const handleVerificationCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      setVerificationError('')
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
      
      // Auto-focus previous input on backspace
      if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validation
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }
    
    try {
      // In real app, send verification code
      // const response = await fetch('/api/send-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.email })
      // })
      
      // For demo, simulate sending code
      console.log('Sending verification code to:', formData.email)
      setVerifyStep(true)
      setCountdown(60) // 60 seconds countdown
      
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsVerifying(true)
    const code = verificationCode.join('')
    
    if (code.length !== 6) {
      setVerificationError('Please enter the 6-digit verification code')
      setIsVerifying(false)
      return
    }
    
    try {
      // In real app, verify code with backend
      // const response = await fetch('/api/verify-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     email: formData.email, 
      //     code 
      //   })
      // })
      
      // Demo verification - accept any 6-digit code
      setTimeout(() => {
        console.log('Verifying code:', code)
        // Simulate successful verification
        console.log('Account verified! Creating account...')
        
        // Create account
        register(formData.email, formData.password, {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          targetBand: formData.targetBand
        }).then(() => {
          console.log('Account created successfully!')
        }).catch(error => {
          setVerificationError('Error creating account: ' + error.message)
        })
        
        setIsVerifying(false)
      }, 1500)
      
    } catch (error) {
      setVerificationError('Verification failed: ' + error.message)
      setIsVerifying(false)
    }
  }

  const handleResendCode = () => {
    if (countdown > 0) return
    
    setVerificationError('')
    setVerificationCode(['', '', '', '', '', ''])
    setCountdown(60)
    
    // In real app, resend verification code
    console.log('Resending verification code to:', formData.email)
    
    // Focus first input
    inputRefs.current[0]?.focus()
  }

  const handleBackToSignUp = () => {
    setVerifyStep(false)
    setVerificationCode(['', '', '', '', '', ''])
    setVerificationError('')
  }

  const handleBackToLogin = () => {
    openAuthModal('login')
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .register-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
          color: #0f172a;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-container {
          width: 100%;
          max-width: 380px;
          position: relative;
        }

        /* Header with Logo */
        .auth-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid rgba(0, 123, 255, 0.1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-rotate {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #00bfff 0%, #007bff 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 18px;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          animation: float 3s ease-in-out infinite;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logo-rotate:hover {
          transform: scale(1.1) rotate(180deg);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #007bff, #00bfff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Form Container */
        .register-form-container {
          background: white;
          border: 2px solid rgba(0, 123, 255, 0.15);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 123, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .register-form-container::before {
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

        /* Welcome Section */
        .welcome-section {
          text-align: center;
          margin-bottom: 25px;
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
          animation: slideIn 0.5s ease;
        }

        .welcome-subtitle {
          color: #6c757d;
          font-size: 14px;
          opacity: 0.8;
        }

        /* Form */
        .register-form {
          position: relative;
          z-index: 1;
        }

        /* Input Groups */
        .input-group {
          margin-bottom: 20px;
          animation: slideIn 0.6s ease forwards;
          opacity: 0;
        }

        .input-group:nth-child(1) { animation-delay: 0.1s; }
        .input-group:nth-child(2) { animation-delay: 0.2s; }
        .input-group:nth-child(3) { animation-delay: 0.3s; }
        .input-group:nth-child(4) { animation-delay: 0.4s; }
        .input-group:nth-child(5) { animation-delay: 0.5s; }

        .input-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          position: relative;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%);
          border-radius: 12px;
          padding: 2px;
          transition: all 0.3s ease;
        }

        .input-wrapper.focused {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #007bff;
          font-size: 16px;
          z-index: 2;
        }

        .input-field {
          width: 100%;
          padding: 14px 45px 14px 45px;
          border: none;
          background: white;
          border-radius: 10px;
          font-size: 14px;
          color: #2c3e50;
          font-weight: 500;
        }

        .input-field:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        .input-field::placeholder {
          color: #adb5bd;
        }

        .password-toggle-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          font-size: 14px;
          padding: 5px;
          border-radius: 5px;
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
          padding: 14px 45px 14px 45px;
          border: none;
          background: white;
          border-radius: 10px;
          font-size: 14px;
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
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 12px;
          pointer-events: none;
        }

        /* Verification Code */
        .verification-section {
          text-align: center;
          margin-bottom: 25px;
        }

        .verification-title {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .verification-subtitle {
          color: #6c757d;
          font-size: 13px;
          opacity: 0.8;
          margin-bottom: 20px;
        }

        .verification-email {
          color: #007bff;
          font-weight: 600;
        }

        .verification-code-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }

        .verification-input {
          width: 45px;
          height: 55px;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
          border: 2px solid rgba(0, 123, 255, 0.2);
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
        }

        .verification-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          transform: translateY(-2px);
        }

        .verification-input.filled {
          background: white;
          border-color: #007bff;
        }

        .resend-code {
          margin-top: 20px;
          color: #6c757d;
          font-size: 13px;
        }

        .resend-button {
          background: none;
          border: none;
          color: #007bff;
          font-weight: 600;
          cursor: pointer;
          margin-left: 5px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .resend-button:hover:not(:disabled) {
          color: #00bfff;
          background: rgba(0, 123, 255, 0.05);
        }

        .resend-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Checkbox */
        .checkbox-group {
          margin: 20px 0;
          animation: slideIn 0.6s ease forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #6c757d;
          cursor: pointer;
          line-height: 1.4;
        }

        .checkbox-label input {
          display: none;
        }

        .custom-checkbox {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(0, 123, 255, 0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          margin-top: 2px;
        }

        .checkbox-label input:checked + .custom-checkbox {
          background: #007bff;
          border-color: #007bff;
        }

        .custom-checkbox::after {
          content: '✓';
          color: white;
          font-size: 12px;
          font-weight: bold;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .checkbox-label input:checked + .custom-checkbox::after {
          opacity: 1;
        }

        .terms-link {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .terms-link:hover {
          color: #00bfff;
          text-decoration: underline;
        }

        /* Buttons */
        .action-button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff 0%, #00bfff 100%);
          color: white;
          animation: pulse 2s infinite;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid;
          border-image: linear-gradient(135deg, #007bff, #00bfff) 1;
          color: #007bff;
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.05), rgba(0, 191, 255, 0.05));
          transform: translateY(-1px);
        }

        /* Back Button */
        .back-button {
          background: none;
          border: none;
          color: #6c757d;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0 auto 20px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          color: #007bff;
          background: rgba(0, 123, 255, 0.05);
        }

        /* Error Messages */
        .error-message {
          background: linear-gradient(135deg, rgba(255, 71, 87, 0.1), rgba(255, 99, 71, 0.1));
          border: 1px solid rgba(255, 71, 87, 0.2);
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 15px;
          font-size: 12px;
          color: #ff4757;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideIn 0.3s ease;
        }

        .verification-error {
          animation: shake 0.5s ease;
        }

        .error-text {
          color: #ff4757;
          font-size: 11px;
          margin-top: 8px;
          display: block;
        }

        /* Loading Spinner */
        .btn-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Auth Links */
        .auth-links {
          text-align: center;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 123, 255, 0.1);
        }

        .link-text {
          color: #6c757d;
          font-size: 13px;
        }

        .link-button {
          background: none;
          border: none;
          color: #007bff;
          font-weight: 700;
          cursor: pointer;
          margin-left: 5px;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .link-button:hover {
          color: #00bfff;
          background: rgba(0, 123, 255, 0.05);
        }

        /* Corner Decorations */
        .corner-decoration {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 123, 255, 0.2);
        }

        .corner-tl {
          top: 15px;
          left: 15px;
          border-right: none;
          border-bottom: none;
          border-radius: 8px 0 0 0;
        }

        .corner-tr {
          top: 15px;
          right: 15px;
          border-left: none;
          border-bottom: none;
          border-radius: 0 8px 0 0;
        }

        .corner-bl {
          bottom: 15px;
          left: 15px;
          border-right: none;
          border-top: none;
          border-radius: 0 0 0 8px;
        }

        .corner-br {
          bottom: 15px;
          right: 15px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 8px 0;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .auth-container {
            max-width: 90%;
          }
          
          .register-form-container {
            padding: 25px;
          }
          
          .auth-header {
            margin-bottom: 25px;
          }
          
          .verification-input {
            width: 40px;
            height: 50px;
            font-size: 20px;
          }
        }
      `}</style>

      <div className="register-container">
        <div className="auth-container">
          {/* Header with Logo */}
          <div className="auth-header">
            <div className="logo-section">
              <div className="logo-rotate" ref={logoRef}>
                EP
              </div>
              <div className="logo-text">ExamPulse</div>
            </div>
          </div>

          {/* Register Form Container */}
          <div className="register-form-container">
            {/* Corner Decorations */}
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            {/* Verification Step */}
            {verifyStep ? (
              <>
                <div className="verification-section">
                  <h2 className="verification-title">Verify Your Email ✉️</h2>
                  <p className="verification-subtitle">
                    We sent a 6-digit code to <br />
                    <span className="verification-email">{formData.email}</span>
                  </p>
                </div>

                {/* Verification Error */}
                {verificationError && (
                  <div className="error-message verification-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {verificationError}
                  </div>
                )}

                {/* Verification Code Inputs */}
                <div className="verification-code-container">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      maxLength="1"
                      value={verificationCode[index]}
                      onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`verification-input ${verificationCode[index] ? 'filled' : ''}`}
                      disabled={isVerifying}
                    />
                  ))}
                </div>

                {/* Resend Code */}
                <div className="resend-code">
                  Didn't receive the code? 
                  <button
                    className="resend-button"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isVerifying}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>

                {/* Verify Button */}
                <button 
                  className="action-button btn-primary"
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.some(code => !code)}
                >
                  {isVerifying ? (
                    <>
                      <div className="btn-spinner"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Create Account'
                  )}
                </button>

                {/* Back Button */}
                <button 
                  className="back-button"
                  onClick={handleBackToSignUp}
                  disabled={isVerifying}
                >
                  <i className="fas fa-arrow-left"></i>
                  Back to Sign Up
                </button>
              </>
            ) : (
              <>
                {/* Welcome Section */}
                <div className="welcome-section">
                  <h2 className="welcome-title">Create Account 🚀</h2>
                  <p className="welcome-subtitle">Start your IELTS preparation journey</p>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.submit}
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="register-form">
                  {/* Name Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    {/* First Name Input */}
                    <div className="input-group">
                      <label className="input-label">First Name *</label>
                      <div className={`input-wrapper ${inputFocused.firstName ? 'focused' : ''}`}>
                        <i className="fas fa-user input-icon"></i>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          onFocus={() => handleFocus('firstName')}
                          onBlur={() => handleBlur('firstName')}
                          className="input-field"
                          placeholder="John"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>

                    {/* Last Name Input */}
                    <div className="input-group">
                      <label className="input-label">Last Name</label>
                      <div className={`input-wrapper ${inputFocused.lastName ? 'focused' : ''}`}>
                        <i className="fas fa-user input-icon"></i>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          onFocus={() => handleFocus('lastName')}
                          onBlur={() => handleBlur('lastName')}
                          className="input-field"
                          placeholder="Doe"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="input-group">
                    <label className="input-label">Email *</label>
                    <div className={`input-wrapper ${inputFocused.email ? 'focused' : ''}`}>
                      <i className="fas fa-envelope input-icon"></i>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        className="input-field"
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  {/* Password Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    {/* Password Input */}
                    <div className="input-group">
                      <label className="input-label">Password *</label>
                      <div className={`input-wrapper ${inputFocused.password ? 'focused' : ''}`}>
                        <i className="fas fa-lock input-icon"></i>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => handleFocus('password')}
                          onBlur={() => handleBlur('password')}
                          className="input-field"
                          placeholder="••••••••"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                      {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="input-group">
                      <label className="input-label">Confirm *</label>
                      <div className={`input-wrapper ${inputFocused.confirmPassword ? 'focused' : ''}`}>
                        <i className="fas fa-lock input-icon"></i>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onFocus={() => handleFocus('confirmPassword')}
                          onBlur={() => handleBlur('confirmPassword')}
                          className="input-field"
                          placeholder="••••••••"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>
                  </div>

                  {/* Target Band Select */}
                  <div className="input-group">
                    <label className="input-label">Target Band Score</label>
                    <div className="input-wrapper">
                      <i className="fas fa-bullseye input-icon"></i>
                      <select
                        name="targetBand"
                        value={formData.targetBand}
                        onChange={handleChange}
                        className="input-field-select"
                        disabled={isLoading}
                      >
                        <option value="5.0">5.0 - Foundation</option>
                        <option value="5.5">5.5 - Basic</option>
                        <option value="6.0">6.0 - Competent</option>
                        <option value="6.5">6.5 - Good</option>
                        <option value="7.0">7.0 - Advanced</option>
                        <option value="7.5">7.5 - Very Good</option>
                        <option value="8.0">8.0 - Excellent</option>
                        <option value="8.5">8.5 - Expert</option>
                        <option value="9.0">9.0 - Native</option>
                      </select>
                      <i className="fas fa-chevron-down select-arrow"></i>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                      <span className="custom-checkbox"></span>
                      I agree to the <span className="terms-link">Terms of Service</span> and <span className="terms-link">Privacy Policy</span>
                    </label>
                    {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
                  </div>

                  {/* Create Account Button */}
                  <button 
                    type="submit" 
                    className="action-button btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="btn-spinner"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Sign In Link */}
                  <div className="auth-links">
                    <span className="link-text">
                      Already have an account?
                      <button 
                        className="link-button"
                        onClick={handleBackToLogin}
                      >
                        Sign in
                      </button>
                    </span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
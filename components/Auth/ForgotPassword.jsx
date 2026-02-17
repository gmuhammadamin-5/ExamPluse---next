import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const logoRef = useRef(null)
  const { resetPassword, openAuthModal } = useAuth()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await resetPassword(email)
      setMessage({ type: 'success', text: 'Password reset link sent to your email! 📧' })
      setIsSubmitted(true)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error sending reset link: ' + error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    openAuthModal('login')
  }

  const handleCreateAccount = () => {
    openAuthModal('register')
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

        .forgot-container {
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
        .forgot-form-container {
          background: white;
          border: 2px solid rgba(0, 123, 255, 0.15);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 123, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .forgot-form-container::before {
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
          line-height: 1.5;
        }

        /* Form */
        .forgot-form {
          position: relative;
          z-index: 1;
        }

        /* Input Groups */
        .input-group {
          margin-bottom: 25px;
          animation: slideIn 0.6s ease forwards;
          opacity: 0;
        }

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

        /* Message Alert */
        .message-alert {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }

        .message-success {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          border: 1px solid #10b981;
          color: #065f46;
        }

        .message-error {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
          border: 1px solid #ef4444;
          color: #7f1d1d;
        }

        /* Success Message */
        .success-message {
          text-align: center;
          padding: 25px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          border: 1px solid #10b981;
          border-radius: 12px;
          margin-bottom: 25px;
          animation: slideIn 0.5s ease;
        }

        .success-icon {
          font-size: 48px;
          color: #10b981;
          margin-bottom: 15px;
        }

        .success-text {
          color: #065f46;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
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

        /* Links */
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
          
          .forgot-form-container {
            padding: 25px;
          }
          
          .auth-header {
            margin-bottom: 25px;
          }
        }
      `}</style>

      <div className="forgot-container">
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

          {/* Forgot Password Form Container */}
          <div className="forgot-form-container">
            {/* Corner Decorations */}
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            {/* Welcome Section */}
            <div className="welcome-section">
              <h2 className="welcome-title">Reset Password 🔑</h2>
              <p className="welcome-subtitle">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {/* Message Alert */}
            {message.text && !isSubmitted && (
              <div className={`message-alert ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                {message.text}
              </div>
            )}

            {/* Success Message */}
            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">📧</div>
                <p className="success-text">
                  Check your email inbox for password reset instructions.
                  <br />
                  If you don't see it, check your spam folder.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="forgot-form">
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="action-button btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            )}

            <div className="auth-links">
              <span className="link-text">
                Remember your password?
                <button 
                  className="link-button"
                  onClick={handleBackToLogin}
                >
                  Sign in
                </button>
              </span>
              <br />
              <span className="link-text" style={{ marginTop: '10px', display: 'inline-block' }}>
                Don't have an account?
                <button 
                  className="link-button"
                  onClick={handleCreateAccount}
                >
                  Create account
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
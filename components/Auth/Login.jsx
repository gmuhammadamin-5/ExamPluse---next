import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [inputFocused, setInputFocused] = useState({
    email: false,
    password: false
  })
  
  const logoRef = useRef(null)
  const { login, openAuthModal } = useAuth()

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
  }

  const handleFocus = (field) => {
    setInputFocused(prev => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field) => {
    setInputFocused(prev => ({ ...prev, [field]: false }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await login(formData.email, formData.password)
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@exampulse.com',
      password: 'demo123'
    })
  }

  const handleForgotPassword = () => {
    openAuthModal('forgot')
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

        .login-container {
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
        .login-form-container {
          background: white;
          border: 2px solid rgba(0, 123, 255, 0.15);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 123, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .login-form-container::before {
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
        .login-form {
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

        .input-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
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

        /* Forgot Password */
        .forgot-link {
          font-size: 13px;
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 4px 8px;
          border-radius: 5px;
          background: none;
          border: none;
        }

        .forgot-link:hover {
          color: #00bfff;
          background: rgba(0, 123, 255, 0.05);
        }

        .forgot-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .error-text {
          color: #ff4757;
          font-size: 11px;
          margin-top: 8px;
          display: block;
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

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          color: #6c757d;
          font-size: 12px;
          font-weight: 500;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.2), transparent);
        }

        .divider span {
          padding: 0 15px;
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
          
          .login-form-container {
            padding: 25px;
          }
          
          .auth-header {
            margin-bottom: 25px;
          }
        }
      `}</style>

      <div className="login-container">
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

          {/* Login Form Container */}
          <div className="login-form-container">
            {/* Corner Decorations */}
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            {/* Welcome Section */}
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome Back! 👋</h2>
              <p className="welcome-subtitle">Sign in to continue your IELTS preparation</p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {errors.submit}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
              <div className="input-group">
                <label className="input-label">Email</label>
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

              {/* Password Input */}
              <div className="input-group">
                <div className="label-row">
                  <label className="input-label">Password</label>
                  <button 
                    type="button"
                    className="forgot-link"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>
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

              {/* Submit Button */}
              <button 
                type="submit" 
                className="action-button btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span>or</span>
              </div>

              {/* Demo Button */}
              <button 
                type="button"
                className="action-button btn-secondary"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <i className="fas fa-rocket"></i>
                Try Demo Account
              </button>

              {/* Sign Up Link */}
              <div className="auth-links">
                <span className="link-text">
                  Don't have an account?
                  <button 
                    className="link-button"
                    onClick={handleCreateAccount}
                  >
                    Create account
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
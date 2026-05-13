import React from 'react'
import { LoginForm } from './LoginPage'
import { RegisterForm } from './RegisterPage'
import { ForgotForm } from './ForgotForm'
import { ResetPasswordForm } from './ResetPasswordForm'

export function AuthPage(props) {
  const isRightPanelActive = props.authMode === 'register'

  const handleSignUpClick = () => {
    props.setAuthMode('register')
  }

  const handleSignInClick = () => {
    props.setAuthMode('login')
  }

  return (
    <div className="auth-page-shell">
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''} mode-${props.authMode}`} id="container">
        <div className="auth-form-container sign-up-container">
          <RegisterForm 
            registerForm={props.registerForm}
            setRegisterForm={props.setRegisterForm}
            handleRegister={props.handleRegister}
            status={props.status}
          />
          <div className="mobile-switch-text">
            Already have an account? <span style={{ color: '#d4af37', fontWeight: 600, cursor: 'pointer' }} onClick={handleSignInClick}>Sign In</span>
          </div>
        </div>
        <div className="auth-form-container sign-in-container">
          <LoginForm 
            loginForm={props.loginForm}
            setLoginForm={props.setLoginForm}
            handleLogin={props.handleLogin}
            status={props.status}
            setStatus={props.setStatus}
            setAuthMode={props.setAuthMode}
          />
          <div className="mobile-switch-text">
            Don't have an account? <span style={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer' }} onClick={handleSignUpClick}>Create one</span>
          </div>
        </div>

        <div className={`auth-form-container forgot-container ${props.authMode === 'forgot' ? 'active' : ''}`}>
          <ForgotForm 
            handleForgotPasswordRequest={props.handleForgotPasswordRequest}
            setAuthMode={props.setAuthMode}
            status={props.status}
          />
        </div>

        <div className={`auth-form-container reset-container ${props.authMode === 'reset-password' ? 'active' : ''}`}>
          <ResetPasswordForm 
            handleResetPassword={props.handleResetPassword}
            setAuthMode={props.setAuthMode}
            status={props.status}
          />
        </div>
        
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className="auth-brand-mark">
                <img src="/logo.svg" alt="ISkill logo" className="auth-brand-logo" />
              </div>
              <p className="auth-panel-eyebrow">ISkill Workspace</p>
              <h1 style={{ fontWeight: 800, margin: 0 }}>Welcome Back</h1>
              <p style={{ margin: '20px 0 8px', fontSize: '14px', lineHeight: 1.6 }}>
                Sign in to continue your secure collaboration, review shared files, and stay in sync with your team.
              </p>
              <p className="auth-panel-supporting-copy">Your conversations, documents, and profile updates stay connected in one place.</p>
              <button className="auth-ghost-button" id="signIn" onClick={handleSignInClick}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <div className="auth-brand-lockup">
                <div className="auth-brand-mark">
                  <img src="/logo.svg" alt="ISkill logo" className="auth-brand-logo" />
                </div>
                <div>
                  <p className="auth-panel-eyebrow">ISkill</p>
                  <h2 className="auth-brand-title">Build a more connected team workspace</h2>
                </div>
              </div>
              <p style={{ margin: '20px 0 8px', fontSize: '14px', lineHeight: 1.7 }}>
                Bring people, documents, and direct communication into one secure hub built for faster teamwork.
              </p>
              <div className="auth-value-list">
                <div className="auth-value-item"><span className="auth-value-icon" aria-hidden="true"></span><span>Centralize conversations and files without losing context.</span></div>
                <div className="auth-value-item"><span className="auth-value-icon" aria-hidden="true"></span><span>Give every teammate a clear profile, role, and workspace presence.</span></div>
                <div className="auth-value-item"><span className="auth-value-icon" aria-hidden="true"></span><span>Start in minutes with a clean onboarding flow for new members.</span></div>
              </div>
              <button className="auth-ghost-button" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { LoginForm } from './LoginPage'
import { RegisterForm } from './RegisterPage'

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
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
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
          />
          <div className="mobile-switch-text">
            Don't have an account? <span style={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer' }} onClick={handleSignUpClick}>Create one</span>
          </div>
        </div>
        
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 style={{ fontWeight: 800, margin: 0 }}>Welcome Back!</h1>
              <p style={{ margin: '20px 0', fontSize: '14px', lineHeight: 1.6 }}>To keep connected with us please login with your personal info</p>
              <button className="auth-ghost-button" id="signIn" onClick={handleSignInClick}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 style={{ fontWeight: 800, margin: 0 }}>Hello, Friend!</h1>
              <p style={{ margin: '20px 0', fontSize: '14px', lineHeight: 1.6 }}>Enter your personal details and start journey with us</p>
              <button className="auth-ghost-button" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

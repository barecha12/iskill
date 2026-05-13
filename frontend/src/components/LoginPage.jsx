import React from 'react'
import { StatusBanner } from './StatusBanner'

export function LoginForm({ loginForm, setLoginForm, handleLogin, status, setStatus, setAuthMode }) {
  const [buttonOffset, setButtonOffset] = React.useState({ x: 0, y: 0 })
  
  const isFormValid = loginForm.email.includes('@') && loginForm.password.length >= 6

  const handleMouseEnter = () => {
    if (!isFormValid) {
      const randomX = Math.floor(Math.random() * 20) - 10
      const randomY = Math.floor(Math.random() * 10) - 5
      setButtonOffset({ x: randomX, y: randomY })
    } else {
      setButtonOffset({ x: 0, y: 0 })
    }
  }

  const styles = {
    card: {
      width: '100%',
      maxWidth: '360px',
      margin: '0 auto',
    },

    brandLockup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '36px',
      justifyContent: 'flex-start',
    },

    brandMark: {
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    brandLogo: {
      width: '36px',
      height: '36px',
      objectFit: 'contain',
      display: 'block',
    },

    brandText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      lineHeight: 1.1,
    },

    brandLabel: {
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: '#f5d56b',
    },

    brandName: {
      fontSize: '20px',
      fontWeight: 800,
      color: '#fff',
    },

    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
    },

    title: {
      fontSize: '32px',
      fontWeight: 800,
      color: '#fff',
      margin: '0 0 10px',
      textAlign: 'left',
    },

    subtitle: {
      fontSize: '14px',
      color: '#94a3b8',
      textAlign: 'left',
      marginBottom: '30px',
    },

    label: {
      fontSize: '12px',
      marginBottom: '8px',
      display: 'block',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    input: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      background: 'rgba(255, 255, 255, 0.07)',
      color: '#fff',
      outline: 'none',
      fontSize: '15px',
      boxSizing: 'border-box',
      boxShadow: 'inset 0 0 0 1px transparent',
    },

    button: {
      marginTop: '20px',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      background: isFormValid ? 'linear-gradient(135deg, #f5d56b, #d4a63a 55%, #9a6518)' : 'rgba(255,255,255,0.1)',
      color: isFormValid ? '#111827' : 'rgba(255,255,255,0.3)',
      fontWeight: 800,
      cursor: isFormValid ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: isFormValid ? '0 16px 30px rgba(212, 175, 55, 0.28)' : 'none',
    },

    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },

    formMetaRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '-8px',
    },

    forgotButton: {
      background: 'transparent',
      border: 'none',
      color: '#f5d56b',
      fontSize: '13px',
      fontWeight: 600,
      padding: 0,
      cursor: 'pointer',
    },
  }

  const handleForgotPassword = () => {
    setAuthMode?.('forgot')
  }

  return (
    <div style={styles.card}>
      <div style={styles.brandLockup}>
        <div style={styles.brandMark}>
          <img src="/logo.svg" alt="ISkill logo" style={styles.brandLogo} />
        </div>
        <div style={styles.brandText}>
          <span style={styles.brandLabel}>Secure Workspace</span>
          <span style={styles.brandName}>ISkill</span>
        </div>
      </div>
      <h1 style={styles.title}>Welcome Back</h1>
      <p style={styles.subtitle}>Enter your secure credentials</p>

      <form style={styles.form} onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            value={loginForm.email}
            onChange={(e) => {
              setLoginForm((cur) => ({ ...cur, email: e.target.value }))
              setButtonOffset({ x: 0, y: 0 })
            }}
            placeholder="name@company.com"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={loginForm.password}
            onChange={(e) => {
              setLoginForm((cur) => ({ ...cur, password: e.target.value }))
              setButtonOffset({ x: 0, y: 0 })
            }}
            placeholder="••••••••"
            required
          />
        </div>

        <div style={styles.formMetaRow}>
          <button type="button" style={styles.forgotButton} onClick={handleForgotPassword}>
            Forgot password?
          </button>
        </div>

        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={handleMouseEnter}
        >
          Sign In
        </button>
      </form>

      <StatusBanner status={status} />
    </div>
  )
}

import React from 'react'
import { StatusBanner } from './StatusBanner'

export function LoginForm({ loginForm, setLoginForm, handleLogin, status }) {
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
      textAlign: 'center',
    },

    subtitle: {
      fontSize: '14px',
      color: '#94a3b8',
      textAlign: 'center',
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
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      outline: 'none',
      fontSize: '15px',
      boxSizing: 'border-box',
    },

    button: {
      marginTop: '20px',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      background: isFormValid ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.1)',
      color: isFormValid ? 'white' : 'rgba(255,255,255,0.3)',
      fontWeight: 700,
      cursor: isFormValid ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
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

        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={handleMouseEnter}
        >
          {isFormValid ? 'Sign In' : 'Complete Form'}
        </button>
      </form>

      <StatusBanner status={status} />
    </div>
  )
}
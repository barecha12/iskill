import React from 'react'
import { StatusBanner } from './StatusBanner'

export function ResetPasswordForm({ handleResetPassword, setAuthMode, status }) {
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')
  
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const email = params.get('email')

  const handleSubmit = (e) => {
    e.preventDefault()
    handleResetPassword({
      token,
      email,
      password,
      password_confirmation: passwordConfirmation
    })
  }

  const styles = {
    card: {
      width: '100%',
      maxWidth: '360px',
      margin: '0 auto',
    },
    title: {
      fontSize: '28px',
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
      lineHeight: 1.5,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
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
    },
    button: {
      marginTop: '10px',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #f5d56b, #d4a63a)',
      color: '#111827',
      fontWeight: 800,
      cursor: 'pointer',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    footer: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#94a3b8',
    },
    linkSpan: {
      color: '#f5d56b',
      cursor: 'pointer',
      fontWeight: 600,
    }
  }

  if (!token || !email) {
    return (
      <div style={styles.card}>
        <h1 style={styles.title}>Invalid Link</h1>
        <p style={styles.subtitle}>This password reset link is invalid or has expired.</p>
        <button style={styles.button} onClick={() => setAuthMode('forgot')}>Request New Link</button>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>New Password</h1>
      <p style={styles.subtitle}>
        Security Protocol: Enter your new secure credentials for <b>{email}</b>.
      </p>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>New Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
          />
        </div>
        <div>
          <label style={styles.label}>Confirm New Password</label>
          <input
            style={styles.input}
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
          />
        </div>
        <button type="submit" style={styles.button}>Update Credentials</button>
      </form>

      <div style={styles.footer}>
        Changed your mind? <span style={styles.linkSpan} onClick={() => setAuthMode('login')}>Back to Sign In</span>
      </div>

      <StatusBanner status={status} />
    </div>
  )
}

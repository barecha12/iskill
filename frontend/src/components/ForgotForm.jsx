import React from 'react'
import { StatusBanner } from './StatusBanner'

export function ForgotForm({ handleForgotPasswordRequest, setAuthMode, status }) {
  const [email, setEmail] = React.useState('')
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    handleForgotPasswordRequest(email)
    setIsSubmitted(true)
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
    backLink: {
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

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Reset Password</h1>
      <p style={styles.subtitle}>
        Enter the email address associated with your executive account and we'll send you a secure link to reset your credentials.
      </p>

      {!isSubmitted || status.type === 'error' ? (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
          <button type="submit" style={styles.button}>Send Reset Link</button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✉️</div>
          <p style={{ color: '#f5d56b', fontWeight: 600 }}>Check your inbox</p>
          <p style={styles.subtitle}>If an account exists for {email}, a reset link has been sent.</p>
        </div>
      )}

      <div style={styles.backLink}>
        Remembered your password? <span style={styles.linkSpan} onClick={() => setAuthMode('login')}>Sign In</span>
      </div>

      <StatusBanner status={status} />
    </div>
  )
}

import React from 'react'
import { StatusBanner } from './StatusBanner'

export function RegisterForm({ registerForm, setRegisterForm, handleRegister, status, setAuthMode }) {
  const [buttonOffset, setButtonOffset] = React.useState({ x: 0, y: 0 })

  const passwordStrength = (() => {
    const password = registerForm.password
    let score = 0

    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (!password) return { label: 'Add a secure password', tone: '#64748b', fill: '0%' }
    if (score <= 1) return { label: 'Weak password', tone: '#f87171', fill: '25%' }
    if (score === 2) return { label: 'Fair password', tone: '#fbbf24', fill: '50%' }
    if (score === 3) return { label: 'Strong password', tone: '#60a5fa', fill: '75%' }
    return { label: 'Very strong password', tone: '#34d399', fill: '100%' }
  })()
  
  const isFormValid =
    registerForm.name.trim().length >= 2 &&
    registerForm.email.includes('@') &&
    registerForm.password.length >= 8 &&
    registerForm.password === registerForm.password_confirmation &&
    registerForm.title.trim().length >= 2 &&
    registerForm.department.trim().length >= 2

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
      gap: '10px',
      width: '100%',
    },

    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },

    title: {
      fontSize: '24px',
      fontWeight: 800,
      color: '#fff',
      margin: '0 0 6px',
      textAlign: 'center',
    },

    subtitle: {
      fontSize: '13px',
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: '14px',
    },

    label: {
      fontSize: '11px',
      marginBottom: '5px',
      display: 'block',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    input: {
      width: '100%',
      padding: '11px 14px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      background: 'rgba(255, 255, 255, 0.07)',
      color: '#fff',
      outline: 'none',
      fontSize: '14px',
      boxSizing: 'border-box',
    },

    button: {
      marginTop: '8px',
      padding: '13px',
      borderRadius: '12px',
      border: 'none',
      background: isFormValid
        ? 'linear-gradient(135deg, #f5d56b, #d4a63a 55%, #9a6518)'
        : 'linear-gradient(135deg, rgba(245, 213, 107, 0.55), rgba(154, 101, 24, 0.5))',
      color: isFormValid ? '#111827' : 'rgba(17, 24, 39, 0.72)',
      fontWeight: 800,
      cursor: isFormValid ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 14px 28px rgba(212, 175, 55, 0.18)',
    },

    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },

    passwordMeta: {
      display: 'grid',
      gap: '6px',
      marginTop: '6px',
    },

    strengthRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },

    strengthLabel: {
      fontSize: '11px',
      fontWeight: 700,
      color: passwordStrength.tone,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },

    strengthHint: {
      fontSize: '11px',
      color: '#94a3b8',
    },

    strengthTrack: {
      width: '100%',
      height: '7px',
      borderRadius: '999px',
      background: 'rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
    },

    strengthFill: {
      width: passwordStrength.fill,
      height: '100%',
      borderRadius: 'inherit',
      background: passwordStrength.tone,
      transition: 'width 0.25s ease, background 0.25s ease',
      boxShadow: `0 0 12px ${passwordStrength.tone}33`,
    },

    terms: {
      marginTop: '4px',
      fontSize: '10.5px',
      lineHeight: 1.5,
      textAlign: 'center',
      color: '#94a3b8',
    },

    termsLink: {
      color: '#f5d56b',
      textDecoration: 'none',
      fontWeight: 600,
    },
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', paddingTop: '8px', paddingBottom: '8px' }}>
      <h1 style={styles.title}>Create Identity</h1>
      <p style={styles.subtitle}>Join the professional network</p>

      <form style={styles.form} onSubmit={handleRegister}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            value={registerForm.name}
            onChange={(e) => {
              setRegisterForm((cur) => ({ ...cur, name: e.target.value }))
              setButtonOffset({ x: 0, y: 0 })
            }}
            placeholder="John Doe"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            value={registerForm.email}
            onChange={(e) => {
              setRegisterForm((cur) => ({ ...cur, email: e.target.value }))
              setButtonOffset({ x: 0, y: 0 })
            }}
            placeholder="name@company.com"
            required
          />
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              type="text"
              value={registerForm.title}
              onChange={(e) => {
                setRegisterForm((cur) => ({ ...cur, title: e.target.value }))
                setButtonOffset({ x: 0, y: 0 })
              }}
              placeholder="Manager"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Department</label>
            <input
              style={styles.input}
              type="text"
              value={registerForm.department}
              onChange={(e) => {
                setRegisterForm((cur) => ({ ...cur, department: e.target.value }))
                setButtonOffset({ x: 0, y: 0 })
              }}
              placeholder="Sales"
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={registerForm.password}
              onChange={(e) => {
                setRegisterForm((cur) => ({ ...cur, password: e.target.value }))
                setButtonOffset({ x: 0, y: 0 })
              }}
              placeholder="Password"
              required
            />
            <div style={styles.passwordMeta}>
              <div style={styles.strengthRow}>
                <span style={styles.strengthLabel}>{passwordStrength.label}</span>
                <span style={styles.strengthHint}>Use 8+ chars, a number, and a symbol</span>
              </div>
              <div style={styles.strengthTrack} aria-hidden="true">
                <div style={styles.strengthFill}></div>
              </div>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm</label>
            <input
              style={styles.input}
              type="password"
              value={registerForm.password_confirmation}
              onChange={(e) => {
                setRegisterForm((cur) => ({ ...cur, password_confirmation: e.target.value }))
                setButtonOffset({ x: 0, y: 0 })
              }}
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={handleMouseEnter}
        >
          Create Account
        </button>

        <p style={styles.terms}>
          By signing up, you agree to our <a href="#" style={styles.termsLink} onClick={(e) => { e.preventDefault(); setAuthMode('terms'); }}>Terms of Service</a> and <a href="#" style={styles.termsLink} onClick={(e) => { e.preventDefault(); setAuthMode('privacy'); }}>Privacy Policy</a>.
        </p>
      </form>

      <StatusBanner status={status} />
    </div>
  )
}

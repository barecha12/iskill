import React from 'react'
import { StatusBanner } from './StatusBanner'

export function RegisterForm({ registerForm, setRegisterForm, handleRegister, status }) {
  const [buttonOffset, setButtonOffset] = React.useState({ x: 0, y: 0 })
  
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
      gap: '12px',
      width: '100%',
    },

    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },

    title: {
      fontSize: '28px',
      fontWeight: 800,
      color: '#fff',
      margin: '0 0 8px',
      textAlign: 'center',
    },

    subtitle: {
      fontSize: '13px',
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: '20px',
    },

    label: {
      fontSize: '11px',
      marginBottom: '6px',
      display: 'block',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    input: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      outline: 'none',
      fontSize: '14px',
      boxSizing: 'border-box',
    },

    button: {
      marginTop: '10px',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      background: isFormValid ? 'linear-gradient(135deg, #d4af37, #996515)' : 'rgba(255,255,255,0.05)',
      color: isFormValid ? 'black' : 'rgba(255,255,255,0.2)',
      fontWeight: 800,
      cursor: isFormValid ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
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
              placeholder="••••••••"
              required
            />
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
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={handleMouseEnter}
        >
          {isFormValid ? 'Finalize Account' : 'Fill All Fields'}
        </button>
      </form>

      <StatusBanner status={status} />
    </div>
  )
}

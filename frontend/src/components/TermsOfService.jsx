import React from 'react'

export function TermsOfService({ setAuthMode }) {
  const styles = {
    container: {
      padding: '40px',
      color: '#fff',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 800,
      color: '#f5d56b',
      margin: '0 0 10px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#f5d56b',
      marginTop: '20px',
    },
    text: {
      fontSize: '14px',
      lineHeight: 1.7,
      color: '#94a3b8',
    },
    button: {
      marginTop: '30px',
      padding: '12px 24px',
      borderRadius: '8px',
      border: '1px solid #f5d56b',
      background: 'transparent',
      color: '#f5d56b',
      fontWeight: 700,
      cursor: 'pointer',
      alignSelf: 'flex-start',
      transition: 'all 0.2s ease',
    }
  }

  return (
    <div style={styles.container} className="legal-scroll-container">
      <h1 style={styles.title}>Terms of Service</h1>
      <p style={styles.text}>Last Updated: May 13, 2026</p>

      <section>
        <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
        <p style={styles.text}>
          By accessing and using the Iskill platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
        </p>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>2. User Responsibilities</h2>
        <p style={styles.text}>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to use the platform only for lawful professional purposes.
        </p>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>3. Intellectual Property</h2>
        <p style={styles.text}>
          All content, features, and functionality on the Iskill platform are the exclusive property of Iskill and its licensors. You may not reproduce, distribute, or create derivative works without explicit permission.
        </p>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>4. Limitation of Liability</h2>
        <p style={styles.text}>
          Iskill shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the service.
        </p>
      </section>

      <button 
        style={styles.button} 
        onClick={() => setAuthMode('register')}
        onMouseOver={(e) => { e.target.style.background = 'rgba(245, 213, 107, 0.1)' }}
        onMouseOut={(e) => { e.target.style.background = 'transparent' }}
      >
        Back to Registration
      </button>
    </div>
  )
}

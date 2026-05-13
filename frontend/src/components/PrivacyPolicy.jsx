import React from 'react'

export function PrivacyPolicy({ setAuthMode }) {
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
      <h1 style={styles.title}>Privacy Policy</h1>
      <p style={styles.text}>Last Updated: May 13, 2026</p>

      <section>
        <h2 style={styles.sectionTitle}>1. Information Collection</h2>
        <p style={styles.text}>
          We collect information you provide directly to us when you create an account, such as your name, email address, job title, and department. This information is used to facilitate secure workspace collaboration.
        </p>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>2. Data Usage</h2>
        <p style={styles.text}>
          Your data is used to provide, maintain, and improve our services, including chat functionality and document sharing. We do not sell your personal information to third parties.
        </p>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>3. Data Security</h2>
        <p style={styles.text}>
          We implement industry-standard security measures, including encryption and strict access controls, to protect your data from unauthorized access or disclosure.
        </p>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>4. Your Rights</h2>
        <p style={styles.text}>
          You have the right to access, correct, or delete your personal information within the Iskill platform. For complex requests, please contact our administrative team.
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

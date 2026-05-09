import React from 'react'

const icons = {
  'Teammates': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'Documents': 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7',
  'Unread': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6'
}

export function MetricCard({ label, value, description }) {
  return (
    <article className="metric-card">
      <div className="metric-header">
        <div className="metric-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons[label] || 'M12 2v20M2 12h20'} />
          </svg>
        </div>
        <span>{label}</span>
        <div className="metric-trend">+12%</div>
      </div>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  )
}

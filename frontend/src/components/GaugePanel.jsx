import React from 'react'

export function GaugePanel({ title, value, min = 0, max = 100, unit = '%', span = 'span-3' }) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100)
  const radius = 70
  const circumference = Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Color based on value
  let color = 'var(--grafana-green)'
  if (percentage > 60) color = 'var(--grafana-yellow)'
  if (percentage > 85) color = 'var(--grafana-red)'

  return (
    <div className={`grafana-panel ${span}`}>
      <div className="grafana-panel-header">
        <h3>{title}</h3>
      </div>
      <div className="grafana-panel-content">
        <div className="gauge-container">
          <svg className="gauge-svg" viewBox="0 0 200 120">
            {/* Background Track */}
            <path
              d="M 30 100 A 70 70 0 0 1 170 100"
              fill="none"
              stroke="#222"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Value Track */}
            <path
              d="M 30 100 A 70 70 0 0 1 170 100"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            <text
              x="100"
              y="90"
              textAnchor="middle"
              className="gauge-value"
              style={{ fill: color }}
            >
              {value}{unit}
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}

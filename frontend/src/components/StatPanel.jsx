import React from 'react'

export function StatPanel({ title, value, label, color = 'var(--grafana-blue)', span = 'span-3', children }) {
  return (
    <div className={`grafana-panel ${span}`}>
      <div className="grafana-panel-header">
        <h3>{title}</h3>
      </div>
      <div className="grafana-panel-content">
        <div className="stat-panel-value" style={{ color }}>{value}</div>
        <div className="stat-panel-label">{label}</div>
        {children && <div className="stat-sparkline">{children}</div>}
      </div>
    </div>
  )
}

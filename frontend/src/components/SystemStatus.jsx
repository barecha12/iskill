import React from 'react'

export function SystemStatus({ span = 'span-4' }) {
  const services = [
    { name: 'API Server', status: 'Online', latency: '24ms', color: 'var(--grafana-green)' },
    { name: 'WebSocket', status: 'Online', latency: '12ms', color: 'var(--grafana-green)' },
    { name: 'File Store', status: 'Optimal', latency: '156ms', color: 'var(--grafana-green)' },
    { name: 'Database', status: 'Connected', latency: '8ms', color: 'var(--grafana-green)' },
    { name: 'Auth Service', status: 'Standby', latency: '45ms', color: 'var(--grafana-yellow)' },
  ]

  return (
    <div className={`grafana-panel ${span}`}>
      <div className="grafana-panel-header">
        <h3>System Status Board</h3>
      </div>
      <div className="grafana-panel-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map((service, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: service.color, boxShadow: `0 0 8px ${service.color}` }}></div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#ccc' }}>{service.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>{service.latency}</span>
                <span style={{ fontSize: '11px', color: service.color, fontWeight: 'bold', textTransform: 'uppercase' }}>{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

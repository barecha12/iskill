import React from 'react'

export function ActivityGraph({ span = 'span-6' }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const data = [40, 70, 45, 90, 65, 30, 50]
  
  return (
    <div className={`grafana-panel ${span} row-2`}>
      <div className="grafana-panel-header">
        <h3>Team Activity (Time Series)</h3>
      </div>
      <div className="grafana-panel-content">
        <div className="time-series-container" style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '20px' }}>
          {data.map((value, index) => (
            <div key={days[index]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <div 
                style={{ 
                  width: '100%', 
                  height: `${value}%`, 
                  background: 'linear-gradient(to top, rgba(87, 148, 242, 0.1), var(--grafana-blue))',
                  borderRadius: '2px 2px 0 0',
                  position: 'relative',
                  borderTop: '2px solid var(--grafana-blue)',
                  transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '-25px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    color: 'var(--grafana-blue)',
                    fontWeight: 'bold'
                  }}
                >
                  {value}
                </div>
              </div>
              <span style={{ fontSize: '10px', color: '#666', marginTop: '8px', textTransform: 'uppercase' }}>{days[index]}</span>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--grafana-blue)', borderRadius: '2px' }}></div>
            <span style={{ color: '#999' }}>Messages</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--grafana-green)', borderRadius: '2px' }}></div>
            <span style={{ color: '#999' }}>Uploads</span>
          </div>
        </div>
      </div>
    </div>
  )
}

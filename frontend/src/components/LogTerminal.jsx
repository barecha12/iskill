import React, { useEffect, useState, useRef } from 'react'

export function LogTerminal({ span = 'span-8' }) {
  const [logs, setLogs] = useState([
    { id: 1, time: '11:00:15', msg: 'System initialized...', type: 'info' },
    { id: 2, time: '11:00:18', msg: 'Database connection established.', type: 'success' },
    { id: 3, time: '11:01:05', msg: 'User admin logged in from 192.168.1.1', type: 'info' },
  ])
  
  const scrollRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        'GET /api/v1/documents - 200 OK',
        'POST /api/v1/chat/send - 201 Created',
        'Cache hit for key: users_list',
        'Socket.io ping-pong: 12ms',
        'Broadcasting update to channel: general',
        'Document "Design_Specs.pdf" synced to cloud',
      ]
      const types = ['info', 'success', 'info', 'info', 'info', 'success']
      const randomIndex = Math.floor(Math.random() * messages.length)
      
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        msg: messages[randomIndex],
        type: types[randomIndex]
      }
      
      setLogs(prev => [...prev.slice(-15), newLog])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className={`grafana-panel ${span} row-2`}>
      <div className="grafana-panel-header">
        <h3>Live Activity Logs</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--grafana-green)' }}>● LIVE</span>
        </div>
      </div>
      <div className="grafana-panel-content" style={{ background: '#050505', padding: '12px' }}>
        <div 
          ref={scrollRef}
          style={{ 
            height: '100%', 
            overflowY: 'auto', 
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: '11px',
            lineHeight: '1.5'
          }}
        >
          {logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
              <span style={{ color: '#444' }}>[{log.time}]</span>
              <span style={{ color: log.type === 'success' ? 'var(--grafana-green)' : '#999' }}>{log.msg}</span>
            </div>
          ))}
          <div style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--grafana-blue)', verticalAlign: 'middle', marginLeft: '4px', animation: 'blink 1s infinite' }}></div>
        </div>
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}

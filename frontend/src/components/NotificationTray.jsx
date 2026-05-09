import React from 'react'

export function NotificationTray({ notifications, onClose, onAction, handleMarkRead }) {
  const [selectedNotification, setSelectedNotification] = React.useState(null)
  const trayRef = React.useRef(null)

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (trayRef.current && !trayRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const unreadNotifications = notifications.filter(n => !n.read)

  return (
    <div className="notification-tray-overlay" ref={trayRef}>
      <div className="notification-tray-header">
        <h3>{selectedNotification ? 'Directive Details' : 'System Priority Alerts'}</h3>
        {!selectedNotification && (
          <span className="badge-premium">{unreadNotifications.length} Active</span>
        )}
        {selectedNotification && (
          <button className="back-to-list" onClick={() => setSelectedNotification(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back
          </button>
        )}
      </div>
      
      <div className="notification-tray-body">
        {selectedNotification ? (
          <div className="notification-detail-view">
            <div className={`detail-icon-large ${selectedNotification.type}`}>
              {selectedNotification.type === 'signal' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              )}
            </div>
            
            <div className="detail-meta-large">
              <div className="author-name">{selectedNotification.author}</div>
              <div className="time-stamp">{selectedNotification.timestamp ? new Date(selectedNotification.timestamp).toLocaleString() : 'Recent'}</div>
            </div>

            <div className="detail-content-full">
              {selectedNotification.content}
            </div>

            <div className="detail-actions">
              <button 
                className="btn-primary-small"
                onClick={() => {
                  onAction(selectedNotification)
                  onClose()
                }}
              >
                Go to {selectedNotification.type === 'signal' ? 'Dashboard' : 'Conversation'}
              </button>
              
              {selectedNotification.type === 'signal' && !selectedNotification.read && (
                <button 
                  className="btn-outline-small"
                  onClick={() => {
                    handleMarkRead(selectedNotification.originalId)
                    setSelectedNotification(null)
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2, marginBottom: '12px' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <p>No high-priority directives detected.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`notification-item ${n.type} ${n.read ? 'read' : ''}`}
              onClick={() => setSelectedNotification(n)}
            >
              <div className="notification-icon">
                {n.type === 'signal' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
              </div>
              <div className="notification-content">
                <div className="notification-meta">
                  <span className="notification-author">{n.author}</span>
                  <span className="notification-time">{n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                </div>
                <p className="notification-text">{n.content}</p>
                <div className="notification-item-footer">
                  <div className="notification-type-tag">{n.type === 'signal' ? 'ADMIN BROADCAST' : 'DIRECTIVE'}</div>
                  <div className="more-indicator">Details →</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .notification-tray-overlay {
          position: absolute;
          top: 70px;
          right: 20px;
          width: 380px;
          background: #0f172a;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.05);
          z-index: 1000;
          animation: slideInTray 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        @keyframes slideInTray {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .notification-tray-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(212, 175, 55, 0.02);
        }
        .notification-tray-header h3 {
          margin: 0;
          font-size: 13px;
          color: #fff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .back-to-list {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          text-transform: uppercase;
        }
        .badge-premium {
          background: var(--primary);
          color: #000;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .notification-tray-body {
          max-height: 480px;
          overflow-y: auto;
        }
        .notification-empty {
          padding: 80px 40px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
        }
        .notification-item {
          padding: 18px 20px;
          display: flex;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s;
        }
        .notification-item:hover {
          background: rgba(255,255,255,0.04);
        }
        .notification-item.read {
          opacity: 0.5;
        }
        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notification-item.signal .notification-icon { background: rgba(212, 175, 55, 0.1); color: var(--primary); }
        .notification-item.message .notification-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        
        .notification-content { flex: 1; }
        .notification-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .notification-author { font-size: 14px; font-weight: 700; color: #fff; }
        .notification-time { font-size: 11px; color: var(--text-muted); }
        .notification-text {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .notification-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        .notification-type-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
          opacity: 0.7;
          text-transform: uppercase;
        }
        .more-indicator {
          font-size: 10px;
          font-weight: 700;
          color: var(--primary);
          opacity: 0;
          transition: 0.2s;
        }
        .notification-item:hover .more-indicator { opacity: 1; }

        .notification-detail-view {
          padding: 30px;
          text-align: left;
        }
        .detail-icon-large {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .detail-icon-large.signal { background: rgba(212, 175, 55, 0.1); color: var(--primary); }
        .detail-icon-large.message { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        
        .author-name { font-size: 18px; font-weight: 800; color: #fff; }
        .time-stamp { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        
        .detail-content-full {
          margin-top: 24px;
          font-size: 15px;
          color: #cbd5e1;
          line-height: 1.6;
          white-space: pre-wrap;
          background: rgba(255,255,255,0.02);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.03);
        }
        .detail-actions {
          margin-top: 30px;
          display: flex;
          gap: 12px;
        }
        .btn-primary-small {
          background: var(--primary);
          color: #000;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-outline-small {
          background: none;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--primary);
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-outline-small:hover { background: rgba(212, 175, 55, 0.05); }
      `}</style>
    </div>
  )
}

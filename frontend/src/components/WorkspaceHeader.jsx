import React from 'react'
import { formatCalendarDate } from '../utils/formatters'
import { NotificationTray } from './NotificationTray'

export function WorkspaceHeader({ 
  viewTitle, activeView, setActiveView, onMenuClick, 
  notifications = [], setSelectedUserId, handleMarkAnnouncementRead
}) {
  const [isTrayOpen, setIsTrayOpen] = React.useState(false)
  const showBack = activeView !== 'dashboard'

  const handleNotificationAction = (n) => {
    if (n.type === 'signal') {
      setActiveView('dashboard')
    } else if (n.type === 'message') {
      setSelectedUserId(n.userId)
      setActiveView('chat')
    }
  }

  return (
    <header className="workspace-header">
      <div className="header-left">
        <button className="mobile-menu-trigger" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        {showBack && (
          <button className="header-back-btn" onClick={() => setActiveView('dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span>Back</span>
          </button>
        )}
        
        <h2>{viewTitle}</h2>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="notification-wrapper" style={{ position: 'relative' }}>
          <button 
            className={`notification-trigger ${notifications.some(n => !n.read) ? 'active' : ''}`}
            onClick={() => setIsTrayOpen(!isTrayOpen)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: notifications.some(n => !n.read) ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            {notifications.some(n => !n.read) && (
              <span className="notification-badge-pulse"></span>
            )}
          </button>
          
          {isTrayOpen && (
            <NotificationTray 
              notifications={notifications} 
              onClose={() => setIsTrayOpen(false)}
              onAction={handleNotificationAction}
              handleMarkRead={handleMarkAnnouncementRead}
            />
          )}
        </div>

        <div className="header-meta">
          <div className="header-chip">Today {formatCalendarDate(new Date())}</div>
          <div className="header-chip accent">Executive Portal</div>
        </div>
      </div>

      <style>{`
        .notification-trigger.active {
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
        }
        .notification-trigger:hover {
          background: rgba(255,255,255,0.06);
          color: var(--primary);
        }
        .notification-badge-pulse {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
          animation: pulse-gold 2s infinite;
        }
        @keyframes pulse-gold {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
      `}</style>
    </header>
  )
}

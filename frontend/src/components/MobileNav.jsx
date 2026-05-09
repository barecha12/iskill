import React from 'react'
import { getInitials } from '../utils/formatters'
import { navigationItems } from '../utils/navigation'

export function MobileNav({
  currentUser,
  activeView,
  setActiveView,
  teamCount,
  unreadCount,
  handleLogout,
  startTransition,
  onClose
}) {
  return (
    <div className="mobile-nav-overlay" onClick={onClose}>
      <aside className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-nav-header">
          <div className="brand-lockup">
            <div className="logo-mark"><img src="/logo.svg" alt="logo" width="32" height="32"></img></div>
            <div>
              <h1 className="sidebar-title">Iskill</h1>
              <p className="sidebar-subtitle">Workspace Portal</p>
            </div>
          </div>
          <button className="close-menu-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="sidebar-summary">
          <div className="summary-stat">
            <span>Team</span>
            <strong>{teamCount}</strong>
          </div>
          <div className="summary-stat">
            <span>Inbox</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activeView ? 'nav-link active' : 'nav-link'}
              onClick={() => {
                startTransition(() => setActiveView(item.id))
                onClose()
              }}
            >
              <div className="nav-link-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <span className="nav-link-label">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-row">
            <div className="avatar-circle">{getInitials(currentUser?.name)}</div>
            <div className="user-info">
              <strong>{currentUser?.name}</strong>
              <span>{currentUser?.profile?.department ?? 'General'}</span>
            </div>
          </div>
          <button type="button" className="ghost-button wide logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </div>
  )
}

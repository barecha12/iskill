import React from 'react'
import { getInitials } from '../utils/formatters'

import { navigationItems } from '../utils/navigation'

export function Sidebar({ 
  currentUser, 
  activeView, 
  setActiveView, 
  teamCount, 
  unreadCount, 
  handleLogout,
  startTransition 
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand-lockup">
          <div className="logo-mark"><img src="/logo.svg" alt="logo" width="32" height="32" /></div>
          <div>
            <h1 className="sidebar-title">Iskill</h1>
            <p className="sidebar-subtitle">Workspace Portal</p>
          </div>
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
      </div>

      <nav className="sidebar-nav">
        {navigationItems.filter(item => {
          // If user is admin, only show Dashboard and hide standard collaboration tools
          if (currentUser?.is_admin) {
            return item.id === 'dashboard'
          }
          return true
        }).map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === activeView ? 'nav-link active' : 'nav-link'}
            onClick={() => startTransition(() => setActiveView(item.id))}
          >
            <div className="nav-link-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="nav-link-label">{item.label}</span>
            </div>
          </button>
        ))}
        {currentUser?.is_admin && (
          <button
            type="button"
            className={activeView === 'admin' ? 'nav-link active' : 'nav-link'}
            onClick={() => startTransition(() => setActiveView('admin'))}
          >
            <div className="nav-link-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span className="nav-link-label">Governance</span>
            </div>
          </button>
        )}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-row">
          <div className="avatar-circle">
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="sidebar-avatar-img" 
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = getInitials(currentUser?.name); }}
              />
            ) : (
              getInitials(currentUser?.name)
            )}
          </div>
          <div className="user-info">
            <strong>{currentUser?.name}</strong>
            <span>{currentUser?.profile?.department ?? 'General'}</span>
          </div>
        </div>
        <button type="button" className="ghost-button wide logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>
    </aside>
  )
}

import React from 'react'
import { getInitials } from '../utils/formatters'
import { navigationItems } from '../utils/navigation'

export function MobileNav({
  currentUser,
  activeView,
  setActiveView,
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

        <nav className="sidebar-nav">
          {navigationItems.filter(item => {
            if (Boolean(currentUser?.is_admin)) {
              return item.id === 'dashboard'
            }
            return true
          }).map((item) => (
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
                <div className="nav-link-main">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span className="nav-link-label">{item.label}</span>
                </div>
                {item.id === 'chat' && unreadCount > 0 ? (
                  <span className="nav-link-badge">{unreadCount}</span>
                ) : null}
              </div>
            </button>
          ))}
          {Boolean(currentUser?.is_admin) && (
            <button
              type="button"
              className={activeView === 'admin' ? 'nav-link active' : 'nav-link'}
              onClick={() => {
                startTransition(() => setActiveView('admin'))
                onClose()
              }}
            >
              <div className="nav-link-row">
                <div className="nav-link-main">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span className="nav-link-label">Governance</span>
                </div>
              </div>
            </button>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-row">
            <div className="avatar-circle">
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar.startsWith('http') ? currentUser.avatar : `/storage/${currentUser.avatar}`} 
                  alt="" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
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

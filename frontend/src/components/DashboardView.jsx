import React from 'react'

export function DashboardView({ 
  currentUser, teamCount, documentCount, unreadCount, users, documents, 
  handleRefresh, handleGenerateReport, setActiveView,
  handleDispatchSignal, announcements 
}) {
  const isAdmin = currentUser?.is_admin
  const [broadcastContent, setBroadcastContent] = React.useState('')
  
  // Real-time Data Analytics
  const totalStorageBytes = documents.reduce((acc, doc) => acc + (doc.size || 0), 0)
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const activeDepartmentCount = [...new Set(users.map(u => u.profile?.department).filter(Boolean))].length
  const recentGlobalDocs = documents.slice(0, 6)
  const myRecentDocs = documents.filter(d => d.uploaded_by === currentUser?.id).slice(0, 5)
  const dashboardDocs = isAdmin ? documents : documents.filter(d => d.uploaded_by === currentUser?.id)
  const activityBars = React.useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))
      const key = date.toISOString().slice(0, 10)
      const total = dashboardDocs.filter((doc) => {
        const created = doc.created_at ? new Date(doc.created_at).toISOString().slice(0, 10) : ''
        return created === key
      }).length

      return {
        key,
        label: date.toLocaleDateString(undefined, { weekday: 'short' }),
        total,
      }
    })
  }, [dashboardDocs])
  const maxActivity = Math.max(...activityBars.map((item) => item.total), 1)
  const insightCards = [
    {
      label: isAdmin ? 'Total Data Volume' : 'My Assets',
      value: isAdmin ? documentCount : dashboardDocs.length,
      accent: 'var(--primary)',
      detail: isAdmin ? `${formatBytes(totalStorageBytes)} stored` : 'Documents in your workspace',
      border: '4px solid var(--primary)',
    },
    {
      label: isAdmin ? 'Personnel Registry' : 'Messages',
      value: isAdmin ? users.length : unreadCount,
      accent: '#3b82f6',
      detail: isAdmin ? `Active in ${activeDepartmentCount} departments` : unreadCount > 0 ? 'Unread conversations waiting' : 'All caught up',
      border: '4px solid #3b82f6',
    },
    {
      label: 'Security Layer',
      value: 256,
      valueSuffix: '-bit',
      accent: '#a855f7',
      detail: 'AES encryption enforced',
      border: '4px solid #a855f7',
    },
    {
      label: 'Authentication',
      value: '100%',
      accent: '#eab308',
      detail: 'Token verification online',
      border: '4px solid #eab308',
    },
  ]

  return (
    <section className="dashboard-view-content" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* System Signal Banner (Latest Unread Broadcast) */}
      {announcements.filter(a => !a.read_by_users?.some(u => u.id === currentUser?.id)).length > 0 && (
        <div className="system-signal-banner" style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '30px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          animation: 'slideDown 0.5s ease-out'
        }}>
          <div style={{
            background: 'var(--primary)',
            color: '#000',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1.5px', marginBottom: '4px' }}>System Priority Signal</div>
            <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', lineHeight: '1.5' }}>
              {announcements.filter(a => !a.read_by_users?.some(u => u.id === currentUser?.id))[0].content}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Dispatched by {announcements.filter(a => !a.read_by_users?.some(u => u.id === currentUser?.id))[0].user?.name} • {new Date(announcements.filter(a => !a.read_by_users?.some(u => u.id === currentUser?.id))[0].created_at).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Executive Command Header */}
      <div className="personal-welcome-section">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            {isAdmin ? 'System Governance' : 'Executive Workspace'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0, fontWeight: '500' }}>
            Authenticated as: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{currentUser?.name}</span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '4px' }}>System Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>Operational</span>
          </div>
        </div>
      </div>

      {/* Global Metadata Grid */}
      <div className="personal-insights-grid">
        {insightCards.map((card) => (
          <div key={card.label} className="premium-card" style={{ padding: '24px', borderLeft: card.border }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700' }}>
              {card.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '8px' }}>
              <h2 style={{ fontSize: '36px', margin: 0, color: '#fff', fontWeight: '800' }}>
                {card.value}
              </h2>
              {card.valueSuffix ? <span style={{ color: card.accent, fontWeight: '700', fontSize: '14px' }}>{card.valueSuffix}</span> : null}
            </div>
            <div style={{ fontSize: '12px', color: card.accent, marginTop: '8px', fontWeight: '600' }}>
              {card.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Governance Grid */}
      <div className="personal-main-grid" style={{ gridTemplateColumns: isAdmin ? '1.8fr 1fr' : '1.5fr 1fr' }}>
        
        {/* Activity Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card" style={{ minHeight: '400px' }}>
            <div className="premium-card-header">
              <div>
                <h3 style={{ margin: 0 }}>{isAdmin ? 'Global Intelligence Feed' : 'Personal Activity Log'}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Real-time monitoring of all published assets</p>
              </div>
              <button className="icon-action-btn sm" onClick={handleRefresh} title="Sync Feed">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              </button>
            </div>

            <div className="activity-chart-card">
              <div className="activity-chart-header">
                <span>Last 7 days</span>
                <strong>{activityBars.reduce((sum, item) => sum + item.total, 0)} uploads</strong>
              </div>
              <div className="activity-chart-bars">
                {activityBars.map((item) => (
                  <div key={item.key} className="activity-chart-col">
                    <div className="activity-chart-track">
                      <div
                        className={`activity-chart-fill ${item.total === 0 ? 'empty' : ''}`}
                        style={{ height: `${Math.max((item.total / maxActivity) * 100, item.total ? 18 : 16)}%` }}
                        title={`${item.label}: ${item.total}`}
                      ></div>
                    </div>
                    <small>{item.total === 0 ? 'No activity' : `${item.total} file${item.total > 1 ? 's' : ''}`}</small>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="activity-section-divider">
              <span>Recent Files</span>
            </div>

            <div className="activity-list-professional">
              {(isAdmin ? recentGlobalDocs : myRecentDocs).map(doc => (
                <div key={doc.id} className="activity-row">
                  <div className="activity-info">
                    <div className="file-type-badge">{doc.original_name.split('.').pop().toUpperCase()}</div>
                    <div>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '14px' }}>{doc.title}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {isAdmin ? `Authored by ${doc.uploader?.name}` : `Published on ${new Date(doc.created_at).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>{formatBytes(doc.size)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{doc.uploader?.profile?.department || 'Sector Alpha'}</div>
                  </div>
                </div>
              ))}
              {(isAdmin ? recentGlobalDocs : myRecentDocs).length === 0 && (
                <div className="empty-state-p">No activity detected in the secure registry.</div>
              )}
            </div>
          </div>
        </div>

        {/* System Management Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {isAdmin ? (
            <div className="premium-card" style={{ background: 'rgba(212, 175, 55, 0.03)' }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 16px' }}>Broadcast Announcement</h3>
              <div className="broadcast-box">
                <textarea 
                  placeholder="Draft system-wide notification..."
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '13px', resize: 'none', height: '80px', marginBottom: '12px' }}
                />
                <button 
                  className="primary-button full-width" 
                  style={{ fontWeight: '800' }}
                  onClick={async () => {
                    if (!broadcastContent.trim()) return
                    await handleDispatchSignal(broadcastContent.trim())
                    setBroadcastContent('')
                  }}
                >
                  Dispatch Signal
                </button>
              </div>
            </div>
          ) : null}

          <div className="premium-card">
            <h3 style={{ fontSize: '16px', margin: '0 0 16px' }}>{isAdmin ? 'Governance Controls' : 'Quick Actions'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button className="quick-action-pill documents" onClick={() => setActiveView(isAdmin ? 'admin' : 'documents')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>{isAdmin ? 'Registry' : 'Upload'}</span>
              </button>
              <button className="quick-action-pill communications" onClick={() => setActiveView('chat')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>Communicate</span>
              </button>
              <button className="quick-action-pill sync" onClick={handleRefresh}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                <span>Sync Node</span>
              </button>
              <button className="quick-action-pill danger" onClick={() => handleGenerateReport('pdf')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span>Full Audit</span>
              </button>
            </div>
          </div>

          <div className="premium-card">
            <h3 style={{ fontSize: '16px', margin: '0 0 16px' }}>Network Topology</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="topology-stat">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Database Connection</span>
                  <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>Active</span>
                </div>
                <div className="progress-container"><div className="progress-bar" style={{ width: '100%', background: '#22c55e' }}></div></div>
              </div>
              <div className="topology-stat">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>API Response Time</span>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700' }}>24ms · Excellent</span>
                </div>
                <div className="progress-container"><div className="progress-bar" style={{ width: '92%', background: '#38bdf8' }}></div></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .activity-list-professional {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }
        .activity-chart-card {
          margin-top: 18px;
          padding: 18px;
          border-radius: 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .activity-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .activity-chart-header strong {
          color: var(--primary);
          font-size: 12px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .activity-chart-bars {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
          align-items: end;
        }
        .activity-chart-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .activity-chart-col span {
          font-size: 11px;
          color: var(--text-muted);
        }
        .activity-chart-col small {
          font-size: 10px;
          color: rgba(148, 163, 184, 0.78);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .activity-chart-track {
          width: 100%;
          height: 88px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .activity-chart-fill {
          width: 100%;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(180deg, #f5d56b 0%, #9a6518 100%);
          min-height: 6px;
        }
        .activity-chart-fill.empty {
          background: rgba(71, 85, 105, 0.55);
          border-top: 1px dashed rgba(148, 163, 184, 0.45);
        }
        .activity-section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 0;
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .activity-section-divider::before,
        .activity-section-divider::after {
          content: '';
          height: 1px;
          flex: 1;
          background: rgba(255,255,255,0.08);
        }
        .activity-row {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .activity-row:hover {
          background: rgba(255,255,255,0.04);
          transform: translateX(5px);
          border-color: var(--primary);
        }
        .activity-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .file-type-badge {
          width: 40px;
          height: 40px;
          background: #1e293b;
          border: 1px solid var(--surface-border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: var(--primary);
        }
        .quick-action-pill {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 14px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }
        .quick-action-pill.documents {
          background: rgba(212, 175, 55, 0.14);
          border-color: rgba(212, 175, 55, 0.28);
          color: #f5d56b;
        }
        .quick-action-pill.communications {
          background: rgba(59, 130, 246, 0.12);
          border-color: rgba(59, 130, 246, 0.24);
          color: #93c5fd;
        }
        .quick-action-pill.sync {
          background: rgba(20, 184, 166, 0.14);
          border-color: rgba(20, 184, 166, 0.26);
          color: #99f6e4;
        }
        .quick-action-pill.danger {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
        .quick-action-pill:hover {
          transform: translateY(-2px);
        }
        .quick-action-pill.documents:hover { background: rgba(212, 175, 55, 0.22); color: #fde68a; border-color: rgba(212, 175, 55, 0.4); }
        .quick-action-pill.communications:hover { background: rgba(59, 130, 246, 0.18); color: #bfdbfe; border-color: rgba(59, 130, 246, 0.34); }
        .quick-action-pill.sync:hover { background: rgba(20, 184, 166, 0.2); color: #ccfbf1; border-color: rgba(20, 184, 166, 0.35); }
        .quick-action-pill svg { transition: stroke 0.2s; }
        .quick-action-pill span { font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .quick-action-pill.danger:hover { background: rgba(239, 68, 68, 0.2); color: #fff; border-color: rgba(239, 68, 68, 0.35); }
        .empty-state-p {
          padding: 60px;
          text-align: center;
          color: var(--text-muted);
          font-style: italic;
          font-size: 13px;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .personal-insights-grid {
            grid-template-columns: 1fr !important;
          }
          .personal-main-grid {
            grid-template-columns: 1fr !important;
          }
          .personal-welcome-section {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 16px;
          }
          .personal-welcome-section div:last-child {
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  )
}

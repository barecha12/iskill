import React, { useEffect, useState } from 'react'
import { getInitials } from '../utils/formatters'
import { STORAGE_BASE_URL } from '../api/client'

export function AdminConsoleView({ 
  adminUsers, loadAdminUsers, handleToggleAdmin, handleDeleteUser, 
  adminDocuments, loadAdminDocuments, handleUpdateUserCompliance, handleUpdateDocumentCompliance,
  handleInspect,
  currentUser 
}) {
  const [activeTab, setActiveTab] = useState('personnel')

  useEffect(() => {
    loadAdminUsers()
    loadAdminDocuments()
  }, [])

  const complianceOptions = [
    { value: 'compliant', label: 'Compliant', color: '#22c55e' },
    { value: 'under_review', label: 'Under Review', color: '#eab308' },
    { value: 'flagged', label: 'Flagged', color: '#ef4444' }
  ]

  const getComplianceLabel = (status) => complianceOptions.find(o => o.value === status) || complianceOptions[0]

  return (
    <section className="admin-console-layout">
      <div className="admin-header-panel">
        <div className="admin-title-block">
          <h1>Identity & Compliance Governance</h1>
          <p>System-wide registry monitoring and asset integrity enforcement</p>
        </div>
        <div className="admin-tabs">
          <button 
            className={`admin-tab-btn ${activeTab === 'personnel' ? 'active' : ''}`}
            onClick={() => setActiveTab('personnel')}
          >
            Personnel Registry
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            Asset Audit
          </button>
        </div>
      </div>

      <div className="admin-stats-strip">
        <div className="mini-stat">
          <span className="label">Total Personnel</span>
          <span className="value">{adminUsers.length}</span>
        </div>
        <div className="mini-stat">
          <span className="label">Managed Assets</span>
          <span className="value">{adminDocuments.length}</span>
        </div>
        <div className="mini-stat">
          <span className="label">Flagged Items</span>
          <span className="value danger">
            {adminUsers.filter(u => u.compliance_status === 'flagged').length + 
             adminDocuments.filter(d => d.compliance_status === 'flagged').length}
          </span>
        </div>
      </div>

      {activeTab === 'personnel' ? (
        <div className="admin-registry-table-wrap">
          <table className="admin-registry-table">
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Department</th>
                <th>Access Level</th>
                <th>Compliance Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map(user => (
                <tr key={user.id} className={user.is_admin ? 'admin-row' : ''}>
                  <td>
                    <div className="user-profile-cell">
                      <div className="avatar-circle sm">
                        {user.avatar ? (
                          <img src={user.avatar.startsWith('http') ? user.avatar : `${STORAGE_BASE_URL}/${user.avatar}`} alt="" />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="user-name-info">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.profile?.department || 'Sector General'}</td>
                  <td>
                    {user.is_admin ? (
                      <span className="status-pill gold-fill">Admin</span>
                    ) : (
                      <span className="status-pill ghost">Standard</span>
                    )}
                  </td>
                  <td>
                    <select 
                      className="compliance-select"
                      value={user.compliance_status || 'compliant'}
                      onChange={(e) => handleUpdateUserCompliance(user.id, e.target.value)}
                      style={{ color: getComplianceLabel(user.compliance_status).color }}
                    >
                      {complianceOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="admin-actions-cell">
                      {user.id !== currentUser.id ? (
                        <>
                          <button 
                            className={`action-btn sm ${user.is_admin ? 'warn' : 'gold'}`}
                            onClick={() => handleToggleAdmin(user.id)}
                          >
                            {user.is_admin ? 'Demote' : 'Promote'}
                          </button>
                          <button 
                            className="action-btn sm danger"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Purge
                          </button>
                        </>
                      ) : (
                        <span className="self-tag">System Root</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-registry-table-wrap">
          <table className="admin-registry-table">
            <thead>
              <tr>
                <th>Asset Title</th>
                <th>Uploader</th>
                <th>Dimensions</th>
                <th>Compliance</th>
                <th>Audit Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminDocuments.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon">{doc.original_name.split('.').pop().toUpperCase()}</div>
                      <div>
                        <strong>{doc.title}</strong>
                        <span>{doc.original_name}</span>
                      </div>
                    </div>
                  </td>
                  <td>{doc.uploader?.name || 'Unknown'}</td>
                  <td>{(doc.size / 1024 / 1024).toFixed(2)} MB</td>
                  <td>
                    <select 
                      className="compliance-select"
                      value={doc.compliance_status || 'compliant'}
                      onChange={(e) => handleUpdateDocumentCompliance(doc.id, e.target.value)}
                      style={{ color: getComplianceLabel(doc.compliance_status).color }}
                    >
                      {complianceOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="action-btn sm gold" onClick={() => handleInspect(`/documents/${doc.id}/download`, doc.original_name)}>
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
              {adminDocuments.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No assets found in the global registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>
        {`
          .admin-console-layout { padding: 30px; animation: fadeIn 0.5s ease; }
          .admin-header-panel {
            display: flex; justify-content: space-between; align-items: flex-end;
            margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 24px;
          }
          .admin-title-block h1 { font-size: 28px; color: #fff; margin: 0 0 4px; }
          .admin-title-block p { color: #64748b; font-size: 14px; margin: 0; }
          
          .admin-tabs { display: flex; gap: 8px; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; }
          .admin-tab-btn {
            padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700;
            color: #64748b; background: transparent; cursor: pointer; transition: all 0.2s;
          }
          .admin-tab-btn.active { background: var(--primary); color: #000; }

          .admin-stats-strip { display: flex; gap: 40px; margin-bottom: 30px; }
          .mini-stat { display: flex; flex-direction: column; gap: 4px; }
          .mini-stat .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; }
          .mini-stat .value { font-size: 20px; font-weight: 800; color: #fff; }
          .mini-stat .value.danger { color: #ef4444; }

          .admin-registry-table-wrap {
            background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px; overflow: hidden;
          }
          .admin-registry-table { width: 100%; border-collapse: collapse; }
          .admin-registry-table th {
            padding: 16px 24px; text-align: left; font-size: 11px; text-transform: uppercase;
            letter-spacing: 1px; color: #64748b; background: rgba(255,255,255,0.01);
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .admin-registry-table td { padding: 16px 24px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.02); }
          
          .user-profile-cell, .asset-cell { display: flex; align-items: center; gap: 12px; }
          .asset-icon {
            width: 36px; height: 36px; background: #1e293b; border: 1px solid rgba(212,175,55,0.2);
            border-radius: 8px; display: flex; align-items: center; justify-content: center;
            font-size: 10px; font-weight: 800; color: var(--primary);
          }
          
          .compliance-select {
            background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px; padding: 4px 8px; font-size: 12px; font-weight: 700;
            color: #fff; cursor: pointer; outline: none;
          }
          .compliance-select option { background: #0f172a; color: #fff; }

          .action-btn {
            padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700;
            cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
          }
          .action-btn.gold { background: rgba(212,175,55,0.1); color: #d4af37; border-color: rgba(212,175,55,0.2); }
          .action-btn.gold:hover { background: #d4af37; color: #000; }
          .action-btn.danger { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }
          .action-btn.danger:hover { background: #ef4444; color: #fff; }
          
          .status-pill { padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
          .status-pill.gold-fill { background: var(--primary); color: #000; }
          .status-pill.ghost { border: 1px solid rgba(255,255,255,0.1); color: #64748b; }
          .self-tag { font-size: 11px; color: var(--primary); font-style: italic; font-weight: 600; }
        `}
      </style>
    </section>
  )
}

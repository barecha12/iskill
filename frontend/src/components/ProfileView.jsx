import React from 'react'
import { getInitials, formatDateTime } from '../utils/formatters'

export function ProfileView({
  currentUser,
  targetUser = null,
  handleUpdateProfile,
  handleUpdatePassword,
  onClose = null,
}) {
  const isOwnProfile = !targetUser || targetUser.id === currentUser?.id
  const user = targetUser || currentUser

  const [activeTab, setActiveTab] = React.useState('overview')
  const [profileForm, setProfileForm] = React.useState({
    name: user?.name || '',
    title: user?.profile?.title || '',
    department: user?.profile?.department || '',
  })
  const [passwordForm, setPasswordForm] = React.useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [showPasswords, setShowPasswords] = React.useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  })
  const fileInputRef = React.useRef(null)

  React.useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        title: user.profile?.title || '',
        department: user.profile?.department || '',
      })
    }
  }, [user])

  if (!user) return null

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Unknown'

  const uploadedDocuments = user?.stats?.documents_count ?? user?.stats?.document_count ?? 'Not available'
  const lastActive = user?.updated_at ? formatDateTime(user.updated_at) : 'Not available'

  const passwordStrength = (() => {
    const password = passwordForm.password
    let score = 0

    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (!password) return { label: 'Minimum 8 chars', tone: '#64748b', fill: '0%' }
    if (score <= 1) return { label: 'Weak strength', tone: '#f87171', fill: '25%' }
    if (score === 2) return { label: 'Medium strength', tone: '#fbbf24', fill: '50%' }
    if (score === 3) return { label: 'Strong strength', tone: '#60a5fa', fill: '75%' }
    return { label: 'Very strong', tone: '#34d399', fill: '100%' }
  })()

  const onProfileSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('name', profileForm.name)
    formData.append('title', profileForm.title)
    formData.append('department', profileForm.department)
    await handleUpdateProfile(formData)
  }

  const onPasswordSubmit = async (event) => {
    event.preventDefault()
    await handleUpdatePassword(passwordForm)
    setPasswordForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    })
    setShowPasswords({
      current_password: false,
      password: false,
      password_confirmation: false,
    })
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('name', profileForm.name)
      formData.append('title', profileForm.title)
      formData.append('department', profileForm.department)
      formData.append('avatar', file)
      handleUpdateProfile(formData)
    }
  }

  const togglePasswordField = (field) => {
    setShowPasswords((current) => ({ ...current, [field]: !current[field] }))
  }

  return (
    <div className={`executive-profile-viewport ${onClose ? 'modal-mode' : ''}`}>
      {onClose && (
        <button className="profile-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      )}
      <div className="identity-badge-container">
        <div className="badge-identity-plate">
          <div className="identity-glow"></div>
          <div className="identity-content">
            <div
              className={`badge-avatar-wrap ${isOwnProfile ? 'editable' : ''}`}
              onClick={() => isOwnProfile && fileInputRef.current?.click()}
            >
              <div className="badge-avatar-inner">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="avatar-image"
                    onError={(event) => {
                      event.target.style.display = 'none'
                      event.target.parentElement.innerHTML = getInitials(user?.name)
                    }}
                  />
                ) : (
                  getInitials(user?.name)
                )}
                {isOwnProfile && (
                  <div className="avatar-overlay">
                    <span>Photo</span>
                  </div>
                )}
              </div>
              <div className="badge-status-ring"></div>
              {isOwnProfile && (
                <div className="avatar-edit-badge">
                  <span className="edit-icon">Edit</span>
                </div>
              )}
              {isOwnProfile && (
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              )}
            </div>

            <div className="badge-name-block">
              <h1>{user?.name}</h1>
              <span className="badge-title-pill">{user?.profile?.title || 'Executive Member'}</span>
            </div>
          </div>
        </div>

        <div className="badge-interface-plate">
          <div className="interface-nav">
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
            {isOwnProfile && <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Settings</button>}
            {isOwnProfile && <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>Security</button>}
          </div>

          <div className="interface-scroll-content">
            {activeTab === 'overview' && (
              <div className="overview-content-panel animate-slide">
                <div className="overview-grid">
                  <div className="info-block">
                    <label>Full Name</label>
                    <p>{user?.name}</p>
                  </div>
                  <div className="info-block">
                    <label>Professional Email</label>
                    <p>{user?.email || 'Not available'}</p>
                  </div>
                  <div className="info-block">
                    <label>Department</label>
                    <p>{user?.profile?.department || 'Not assigned'}</p>
                  </div>
                  <div className="info-block">
                    <label>Title</label>
                    <p>{user?.profile?.title || 'Not assigned'}</p>
                  </div>
                  <div className="info-block">
                    <label>Member Since</label>
                    <p>{memberSince}</p>
                  </div>
                  <div className="info-block">
                    <label>Last Active</label>
                    <p>{lastActive}</p>
                  </div>
                  <div className="info-block">
                    <label>Total Documents</label>
                    <p>{uploadedDocuments}</p>
                  </div>
                </div>
              </div>
            )}

            {isOwnProfile && activeTab === 'info' && (
              <form onSubmit={onProfileSubmit} className="interface-form animate-slide">
                <div className="input-field-premium">
                  <label>Display Name</label>
                  <input type="text" value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} />
                </div>
                <div className="input-group-row">
                  <div className="input-field-premium">
                    <label>Title</label>
                    <input type="text" value={profileForm.title} onChange={(event) => setProfileForm({ ...profileForm, title: event.target.value })} />
                  </div>
                  <div className="input-field-premium">
                    <label>Department</label>
                    <input type="text" value={profileForm.department} onChange={(event) => setProfileForm({ ...profileForm, department: event.target.value })} />
                  </div>
                </div>
                <p className="interface-helper">Changes saved here will trigger the existing success notification once the update completes.</p>
                <button type="submit" className="gold-action-btn">Commit Changes</button>
              </form>
            )}

            {isOwnProfile && activeTab === 'security' && (
              <form onSubmit={onPasswordSubmit} className="interface-form animate-slide">
                <div className="input-field-premium">
                  <label>Current Password</label>
                  <div className="password-input-shell">
                    <input
                      type={showPasswords.current_password ? 'text' : 'password'}
                      value={passwordForm.current_password}
                      onChange={(event) => setPasswordForm({ ...passwordForm, current_password: event.target.value })}
                      placeholder="Enter current password"
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => togglePasswordField('current_password')}>
                      {showPasswords.current_password ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="input-field-premium">
                  <label>New Access Key</label>
                  <div className="password-input-shell">
                    <input
                      type={showPasswords.password ? 'text' : 'password'}
                      value={passwordForm.password}
                      onChange={(event) => setPasswordForm({ ...passwordForm, password: event.target.value })}
                      placeholder="Minimum 8 characters"
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => togglePasswordField('password')}>
                      {showPasswords.password ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="password-strength-block">
                    <div className="password-strength-row">
                      <span style={{ color: passwordStrength.tone }}>{passwordStrength.label}</span>
                      <span>Use 8+ chars, a number, and a symbol</span>
                    </div>
                    <div className="password-strength-track" aria-hidden="true">
                      <div className="password-strength-fill" style={{ width: passwordStrength.fill, background: passwordStrength.tone }}></div>
                    </div>
                  </div>
                </div>
                <div className="input-field-premium">
                  <label>Confirm New Password</label>
                  <div className="password-input-shell">
                    <input
                      type={showPasswords.password_confirmation ? 'text' : 'password'}
                      value={passwordForm.password_confirmation}
                      onChange={(event) => setPasswordForm({ ...passwordForm, password_confirmation: event.target.value })}
                      placeholder="Repeat new password"
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => togglePasswordField('password_confirmation')}>
                      {showPasswords.password_confirmation ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <p className="interface-helper">Use Rotate Protocols to update your password. A success notification appears after the change is completed.</p>
                <button type="submit" className="gold-action-btn">Rotate Protocols</button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          .executive-profile-viewport {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            background: #000;
          }

          .executive-profile-viewport.modal-mode {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(12px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s ease;
          }

          .executive-profile-viewport.modal-mode .identity-badge-container {
            max-width: 960px;
            height: 560px;
            transform: scale(0.95);
            animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }

          @keyframes popIn {
            to { transform: scale(1); opacity: 1; }
          }

          .profile-close-btn {
            position: absolute;
            top: 25px;
            right: 25px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #64748b;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            z-index: 10001;
          }

          .profile-close-btn:hover {
            background: #ef4444;
            color: #fff;
            border-color: #ef4444;
          }

          .identity-badge-container {
            display: flex;
            width: 100%;
            max-width: 1000px;
            height: 600px;
            background: #0a0a0a;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 40px;
            overflow: hidden;
            box-shadow: 0 50px 100px rgba(0,0,0,0.8);
            position: relative;
          }

          .badge-identity-plate {
            width: 360px;
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
            padding: 60px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-right: 1px solid rgba(212, 175, 55, 0.1);
          }

          .identity-glow {
            position: absolute;
            top: 10%; left: 10%;
            width: 80%; height: 80%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
            pointer-events: none;
          }

          .badge-avatar-wrap {
            position: relative;
            width: 140px;
            height: 140px;
            margin-bottom: 40px;
          }

          .badge-avatar-wrap.editable {
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .badge-avatar-wrap.editable:hover {
            transform: scale(1.05);
          }

          .badge-avatar-inner {
            width: 100%; height: 100%;
            background: linear-gradient(135deg, #d4af37 0%, #aa8a2e 100%);
            border-radius: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: 800;
            color: #000;
            box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
            overflow: hidden;
            position: relative;
          }

          .avatar-image { width: 100%; height: 100%; object-fit: cover; }

          .avatar-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            opacity: 0;
            transition: opacity 0.3s;
            color: #fff;
          }

          .badge-avatar-wrap:hover .avatar-overlay { opacity: 1; }

          .avatar-edit-badge {
            position: absolute;
            bottom: 5px; right: 5px;
            min-width: 40px; height: 36px;
            padding: 0 10px;
            background: #d4af37;
            border: 3px solid #0f172a;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 5;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            transition: all 0.3s;
          }

          .avatar-edit-badge .edit-icon { font-size: 12px; font-weight: 800; color: #000; }

          .badge-avatar-wrap:hover .avatar-edit-badge {
            transform: scale(1.08);
            background: #f1d279;
          }

          .badge-status-ring {
            position: absolute;
            top: -8px; left: -8px; right: -8px; bottom: -8px;
            border: 2px solid rgba(212, 175, 55, 0.2);
            border-radius: 40px;
          }

          .badge-name-block h1 {
            font-size: 32px;
            font-weight: 800;
            color: #fff;
            margin: 0 0 12px;
            letter-spacing: -1px;
          }

          .badge-title-pill {
            display: inline-block;
            background: rgba(212, 175, 55, 0.1);
            color: #d4af37;
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border: 1px solid rgba(212, 175, 55, 0.2);
          }

          .badge-interface-plate {
            flex: 1;
            padding: 56px;
            display: flex;
            flex-direction: column;
          }

          .interface-nav {
            display: flex;
            gap: 32px;
            margin-bottom: 36px;
          }

          .interface-nav button {
            background: transparent;
            border: none;
            color: #475569;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
          }

          .interface-nav button.active { color: #d4af37; }
          .interface-nav button.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 2px;
            background: #d4af37;
            box-shadow: 0 0 10px #d4af37;
          }

          .interface-scroll-content {
            flex: 1;
            overflow-y: auto;
            padding-right: 8px;
            scrollbar-width: thin;
            scrollbar-color: rgba(71, 85, 105, 0.7) transparent;
          }

          .interface-scroll-content::-webkit-scrollbar {
            width: 8px;
          }

          .interface-scroll-content::-webkit-scrollbar-track {
            background: transparent;
          }

          .interface-scroll-content::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.72);
            border-radius: 999px;
          }

          .interface-scroll-content::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.86);
          }

          .overview-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px 28px;
          }

          .info-block {
            margin-bottom: 0;
            padding: 18px 20px;
            border-radius: 18px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
          }

          .info-block label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.08em;
          }

          .info-block p {
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            margin: 0;
            line-height: 1.5;
            word-break: break-word;
          }

          .interface-form {
            display: flex;
            flex-direction: column;
            gap: 22px;
          }

          .input-field-premium {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .input-field-premium label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .input-field-premium input {
            width: 100%;
            background: #000;
            border: 1px solid rgba(255,255,255,0.08);
            padding: 16px 20px;
            border-radius: 16px;
            color: #fff;
            outline: none;
            box-sizing: border-box;
          }

          .input-field-premium input:focus {
            border-color: rgba(212, 175, 55, 0.6);
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
          }

          .input-group-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .password-input-shell {
            position: relative;
          }

          .password-input-shell input {
            padding-right: 88px;
          }

          .password-toggle-btn {
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-50%);
            border: none;
            background: transparent;
            color: #d4af37;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            padding: 6px 8px;
          }

          .password-strength-block {
            display: grid;
            gap: 8px;
            margin-top: 2px;
          }

          .password-strength-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
            font-size: 11px;
            color: #94a3b8;
          }

          .password-strength-row span:first-child {
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .password-strength-track {
            width: 100%;
            height: 8px;
            border-radius: 999px;
            background: rgba(255,255,255,0.06);
            overflow: hidden;
          }

          .password-strength-fill {
            height: 100%;
            border-radius: inherit;
            transition: width 0.25s ease, background 0.25s ease;
          }

          .interface-helper {
            margin: -4px 0 0;
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.6;
          }

          .gold-action-btn {
            background: linear-gradient(90deg, #d4af37, #aa8a2e);
            color: #000;
            border: none;
            padding: 18px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            margin-top: 4px;
            box-shadow: 0 16px 30px rgba(212, 175, 55, 0.18);
          }

          .animate-slide { animation: slideIn 0.4s ease-out; }
          @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

          @media (max-width: 1000px) {
            .identity-badge-container { flex-direction: column; height: auto; }
            .badge-identity-plate { width: 100%; border-right: none; border-bottom: 1px solid rgba(212, 175, 55, 0.1); padding: 40px; }
            .badge-interface-plate { padding: 40px; }
            .overview-grid { grid-template-columns: 1fr 1fr; }
            .profile-close-btn { top: 15px; left: 15px; }
          }

          @media (max-width: 700px) {
            .overview-grid { grid-template-columns: 1fr; }
            .input-group-row { grid-template-columns: 1fr; }
          }

          @media (max-width: 600px) {
            .executive-profile-viewport { padding: 10px; }
            .badge-identity-plate { padding: 30px 20px; text-align: center; align-items: center; }
            .badge-interface-plate { padding: 30px 20px; }
            .badge-avatar-wrap { width: 110px; height: 110px; margin-bottom: 25px; }
            .badge-avatar-inner { border-radius: 25px; font-size: 36px; }
            .badge-name-block h1 { font-size: 24px; }
            .interface-nav { gap: 15px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
            .interface-nav::-webkit-scrollbar { display: none; }
            .interface-nav button { font-size: 12px; white-space: nowrap; }
            .gold-action-btn { padding: 16px; font-size: 12px; }
          }
        `}
      </style>
    </div>
  )
}

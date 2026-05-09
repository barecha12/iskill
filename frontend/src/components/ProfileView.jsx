import React from 'react'
import { getInitials } from '../utils/formatters'

export function ProfileView({ 
  currentUser, 
  targetUser = null,
  handleUpdateProfile, 
  handleUpdatePassword,
  onClose = null 
}) {
  const isOwnProfile = !targetUser || targetUser.id === currentUser?.id
  const user = targetUser || currentUser
  
  const [activeTab, setActiveTab] = React.useState('overview')
  const [profileForm, setProfileForm] = React.useState({
    name: user?.name || '',
    title: user?.profile?.title || '',
    department: user?.profile?.department || ''
  })
  const [passwordForm, setPasswordForm] = React.useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })
  const fileInputRef = React.useRef(null)

  React.useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        title: user.profile?.title || '',
        department: user.profile?.department || ''
      })
    }
  }, [user])

  if (!user) return null

  const onProfileSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', profileForm.name)
    formData.append('title', profileForm.title)
    formData.append('department', profileForm.department)
    handleUpdateProfile(formData)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('name', profileForm.name)
      formData.append('title', profileForm.title)
      formData.append('department', profileForm.department)
      formData.append('avatar', file)
      handleUpdateProfile(formData)
    }
  }

  return (
    <div className={`executive-profile-viewport ${onClose ? 'modal-mode' : ''}`}>
      {onClose && (
        <button className="profile-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      )}
      <div className="identity-badge-container">
        
        {/* The Badge: Left Section (Identity) */}
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
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = getInitials(user?.name); }}
                  />
                ) : (
                  getInitials(user?.name)
                )}
                {isOwnProfile && (
                  <div className="avatar-overlay">
                    <span>📸</span>
                  </div>
                )}
              </div>
              <div className="badge-status-ring"></div>
              {isOwnProfile && (
                <div className="avatar-edit-badge">
                  <span className="edit-icon">✏️</span>
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

        {/* The Interface: Right Section (Actions) */}
        <div className="badge-interface-plate">
          <div className="interface-nav">
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
            {isOwnProfile && <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Settings</button>}
            {isOwnProfile && <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>Security</button>}
          </div>

          <div className="interface-scroll-content">
            {activeTab === 'overview' && (
              <div className="overview-content-panel animate-slide">
                <div className="info-block">
                  <label>Official Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-block">
                  <label>Assigned Department</label>
                  <p>{user?.profile?.department || 'Operations'}</p>
                </div>
                <div className="info-block">
                  <label>Registry Tenure</label>
                  <p>{new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            )}

            {isOwnProfile && activeTab === 'info' && (
              <form onSubmit={onProfileSubmit} className="interface-form animate-slide">
                <div className="input-field-premium">
                  <label>Display Designation</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                </div>
                <div className="input-group-row">
                  <div className="input-field-premium">
                    <label>Rank</label>
                    <input type="text" value={profileForm.title} onChange={e => setProfileForm({...profileForm, title: e.target.value})} />
                  </div>
                  <div className="input-field-premium">
                    <label>Sector</label>
                    <input type="text" value={profileForm.department} onChange={e => setProfileForm({...profileForm, department: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="gold-action-btn">Commit Changes</button>
              </form>
            )}

            {isOwnProfile && activeTab === 'security' && (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(passwordForm); }} className="interface-form animate-slide">
                <div className="input-field-premium">
                  <label>Current Key</label>
                  <input type="password" value={passwordForm.current_password} onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})} placeholder="••••••••" />
                </div>
                <div className="input-field-premium">
                  <label>New Access Key</label>
                  <input type="password" value={passwordForm.password} onChange={e => setPasswordForm({...passwordForm, password: e.target.value})} placeholder="Minimum 8 chars" />
                </div>
                <div className="input-field-premium">
                  <label>Verify Key</label>
                  <input type="password" value={passwordForm.password_confirmation} onChange={e => setPasswordForm({...passwordForm, password_confirmation: e.target.value})} placeholder="Repeat key" />
                </div>
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
            max-width: 900px;
            height: 520px;
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
            height: 560px;
            background: #0a0a0a;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 40px;
            overflow: hidden;
            box-shadow: 0 50px 100px rgba(0,0,0,0.8);
            position: relative;
          }

          .badge-identity-plate {
            width: 380px;
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
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            opacity: 0;
            transition: opacity 0.3s;
          }

          .badge-avatar-wrap:hover .avatar-overlay { opacity: 1; }

          .avatar-edit-badge {
            position: absolute;
            bottom: 5px; right: 5px;
            width: 36px; height: 36px;
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

          .avatar-edit-badge .edit-icon { font-size: 16px; }

          .badge-avatar-wrap:hover .avatar-edit-badge {
            transform: scale(1.1) rotate(10deg);
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

          .badge-meta-minimal { margin-top: 40px; }
          .meta-label { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 8px; }
          .meta-status { display: flex; align-items: center; gap: 10px; color: #10b981; font-size: 14px; font-weight: 600; }
          .meta-status .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }

          .badge-interface-plate { flex: 1; padding: 60px; display: flex; flex-direction: column; }
          .interface-nav { display: flex; gap: 32px; margin-bottom: 50px; }
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
          .interface-nav button.active::after { content: ''; position: absolute; bottom: -8px; left: 0; right: 0; height: 2px; background: #d4af37; box-shadow: 0 0 10px #d4af37; }

          .interface-scroll-content { flex: 1; overflow-y: auto; }
          .info-block { margin-bottom: 32px; }
          .info-block label { display: block; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 8px; }
          .info-block p { font-size: 20px; font-weight: 600; color: #fff; margin: 0; }

          .interface-form { display: flex; flex-direction: column; gap: 24px; }
          .input-field-premium { display: flex; flex-direction: column; gap: 10px; }
          .input-field-premium label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; }
          .input-field-premium input { background: #000; border: 1px solid rgba(255,255,255,0.05); padding: 16px 20px; border-radius: 16px; color: #fff; }

          .input-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .gold-action-btn {
            background: linear-gradient(90deg, #d4af37, #aa8a2e);
            color: #000;
            border: none;
            padding: 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            margin-top: 10px;
          }

          .animate-slide { animation: slideIn 0.4s ease-out; }
          @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

          @media (max-width: 1000px) {
            .identity-badge-container { flex-direction: column; height: auto; }
            .badge-identity-plate { width: 100%; border-right: none; border-bottom: 1px solid rgba(212, 175, 55, 0.1); padding: 40px; }
            .badge-interface-plate { padding: 40px; }
            .profile-close-btn { top: 15px; left: 15px; }
          }

          @media (max-width: 600px) {
            .executive-profile-viewport { padding: 10px; }
            .badge-identity-plate { padding: 30px 20px; text-align: center; align-items: center; }
            .badge-interface-plate { padding: 30px 20px; }
            .input-group-row { grid-template-columns: 1fr; }
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
import { useState, useEffect, useRef, useDeferredValue, startTransition, useEffectEvent } from 'react'
import { apiRequest, TOKEN_KEY } from '../api/client'
import { filterConversations, filterPeople } from '../utils/filters'


export function useAppData() {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_KEY) ?? '')
  const [authMode, setAuthMode] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([])
  const [activeView, setActiveView] = useState(() => window.localStorage.getItem('iskill_view') ?? 'dashboard')

  useEffect(() => {
    window.localStorage.setItem('iskill_view', activeView)
  }, [activeView])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token))
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', password_confirmation: '', title: '', department: '' })
  const [chatDraft, setChatDraft] = useState('')
  const [chatAttachment, setChatAttachment] = useState(null)
  const [documentForm, setDocumentForm] = useState({ title: '', file: null })
  const [documentSearch, setDocumentSearch] = useState('')
  const [conversationSearch, setConversationSearch] = useState('')
  const [peopleSearch, setPeopleSearch] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: '', onConfirm: null })
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])

  const messageFileInputRef = useRef(null)
  const documentFileInputRef = useRef(null)

  const deferredDocumentSearch = useDeferredValue(documentSearch)
  const deferredConversationSearch = useDeferredValue(conversationSearch)
  const deferredPeopleSearch = useDeferredValue(peopleSearch)

  const selectedConversation =
    conversations.find((conversation) => conversation.user.id === selectedUserId) ?? null

  const selectedUser = selectedConversation?.user ?? users.find((user) => user.id === selectedUserId) ?? null

  const filteredDocuments = (() => {
    const query = deferredDocumentSearch.trim().toLowerCase()
    if (!query) return documents
    return documents.filter((document) =>
      [document.title, document.original_name, document.uploader?.name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  })()

  const filteredConversations = filterConversations(conversations, deferredConversationSearch)
  const filteredPeople = filterPeople(users, currentUser, deferredPeopleSearch)

  const runBootstrap = useEffectEvent((authToken) => {
    bootstrapApp(authToken)
  })

  const runLoadMessages = useEffectEvent((userId) => {
    loadMessages(userId)
  })

  useEffect(() => {
    if (token) {
      runBootstrap(token)
    }
  }, [token])

  useEffect(() => {
    if (activeView !== 'chat' || !selectedUserId || !token) {
      return
    }
    runLoadMessages(selectedUserId)
  }, [activeView, selectedUserId, token])

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' })
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [status])

  async function bootstrapApp(authToken) {
    setIsBootstrapping(true)
    try {
      const [me, allUsers, allConversations, allDocuments] = await Promise.all([
        apiRequest('/me', {}, authToken),
        apiRequest('/users', {}, authToken),
        apiRequest('/conversations', {}, authToken),
        apiRequest('/documents', {}, authToken),
      ])

      const userData = me.user || me
      setCurrentUser(userData)
      setStats(me.stats || null)
      setRecentActivity(me.recent_activity || [])
      setUsers(allUsers)
      setConversations(allConversations)
      setDocuments(allDocuments)

      startTransition(() => {
        setSelectedUserId((currentId) => currentId ?? allConversations[0]?.user.id ?? allUsers.find((user) => user.id !== me.id)?.id ?? null)
      })
    } catch (error) {
      clearSession()
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsBootstrapping(false)
    }
  }

  async function handleRefresh() {
    setStatus({ type: 'info', message: 'Refreshing workspace data...' })
    await bootstrapApp(token)
    setStatus({ type: 'success', message: 'Dashboard updated.' })
  }

  async function handleGenerateReport(format = 'csv') {
    setStatus({ type: 'info', message: `Compiling ${format.toUpperCase()} intelligence report...` })
    
    await new Promise(r => setTimeout(r, 1500))

    try {
      const timestamp = new Date().toLocaleString()
      const dateStr = new Date().toISOString().split('T')[0]
      const unreadTotal = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)

      if (format === 'csv') {
        const csvRows = [
          ['"REPORT TYPE"', '"ISKILL WORKSPACE INTELLIGENCE"', '""', '""', '""'],
          ['"GENERATED"', `"${timestamp}"`, '""', '""', '""'],
          ['"CLASSIFICATION"', '"CONFIDENTIAL"', '""', '""', '""'],
          ['""', '""', '""', '""', '""'],
          ['"SECTION 1: KEY PERFORMANCE INDICATORS"', '""', '""', '""', '""'],
          ['"Metric Identifier"', '"Metric Value"', '"Current Status"', '""', '""'],
          ['"Total Workspace Personnel"', `"${users.length}"`, '"Active"', '""', '""'],
          ['"Total Repository Assets"', `"${documents.length}"`, '"Archived"', '""', '""'],
          ['"Total Active Dialogues"', `"${conversations.length}"`, '"Operational"', '""', '""'],
          ['"Unresolved System Alerts"', `"${unreadTotal}"`, '"Pending"', '""', '""'],
          ['""', '""', '""', '""', '""'],
          ['"SECTION 2: COMPREHENSIVE ASSET AUDIT LOG"', '""', '""', '""', '""'],
          ['"ID"', '"Asset Title"', '"Original Filename"', '"Uploaded By (Owner)"', '"Timestamp"'],
          ...documents.slice(0, 100).map(d => [
            `"${d.id}"`, 
            `"${(d.title || 'Untitled').replace(/"/g, '""')}"`, 
            `"${(d.original_name || 'unknown').replace(/"/g, '""')}"`, 
            `"${(d.uploader?.name || 'System Auto').replace(/"/g, '""')}"`,
            `"${d.created_at}"`
          ]),
          ['""', '""', '""', '""', '""'],
          ['"REPORT VALIDATION"', '"COMPLETED"', '""', '""', '"--- END ---"']
        ]
        const csvContent = csvRows.map(row => row.join(',')).join('\n')
        downloadFile(csvContent, `Iskill_Intelligence_Report_${dateStr}.csv`, 'text/csv;charset=utf-8;')
      } else {
        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: 'Outfit', sans-serif; background: #02040a; color: #f1f5f9; padding: 40px; }
                .header { border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 40px; }
                .title { color: #d4af37; font-size: 28px; font-weight: bold; margin: 0; text-transform: uppercase; }
                .meta { font-size: 12px; color: #94a3b8; margin-top: 10px; }
                .section { margin-top: 40px; }
                .section-title { font-size: 18px; color: #d4af37; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; }
                .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
                .card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 12px; }
                .card-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; }
                .card-value { font-size: 24px; color: #d4af37; font-weight: bold; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { text-align: left; background: rgba(212, 175, 55, 0.1); color: #d4af37; padding: 12px; font-size: 12px; text-transform: uppercase; }
                td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
                .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #475569; }
                @media print { body { background: white; color: black; padding: 0; } .card { border: 1px solid #ddd; } .title, .section-title, .card-value { color: #856404; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 class="title">Iskill Workspace Intelligence</h1>
                <div class="meta">Report Generation: ${timestamp} • Classification: CONFIDENTIAL</div>
              </div>

              <div class="section">
                <div class="section-title">Executive Summary</div>
                <div class="grid">
                  <div class="card"><div class="card-label">Personnel</div><div class="card-value">${users.length}</div></div>
                  <div class="card"><div class="card-label">Documents</div><div class="card-value">${documents.length}</div></div>
                  <div class="card"><div class="card-label">Conversations</div><div class="card-value">${conversations.length}</div></div>
                  <div class="card"><div class="card-label">Alerts</div><div class="card-value">${unreadTotal}</div></div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Asset Repository Audit</div>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Asset Title</th>
                      <th>Filename</th>
                      <th>Owner</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${documents.slice(0, 100).map(d => `
                      <tr>
                        <td>${d.id}</td>
                        <td><b>${d.title}</b></td>
                        <td>${d.original_name}</td>
                        <td>${d.uploader?.name || 'System'}</td>
                        <td>${d.created_at}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div class="footer">
                End of generated intelligence report. All rights reserved.
              </div>
            </body>
          </html>
        `

        const printWindow = window.open('', '_blank')
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        setTimeout(() => { printWindow.print(); }, 500)
      }

      setStatus({ type: 'success', message: `Report (${format.toUpperCase()}) successfully generated.` })
    } catch (error) {
      console.error('Report Error:', error)
      setStatus({ type: 'error', message: 'Report generation failed.' })
    }
  }

  function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  async function loadMessages(userId) {
    setIsLoadingMessages(true)
    try {
      const conversationMessages = await apiRequest(`/messages/${userId}`, {}, token)
      setMessages(conversationMessages)

      const refreshedConversations = await apiRequest('/conversations', {}, token)
      setConversations(refreshedConversations)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsLoadingMessages(false)
    }
  }

  async function handleLogin(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      }, '')

      window.localStorage.setItem(TOKEN_KEY, response.token)
      setToken(response.token)
      
      const userData = response.user.user || response.user
      setCurrentUser(userData)
      setStats(response.user.stats || null)
      setRecentActivity(response.user.recent_activity || [])
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleRegister(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    try {
      const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(registerForm),
      }, '')

      setStatus({ type: 'success', message: response.message || 'Account created successfully. Please sign in.' })
      setRegisterForm({ name: '', email: '', password: '', password_confirmation: '', title: '', department: '' })
      setAuthMode('login')
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleLogout() {
    const currentToken = token
    clearSession() // Clear UI immediately for responsiveness
    try {
      if (currentToken) {
        await apiRequest('/logout', { method: 'POST' }, currentToken)
      }
    } catch (error) {
      console.warn('Background logout failed:', error)
    }
  }

  function clearSession() {
    window.localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setCurrentUser(null)
    setUsers([])
    setConversations([])
    setDocuments([])
    setMessages([])
    setSelectedUserId(null)
    setLoginForm({ email: '', password: '' })
    setRegisterForm({ name: '', email: '', password: '', password_confirmation: '', title: '', department: '' })
    window.localStorage.removeItem('iskill_view')
    setActiveView('dashboard')
  }

  async function handleSendMessage(event) {
    event.preventDefault()
    if (!selectedUserId || (!chatDraft.trim() && !chatAttachment)) return

    try {
      const body = new FormData()
      body.append('receiver_id', selectedUserId)
      body.append('message', chatDraft.trim())
      if (chatAttachment) body.append('attachment', chatAttachment)

      await apiRequest(chatAttachment ? '/messages/attachment' : '/messages', {
        method: 'POST',
        body,
      }, token)

      setChatDraft('')
      setChatAttachment(null)
      if (messageFileInputRef.current) messageFileInputRef.current.value = ''

      await loadMessages(selectedUserId)
      setStatus({ type: 'success', message: 'Message sent.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleDocumentUpload(event) {
    event.preventDefault()
    if (!documentForm.file) {
      setStatus({ type: 'error', message: 'Choose a document to upload first.' })
      return
    }

    try {
      const body = new FormData()
      body.append('title', documentForm.title.trim())
      body.append('file', documentForm.file)

      await apiRequest('/documents', {
        method: 'POST',
        body,
      }, token)

      setDocumentForm({ title: '', file: null })
      if (documentFileInputRef.current) documentFileInputRef.current.value = ''

      await refreshDocuments()
      setStatus({ type: 'success', message: 'Document uploaded.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function refreshDocuments() {
    const allDocuments = await apiRequest('/documents', {}, token)
    setDocuments(allDocuments)
  }

  async function handleDeleteDocument(documentId) {
    setConfirmation({
      isOpen: true,
      message: 'This document will be permanently removed from the workspace.',
      onConfirm: async () => {
        setConfirmation({ isOpen: false, message: '', onConfirm: null })
        try {
          await apiRequest(`/documents/${documentId}`, {
            method: 'DELETE',
          }, token)

          await refreshDocuments()
          setStatus({ type: 'success', message: 'Document removed.' })
        } catch (error) {
          setStatus({ type: 'error', message: error.message })
        }
      }
    })
  }

  function handleCancelConfirmation() {
    setConfirmation({ isOpen: false, message: '', onConfirm: null })
  }

  async function handleDownload(path, fallbackName) {
    setStatus({ type: 'info', message: `Downloading ${fallbackName}...` })
    try {
      const response = await apiRequest(path, {}, token)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fallbackName
      anchor.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleInspect(path, fileName) {
    setStatus({ type: 'info', message: `Retrieving ${fileName} for security inspection...` })
    try {
      const response = await apiRequest(path, {}, token)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleUpdateProfile(profileData) {
    setStatus({ type: 'info', message: 'Syncing profile changes...' })
    try {
      // Use FormData if profileData is not already one (backward compatibility or direct objects)
      let body = profileData;
      let headers = {}; // Let fetch set content-type for FormData

      if (!(profileData instanceof FormData)) {
        body = JSON.stringify(profileData);
        headers['Content-Type'] = 'application/json';
      }

      const response = await apiRequest('/profile', {
        method: 'POST',
        headers: headers,
        body: body,
      }, token)
      setCurrentUser(response.user)
      setStatus({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleUpdatePassword(passwordData) {
    setStatus({ type: 'info', message: 'Updating secure credentials...' })
    try {
      await apiRequest('/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      }, token)
      setStatus({ type: 'success', message: 'Security credentials updated.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const [adminUsers, setAdminUsers] = useState([])
  const [adminDocuments, setAdminDocuments] = useState([])
  const [announcements, setAnnouncements] = useState([])

  async function loadAdminUsers() {
    try {
      const usersList = await apiRequest('/admin/users', {}, token)
      setAdminUsers(usersList)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function loadAdminDocuments() {
    try {
      const docsList = await apiRequest('/admin/documents', {}, token)
      setAdminDocuments(docsList)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function loadAnnouncements() {
    try {
      const list = await apiRequest('/announcements', {}, token)
      setAnnouncements(list)
    } catch (error) {
      console.warn('Failed to load announcements:', error)
    }
  }

  async function handleToggleAdmin(userId) {
    try {
      const response = await apiRequest(`/admin/users/${userId}/toggle-admin`, { method: 'POST' }, token)
      setStatus({ type: 'success', message: response.message })
      setAdminUsers(prev => prev.map(u => u.id === userId ? response.user : u))
      setUsers(prev => prev.map(u => u.id === userId ? response.user : u))
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleUpdateUserCompliance(userId, status) {
    try {
      const response = await apiRequest(`/admin/users/${userId}/compliance`, {
        method: 'POST',
        body: JSON.stringify({ status })
      }, token)
      setStatus({ type: 'success', message: response.message })
      setAdminUsers(prev => prev.map(u => u.id === userId ? response.user : u))
      setUsers(prev => prev.map(u => u.id === userId ? response.user : u))
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleUpdateDocumentCompliance(docId, status) {
    try {
      const response = await apiRequest(`/admin/documents/${docId}/compliance`, {
        method: 'POST',
        body: JSON.stringify({ status })
      }, token)
      setStatus({ type: 'success', message: response.message })
      setAdminDocuments(prev => prev.map(d => d.id === docId ? response.document : d))
      setDocuments(prev => prev.map(d => d.id === docId ? response.document : d))
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleDispatchSignal(content) {
    try {
      const response = await apiRequest('/admin/announcements', {
        method: 'POST',
        body: JSON.stringify({ content })
      }, token)
      setStatus({ type: 'success', message: response.message })
      setAnnouncements(prev => [response.announcement, ...prev])
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleDeleteUser(userId) {
    setConfirmation({
      isOpen: true,
      message: 'PURGE ACTION: This will permanently delete this executive account and all associated assets. Continue?',
      onConfirm: async () => {
        try {
          const response = await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' }, token)
          setStatus({ type: 'success', message: response.message })
          setAdminUsers(prev => prev.filter(u => u.id !== userId))
          setUsers(prev => prev.filter(u => u.id !== userId))
        } catch (error) {
          setStatus({ type: 'error', message: error.message })
        }
      }
    })
  }

  async function handleMarkAnnouncementRead(annId) {
    try {
      await apiRequest(`/announcements/${annId}/read`, { method: 'POST' }, token)
      await loadAnnouncements()
    } catch (error) {
      console.warn('Failed to mark signal as read:', error)
    }
  }

  const notifications = [
    ...announcements.map(a => ({
      id: `ann-${a.id}`,
      originalId: a.id,
      type: 'signal',
      content: a.content,
      author: a.user?.name || 'System',
      timestamp: a.created_at,
      read: a.read_by_users?.some(u => u.id === currentUser?.id) || false
    })),
    ...conversations.flatMap(c => 
      (c.last_message && c.last_message.sender?.is_admin && c.unread_count > 0) 
      ? [{
          id: `msg-${c.id}`,
          type: 'message',
          content: c.last_message?.content || 'New Directive',
          author: c.last_message?.sender?.name || 'Admin',
          timestamp: c.last_message?.created_at,
          userId: c.user?.id
        }]
      : []
    )
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return {
    token, currentUser, authMode, setAuthMode, users, conversations, documents, messages, activeView, setActiveView,
    adminUsers, loadAdminUsers, handleToggleAdmin, handleDeleteUser,
    adminDocuments, loadAdminDocuments, handleUpdateUserCompliance, handleUpdateDocumentCompliance,
    announcements, loadAnnouncements, handleDispatchSignal,
    notifications, handleMarkAnnouncementRead,
    selectedUserId, setSelectedUserId, isBootstrapping, isLoadingMessages, loginForm, setLoginForm,
    registerForm, setRegisterForm,
    chatDraft, setChatDraft, chatAttachment, setChatAttachment, documentForm, setDocumentForm,
    documentSearch, setDocumentSearch, conversationSearch, setConversationSearch, peopleSearch, setPeopleSearch,
    status, setStatus, confirmation, handleCancelConfirmation, messageFileInputRef, documentFileInputRef,
    selectedUser, filteredDocuments, filteredConversations, filteredPeople,
    handleLogin, handleRegister, handleLogout, handleSendMessage, handleDocumentUpload, handleDeleteDocument, handleDownload, handleInspect,
    handleRefresh, handleGenerateReport,
    handleUpdateProfile, handleUpdatePassword,
    stats, recentActivity,
    startTransition
  }
}

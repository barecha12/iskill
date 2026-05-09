import React from 'react'
import { useAppData } from './hooks/useAppData'
import { Sidebar } from './components/Sidebar'
import { WorkspaceHeader } from './components/WorkspaceHeader'
import { StatusBanner } from './components/StatusBanner'
import { DashboardView } from './components/DashboardView'
import { ChatView } from './components/ChatView'
import { DocumentsView } from './components/DocumentsView'
import { PeopleView } from './components/PeopleView'
import { AuthPage } from './components/AuthPage'
import { ConfirmModal } from './components/ConfirmModal'
import { MobileNav } from './components/MobileNav'
import { ProfileView } from './components/ProfileView'

import { AdminConsoleView } from './components/AdminConsoleView'

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  
  const {
    token, currentUser, authMode, setAuthMode, users, conversations, documents, messages, activeView, setActiveView,
    adminUsers, loadAdminUsers, handleToggleAdmin, handleDeleteUser,
    adminDocuments, loadAdminDocuments, handleUpdateUserCompliance, handleUpdateDocumentCompliance,
    announcements, loadAnnouncements, handleDispatchSignal,
    notifications, handleMarkAnnouncementRead,
    selectedUserId, setSelectedUserId, isBootstrapping, isLoadingMessages, 
    loginForm, setLoginForm, registerForm, setRegisterForm,
    chatDraft, setChatDraft, chatAttachment, setChatAttachment, documentForm, setDocumentForm,
    documentSearch, setDocumentSearch, conversationSearch, setConversationSearch, peopleSearch, setPeopleSearch,
    status, setStatus, confirmation, handleCancelConfirmation, messageFileInputRef, documentFileInputRef,
    selectedUser, filteredDocuments, filteredConversations, filteredPeople,
    handleLogin, handleRegister, handleLogout, handleSendMessage, handleDocumentUpload, handleDeleteDocument, handleDownload, handleInspect,
    handleRefresh, handleGenerateReport,
    handleUpdateProfile, handleUpdatePassword,
    stats, recentActivity,
    startTransition
  } = useAppData()

  React.useEffect(() => {
    if (token) {
      loadAnnouncements()
    }
  }, [token])

  if (!token) {
    return (
      <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        handleRegister={handleRegister}
        status={status}
      />
    )
  }

  const viewTitle =
    activeView === 'dashboard'
      ? 'Workspace Dashboard'
      : activeView === 'chat'
        ? 'Direct conversations'
        : activeView === 'documents'
          ? 'Shared documents'
          : activeView === 'admin'
            ? 'Governance Console'
            : 'People directory'

  const teamCount = users.filter((user) => user.id !== currentUser?.id).length
  const unreadCount = conversations.reduce(
    (count, conversation) => count + (conversation.unread_count ?? 0),
    0,
  )

  return (
    <div className="workspace-shell">
      <Sidebar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        teamCount={teamCount}
        unreadCount={unreadCount}
        handleLogout={handleLogout}
        startTransition={startTransition}
      />

      {isMobileMenuOpen && (
        <MobileNav
          currentUser={currentUser}
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view)
            setIsMobileMenuOpen(false)
          }}
          teamCount={teamCount}
          unreadCount={unreadCount}
          handleLogout={handleLogout}
          startTransition={startTransition}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="workspace-main">
        <WorkspaceHeader
          viewTitle={viewTitle}
          activeView={activeView}
          setActiveView={setActiveView}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          notifications={notifications}
          setSelectedUserId={setSelectedUserId}
          handleMarkAnnouncementRead={handleMarkAnnouncementRead}
        />

        <StatusBanner status={status} />
        {isBootstrapping && (
          <div className="splash-screen">
            <div className="splash-content">
              <div className="splash-logo">
                <img src="/logo.svg" alt="logo" width="64" height="64" />
              </div>
              <h2>Iskill Workspace</h2>
              <p>Synchronizing secure node protocols...</p>
              <div className="splash-loader"></div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={confirmation.isOpen}
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={handleCancelConfirmation}
        />

        {activeView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            teamCount={teamCount}
            documentCount={documents.length}
            unreadCount={unreadCount}
            users={users}
            documents={documents}
            handleRefresh={handleRefresh}
            handleGenerateReport={handleGenerateReport}
            setActiveView={setActiveView}
            handleDispatchSignal={handleDispatchSignal}
            announcements={announcements}
          />
        )}

        {activeView === 'chat' && (
          <ChatView
            filteredConversations={filteredConversations}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            selectedUser={selectedUser}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            currentUser={currentUser}
            chatDraft={chatDraft}
            setChatDraft={setChatDraft}
            chatAttachment={chatAttachment}
            setChatAttachment={setChatAttachment}
            handleSendMessage={handleSendMessage}
            handleDownload={handleDownload}
            conversationSearch={conversationSearch}
            setConversationSearch={setConversationSearch}
            messageFileInputRef={messageFileInputRef}
            startTransition={startTransition}
          />
        )}

        {activeView === 'documents' && (
          <DocumentsView
            documentForm={documentForm}
            setDocumentForm={setDocumentForm}
            handleDocumentUpload={handleDocumentUpload}
            documentFileInputRef={documentFileInputRef}
            filteredDocuments={filteredDocuments}
            handleDownload={handleDownload}
            handleDeleteDocument={handleDeleteDocument}
            currentUser={currentUser}
            documentSearch={documentSearch}
            setDocumentSearch={setDocumentSearch}
          />
        )}

        {activeView === 'people' && (
          <PeopleView
            peopleSearch={peopleSearch}
            setPeopleSearch={setPeopleSearch}
            filteredPeople={filteredPeople}
            setSelectedUserId={setSelectedUserId}
            setActiveView={setActiveView}
            startTransition={startTransition}
          />
        )}
        {activeView === 'admin' && currentUser?.is_admin && (
          <AdminConsoleView 
            adminUsers={adminUsers} 
            loadAdminUsers={loadAdminUsers} 
            handleToggleAdmin={handleToggleAdmin} 
            handleDeleteUser={handleDeleteUser} 
            adminDocuments={adminDocuments}
            loadAdminDocuments={loadAdminDocuments}
            handleUpdateUserCompliance={handleUpdateUserCompliance}
            handleUpdateDocumentCompliance={handleUpdateDocumentCompliance}
            handleInspect={handleInspect}
            currentUser={currentUser} 
          />
        )}
        {activeView === 'profile' && (
          <ProfileView 
            currentUser={currentUser} 
            stats={stats} 
            recentActivity={recentActivity} 
            handleUpdateProfile={handleUpdateProfile}
            handleUpdatePassword={handleUpdatePassword}
          />
        )}
      </main>
    </div>
  )
}

export default App

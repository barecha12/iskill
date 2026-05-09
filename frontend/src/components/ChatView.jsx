import React, { useState } from 'react'
import { getInitials, formatDateTime } from '../utils/formatters'

export function ChatView({
  filteredConversations,
  selectedUserId,
  setSelectedUserId,
  selectedUser,
  messages,
  isLoadingMessages,
  currentUser,
  chatDraft,
  setChatDraft,
  chatAttachment,
  setChatAttachment,
  handleSendMessage,
  handleDownload,
  conversationSearch,
  setConversationSearch,
  messageFileInputRef,
  startTransition
}) {
  // Mobile-only: tracks which panel is visible ('list' | 'chat')
  // Kept separate from selectedUserId so desktop is unaffected
  const [mobilePanel, setMobilePanel] = useState('list')

  function handleSelectConversation(userId) {
    startTransition(() => setSelectedUserId(userId))
    setMobilePanel('chat')
  }

  return (
    <section className={`chat-layout mobile-panel-${mobilePanel}`}>

      {/* ── Conversation List ── */}
      <div className="chat-list panel">
        <div className="chat-list-header">
          <input
            className="search-input"
            type="search"
            value={conversationSearch}
            onChange={(event) => setConversationSearch(event.target.value)}
            placeholder="Search"
          />
        </div>

        <div className="conversation-list-scroll">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.user.id}
              type="button"
              className={conversation.user.id === selectedUserId ? 'conversation-row active' : 'conversation-row'}
              onClick={() => handleSelectConversation(conversation.user.id)}
            >
              <div className="avatar-circle">{getInitials(conversation.user.name)}</div>
              <div className="conversation-copy">
                <div className="conv-name-row">
                  <strong>{conversation.user.name}</strong>
                  {conversation.last_message && (
                    <time>{formatDateTime(conversation.last_message.created_at)}</time>
                  )}
                </div>
                <span>{conversation.last_message?.message ?? 'No messages yet.'}</span>
              </div>
              {conversation.unread_count ? <span className="badge">{conversation.unread_count}</span> : null}
            </button>
          ))}

          {filteredConversations.length === 0 ? <p className="empty-state">No matches.</p> : null}
        </div>
      </div>

      {/* ── Message Window ── */}
      <div className="chat-window panel">
        {selectedUser ? (
          <>
            <div className="chat-window-header">
              {/* Back button — hidden on desktop, shown on mobile via CSS */}
              <button
                className="mobile-back-btn"
                onClick={() => setMobilePanel('list')}
                title="Back to conversations"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <div className="chat-header-contact">
                <div className="avatar-circle sm">{getInitials(selectedUser.name)}</div>
                <div className="header-contact-info">
                  <strong>{selectedUser.name}</strong>
                  <span>{selectedUser.profile?.department ?? 'Online'}</span>
                </div>
              </div>
            </div>

            <div className="message-stream">
              {isLoadingMessages ? <p className="empty-state">Loading conversation…</p> : null}
              {!isLoadingMessages && messages.length === 0 ? <p className="empty-state">Start the conversation with a quick message or file.</p> : null}

              {messages.map((message) => (
                <article
                  key={message.id}
                  className={message.sender_id === currentUser.id ? 'message-bubble sent' : 'message-bubble received'}
                >
                  {message.message ? <p>{message.message}</p> : null}
                  {message.attachments?.length ? (
                    <div className="attachment-list">
                      {message.attachments.map((attachment) => (
                        <button
                          key={attachment.id}
                          type="button"
                          className="attachment-chip"
                          onClick={() => handleDownload(`/messages/attachments/${attachment.id}/download`, attachment.original_name)}
                        >
                          {attachment.original_name}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <time>{formatDateTime(message.created_at)}</time>
                </article>
              ))}
            </div>

            <form className="telegram-composer" onSubmit={handleSendMessage}>
              <div className="input-wrapper">
                <button type="button" className="attach-btn" onClick={() => messageFileInputRef.current?.click()}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  <input
                    ref={messageFileInputRef}
                    type="file"
                    hidden
                    onChange={(event) => setChatAttachment(event.target.files?.[0] ?? null)}
                    accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
                  />
                </button>

                <textarea
                  value={chatDraft}
                  onChange={(event) => setChatDraft(event.target.value)}
                  placeholder="Message"
                  rows="1"
                />

                {chatAttachment && (
                  <div className="attachment-preview-chip">
                    <span>{chatAttachment.name}</span>
                    <button type="button" onClick={() => setChatAttachment(null)}>×</button>
                  </div>
                )}
              </div>

              <button type="submit" className="telegram-send-btn" disabled={!chatDraft.trim() && !chatAttachment}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </>
        ) : (
          <p className="empty-state">Choose a teammate to view messages.</p>
        )}
      </div>
    </section>
  )
}

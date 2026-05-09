import React, { useState } from 'react'
import { formatDateTime, formatFileSize, getFriendlyFileType } from '../utils/formatters'

export function DocumentsView({
  documentForm,
  setDocumentForm,
  handleDocumentUpload,
  documentFileInputRef,
  filteredDocuments,
  handleDownload,
  handleDeleteDocument,
  currentUser,
  documentSearch,
  setDocumentSearch
}) {
  const [viewingDocument, setViewingDocument] = useState(null)

  return (
    <section className="documents-layout">
      <aside className="upload-sidebar">
        <div className="panel upload-panel">
          <div className="panel-header">
            <h3>Publish Asset</h3>
            <span className="badge-pill">10MB Max</span>
          </div>

          <form className="upload-form" onSubmit={handleDocumentUpload}>
            <div className="form-group">
              <label>Asset Title</label>
              <input
                type="text"
                value={documentForm.title}
                onChange={(event) => setDocumentForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Marketing Plan Q4..."
              />
            </div>

            <div className="form-group">
              <label>Select File</label>
              <div className="file-drop-zone" onClick={() => documentFileInputRef.current?.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span>{documentForm.file ? documentForm.file.name : 'Choose file to upload'}</span>
                <input
                  ref={documentFileInputRef}
                  type="file"
                  hidden
                  onChange={(event) => setDocumentForm((current) => ({ ...current, file: event.target.files?.[0] ?? null }))}
                  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
                />
              </div>
            </div>

            <button type="submit" className="primary-button full-width" disabled={!documentForm.file}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload Asset
            </button>
          </form>
        </div>
      </aside>

      <div className="documents-main">
        <div className="repo-header">
          <div>
            <h3>Resource Repository</h3>
            <p>Direct access to shared team documents</p>
          </div>
          <input
            className="search-input"
            type="search"
            value={documentSearch}
            onChange={(event) => setDocumentSearch(event.target.value)}
            placeholder="Search assets..."
          />
        </div>

        <div className="document-grid">
          {filteredDocuments.map((document) => {
            const isOwner = document.uploaded_by === currentUser.id
            const isFlagged = document.compliance_status === 'flagged'
            const isUnderReview = document.compliance_status === 'under_review'
            const isRestricted = isFlagged || isUnderReview

            return (
              <div key={document.id} className={`panel document-card-minimal ${isRestricted && isOwner ? 'doc-restricted' : ''}`}>
                {isOwner && isRestricted && (
                  <div className={`compliance-badge ${isFlagged ? 'flagged' : 'under-review'}`}>
                    {isFlagged ? '⚑ Flagged' : '⏳ Under Review'}
                  </div>
                )}

                <div className="doc-type-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                </div>

                <div className="doc-card-info">
                  <strong title={document.title || document.original_name}>
                    {document.title || document.original_name}
                  </strong>
                  {isOwner && isRestricted && (
                    <span className={`doc-status-text ${isFlagged ? 'flagged' : 'review'}`}>
                      {isFlagged
                        ? 'This document has been flagged by an admin and is hidden from others.'
                        : 'This document is under admin review and is temporarily hidden from others.'}
                    </span>
                  )}
                </div>

                <div className="doc-card-actions">
                  <button
                    type="button"
                    className="icon-action-btn sm"
                    title="Quick Glance"
                    onClick={() => setViewingDocument(document)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn sm"
                    title={isRestricted && !currentUser.is_admin ? 'Unavailable while under review' : 'Download'}
                    disabled={isRestricted && !currentUser.is_admin}
                    onClick={() => handleDownload(`/documents/${document.id}/download`, document.original_name)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </button>
                  {(document.uploaded_by === currentUser.id || currentUser.is_admin) ? (
                    <button
                      type="button"
                      className="icon-action-btn sm danger"
                      title="Delete"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
        {filteredDocuments.length === 0 && <div className="empty-state">No assets found in the repository.</div>}
      </div>

      {viewingDocument && (
        <div className="glance-modal-overlay" onClick={() => setViewingDocument(null)}>
          <div className="glance-modal" onClick={(e) => e.stopPropagation()}>
            <div className="glance-header">
              <div className="doc-type-icon large">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
              </div>
              <button className="close-glance" onClick={() => setViewingDocument(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="glance-body">
              <h2 className="glance-title">{viewingDocument.title}</h2>
              <p className="glance-filename">{viewingDocument.original_name}</p>

              <div className="glance-metadata-grid">
                <div className="meta-item">
                  <label>Published By</label>
                  <span>{viewingDocument.uploader?.name || 'Unknown User'}</span>
                </div>
                <div className="meta-item">
                  <label>Department</label>
                  <span>{viewingDocument.uploader?.profile?.department || 'General'}</span>
                </div>
                <div className="meta-item">
                  <label>Asset Type</label>
                  <span>{getFriendlyFileType(viewingDocument.mime_type, viewingDocument.original_name)}</span>
                </div>
                <div className="meta-item">
                  <label>File Size</label>
                  <span>{formatFileSize(viewingDocument.size)}</span>
                </div>
                <div className="meta-item">
                  <label>Upload Date</label>
                  <span>{formatDateTime(viewingDocument.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="glance-footer">
              <button
                className="primary-button full-width"
                onClick={() => {
                  handleDownload(`/documents/${viewingDocument.id}/download`, viewingDocument.original_name)
                  setViewingDocument(null)
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

import React from 'react'

export function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-warning">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        
        <h3>Are you sure?</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Nevermind
          </button>
          <button type="button" className="danger-button" onClick={onConfirm}>
            Yes, proceed
          </button>
        </div>
      </div>
    </div>
  )
}

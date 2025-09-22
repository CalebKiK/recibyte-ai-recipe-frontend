"use client";

import "../../styles/modals/ConfirmModal.css";

export default function ConfirmModal({ show, title, message, confirmText="Confirm", cancelText="Cancel", onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>{confirmText}</button>
          <button className="cancel-btn" onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
}
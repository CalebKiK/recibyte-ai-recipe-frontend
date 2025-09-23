"use client";

import React from "react";
import "../../styles/modals/Modal.css"; 

export default function Modal({ show, onClose, children, ariaLabel = "Modal" }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-label={ariaLabel} onMouseDown={onClose}>
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
}
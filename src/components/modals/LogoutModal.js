"use client";

import "../../styles/modals/LogoutModal.css";
import { useState } from "react";

export default function LogoutModal({ onCancel, show, onConfirm }) {
  // const [isOpen, setIsOpen] = useState(true);

  // const handleLogout = () => {
  //   onLogout(); // Call the logout function (passed as a prop)
  //   setIsOpen(false);
  // };

  if (!show) {
    return null; // Return nothing if the 'show' prop is false
  }

    return (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to log out?</h2>
            <div className="modal-buttons">
              <button className="logout-btn" onClick={onConfirm}>
                Logout
              </button>
              <button className="cancel-btn" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
}

import React from 'react';
import './Modals.css';

function ConfirmModal({ 
  title = "Подтверждение",
  message,
  onConfirm,
  onCancel,
  confirmText = "Да",
  cancelText = "Нет"
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
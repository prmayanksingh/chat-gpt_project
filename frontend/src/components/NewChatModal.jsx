import React, { useState } from "react";
import "./NewChatModal.css";

const NewChatModal = ({ isOpen, onClose, onConfirm }) => {
  const [chatName, setChatName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatName.trim()) {
      onConfirm(chatName);
      setChatName("");
    }
  };

  const handleCancel = () => {
    setChatName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Create New Chat</h2>
        <p className="modal-subtitle">Enter a name for your new chat</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            placeholder="e.g., Project Ideas, Research, etc."
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            autoFocus
          />
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn confirm-btn"
              disabled={!chatName.trim()}
            >
              Create Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;

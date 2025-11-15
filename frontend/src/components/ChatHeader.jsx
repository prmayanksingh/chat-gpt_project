import React from "react";
import "./ChatHeader.css";

const ChatHeader = ({ onToggleSidebar }) => {
  return (
    <div className="chat-header">
      <button
        className="sidebar-toggle-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
    </div>
  );
};

export default ChatHeader;

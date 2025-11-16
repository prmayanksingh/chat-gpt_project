import React from "react";
import "./ChatSidebar.css";

const ChatSidebar = ({
  chats,
  activeChat,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  sidebarOpen,
  onCloseSidebar,
}) => {
  console.log(chats)
  return (
    <>
      {/* Sidebar */}
      <aside className={`chat-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="header-top">
            <span className="header-label">CHATS</span>
            <div className="header-right">
              <span className="header-label new-label">NEW</span>
              <button className="header-new-btn" onClick={onNewChat} title="Create a new chat">
                +
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="chat-list">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${activeChat === chat._id ? "active" : ""}`}
                onClick={() => onSelectChat(chat._id)}
                role="button"
                tabIndex={0}
              >
                <div className="chat-item-content">
                  <p className="chat-title">{chat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">U</div>
            <span className="user-name">User</span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={onCloseSidebar}
          role="presentation"
        ></div>
      )}
    </>
  );
};

export default ChatSidebar;

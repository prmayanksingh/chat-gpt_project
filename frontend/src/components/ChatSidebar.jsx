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
  onLogout,
}) => {

  const getChatId = (chat) => chat.id ?? chat._id;
  const onChatSelect = (chat) => {
    const chatId = getChatId(chat);
    if (chatId) {
      onSelectChat(chatId);
    }
  };
  
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
            {chats.length === 0 ? (
              <div className="empty-chat-state">
                <p className="empty-title">No chats available</p>
                <p className="empty-subtitle">Create a new chat to get started.</p>
              </div>
            ) : (
              chats.map((chat, index) => {
                const chatId = getChatId(chat);
                return (
                  <div
                    key={chatId ?? `chat-${index}`}
                    className={`chat-item ${activeChat === chatId ? "active" : ""}`}
                    onClick={() => onChatSelect(chat)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="chat-item-content">
                      <p className="chat-title">{chat.title}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
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

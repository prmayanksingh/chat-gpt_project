import React from "react";
import "./Message.css";

const Message = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className="message-avatar">{isUser ? "U" : "AI"}</div>

      <div className="message-content">
        {message.loading ? (
          <div className="typing-indicator" aria-label="Assistant is typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <p>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default Message;

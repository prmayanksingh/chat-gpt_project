import React from "react";
import "./Message.css";

const Message = ({ message }) => {
  return (
    <div className={`message ${message.sender === "user" ? "user" : "assistant"}`}>
      <div className="message-avatar">
        {message.sender === "user" ? "U" : "AI"}
      </div>
      <div className="message-content">
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;

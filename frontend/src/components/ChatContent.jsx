import React from "react";
import Message from "./Message";
import WelcomeScreen from "./WelcomeScreen";
import "./ChatContent.css";

const ChatContent = ({ activeChat, messages }) => {
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  return (
    <div className="chat-content">
      {activeChat === null || currentMessages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div className="messages-container">
          {currentMessages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatContent;

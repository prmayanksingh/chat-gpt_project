import React, { useEffect, useRef } from "react";
import Message from "./Message";
import WelcomeScreen from "./WelcomeScreen";
import "./ChatContent.css";

const ChatContent = ({ activeChat, messages }) => {
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  // ref to bottom of the messages
  const bottomRef = useRef(null);

  // auto-scroll whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [currentMessages]);

  return (
    <div className="chat-content">
      {activeChat === null || currentMessages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div className="messages-container">
          {currentMessages.map((message, idx) => (
            <Message key={idx} message={message} />
          ))}

          {/* invisible element that forces scroll to bottom */}
          <div ref={bottomRef}></div>
        </div>
      )}
    </div>
  );
};

export default ChatContent;

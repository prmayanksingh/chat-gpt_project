import React from "react";
import "./ChatInput.css";

const ChatInput = ({ inputValue, onInputChange, onSendMessage, isDisabled }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-input-area">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Message ChatGPT..."
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isDisabled}
        />
        <button
          className="send-btn"
          onClick={onSendMessage}
          disabled={isDisabled || !inputValue.trim()}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

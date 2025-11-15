import React from "react";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  return (
    <div className="chat-welcome">
      <div className="welcome-content">
        <p className="welcome-label">Early Preview</p>
        <h1 className="welcome-title">ChatGPT Clone</h1>
        <p className="welcome-subtitle">
          Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/ThemeContext";
import "./Message.css";

const Message = ({ message }) => {
  const isUser = message.sender === "user";
  const { theme } = useTheme();

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
        ) : isUser ? (
          <p>{message.text}</p>
        ) : (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={theme === "dark" ? vscDarkPlus : oneLight}
                    language={language}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Message;

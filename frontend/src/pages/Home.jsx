import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChat,
  setActiveChat,
  addMessage,
  updateMessage,
  fetchChats,
  setMessages,
} from "../redux/chatSlice";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatContent from "../components/ChatContent";
import ChatInput from "../components/ChatInput";
import NewChatModal from "../components/NewChatModal";
import "../styles/Home.css";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { chats, activeChat, messages } = useSelector((state) => state.chat);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate()

  // Keep latest activeChat for socket
  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Track loading bubble message id
  const loadingMsgIdRef = useRef(null);

  // ---------------- NEW CHAT ----------------
  const handleNewChatConfirm = async (chatTitle) => {
    const chat = { title: chatTitle };

    const response = await axios.post("http://localhost:3000/api/chat", chat, {
      withCredentials: true,
    });

    const newChat = {
      id: response.data.chat.id,
      title: chatTitle,
    };

    dispatch(createChat(newChat));
    setShowNewChatModal(false);
  };

  const handleSelectChat = (chatId) => {
    dispatch(setActiveChat(chatId));
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/login");
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeChat) return;

    const newMessage = {
      text: inputValue,
      sender: "user",
    };

    // Add user message
    dispatch(addMessage({ chatId: activeChat, message: newMessage }));

    // Add placeholder assistant message
    const loadingId = `loading_${Date.now()}`;
    loadingMsgIdRef.current = loadingId;

    const loadingMessage = {
      id: loadingId,
      text: "AI is typing...",
      sender: "assistant",
      loading: true,
    };

    dispatch(addMessage({ chatId: activeChat, message: loadingMessage }));

    // Send to backend
    socket.emit("ai-message", {
      chat: activeChat,
      content: inputValue,
    });

    setInputValue("");
  };

  const getMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/chat/messages/${chatId}`,
        { withCredentials: true }
      );

      // backend returns an array of messages — map to your frontend shape
      const messagesFromDB = (response.data.messages || []).map((m) => ({
        id:
          m.id ||
          m._id ||
          `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text: m.content ?? m.text ?? "",
        sender: m.role === "user" ? "user" : "assistant",
      }));

      // dispatch action with correct payload shape: { chatId, messages }
      dispatch(setMessages({ chatId, messages: messagesFromDB }));
    } catch (err) {
      console.error("Failed to load messages for chat:", chatId, err);
    }
  };

  // ---------------- SOCKET CONNECTION ----------------
  useEffect(() => {

    const loadChats = async () => {
    try {
      // This will fail if token is missing or invalid
      await dispatch(fetchChats()).unwrap();
    } catch (err) {
      console.log("Token missing or invalid. Redirecting to login...");
      navigate("/login")
    }
  };

  loadChats();

    const tempSocket = io("http://localhost:3000", { withCredentials: true });

    tempSocket.on("ai-response", (messagePayload) => {
      const chatId = activeChatRef.current;
      const loadingId = loadingMsgIdRef.current;

      const responseText =
        messagePayload?.response ?? messagePayload?.text ?? "";

      if (loadingId) {
        dispatch(
          updateMessage({
            chatId,
            messageId: loadingId,
            newFields: { text: responseText, loading: false },
          })
        );
        loadingMsgIdRef.current = null;
      }
    });

    setSocket(tempSocket);
  }, []);

  return (
    <div className="chat-container">
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onConfirm={handleNewChatConfirm}
      />

      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={(id) => {
          handleSelectChat(id);
          getMessages(id);
        }}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        onNewChat={() => setShowNewChatModal(true)}
        onLogout={handleLogout}
      />

      <main className="chat-main">
        <ChatHeader onToggleSidebar={() => setSidebarOpen(true)} />

        <ChatContent activeChat={activeChat} messages={messages} />

        <ChatInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          isDisabled={!activeChat}
        />
      </main>
    </div>
  );
};

export default Home;

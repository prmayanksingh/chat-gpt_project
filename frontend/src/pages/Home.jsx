import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChat,
  setActiveChat,
  addMessages,
  deleteChat,
  updateChatTitle,
  fetchChats
} from "../redux/chatSlice";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatContent from "../components/ChatContent";
import ChatInput from "../components/ChatInput";
import NewChatModal from "../components/NewChatModal";
import "../styles/Home.css";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { chats, activeChat, messages } = useSelector((state) => state.chat);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Generate unique ID
  const generateId = () =>
    `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Get current date/time string
  const getDateString = () => {
    const now = new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (now.toDateString() === today.toDateString()) {
      return "Today";
    } else if (now.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Handle new chat - show modal
  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  // Handle new chat confirmation from modal
  const handleNewChatConfirm = async (chatTitle) => {

    const chat ={
      title: chatTitle
    }
    const response = await axios.post("http://localhost:3000/api/chat", chat,{
      withCredentials:true
    })
    
    console.log(response)
    
    const newChat = {
      id: response.data.chat.id,
      title: chatTitle,
    };

    dispatch(createChat(newChat));
    setInputValue("");
    setSidebarOpen(false);
    setShowNewChatModal(false);
  };

  // Select a chat
  const handleSelectChat = (chatId) => {
    dispatch(setActiveChat(chatId));
    setSidebarOpen(false);
  };

  // Send message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Create a new chat if no active chat exists
      let targetChatId = activeChat;
      if (!targetChatId) {
        targetChatId = generateId();
        const newChat = {
          id: targetChatId,
          title: "New Chat",
          date: getDateString(),
        };
        dispatch(createChat(newChat));
      }

      const newMessage = {
        id: `msg_${Date.now()}`,
        text: inputValue,
        sender: "user",
      };

      const assistantMessage = {
        id: `msg_${Date.now()}_ai`,
        text: "This is a sample response from AI assistant.",
        sender: "assistant",
      };

      dispatch(
        addMessages({
          chatId: targetChatId,
          messages: [newMessage, assistantMessage],
        })
      );

      // Update chat title if it's still "New Chat"
      const targetChat = chats.find((chat) => chat.id === targetChatId);
      if (targetChat && targetChat.title === "New Chat") {
        dispatch(
          updateChatTitle({
            chatId: targetChatId,
            title:
              inputValue.substring(0, 30) +
              (inputValue.length > 30 ? "..." : ""),
          })
        );
      }

      setInputValue("");
    }
  };

  // Delete chat
  const handleDeleteChat = (id) => {
    dispatch(deleteChat(id));
  };

  useEffect(() => {
    dispatch(fetchChats())
  }, [])
  

  return (
    <div className="chat-container">
      {/* Modal for new chat name */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onConfirm={handleNewChatConfirm}
      />

      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Header */}
        <ChatHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Chat Content */}
        <ChatContent activeChat={activeChat} messages={messages} />

        {/* Input Area */}
        <ChatInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          isDisabled={false}
        />
      </main>
    </div>
  );
};

export default Home;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChat: null,
  messages: {}, // { chatId: [messages] }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Create a new chat
    createChat: (state, action) => {
      const newChat = {
        id: action.payload.id,
        title: action.payload.title,
        date: action.payload.date,
      };
      state.chats.unshift(newChat);
      state.activeChat = newChat.id;
      state.messages[newChat.id] = [];
    },

    // Set active chat
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },

    // Add message to a chat
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },

    // Add multiple messages to a chat (user + assistant response)
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(...messages);
    },

    // Delete a chat
    deleteChat: (state, action) => {
      const chatId = action.payload;
      state.chats = state.chats.filter((chat) => chat.id !== chatId);
      delete state.messages[chatId];
      if (state.activeChat === chatId) {
        state.activeChat = state.chats.length > 0 ? state.chats[0].id : null;
      }
    },

    // Update chat title
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.title = title;
      }
    },

    // Clear all chats
    clearAllChats: (state) => {
      state.chats = [];
      state.activeChat = null;
      state.messages = {};
    },

    // Get messages for a chat
    getMessages: (state, action) => {
      return state.messages[action.payload] || [];
    },
  },
});

export const {
  createChat,
  setActiveChat,
  addMessage,
  addMessages,
  deleteChat,
  updateChatTitle,
  clearAllChats,
  getMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

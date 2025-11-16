import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  const response = await axios.get("http://localhost:3000/api/chat", {
    withCredentials: true,
  });

  // assume API returns: { chats: [...] }
  return response.data.chats;
});

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
      };
      state.chats.unshift(newChat);
      state.activeChat = newChat.id;
      state.messages[newChat.id] = [];
    },

    // Get all chats
    getChat: (state) => {
      // const response = await axios.get("http://localhost:3000/api/chat",{
      //   withCredentials:true
      // });
      console.log("response");

      // state.chats = response.data.chats
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

  extraReducers: (builder) => {
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload; // <-- THIS STORES YOUR CHATS
    });
  },
});

export const {
  createChat,
  getChat,
  setActiveChat,
  addMessage,
  addMessages,
  deleteChat,
  updateChatTitle,
  clearAllChats,
  getMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

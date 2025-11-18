import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  const response = await axios.get("https://chat-gpt-project-adq9.onrender.com/api/chat", {
    withCredentials: true,
  });

  return response.data.chats;
});

const initialState = {
  chats: [],
  activeChat: null,
  messages: {}, // [ chatId: [messages] ]
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createChat: (state, action) => {
      const newChat = {
        id: action.payload.id,
        title: action.payload.title,
      };
      state.chats.unshift(newChat);
      state.activeChat = newChat.id;
      state.messages[newChat.id] = [];
    },

    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },

    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },

    setMessages:(state,action)=>{
      const {chatId, messages} = action.payload;

      state.messages[chatId] = messages
    },

    // update a message (used to replace loading bubble)
    updateMessage: (state, action) => {
      const { chatId, messageId, newFields } = action.payload;
      const msgs = state.messages[chatId];
      if (!msgs) return;
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx === -1) return;
      state.messages[chatId][idx] = {
        ...msgs[idx],
        ...newFields,
      };
    },

    deleteChat: (state, action) => {
      const chatId = action.payload;
      state.chats = state.chats.filter((chat) => chat.id !== chatId);
      delete state.messages[chatId];
      if (state.activeChat === chatId) {
        state.activeChat = state.chats.length > 0 ? state.chats[0].id : null;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
  },
});

export const {
  createChat,
  setActiveChat,
  addMessage,
  setMessages,
  updateMessage, 
  deleteChat,
} = chatSlice.actions;

export default chatSlice.reducer;

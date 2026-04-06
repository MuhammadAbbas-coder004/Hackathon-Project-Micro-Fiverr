// Chat Slice - Manages real-time messaging state
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  conversations: [],
  activeChat: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMessages: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setConversations: (state, action) => {
      state.loading = false;
      state.conversations = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.activeChat = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setMessages,
  addMessage,
  setConversations,
  setActiveChat,
  clearChat,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;

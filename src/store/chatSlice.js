import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  usersTyping: [],
  eventId: null,
  connected: false,
  connectionError: null,
  userCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setEventId: (state, action) => {
      state.eventId = action.payload;
      state.messages = []; // Clear messages when switching events
    },
    
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // Keep only last 100 messages to prevent memory issues
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100);
      }
    },
    
    setMessageHistory: (state, action) => {
      state.messages = action.payload;
    },
    
    addTypingUser: (state, action) => {
      const { userId, username } = action.payload;
      const existingUser = state.usersTyping.find(user => user.userId === userId);
      if (!existingUser) {
        state.usersTyping.push({ userId, username });
      }
    },
    
    removeTypingUser: (state, action) => {
      const userId = action.payload;
      state.usersTyping = state.usersTyping.filter(user => user.userId !== userId);
    },
    
    clearTypingUsers: (state) => {
      state.usersTyping = [];
    },
    
    setConnected: (state, action) => {
      state.connected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
      state.connected = false;
    },
    
    setUserCount: (state, action) => {
      state.userCount = action.payload;
    },
    
    clearChat: (state) => {
      state.messages = [];
      state.usersTyping = [];
      state.eventId = null;
    },
  },
});

export const {
  setEventId,
  addMessage,
  setMessageHistory,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  setConnected,
  setConnectionError,
  setUserCount,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
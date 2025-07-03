import React, { createContext, useContext, useState, useEffect } from 'react';
import socket from '../services/socket';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [currentEventId, setCurrentEventId] = useState(null);
  const [socketInstance] = useState(socket);
  const [user, setUser] = useState(() => {
    // Generate a random user ID and username on first load
    const savedUser = localStorage.getItem('lukachat_user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: `User${Math.floor(Math.random() * 1000)}`,
    };
    localStorage.setItem('lukachat_user', JSON.stringify(newUser));
    return newUser;
  });

  const updateEventId = (eventId) => {
    setCurrentEventId(eventId);
  };

  const updateUsername = (newUsername) => {
    const updatedUser = { ...user, username: newUsername };
    setUser(updatedUser);
    localStorage.setItem('lukachat_user', JSON.stringify(updatedUser));
  };

  const contextValue = {
    eventId: currentEventId,
    updateEventId,
    socket: socketInstance,
    user,
    updateUsername,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
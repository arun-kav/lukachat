import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChatContext } from '../contexts/ChatContext';
import {
  addMessage,
  setMessageHistory,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  setConnected,
  setConnectionError,
  setUserCount,
} from '../store/chatSlice';

export const useChat = () => {
  const dispatch = useDispatch();
  const { socket, user, eventId } = useChatContext();
  const { connected, connectionError } = useSelector((state) => state.chat);
  const typingTimeoutRef = useRef(null);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      dispatch(setConnected(true));
      console.log('Connected to server');
    };

    const handleDisconnect = () => {
      dispatch(setConnected(false));
      dispatch(clearTypingUsers());
      console.log('Disconnected from server');
    };

    const handleConnectError = (error) => {
      dispatch(setConnectionError(error.message));
      console.error('Connection error:', error);
    };

    const handleMessage = (message) => {
      console.log('Received message:', message);
      dispatch(addMessage(message));
    };

    const handleHistory = (messages) => {
      dispatch(setMessageHistory(messages));
    };

    const handleUserTyping = ({ userId, username }) => {
      if (userId !== user.id) {
        dispatch(addTypingUser({ userId, username }));
      }
    };

    const handleUserStoppedTyping = ({ userId }) => {
      dispatch(removeTypingUser(userId));
    };

    const handleUserCount = ({ count }) => {
      dispatch(setUserCount(count));
    };

    // Attach event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('message', handleMessage);
    socket.on('history', handleHistory);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('user_count', handleUserCount);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('message', handleMessage);
      socket.off('history', handleHistory);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
      socket.off('user_count', handleUserCount);
    };
  }, [socket, user.id, dispatch]);

  // Connect socket when component mounts
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Don't disconnect on unmount to maintain connection
    };
  }, [socket]);

  // Join room when eventId changes
  useEffect(() => {
    if (eventId && socket.connected) {
      socket.emit('joinRoom', { eventId, user });
    }
  }, [eventId, socket, user]);

  const sendMessage = useCallback((text) => {
    if (!text.trim() || !eventId || !socket.connected) return;

    const message = {
      text: text.trim(),
      user,
      eventId,
      timestamp: new Date().toISOString(),
    };

    socket.emit('message', message);
  }, [socket, user, eventId]);

  const sendTyping = useCallback(() => {
    if (!eventId || !socket.connected) return;

    socket.emit('typing', { eventId, user });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { eventId, user });
    }, 2000);
  }, [socket, user, eventId]);

  const stopTyping = useCallback(() => {
    if (!eventId || !socket.connected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('stop_typing', { eventId, user });
  }, [socket, user, eventId]);

  return {
    sendMessage,
    sendTyping,
    stopTyping,
    connected,
    connectionError,
  };
};

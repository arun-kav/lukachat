import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useChatContext } from '../contexts/ChatContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const ChatWindow = () => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { messages, connected, connectionError, userCount } = useSelector((state) => state.chat);
  const { sendMessage, sendTyping, stopTyping } = useChat();
  const { eventId, user, updateUsername } = useChatContext();
  
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState(user.username);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [eventId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
      setIsTyping(false);
      stopTyping();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      sendTyping();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleBlur = () => {
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  };

  const handleUsernameUpdate = () => {
    if (tempUsername.trim() && tempUsername !== user.username) {
      updateUsername(tempUsername.trim());
    }
    setShowUsernameModal(false);
  };

  if (!eventId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to LukaChat</h2>
          <p className="text-gray-500">Select an event to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Event: {eventId}
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`text-sm flex items-center ${
                connected ? 'text-green-600' : 'text-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
              {userCount > 0 && (
                <span className="text-sm text-gray-500">
                  {userCount} user{userCount !== 1 ? 's' : ''} online
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Logged in as: <span className="font-semibold text-gray-700">{user.username}</span>
            </span>
            <button
              onClick={() => setShowUsernameModal(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Change Username
            </button>
          </div>
        </div>
        
        {connectionError && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
            Connection Error: {connectionError}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message key={`${message.timestamp}-${index}`} message={message} />
          ))
        )}
        
        <TypingIndicator />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            placeholder={connected ? "Type your message..." : "Connecting..."}
            disabled={!connected}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!connected || !inputText.trim()}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Username</h3>
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter new username"
              maxLength={20}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowUsernameModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUsernameUpdate}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow

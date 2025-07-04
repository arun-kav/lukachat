import React from 'react';
import { useSelector } from 'react-redux';

const TypingIndicator = () => {
  const usersTyping = useSelector((state) => state.chat.usersTyping);

  if (usersTyping.length === 0) return null;

  const getTypingText = () => {
    if (usersTyping.length === 1) {
      return `${usersTyping[0].username} is typing...`;
    } else if (usersTyping.length === 2) {
      return `${usersTyping[0].username} and ${usersTyping[1].username} are typing...`;
    } else {
      return `${usersTyping[0].username} and ${usersTyping.length - 1} others are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm italic">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;
import React from 'react';
import { useChatContext } from '../contexts/ChatContext';

const Message = ({ message }) => {
  const { user } = useChatContext();
  const isOwnMessage = message.user.id === user.id;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwnMessage 
          ? 'bg-primary-500 text-white' 
          : 'bg-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium ${
            isOwnMessage ? 'text-primary-100' : 'text-gray-600'
          }`}>
            {isOwnMessage ? 'You' : message.user.username}
          </span>
          <span className={`text-xs ml-2 ${
            isOwnMessage ? 'text-primary-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
        <p className="text-sm break-words">
          {message.text}
        </p>
      </div>
    </div>
  );
};

export default Message;
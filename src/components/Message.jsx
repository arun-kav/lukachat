import React from 'react';
import { useChatContext } from '../contexts/ChatContext';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B801', '#5F6B6D',
  '#B1A296', '#F28C28', '#C8A2C8', '#78C0A8', '#F0A8A8'
];

const getUserColor = (userId) => {
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return COLORS[Math.abs(hash) % COLORS.length];
};

const Message = ({ message }) => {
  const { user } = useChatContext();
  const isOwnMessage = message.userId === user.id;
  const userColor = getUserColor(message.userId);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`flex items-start gap-3 my-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: userColor }}
        >
          {message.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2 rounded-md max-w-lg ${
          isOwnMessage
            ? 'bg-primary-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}>
          <p className="text-sm break-words">
            {!isOwnMessage && (
              <span className="font-bold" style={{ color: userColor }}>
                {message.username}:{' '}
              </span>
            )}
            {message.text}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Message;

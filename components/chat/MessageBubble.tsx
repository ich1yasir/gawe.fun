'use client'
import React from 'react';
import { ChatMessage } from './types';

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId?: string;
  isNew?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId, isNew = false }) => {
  const isCurrentUser = message.userId === currentUserId;
  const isSystem = message.messageType === 'system' || message.messageType === 'notification';
  
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSystem) {
    return (
      <div className={`flex justify-center ${isNew ? 'animate-fade-in-down' : ''}`}>
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg text-sm max-w-md">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{message.text}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-center">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isNew ? 'animate-fade-in-down' : ''}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isCurrentUser 
          ? 'bg-blue-500 text-white ml-auto' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      }`}>
        <div className="flex flex-col">
          {!isCurrentUser && (
            <div className="text-xs font-medium mb-1 opacity-75">
              {message.username}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm break-words">{message.text}</p>
            <div className={`flex items-center space-x-1 mt-1 text-xs ${
              isCurrentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {message.encrypted && (
                <>
                  <span>•</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

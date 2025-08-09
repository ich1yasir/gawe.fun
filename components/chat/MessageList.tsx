'use client'
import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { ChatMessage } from './types';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isTopOriented?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUserId, 
  isTopOriented = false 
}) => {
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  
  // For top-oriented display, show newest messages first (reverse order)
  const displayMessages = isTopOriented ? [...messages].reverse() : messages;

  useEffect(() => {
    setPreviousMessageCount(messages.length);
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Top indicator for newest messages */}
      {isTopOriented && displayMessages.length > 0 && (
        <div className="text-center py-2">
          <div className="inline-flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span>Latest messages</span>
          </div>
        </div>
      )}
      
      {displayMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        </div>
      ) : (
        displayMessages.map((message, index) => {
          // Mark the newest message as new for animation (only the first message in top-oriented view)
          const isNew = isTopOriented && index === 0 && messages.length > previousMessageCount;
          
          return (
            <MessageBubble 
              key={message.id} 
              message={message} 
              currentUserId={currentUserId}
              isNew={isNew}
            />
          );
        })
      )}

      {/* Bottom indicator for older messages */}
      {isTopOriented && displayMessages.length > 0 && (
        <div className="text-center py-2">
          <div className="inline-flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            <span>Older messages</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;

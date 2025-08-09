'use client'
import React from 'react';

interface ChatHeaderProps {
  isConnected: boolean;
  channelCode?: string;
  participantCount?: number;
  onLeaveChannel: () => void;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isConnected, 
  channelCode, 
  participantCount = 0,
  onLeaveChannel, 
  onClearChat 
}) => {
  const copyChannelCode = () => {
    if (channelCode) {
      navigator.clipboard.writeText(channelCode);
      // You could add a toast notification here
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        {channelCode && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">
              <span className="text-gray-600 dark:text-gray-400">Channel:</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{channelCode}</span>
              <button
                onClick={copyChannelCode}
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Copy channel code"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>End-to-End Encrypted</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onClearChat}
          className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Clear chat history"
        >
          Clear
        </button>
        
        <button
          onClick={onLeaveChannel}
          className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
        >
          Leave Channel
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

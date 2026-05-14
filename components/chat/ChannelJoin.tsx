import React, { useState, useEffect } from 'react';
import { chatStorage } from '../../lib/chatStorage';

interface ChannelJoinProps {
  onJoinChannel: (channelCode: string, userId: string, username: string) => void;
  isConnected: boolean;
  isLoading?: boolean;
  autoReconnecting?: boolean;
  autoReconnectAttempts?: number;
  maxAutoReconnectAttempts?: number;
  onResetAutoReconnect?: () => void;
}

const ChannelJoin: React.FC<ChannelJoinProps> = ({ 
  onJoinChannel, 
  isConnected, 
  isLoading = false,
  autoReconnecting = false,
  autoReconnectAttempts = 0,
  maxAutoReconnectAttempts = 3,
  onResetAutoReconnect
}) => {
  const [channelCode, setChannelCode] = useState('');
  const [username, setUsername] = useState('');
  const [recentChannels, setRecentChannels] = useState<string[]>([]);
  const [userId, setUserId] = useState(() => {
    // Check if we're in the browser environment first
    if (typeof window === 'undefined') {
      // Server-side: return a temporary ID that will be replaced on client
      return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
    
    // Client-side: Get or create a persistent userId
    let persistentUserId = localStorage.getItem('gawe_user_id');
    if (!persistentUserId) {
      persistentUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('gawe_user_id', persistentUserId);
    }
    return persistentUserId;
  });

  // Ensure we have the correct userId on client-side hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let persistentUserId = localStorage.getItem('gawe_user_id');
      if (!persistentUserId) {
        persistentUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem('gawe_user_id', persistentUserId);
      }
      setUserId(persistentUserId);
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Load recent channels on component mount
    const recent = chatStorage.getRecentChannels();
    setRecentChannels(recent);
    
    // Load saved user info
    const savedUserInfo = chatStorage.getUserInfo();
    const savedUsername = localStorage.getItem('gawe_username');
    
    if (savedUserInfo?.username) {
      setUsername(savedUserInfo.username);
    } else if (savedUsername) {
      setUsername(savedUsername);
    }
    
    // Pre-populate with latest channel if available
    const latestChannel = chatStorage.getLatestChannel();
    if (latestChannel && recent.includes(latestChannel)) {
      setChannelCode(latestChannel);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelCode.trim() || !username.trim()) {
      alert('Please enter both channel code and username');
      return;
    }

    if (!isConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }

    // Save username to localStorage (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('gawe_username', username.trim());
    }

    onJoinChannel(channelCode.trim().toUpperCase(), userId, username.trim());
  };

  const handleRecentChannelClick = (code: string) => {
    setChannelCode(code);
  };

  const generateRandomChannel = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setChannelCode(result);
  };

  const handleResetAutoReconnect = () => {
    if (onResetAutoReconnect) {
      onResetAutoReconnect();
      // Clear the form
      setChannelCode('');
      setUsername('');
      // Clear stored user data (only on client side)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gawe_user_id');
        localStorage.removeItem('gawe_username');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        {autoReconnecting ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-lg font-medium">Auto-reconnecting...</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Attempting to reconnect to your latest channel
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Attempt {autoReconnectAttempts} of {maxAutoReconnectAttempts}
            </p>
            {autoReconnectAttempts >= maxAutoReconnectAttempts && onResetAutoReconnect && (
              <div className="mt-4">
                <p className="text-red-600 dark:text-red-400 mb-4">
                  Failed to auto-reconnect after {maxAutoReconnectAttempts} attempts
                </p>
                <button
                  onClick={handleResetAutoReconnect}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Reset and Start Fresh
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gawe Chat
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join a channel to start chatting
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  maxLength={30}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="channelCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Channel Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="channelCode"
                    value={channelCode}
                    onChange={(e) => setChannelCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-character code"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={generateRandomChannel}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50"
                  >
                    Random
                  </button>
                </div>
              </div>

              {/* Recent Channels */}
              {recentChannels.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recent Channels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {recentChannels.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleRecentChannelClick(code)}
                        disabled={isLoading}
                        className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full transition-colors disabled:opacity-50 font-mono"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {isConnected ? 'Connected to server' : 'Connecting to server...'}
              </div>

              <button
                type="submit"
                disabled={!isConnected || isLoading || !channelCode.trim() || !username.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors font-medium disabled:cursor-not-allowed"
              >
                {isLoading ? 'Joining...' : 'Join Channel'}
              </button>
            </form>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>Share the channel code with others to invite them to your chat.</p>
              <p className="mt-1">All messages are end-to-end encrypted.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChannelJoin;

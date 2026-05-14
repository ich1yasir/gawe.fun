import { ChatMessage } from '../components/chat/types';

const STORAGE_KEY = 'gawe_chat_history';
const MAX_CHANNELS = 10; // Keep history for last 10 channels
const MAX_MESSAGES_PER_CHANNEL = 50; // Keep last 50 messages per channel

export interface ChatHistory {
  [channelCode: string]: {
    messages: ChatMessage[];
    lastAccessed: string;
    participants: string[];
  };
}

export const chatStorage = {
  // Save messages for a channel
  saveMessages: (channelCode: string, messages: ChatMessage[], participants: string[] = []) => {
    try {
      const history = chatStorage.getHistory();
      
      // Keep only the latest messages
      const messagesToSave = messages.slice(-MAX_MESSAGES_PER_CHANNEL);
      
      history[channelCode] = {
        messages: messagesToSave,
        lastAccessed: new Date().toISOString(),
        participants
      };

      // Keep only the most recent channels
      const channelEntries = Object.entries(history);
      if (channelEntries.length > MAX_CHANNELS) {
        // Sort by last accessed and keep only the most recent
        const sortedChannels = channelEntries
          .sort(([, a], [, b]) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
          .slice(0, MAX_CHANNELS);
        
        const newHistory: ChatHistory = {};
        sortedChannels.forEach(([code, data]) => {
          newHistory[code] = data;
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
      
      // Save as latest channel
      chatStorage.saveLatestChannel(channelCode);
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  },

  // Save the latest channel for auto-reconnection
  saveLatestChannel: (channelCode: string) => {
    try {
      localStorage.setItem('gawe_latest_channel', channelCode);
    } catch (error) {
      console.error('Failed to save latest channel:', error);
    }
  },

  // Get the latest channel for auto-reconnection
  getLatestChannel: (): string | null => {
    try {
      return localStorage.getItem('gawe_latest_channel');
    } catch (error) {
      console.error('Failed to get latest channel:', error);
      return null;
    }
  },

  // Save current user info for auto-reconnection
  saveUserInfo: (userId: string, username: string) => {
    try {
      const userInfo = { userId, username, savedAt: new Date().toISOString() };
      localStorage.setItem('gawe_user_info', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to save user info:', error);
    }
  },

  // Get saved user info for auto-reconnection
  getUserInfo: (): { userId: string; username: string } | null => {
    try {
      const stored = localStorage.getItem('gawe_user_info');
      if (stored) {
        const userInfo = JSON.parse(stored);
        // Check if saved info is not too old (7 days)
        const savedAt = new Date(userInfo.savedAt);
        const now = new Date();
        const daysDiff = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 7) {
          return { userId: userInfo.userId, username: userInfo.username };
        } else {
          // Remove old user info
          localStorage.removeItem('gawe_user_info');
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  },

  // Get messages for a specific channel
  getChannelMessages: (channelCode: string): ChatMessage[] => {
    try {
      const history = chatStorage.getHistory();
      const channelData = history[channelCode];
      
      if (channelData) {
        // Update last accessed time
        channelData.lastAccessed = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        
        return channelData.messages || [];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get channel messages:', error);
      return [];
    }
  },

  // Get all chat history
  getHistory: (): ChatHistory => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return {};
    }
  },

  // Get recent channels
  getRecentChannels: (limit: number = 5): string[] => {
    try {
      const history = chatStorage.getHistory();
      return Object.entries(history)
        .sort(([, a], [, b]) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
        .slice(0, limit)
        .map(([code]) => code);
    } catch (error) {
      console.error('Failed to get recent channels:', error);
      return [];
    }
  },

  // Clear history for a specific channel
  clearChannel: (channelCode: string) => {
    try {
      const history = chatStorage.getHistory();
      delete history[channelCode];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      
      // Clear latest channel if it's the one being cleared
      const latestChannel = chatStorage.getLatestChannel();
      if (latestChannel === channelCode) {
        localStorage.removeItem('gawe_latest_channel');
      }
    } catch (error) {
      console.error('Failed to clear channel history:', error);
    }
  },

  // Clear all chat history
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('gawe_latest_channel');
      localStorage.removeItem('gawe_user_info');
    } catch (error) {
      console.error('Failed to clear all chat history:', error);
    }
  },

  // Get storage size info
  getStorageInfo: () => {
    try {
      const history = chatStorage.getHistory();
      const channelCount = Object.keys(history).length;
      const totalMessages = Object.values(history).reduce((sum, channel) => sum + channel.messages.length, 0);
      const storageSize = new Blob([JSON.stringify(history)]).size;
      
      return {
        channelCount,
        totalMessages,
        storageSize,
        storageSizeKB: Math.round(storageSize / 1024)
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        channelCount: 0,
        totalMessages: 0,
        storageSize: 0,
        storageSizeKB: 0
      };
    }
  },

  clearAutoReconnectData: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('gawe_latest_channel');
    localStorage.removeItem('gawe_user_info');
  }
};

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ChannelParticipant, ServerToClientEvents, ClientToServerEvents } from '../lib/socket';
import { chatStorage } from '../lib/chatStorage';

type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface UseSocketReturn {
  socket: SocketIO | null;
  isConnected: boolean;
  messages: ChatMessage[];
  participants: ChannelParticipant[];
  typingUsers: string[];
  joinChannel: (channelCode: string, userId: string, username: string) => void;
  leaveChannel: () => void;
  sendMessage: (text: string, messageType?: 'text' | 'system' | 'notification') => void;
  startTyping: () => void;
  stopTyping: () => void;
  clearMessages: () => void;
  currentChannelCode: string | null;
  connectionError: string | null;
  getRecentChannels: () => string[];
  loadChannelHistory: (channelCode: string) => void;
  autoReconnect: () => Promise<boolean>;
  resetAutoReconnect: () => void;
  autoReconnectAttempts: number;
  maxAutoReconnectAttempts: number;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<SocketIO | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<ChannelParticipant[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [currentChannelCode, setCurrentChannelCode] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [autoReconnectAttempts, setAutoReconnectAttempts] = useState(0);
  const [hasTriedAutoReconnect, setHasTriedAutoReconnect] = useState(false);
  
  const currentUserRef = useRef<{ userId: string; username: string } | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxAutoReconnectAttempts = 3;

  // Initialize socket connection
  useEffect(() => {
    let socketInstance: SocketIO;

    const initSocket = async () => {
      try {
        // Initialize socket.io connection
        await fetch('/api/socket');
        
        socketInstance = io({
          path: '/api/socket',
          addTrailingSlash: false,
        });

        // Connection events
        socketInstance.on('connect', () => {
          console.log('Connected to server');
          setIsConnected(true);
          setConnectionError(null);
        });

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from server');
          setIsConnected(false);
          setCurrentChannelCode(null);
          setMessages([]);
          setParticipants([]);
          setTypingUsers([]);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setConnectionError('Failed to connect to server');
          setIsConnected(false);
        });

        // Message events
        socketInstance.on('message', (message: ChatMessage) => {
          setMessages(prev => {
            // Prevent duplicate messages
            const exists = prev.some(m => m.id === message.id);
            if (exists) return prev;
            const newMessages = [...prev, message];
            
            // Save to localStorage
            if (currentChannelCode) {
              chatStorage.saveMessages(currentChannelCode, newMessages);
            }
            
            return newMessages;
          });
        });

        // User events
        socketInstance.on('user_joined', ({ userId, username, channelCode }) => {
          if (currentUserRef.current?.userId !== userId) {
            setMessages(prev => [...prev, {
              id: `join-${Date.now()}`,
              text: `${username} joined the channel`,
              userId: 'system',
              username: 'System',
              channelCode,
              timestamp: new Date(),
              encrypted: false,
              messageType: 'notification'
            }]);
          }
        });

        socketInstance.on('user_left', ({ userId, username, channelCode }) => {
          if (currentUserRef.current?.userId !== userId) {
            setMessages(prev => [...prev, {
              id: `leave-${Date.now()}`,
              text: `${username} left the channel`,
              userId: 'system',
              username: 'System',
              channelCode,
              timestamp: new Date(),
              encrypted: false,
              messageType: 'notification'
            }]);
          }
        });

        // Channel info events
        socketInstance.on('channel_info', ({ participants: newParticipants }) => {
          setParticipants(newParticipants);
        });

        // Typing events
        socketInstance.on('typing_start', ({ userId, username }) => {
          if (currentUserRef.current?.userId !== userId) {
            setTypingUsers(prev => {
              if (!prev.includes(username)) {
                return [...prev, username];
              }
              return prev;
            });
          }
        });

        socketInstance.on('typing_stop', ({ userId, username }) => {
          if (currentUserRef.current?.userId !== userId) {
            setTypingUsers(prev => prev.filter(user => user !== username));
          }
        });

        // Error events
        socketInstance.on('error', (error: string) => {
          console.error('Socket error:', error);
          setConnectionError(error);
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        setConnectionError('Failed to initialize connection');
      }
    };

    initSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (autoReconnectTimeoutRef.current) {
        clearTimeout(autoReconnectTimeoutRef.current);
      }
    };
  }, []);

  const joinChannel = (channelCode: string, userId: string, username: string) => {
    if (!socket || !isConnected) {
      setConnectionError('Not connected to server');
      return;
    }

    currentUserRef.current = { userId, username };
    setCurrentChannelCode(channelCode);
    
    // Reset auto-reconnect state on successful manual join
    setAutoReconnectAttempts(0);
    setHasTriedAutoReconnect(false);
    
    // Save user info and latest channel for auto-reconnection
    chatStorage.saveUserInfo(userId, username);
    chatStorage.saveLatestChannel(channelCode);
    
    // Load chat history from localStorage first
    const localMessages = chatStorage.getChannelMessages(channelCode);
    setMessages(localMessages);
    
    setParticipants([]);
    setTypingUsers([]);
    setConnectionError(null);

    socket.emit('join_channel', { channelCode, userId, username });
  };

  const leaveChannel = () => {
    if (!socket || !currentChannelCode || !currentUserRef.current) return;

    // Save current messages to localStorage before leaving
    if (messages.length > 0) {
      const participantNames = participants.map(p => p.username);
      chatStorage.saveMessages(currentChannelCode, messages, participantNames);
    }

    socket.emit('leave_channel', { 
      channelCode: currentChannelCode, 
      userId: currentUserRef.current.userId 
    });

    setCurrentChannelCode(null);
    setMessages([]);
    setParticipants([]);
    setTypingUsers([]);
    currentUserRef.current = null;
  };

  const sendMessage = (text: string, messageType: 'text' | 'system' | 'notification' = 'text') => {
    if (!socket || !isConnected || !currentChannelCode || !currentUserRef.current) {
      setConnectionError('Cannot send message: not connected to a channel');
      return;
    }

    socket.emit('send_message', {
      text,
      userId: currentUserRef.current.userId,
      username: currentUserRef.current.username,
      encrypted: true,
      messageType
    });
  };

  const startTyping = () => {
    if (!socket || !isConnected || !currentChannelCode || !currentUserRef.current) return;

    socket.emit('typing_start', {
      channelCode: currentChannelCode,
      userId: currentUserRef.current.userId,
      username: currentUserRef.current.username
    });

    // Auto-stop typing after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!socket || !isConnected || !currentChannelCode || !currentUserRef.current) return;

    socket.emit('typing_stop', {
      channelCode: currentChannelCode,
      userId: currentUserRef.current.userId,
      username: currentUserRef.current.username
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const clearMessages = () => {
    setMessages([]);
    // Also clear from localStorage
    if (currentChannelCode) {
      chatStorage.clearChannel(currentChannelCode);
    }
  };

  const getRecentChannels = () => {
    return chatStorage.getRecentChannels();
  };

  const loadChannelHistory = (channelCode: string) => {
    const history = chatStorage.getChannelMessages(channelCode);
    setMessages(history);
  };

  const autoReconnect = async (): Promise<boolean> => {
    try {
      // Prevent multiple auto-reconnect attempts
      if (hasTriedAutoReconnect || autoReconnectAttempts >= maxAutoReconnectAttempts) {
        console.log('Auto-reconnect skipped: already attempted or max attempts reached');
        return false;
      }

      const latestChannel = chatStorage.getLatestChannel();
      const userInfo = chatStorage.getUserInfo();
      
      if (latestChannel && userInfo && isConnected && !currentChannelCode) {
        console.log(`Auto-reconnecting to channel: ${latestChannel} (attempt ${autoReconnectAttempts + 1}/${maxAutoReconnectAttempts})`);
        
        setAutoReconnectAttempts(prev => prev + 1);
        setHasTriedAutoReconnect(true);
        
        // Add a small delay to ensure socket is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        joinChannel(latestChannel, userInfo.userId, userInfo.username);
        
        // Wait a bit to see if join was successful
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (currentChannelCode === latestChannel) {
          console.log('Auto-reconnect successful');
          // Reset attempt counter on successful reconnect
          setAutoReconnectAttempts(0);
          return true;
        } else {
          console.log('Auto-reconnect failed: channel not joined');
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Auto-reconnect failed:', error);
      setAutoReconnectAttempts(prev => prev + 1);
      return false;
    }
  };

  const resetAutoReconnect = () => {
    setAutoReconnectAttempts(0);
    setHasTriedAutoReconnect(false);
    if (autoReconnectTimeoutRef.current) {
      clearTimeout(autoReconnectTimeoutRef.current);
      autoReconnectTimeoutRef.current = null;
    }
    // Clear auto-reconnect data
    chatStorage.clearAutoReconnectData();
  };

  return {
    socket,
    isConnected,
    messages,
    participants,
    typingUsers,
    joinChannel,
    leaveChannel,
    sendMessage,
    startTyping,
    stopTyping,
    clearMessages,
    currentChannelCode,
    connectionError,
    getRecentChannels,
    loadChannelHistory,
    autoReconnect,
    resetAutoReconnect,
    autoReconnectAttempts,
    maxAutoReconnectAttempts
  };
};

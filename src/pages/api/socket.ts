import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO, SocketWithData } from '../../../lib/socket';
import { channelManager } from '../../../lib/channelManager';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket.IO server already running');
    res.end();
    return;
  }

  console.log('Starting Socket.IO server...');
  
  const io = new ServerIO(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Store the io instance
  res.socket.server.io = io;

  // Set up channel manager callback for user left events
  channelManager.setOnUserLeftCallback((channelCode: string, userId: string, username: string) => {
    io.to(channelCode).emit('user_left', { userId, username, channelCode });
    
    // Update channel info for remaining users
    const participants = channelManager.getChannelParticipants(channelCode);
    io.to(channelCode).emit('channel_info', { 
      participants, 
      totalCount: participants.length 
    });
  });

  io.on('connection', (socket: SocketWithData) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle joining a channel
    socket.on('join_channel', ({ channelCode, userId, username }) => {
      try {
        // Leave previous channel if any
        if (socket.channelCode) {
          socket.leave(socket.channelCode);
          if (socket.userId) {
            channelManager.leaveChannel(socket.channelCode, socket.userId);
          }
        }

        // Join new channel
        socket.join(channelCode);
        socket.channelCode = channelCode;
        socket.userId = userId;
        socket.username = username;

        // Add user to channel (this will update existing participant if userId already exists)
        const isNewParticipant = channelManager.joinChannel(channelCode, userId, username);

        // Handle reconnection case
        channelManager.handleReconnect(userId);

        // Get recent messages
        const recentMessages = channelManager.getChannelMessages(channelCode, 50);
        
        // Send recent messages to the user
        recentMessages.forEach(message => {
          socket.emit('message', message);
        });

        // Only notify others if this is a truly new participant (not a reconnection)
        if (isNewParticipant) {
          socket.to(channelCode).emit('user_joined', { userId, username, channelCode });
        }

        // Send channel info to the user
        const participants = channelManager.getChannelParticipants(channelCode);
        socket.emit('channel_info', { 
          participants, 
          totalCount: participants.length 
        });

        // Broadcast updated channel info to all users in the channel
        io.to(channelCode).emit('channel_info', { 
          participants, 
          totalCount: participants.length 
        });

        console.log(`User ${username} (${userId}) ${isNewParticipant ? 'joined' : 'reconnected to'} channel ${channelCode}`);
      } catch (error) {
        console.error('Error joining channel:', error);
        socket.emit('error', 'Failed to join channel');
      }
    });

    // Handle leaving a channel
    socket.on('leave_channel', ({ channelCode, userId }) => {
      try {
        socket.leave(channelCode);
        
        const success = channelManager.leaveChannel(channelCode, userId);
        if (success) {
          socket.to(channelCode).emit('user_left', { 
            userId, 
            username: socket.username || 'Unknown', 
            channelCode 
          });

          // Update channel info for remaining users
          const participants = channelManager.getChannelParticipants(channelCode);
          io.to(channelCode).emit('channel_info', { 
            participants, 
            totalCount: participants.length 
          });
        }

        socket.channelCode = undefined;
        socket.userId = undefined;
        socket.username = undefined;

        console.log(`User ${userId} left channel ${channelCode}`);
      } catch (error) {
        console.error('Error leaving channel:', error);
        socket.emit('error', 'Failed to leave channel');
      }
    });

    // Handle sending messages
    socket.on('send_message', (messageData) => {
      try {
        if (!socket.channelCode || !socket.userId || !socket.username) {
          socket.emit('error', 'Not connected to any channel');
          return;
        }

        const message = channelManager.addMessage(socket.channelCode, {
          ...messageData,
          userId: socket.userId,
          username: socket.username
        });

        if (message) {
          // Broadcast message to all users in the channel
          io.to(socket.channelCode).emit('message', message);
          console.log(`Message sent in channel ${socket.channelCode} by ${socket.username}`);
        } else {
          socket.emit('error', 'Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle typing indicators
    socket.on('typing_start', ({ channelCode, userId, username }) => {
      try {
        if (channelManager.setUserTyping(channelCode, userId, true)) {
          socket.to(channelCode).emit('typing_start', { userId, username });
        }
      } catch (error) {
        console.error('Error handling typing start:', error);
      }
    });

    socket.on('typing_stop', ({ channelCode, userId, username }) => {
      try {
        if (channelManager.setUserTyping(channelCode, userId, false)) {
          socket.to(channelCode).emit('typing_stop', { userId, username });
        }
      } catch (error) {
        console.error('Error handling typing stop:', error);
      }
    });

    // Handle channel info requests
    socket.on('get_channel_info', (channelCode) => {
      try {
        const participants = channelManager.getChannelParticipants(channelCode);
        socket.emit('channel_info', { 
          participants, 
          totalCount: participants.length 
        });
      } catch (error) {
        console.error('Error getting channel info:', error);
        socket.emit('error', 'Failed to get channel info');
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        if (socket.channelCode && socket.userId && socket.username) {
          // Use graceful disconnect handling instead of immediate removal
          channelManager.handleDisconnect(socket.channelCode, socket.userId, socket.username);
          
          // Note: Don't emit user_left immediately - wait for grace period
          // The cleanup will handle permanent disconnections after the grace period
        }
        console.log(`Socket disconnected: ${socket.id}`);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });

  console.log('Socket.IO server started successfully');
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

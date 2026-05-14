# Socket.IO Real-time Chat System

This project implements a robust real-time chat system using Socket.IO with Next.js.

## Features

- ✅ **Real-time messaging** between multiple clients
- ✅ **Channel-based communication** with 6-character channel codes
- ✅ **User presence** - see who's online in your channel
- ✅ **Typing indicators** - see when others are typing
- ✅ **Message history** - get recent messages when joining a channel
- ✅ **Auto-cleanup** - channels automatically expire after 24 hours of inactivity
- ✅ **Responsive design** - works on desktop and mobile
- ✅ **Error handling** - robust error handling and reconnection
- ✅ **TypeScript** - fully typed for better development experience

## Architecture

### Backend Components

1. **Socket.IO Server** (`pages/api/socket.ts`)
   - Handles WebSocket connections
   - Manages channel joining/leaving
   - Broadcasts messages to channel participants
   - Handles typing indicators

2. **Channel Manager** (`lib/channelManager.ts`)
   - In-memory channel management
   - User presence tracking
   - Message history (last 100 messages per channel)
   - Automatic cleanup of inactive channels

3. **Type Definitions** (`lib/socket.ts`)
   - TypeScript interfaces for Socket.IO events
   - Message and channel data types

### Frontend Components

1. **useSocket Hook** (`hooks/useSocket.ts`)
   - React hook for Socket.IO client connection
   - State management for messages, participants, typing indicators
   - Event handlers for all socket events

2. **ChatInterface** (`components/chat/ChatInterface.tsx`)
   - Main chat component
   - Integrates all chat functionality
   - Responsive layout with participants sidebar

3. **ChannelJoin** (`components/chat/ChannelJoin.tsx`)
   - Channel joining interface
   - Username and channel code input
   - Random channel code generation

4. **MessageComponents**
   - `MessageList.tsx` - Displays message history
   - `MessageBubble.tsx` - Individual message component
   - `MessageInput.tsx` - Message input with typing indicators

5. **ParticipantsList** (`components/chat/ParticipantsList.tsx`)
   - Shows online participants
   - Real-time typing indicators
   - User presence status

## Usage

### Starting the Server

```bash
pnpm dev
```

The server runs on `http://localhost:3000` with Socket.IO on path `/api/socket`.

### Joining a Chat

1. Navigate to `/chat`
2. Enter your username
3. Enter a 6-character channel code or generate a random one
4. Click "Join Channel"
5. Share the channel code with others to invite them

### Features in Action

- **Send Messages**: Type and press Enter
- **Typing Indicators**: Start typing to show others you're typing
- **Copy Channel Code**: Click the copy icon next to the channel code
- **View Participants**: See who's online in the right sidebar
- **Leave Channel**: Click "Leave Channel" to exit

## Scaling Considerations

### Current Implementation
- In-memory storage (suitable for single server)
- Automatic cleanup of inactive channels
- Maximum 1000 concurrent channels

### For Production Scaling
1. **Redis Adapter**: Use Socket.IO Redis adapter for multi-server scaling
2. **Database Storage**: Persist messages and channels in PostgreSQL/MongoDB
3. **Load Balancing**: Use sticky sessions for WebSocket connections
4. **Rate Limiting**: Implement rate limiting for message sending

### Environment Variables

```env
# Required for production CORS
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional Redis for scaling
REDIS_URL=redis://localhost:6379

# Optional database for persistence
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

## Security Features

- **Input Validation**: Message length limits (1000 characters)
- **XSS Protection**: React automatically escapes content
- **CORS Configuration**: Proper CORS setup for production
- **Rate Limiting**: Built-in Socket.IO rate limiting
- **Channel Isolation**: Users can only see messages from their channel

## API Endpoints

- `GET /api/stats` - Get channel statistics
- `POST /api/socket` - Initialize Socket.IO server

## Socket.IO Events

### Client → Server
- `join_channel` - Join a channel
- `leave_channel` - Leave current channel  
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `get_channel_info` - Get channel participants

### Server → Client
- `message` - Receive a new message
- `user_joined` - User joined the channel
- `user_left` - User left the channel
- `typing_start` - Someone started typing
- `typing_stop` - Someone stopped typing
- `channel_info` - Channel participant information
- `error` - Error messages

## Performance Optimizations

- **Message Limiting**: Only keep last 100 messages per channel
- **Auto-cleanup**: Remove inactive channels after 24 hours
- **Efficient Re-renders**: Optimized React components
- **Connection Management**: Automatic reconnection handling
- **Memory Management**: Cleanup on disconnect

## Development

### Project Structure
```
├── components/chat/          # React chat components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
├── pages/api/               # Next.js API routes
└── types/                   # TypeScript definitions
```

### Adding Features

1. **Message Types**: Extend `ChatMessage` interface
2. **New Events**: Add to Socket.IO event interfaces
3. **UI Components**: Create new components in `components/chat/`
4. **State Management**: Extend `useSocket` hook

This implementation provides a solid foundation for a production-ready real-time chat system with room for expansion and scaling.

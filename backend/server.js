const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const chatController = require('./controllers/chatController');
const eventController = require('./controllers/eventController');
const rateLimiter = require('./middleware/rateLimiter');
const botFilter = require('./middleware/botFilter');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for Vercel deployment
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/events', eventController.getEvents);
app.post('/api/events', eventController.createEvent);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join room event
  socket.on('joinRoom', (payload) => {
    try {
      const { eventId } = payload;
      chatController.joinRoom(socket, eventId);
      console.log(`User ${socket.id} joined room: ${eventId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', 'Failed to join room');
    }
  });
  
  // Send message event with middleware
  socket.on('message', async (payload) => {
    try {
      // Apply rate limiting
      const clientIp = socket.handshake.address;
      if (!rateLimiter.checkRate(clientIp)) {
        socket.emit('error', 'Rate limit exceeded');
        return;
      }
      
      // Apply bot filtering
      const filteredPayload = botFilter.filterMessage(payload);
      if (!filteredPayload) {
        socket.emit('error', 'Message blocked by filters');
        return;
      }
      
      // Send message
      chatController.sendMessage(socket, filteredPayload, io);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });
  
  // Typing events
  socket.on('typing', (data) => {
    socket.to(data.eventId).emit('typing', {
      userId: socket.id,
      username: data.username,
      isTyping: data.isTyping
    });
  });
  
  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };

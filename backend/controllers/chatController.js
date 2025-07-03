const RingBuffer = require('../utils/ringbuffer');

// In-memory storage for different events
const eventBuffers = new Map();

// Get or create buffer for an event
function getEventBuffer(eventId) {
  if (!eventBuffers.has(eventId)) {
    eventBuffers.set(eventId, new RingBuffer(100)); // Keep last 100 messages
  }
  return eventBuffers.get(eventId);
}

// Join room handler
function joinRoom(socket, eventId) {
  if (!eventId) {
    throw new Error('Event ID is required');
  }
  
  // Join the socket room
  socket.join(eventId);
  
  // Get message history
  const buffer = getEventBuffer(eventId);
  const history = buffer.getAll();
  
  // Send history to the client
  socket.emit('history', history);
  
  // Notify others that user joined
  socket.to(eventId).emit('userJoined', {
    userId: socket.id,
    timestamp: new Date().toISOString()
  });
}

// Send message handler
function sendMessage(socket, payload, io) {
  const { eventId, text, username } = payload;
  
  if (!eventId || !text || !username) {
    throw new Error('Missing required fields: eventId, text, username');
  }
  
  // Create message object
  const message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: socket.id,
    username: username.trim(),
    text: text.trim(),
    timestamp: new Date().toISOString(),
    eventId
  };
  
  // Store in buffer
  const buffer = getEventBuffer(eventId);
  buffer.push(message);
  
  // Broadcast to all clients in the room
  io.to(eventId).emit('message', message);
  
  console.log(`Message sent in ${eventId}: ${username} - ${text}`);
}

module.exports = {
  joinRoom,
  sendMessage,
  getEventBuffer
};
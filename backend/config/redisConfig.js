const redis = require('redis');

let client = null;

// Optional Redis configuration for future scaling
async function createRedisClient() {
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    console.log('Redis not configured - using in-memory storage');
    return null;
  }
  
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableOfflineQueue: false,
    });
    
    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    
    client.on('connect', () => {
      console.log('Redis connected successfully');
    });
    
    client.on('ready', () => {
      console.log('Redis client ready');
    });
    
    client.on('end', () => {
      console.log('Redis connection ended');
    });
    
    await client.connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
}

// Initialize Redis client
createRedisClient().then(redisClient => {
  client = redisClient;
});

// Helper functions for Redis operations
async function storeMessage(eventId, message) {
  if (!client) return;
  
  try {
    // Store message in Redis list
    await client.lpush(`event:${eventId}:messages`, JSON.stringify(message));
    
    // Keep only last 100 messages
    await client.ltrim(`event:${eventId}:messages`, 0, 99);
  } catch (error) {
    console.error('Error storing message in Redis:', error);
  }
}

async function getMessageHistory(eventId, limit = 50) {
  if (!client) return [];
  
  try {
    const messages = await client.lrange(`event:${eventId}:messages`, 0, limit - 1);
    return messages.map(msg => JSON.parse(msg)).reverse();
  } catch (error) {
    console.error('Error getting message history from Redis:', error);
    return [];
  }
}

module.exports = {
  client,
  storeMessage,
  getMessageHistory
};
// Simple sliding window rate limiter
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map(); // IP -> array of timestamps
  }
  
  checkRate(ip) {
    const now = Date.now();
    const userRequests = this.requests.get(ip) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => 
      now - timestamp < this.windowMs
    );
    
    // Check if under limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(ip, validRequests);
    
    return true;
  }
  
  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [ip, timestamps] of this.requests.entries()) {
      const validRequests = timestamps.filter(timestamp => 
        now - timestamp < this.windowMs
      );
      
      if (validRequests.length === 0) {
        this.requests.delete(ip);
      } else {
        this.requests.set(ip, validRequests);
      }
    }
  }
}

// Create global rate limiter instance
const rateLimiter = new RateLimiter(15, 60000); // 15 messages per minute

// Clean up every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

module.exports = rateLimiter;
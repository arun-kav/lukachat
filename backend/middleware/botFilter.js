// Bot filtering patterns
const SPAM_PATTERNS = [
  /(.)\1{10,}/gi, // Repeated characters (more than 10)
  /https?:\/\/[^\s]+/gi, // URLs (basic detection)
  /\b(?:buy|sell|cheap|discount|offer|deal)\b.*\b(?:now|today|limited)\b/gi, // Spam keywords
  /(.{1,10})\1{5,}/gi, // Repeated short patterns
  /[A-Z]{20,}/g, // Excessive caps
];

const BLOCKED_WORDS = [
  // Add specific blocked words here
  'spam',
  'scam',
];

class BotFilter {
  filterMessage(payload) {
    if (!payload || !payload.text) {
      return null;
    }
    
    let { text, user, eventId } = payload;
    let username = user ? user.username : ''; // Extract username from user object
    
    // Basic validation
    if (!text.trim() || !username.trim() || !eventId) {
      return null;
    }
    
    // Length limits
    if (text.length > 500) {
      text = text.substring(0, 500) + '...';
    }
    
    if (username.length > 50) {
      username = username.substring(0, 50);
    }
    
    // Check for spam patterns
    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(text)) {
        console.log(`Blocked spam pattern: ${pattern}`);
        return null;
      }
    }
    
    // Check for blocked words
    const lowerText = text.toLowerCase();
    for (const word of BLOCKED_WORDS) {
      if (lowerText.includes(word.toLowerCase())) {
        console.log(`Blocked word: ${word}`);
        return null;
      }
    }
    
    // Sanitize HTML
    text = this.sanitizeHtml(text);
    username = this.sanitizeHtml(username);
    
    return {
      text,
      username,
      eventId
    };
  }
  
  sanitizeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

module.exports = new BotFilter();

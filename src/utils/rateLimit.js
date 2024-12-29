class RateLimit {
  constructor() {
    this.userTimers = new Map();
    this.spamCounts = new Map();
    this.lastResetTime = new Map();
    this.lastNotifiedDuration = new Map(); // Track last notified duration
    this.ignoreUsers = new Set(); // Users to completely ignore
    
    // Clean up expired entries every hour
    setInterval(() => this.cleanup(), 3600000);
  }

  getRateLimitInfo(userId) {
    const now = Date.now();
    if (this.userTimers.has(userId)) {
      const timeLeft = this.userTimers.get(userId) - now;
      if (timeLeft > 0) {
        const minutes = Math.ceil(timeLeft / 60000);
        const spamCount = this.spamCounts.get(userId) || 0;
        const lastNotified = this.lastNotifiedDuration.get(userId) || 0;
        
        // Only notify if duration increased
        const shouldNotify = lastNotified < minutes && !this.ignoreUsers.has(userId);
        
        return {
          isLimited: true,
          timeLeft: minutes,
          nextBanDuration: Math.min(5, Math.ceil((5000 * Math.pow(2, spamCount + 1)) / 60000)),
          shouldNotify
        };
      }
    }
    return { isLimited: false };
  }

  isRateLimited(userId) {
    const now = Date.now();
    
    // Immediately return true if user should be ignored
    if (this.ignoreUsers.has(userId)) {
      return true;
    }
    
    // Reset spam count if 24 hours have passed
    if (this.lastResetTime.has(userId)) {
      const timeSinceReset = now - this.lastResetTime.get(userId);
      if (timeSinceReset >= 86400000) {
        this.spamCounts.delete(userId);
        this.lastResetTime.delete(userId);
        this.lastNotifiedDuration.delete(userId);
        this.ignoreUsers.delete(userId);
      }
    }

    // Check if user is currently rate limited
    if (this.userTimers.has(userId)) {
      const timeLeft = this.userTimers.get(userId) - now;
      if (timeLeft > 0) {
        // Increase spam count and cooldown if user keeps trying
        const spamCount = (this.spamCounts.get(userId) || 0) + 1;
        this.spamCounts.set(userId, spamCount);
        
        // Completely ignore user after excessive spam (e.g., after 5 attempts)
        if (spamCount > 5) {
          this.ignoreUsers.add(userId);
          return true;
        }
        
        // Exponentially increase cooldown
        const newCooldown = Math.min(300000, 5000 * Math.pow(2, spamCount)); // Max 5 minutes
        this.userTimers.set(userId, now + newCooldown);
        
        return true;
      }
    }

    // Set initial cooldown (3 seconds)
    this.userTimers.set(userId, now + 3000);
    if (!this.lastResetTime.has(userId)) {
      this.lastResetTime.set(userId, now);
    }
    
    return false;
  }

  cleanup() {
    const now = Date.now();
    for (const [userId, expiry] of this.userTimers.entries()) {
      if (expiry <= now) {
        this.userTimers.delete(userId);
      }
    }
  }
}

module.exports = new RateLimit();
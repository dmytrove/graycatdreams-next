/**
 * Simple in-memory rate limiter for API routes
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimit {
  private cache = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;
  
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    this.windowMs = windowMs; // 15 minutes default
    this.maxRequests = maxRequests; // 100 requests default
    
    // Clean up expired records every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
  
  async check(identifier: string): Promise<{
    success: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const record = this.cache.get(identifier);
    
    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      const newRecord: RateLimitRecord = {
        count: 1,
        resetTime: now + this.windowMs
      };
      this.cache.set(identifier, newRecord);
      
      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetTime: newRecord.resetTime
      };
    }
    
    // Increment existing record
    record.count += 1;
    this.cache.set(identifier, record);
    
    const success = record.count <= this.maxRequests;
    const remaining = Math.max(0, this.maxRequests - record.count);
    
    return {
      success,
      remaining,
      resetTime: record.resetTime
    };
  }
  
  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.cache.entries()) {
      if (now > record.resetTime) {
        this.cache.delete(key);
      }
    }
  }
  
  // Get current status without incrementing
  getStatus(identifier: string) {
    const record = this.cache.get(identifier);
    const now = Date.now();
    
    if (!record || now > record.resetTime) {
      return {
        count: 0,
        remaining: this.maxRequests,
        resetTime: now + this.windowMs
      };
    }
    
    return {
      count: record.count,
      remaining: Math.max(0, this.maxRequests - record.count),
      resetTime: record.resetTime
    };
  }
}

// Different rate limits for different endpoints
export const uploadRateLimit = new RateLimit(15 * 60 * 1000, 20); // 20 uploads per 15 min
export const apiRateLimit = new RateLimit(15 * 60 * 1000, 100); // 100 requests per 15 min
export const deleteRateLimit = new RateLimit(15 * 60 * 1000, 10); // 10 deletes per 15 min

export { RateLimit };

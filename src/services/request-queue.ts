/**
 * Enhanced request queue for handling rate limiting and concurrent requests
 */
export class EnhancedRequestQueue {
  private queue: Array<{ 
    execute: () => Promise<unknown>; 
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];
  private processing = false;
  private activeRequests = 0;
  private readonly maxConcurrent: number;
  private readonly minInterval: number;
  private lastRequestTime = 0;

  constructor(maxConcurrent = 3, minInterval = 100) {
    this.maxConcurrent = maxConcurrent;
    this.minInterval = minInterval;
  }

  /**
   * Add a request to the queue
   */
  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        execute: requestFn,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.process();
    });
  }

  /**
   * Process the queue
   */
  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minInterval) {
        const delay = this.minInterval - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const request = this.queue.shift();
      if (!request) continue;

      this.activeRequests++;
      this.lastRequestTime = Date.now();

      request.execute()
        .then(result => {
          request.resolve(result);
        })
        .catch(error => {
          request.reject(error);
        })
        .finally(() => {
          this.activeRequests--;
          // Process next request after completion
          if (this.queue.length > 0) {
            setTimeout(() => this.process(), 0);
          }
        });
    }

    this.processing = false;
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests,
      isProcessing: this.processing,
    };
  }

  /**
   * Clear the queue
   */
  clear() {
    this.queue.forEach(request => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
}

// Create a singleton instance
export const requestQueue = new EnhancedRequestQueue(); 
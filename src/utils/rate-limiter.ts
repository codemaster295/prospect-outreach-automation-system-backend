export class RateLimiter {
  private requestsPerSecond: number;
  private requests: Map<string, number>;

  constructor(requestsPerSecond: number = 1) {
    this.requestsPerSecond = requestsPerSecond;
    this.requests = new Map<string, number>();
  }

  async waitIfNeeded(domain: string): Promise<void> {
    const now = Date.now();
    const lastRequest = this.requests.get(domain) || 0;
    const timeSinceLastRequest = now - lastRequest;
    const minInterval = 1000 / this.requestsPerSecond;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    this.requests.set(domain, Date.now());
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

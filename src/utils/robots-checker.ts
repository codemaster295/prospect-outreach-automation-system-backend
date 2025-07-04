
import robotsParser from 'robots-parser';

interface RobotsLike {
   isAllowed: (url: string, userAgent?: string) => boolean | undefined;
}

export class RobotsChecker {
  private robotsCache: Map<string, RobotsLike>;

  constructor() {
    this.robotsCache = new Map();
  }

  async canFetch(url: string, userAgent: string = '*'): Promise<boolean> {
    try {
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      const robotsUrl = `${baseUrl}/robots.txt`;


      if (!this.robotsCache.has(baseUrl)) {
        try {
          const response = await fetch(robotsUrl);
          const robotsTxt = response.ok ? await response.text() : '';
          const robots = robotsParser(robotsUrl, robotsTxt);
          this.robotsCache.set(baseUrl, robots);
        } catch {
          // If robots.txt can't be fetched, assume it's allowed
          this.robotsCache.set(baseUrl, {
            isAllowed: () => true
          });
        }
      }

      const robots = this.robotsCache.get(baseUrl);
      return robots?.isAllowed(url, userAgent) ?? true;
    } catch {
      return true; // Default to allowed if there's an error
    }
  }
}

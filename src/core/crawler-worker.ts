import { Browser, chromium, Page, BrowserContext } from 'playwright';
import { PageProcessor } from './page-processor';
import { RateLimiter } from '@/utils/rate-limiter';
import { RobotsChecker } from '@/utils/robots-checker';
import { logger } from '../utils/logger';
import { config } from '../config';
import type { PageData } from './page-processor';
interface CrawlJob {
  data: {
    url: string;
    depth?: number;
    maxDepth?: number;
  };
}

// interface PageData {
//   url: string;
//   title: string;
//   body: string;
//   links: string[];
// images: string[];
//   timestamp: string;
// }

interface CrawlResult {
  success: boolean;
  reason?: string;
  data?: PageData;
  newUrls?: string[];
  error?: string;
}


export class CrawlerWorker {
  private workerId: string;
  private browser: Browser | null = null;
  private rateLimiter: RateLimiter;
  private robotsChecker: RobotsChecker;
  private pageProcessor: PageProcessor;
  private isRunning: boolean = false;
  private allowedDomains: Set<string>;

  constructor(workerId: string, allowedDomains: Set<string> = new Set()) {
    this.workerId = workerId;
    this.allowedDomains = allowedDomains;
    this.rateLimiter = new RateLimiter(1);
    this.robotsChecker = new RobotsChecker();
    this.pageProcessor = new PageProcessor(config);
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
        ],
      });

      this.isRunning = true;
      logger.info(`🚀 Worker ${this.workerId} initialized`);
    } catch (error: any) {
      logger.error(`❌ Failed to initialize worker ${this.workerId}:`, error);
      throw error;
    }
  }

  private isAllowedDomain(url: string): boolean {
    try {
      const domain = new URL(url).hostname;
      return this.allowedDomains.has(domain);
    } catch {
      return false;
    }
  }

  async crawlPage(job: CrawlJob): Promise<CrawlResult> {
    const { url, depth = 0, maxDepth = 2 } = job.data;

    if (depth > maxDepth) {
      logger.info(`📏 Max depth ${maxDepth} reached for ${url}`);
      return { success: true, reason: 'max_depth_reached' };
    }

    if (!this.isAllowedDomain(url)) {
      logger.info(`🚫 Worker ${this.workerId}: Skipping URL from disallowed domain: ${url}`);
      return { success: false, reason: 'disallowed_domain' };
    }

    if (!this.browser || !this.browser.isConnected?.()) {
      logger.warn(`🔌 Worker ${this.workerId} browser is closed, skipping job: ${url}`);
      return { success: false, reason: 'browser_closed' };
    }

    try {
      const canFetch = await this.robotsChecker.canFetch(url, config.crawler.userAgent);
      if (!canFetch) {
        logger.info(`🤖 Blocked by robots.txt: ${url}`);
        return { success: false, reason: 'blocked_by_robots' };
      }

      const domain = new URL(url).hostname;
      await this.rateLimiter.waitIfNeeded(domain);

      let context: BrowserContext;

      try {
        context = await this.browser.newContext({
          userAgent: config.crawler.userAgent,
          extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          },
        });
      } catch (err: any) {
        logger.error(`❌ Failed to create browser context for ${url}: ${err.message}`);
        return { success: false, reason: 'context_creation_failed' };
      }

      const page: Page = await context.newPage();

      try {
        logger.info(`🌐 Worker ${this.workerId}: Crawling ${url} (depth: ${depth})`);

        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: config.crawler.timeout,
        });

        if (!response || !response.ok()) {
          throw new Error(`HTTP ${response?.status()} for ${url}`);
        }

        const pageData = await this.pageProcessor.processPage(page, url, this.browser);
        await this.pageProcessor.savePageData(pageData);

        const allowedLinks = pageData.links.filter((link) => this.isAllowedDomain(link));

        logger.info(`✅ Worker ${this.workerId}: Successfully crawled ${url}`);
        logger.info(`🔗 Found ${pageData.links.length} total links, ${allowedLinks.length} from allowed domains`);

        this.printPageSummary(pageData);

        return {
          success: true,
          data: pageData,
          newUrls: allowedLinks.slice(0, 50),
        };
      } finally {
        await page.close();
        await context.close();
      }
    } catch (error: any) {
      logger.error(`❌ Worker ${this.workerId}: Error crawling ${url}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  private printPageSummary(pageData: PageData): void {
    const summary = {
      url: pageData.url,
      title: pageData.title,
      contentLength: pageData.body?.length || 0,
      linksFound: pageData.links?.length || 0,
      imagesFound: pageData.images?.length || 0,
      timestamp: pageData.timestamp,
    };

    logger.info(`📄 Page Summary:`, summary);

    if (pageData.body && pageData.body.length > 0) {
      const preview = pageData.body.substring(0, 200).replace(/\n/g, ' ');
      logger.info(`📝 Content Preview: ${preview}${pageData.body.length > 200 ? '...' : ''}`);
    }
  }

  async shutdown(): Promise<void> {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.browser) {
      try {
        await this.browser.close();
        logger.info(`🔻 Worker ${this.workerId} shut down`);
      } catch (err: any) {
        logger.warn(`⚠️ Error closing browser for worker ${this.workerId}:`, err.message);
      }
      this.browser = null;
    }
  }
}

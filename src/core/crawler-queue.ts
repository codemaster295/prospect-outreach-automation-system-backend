import Queue, { JobOptions } from 'bull';
import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import { logger } from '../utils/logger';
import { UrlUtils } from '@/utils/url-utils';
import fs from 'fs/promises';

interface CrawlerOptions {
  depth?: number;
  maxDepth?: number;
  priority?: number;
  delay?: number;
  force?: boolean;
}

export class CrawlerQueue {
  private redisClient!: RedisClientType;
public crawlQueue!: Queue.Queue<any>;
  private visitedUrls: Set<string> = new Set();
  private queuedUrls: Set<string> = new Set();
  private domainStats: Map<string, number> = new Map();
  private allowedDomains: Set<string> = new Set();
 public processAssigned: boolean = false;
  async initialize(): Promise<void> {
    try {
      this.redisClient = createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port,
        },
        password: config.redis.password,
      });

      this.redisClient.on('error', (err) => logger.error('Redis Client Error', err));
      await this.redisClient.connect();

      this.crawlQueue = new Queue('web crawler', {
        redis: {
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      });

      await this.loadVisitedUrls();

      const queuedUrls = await this.redisClient.sMembers('queued_urls');
      this.queuedUrls = new Set(queuedUrls);

      logger.info('Crawler queue initialized');
    } catch (error) {
      logger.error('Failed to initialize crawler queue:', error);
      throw error;
    }
  }

  setAllowedDomains(startUrls: string[]): void {
    this.allowedDomains.clear();
    for (const url of startUrls) {
      try {
        const domain = new URL(url).hostname;
        this.allowedDomains.add(domain);
        logger.info(`✅ Added allowed domain: ${domain}`);
      } catch {
        logger.warn(`⚠️ Invalid start URL: ${url}`);
      }
    }
    logger.info(`🔒 Crawling restricted to domains: ${Array.from(this.allowedDomains).join(', ')}`);
  }

  isAllowedDomain(url: string): boolean {
    try {
      const domain = new URL(url).hostname;
      return this.allowedDomains.has(domain);
    } catch {
      return false;
    }
  }

  async addUrls(urls: string[], options: CrawlerOptions = {}): Promise<{ url: string; added: boolean }[]> {
    const results = [];
    for (const url of urls) {
      const added = await this.addUrl(url, options);
      results.push({ url, added });
    }
    logger.info(`📝 Processed ${urls.length} URLs, added ${results.filter((r) => r.added).length}`);
    return results;
  }

  async addUrl(url: string, options: CrawlerOptions = {}): Promise<boolean> {
    const normalizedUrl = UrlUtils.normalizeUrl(url);
    if (!normalizedUrl) {
      logger.debug(`❌ Invalid URL: ${url}`);
      return false;
    }

    if (!this.isAllowedDomain(normalizedUrl)) {
      logger.debug(`🚫 Skipping URL from disallowed domain: ${normalizedUrl}`);
      return false;
    }

    const [isVisited, isQueued] = await Promise.all([
      this.redisClient.sIsMember('visited_urls', normalizedUrl),
      this.redisClient.sIsMember('queued_urls', normalizedUrl),
    ]);

    if (!options.force && (isVisited || isQueued)) {
      logger.debug(`⏩ URL already processed/queued: ${normalizedUrl}`);
      return false;
    }

    const domain = new URL(normalizedUrl).hostname;
    const domainCount = this.domainStats.get(domain) || 0;

    if (!options.force && domainCount >= config.crawler.maxPagesPerDomain) {
      logger.info(`⚠️ Domain limit reached for ${domain} (${domainCount}/${config.crawler.maxPagesPerDomain})`);
      return false;
    }

    const jobOptions: JobOptions = {
      priority: options.priority || 0,
      delay: options.delay || 0,
    };

    await this.crawlQueue.add(
      'crawl',
      {
        url: normalizedUrl,
        depth: options.depth || 0,
        maxDepth: options.maxDepth || 2,
        timestamp: Date.now(),
      },
      jobOptions
    );

    await this.redisClient.sAdd('queued_urls', normalizedUrl);
    this.queuedUrls.add(normalizedUrl);

    logger.info(`➕ Added to queue: ${normalizedUrl} (depth: ${options.depth || 0})`);
    return true;
  }

  private async loadVisitedUrls(): Promise<void> {
    try {
      const urls = await this.redisClient.sMembers('visited_urls');
      this.visitedUrls = new Set(urls);

      for (const url of urls) {
        try {
          const domain = new URL(url).hostname;
          const count = this.domainStats.get(domain) || 0;
          this.domainStats.set(domain, count + 1);
        } catch {}
      }

      logger.info(`📚 Loaded ${urls.length} visited URLs from previous sessions`);
    } catch (error) {
      logger.error('Error loading visited URLs:', error);
    }
  }

  async markAsVisited(url: string): Promise<void> {
    const normalized = UrlUtils.normalizeUrl(url);
    if (!normalized) {
      logger.warn(`markAsVisited skipped invalid URL: ${url}`);
      return;
    }

    this.visitedUrls.add(normalized);
    this.queuedUrls.delete(normalized);

    await Promise.all([
      this.redisClient.sAdd('visited_urls', normalized),
      this.redisClient.sRem('queued_urls', normalized),
    ]);

    const domain = new URL(normalized).hostname;
    const domainCount = this.domainStats.get(domain) || 0;
    this.domainStats.set(domain, domainCount + 1);

    logger.info(`✅ Marked as visited: ${normalized} (${domain}: ${domainCount + 1} pages)`);
  }

  async saveVisitedUrlsToFile(filePath = './visited_urls.json'): Promise<void> {
    try {
      const urls = Array.from(this.visitedUrls);
      await fs.writeFile(filePath, JSON.stringify(urls, null, 2));
      logger.info(`💾 Saved ${urls.length} visited URLs to ${filePath}`);
    } catch (err) {
      logger.error('Error saving visited URLs file:', err);
    }
  }

  async getStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    visited: number;
    domains: number;
    allowedDomains: string[];
    domainStats: Record<string, number>;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.crawlQueue.getJobs(['waiting']),
      this.crawlQueue.getJobs(['active']),
      this.crawlQueue.getJobs(['completed']),
      this.crawlQueue.getJobs(['failed']),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      visited: this.visitedUrls.size,
      domains: this.domainStats.size,
      allowedDomains: Array.from(this.allowedDomains),
      domainStats: Object.fromEntries(this.domainStats),
    };
  }

  async shutdown(): Promise<void> {
    await this.saveVisitedUrlsToFile();
    if (this.crawlQueue) {
      await this.crawlQueue.close();
    }
    if (this.redisClient) {
      await this.redisClient.disconnect();
    }
    logger.info('🔻 Crawler queue shut down');
  }

  async clearRedisState(): Promise<void> {
    try {
      await this.redisClient.del('visited_urls');
      await this.redisClient.del('queued_urls');

      this.visitedUrls.clear();
      this.queuedUrls.clear();
      this.domainStats.clear();

      logger.info('🧹 Cleared Redis and in-memory state: visited_urls, queued_urls, domainStats');
    } catch (error) {
      logger.error('Error clearing Redis state:', error);
    }
  }
}

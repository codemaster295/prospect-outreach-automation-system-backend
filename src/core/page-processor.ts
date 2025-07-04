import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { UrlUtils } from '@/utils/url-utils';
import { logger } from '../utils/logger';
import TurndownService from 'turndown';
import { gfm } from 'joplin-turndown-plugin-gfm';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import crypto from 'crypto';
import { Page, Browser } from 'playwright';

interface Config {
  screenshots: boolean;
  storage: {
    screenshotsDir: string;
    outputDir: string;
  };
}

interface Link {
  href: string;
  text: string;
  title: string;
}


interface Metadata {
  description: string;
  keywords: string;
  author: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
}

interface PerformanceMetrics {
  loadTime?: number;
  domContentLoaded?: number;
  responseTime?: number;
}

export interface PageData {
  url: string;
  timestamp: string;
  title: string;
  body: string;
  links: string[];
 images: {
    src: string;
    alt: string;
    title: string;
  }[];
  metadata: Metadata;
  performance: PerformanceMetrics;
  screenshot: string | null;
}

export class PageProcessor {
  private config: Config;
  private turndownService: TurndownService;

  constructor(config: Config) {
    this.config = config;

    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    this.turndownService.use(gfm);
  }

  async processPage(page: Page, url: string, browser: Browser): Promise<PageData> {
    const data: PageData = {
      url,
      timestamp: new Date().toISOString(),
      title: '',
      body: '',
      links: [],
      images: [],
      metadata: {
        description: '',
        keywords: '',
        author: '',
        canonical: '',
        ogTitle: '',
        ogDescription: '',
      },
      performance: {},
      screenshot: null,
    };

    try {
      await page.waitForLoadState('domcontentloaded');
      data.title = await page.title();
      const content = await page.content();

      const dom = new JSDOM(content, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (article?.content) {
        const cleanHtml = article.content.replace(/<img[^>]*>/g, '');
        data.body = this.turndownService.turndown(cleanHtml);
      } else {
        const $ = cheerio.load(content);
        $('script, style, astro-island, astro-slot, astro-static-slot, template, img').remove();
        const htmlBody = $('body').html() || '';
        data.body = this.turndownService.turndown(htmlBody);
      }

      // Metadata
      const $ = cheerio.load(content);
      data.metadata = {
        description: $('meta[name="description"]').attr('content') || '',
        keywords: $('meta[name="keywords"]').attr('content') || '',
        author: $('meta[name="author"]').attr('content') || '',
        canonical: $('link[rel="canonical"]').attr('href') || '',
        ogTitle: $('meta[property="og:title"]').attr('content') || '',
        ogDescription: $('meta[property="og:description"]').attr('content') || '',
      };

      // Links
      const links = await page.$$eval('a[href]', (anchors) =>
        anchors.map((a) => ({
          href: (a as HTMLAnchorElement).href,
          text: (a as HTMLAnchorElement).textContent?.trim() || '',
          title: (a as HTMLAnchorElement).title,
        }))
      );

      data.links = links
        .map((link: Link) => UrlUtils.normalizeUrl(link.href, url))
        .filter((href) => href && UrlUtils.isValidUrl(href) && !UrlUtils.shouldSkipUrl(href)) as string[];

      // Images
      data.images = await page.$$eval('img[src]', (images) =>
        images.map((img) => ({
          src: (img as HTMLImageElement).src,
          alt: (img as HTMLImageElement).alt,
          title: (img as HTMLImageElement).title,
        }))
      );

      // Performance
      const performanceEntries: PerformanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        return navigation
          ? {
              loadTime: navigation.loadEventEnd - navigation.loadEventStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              responseTime: navigation.responseEnd - navigation.requestStart,
            }
          : {};
      });

      data.performance = performanceEntries;

      // Screenshot
      if (this.config.screenshots) {
        const screenshotPath = await this.takeScreenshot(page, url);
        data.screenshot = screenshotPath;
      }

      return data;
    } catch (error: any) {
      logger.error(`Error processing page ${url}:`, error);
      throw error;
    }
  }

  async takeScreenshot(page: Page, url: string): Promise<string | null> {
    try {
      const urlObj = new URL(url);
      const filename = `${urlObj.hostname}_${Date.now()}.png`;
      const screenshotPath = path.join(this.config.storage.screenshotsDir, filename);

      await fs.mkdir(this.config.storage.screenshotsDir, { recursive: true });
      await page.screenshot({ path: screenshotPath, fullPage: true });

      return screenshotPath;
    } catch (error: any) {
      logger.error(`Error taking screenshot for ${url}:`, error);
      return null;
    }
  }

  async savePageData(data: PageData): Promise<string | null> {
    // Optional stub
    return null;
  }
}

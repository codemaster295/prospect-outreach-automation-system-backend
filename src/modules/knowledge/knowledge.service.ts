
import { DB } from '@database/index';
import { chromium } from 'playwright';
import { PageProcessor } from '@/core/page-processor';
import { logger } from '@/utils/logger';

const Knowledge = DB.Knowledge;


export const crawlAndStoreKnowledge = async (
  urls: string[],
  campaign_id: string,
  contact_id: string
): Promise<string[]> => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();


  const processor = new PageProcessor({
    screenshots: false,
    storage: {
      screenshotsDir: './screenshots',
      outputDir: './scraped',
    },
    
  });

  const savedUrls: string[] = [];
  for (const url of urls) {
    try {
      logger.info(`🌐 Crawling: ${url}`);

      await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
      const data = await processor.processPage(page, url, browser);

      if (data.title && data.body) {
        await Knowledge.create({
          page: data.url,
          title: data.title,
          body: data.body,
          campaign_id,
          contact_id,
        });

        savedUrls.push(data.url);
        logger.info(`✅ Saved: ${data.url}`);
      } else {
        logger.warn(`⚠️ Skipped empty content: ${url}`);
      }
    } catch (err: any) {
      logger.warn(`⚠️ Error processing ${url}: ${err.message}`);
    }
  }

  await browser.close();
  return savedUrls;
};

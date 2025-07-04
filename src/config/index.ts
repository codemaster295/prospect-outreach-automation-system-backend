import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = parseInt(value || '');
  return isNaN(parsed) ? fallback : parsed;
};

export const config = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: toNumber(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  crawler: {
    concurrentWorkers: toNumber(process.env.CONCURRENT_WORKERS, 5),
    maxPagesPerDomain: toNumber(process.env.MAX_PAGES_PER_DOMAIN, 1000),
    requestDelay: toNumber(process.env.REQUEST_DELAY, 1000),
    timeout: toNumber(process.env.TIMEOUT, 30000),
    userAgent:
      process.env.USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    outputDir: './output',
  },
  storage: {
    outputDir: './output',
    screenshotsDir: './screenshots',
  },
   screenshots: process.env.ENABLE_SCREENSHOTS === 'true',
  app: {
    port: toNumber(process.env.PORT, 5050),
    nodeEnv: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:5050',
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || '',
  },
  database: {
    port: toNumber(process.env.DB_PORT, 5432),
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    database: process.env.DB_DATABASE || '',
  },
};

// Optional: Destructure for convenience
export const {
  app: { port: PORT, nodeEnv: NODE_ENV, baseUrl: BASE_URL, jwtRefreshTokenSecret: JWT_REFRESH_TOKEN_SECRET },
  database: {
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    name: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
    database: DB_DATABASE,
  },
} = config;

// import { config } from 'dotenv';

// config();

// export const { PORT, NODE_ENV, BASE_URL, JWT_REFRESH_TOKEN_SECRET } =
//     process.env;

// export const {
//     DB_PORT,
//     DB_USERNAME,
//     DB_PASSWORD,
//     DB_NAME,
//     DB_HOST,
//     DB_DIALECT,
//     DB_DATABASE,
// } = process.env;

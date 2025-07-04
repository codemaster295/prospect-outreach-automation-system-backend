// import winston from 'winston';
// import 'winston-daily-rotate-file';
// import path from 'path';

// // Folder paths for logs
// const logDir = path.join(__dirname, '../logs');

// const logFormatter = winston.format.printf(info => {
//     const { timestamp, level, stack, message } = info;
//     const errorMessage = stack || message;

//     const symbols = Object.getOwnPropertySymbols(info);
//     if (info[symbols[0]] !== 'error') {
//         return `[${timestamp}] - ${level}: ${message}`;
//     }

//     return `[${timestamp}] ${level}: ${errorMessage}`;
// });

// // Daily Rotate File for debug logs
// const debugTransport = new winston.transports.DailyRotateFile({
//     filename: `${logDir}/debug/debug-%DATE%.log`,
//     datePattern: 'YYYY-MM-DD',
//     level: 'debug',
//     maxFiles: '14d', // Keep logs for 14 days
// });

// // Daily Rotate File for error logs
// const errorTransport = new winston.transports.DailyRotateFile({
//     filename: `${logDir}/error/error-%DATE%.log`,
//     datePattern: 'YYYY-MM-DD',
//     level: 'error',
//     maxFiles: '30d', // Keep error logs for 30 days
// });

// // Console transport for development
// const consoleTransport = new winston.transports.Console({
//     format: winston.format.combine(winston.format.colorize(), logFormatter),
// });

// // Winston Logger Configuration
// const logger = winston.createLogger({
//     level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => {
//             return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//         }),
//     ),
//     transports: [consoleTransport, debugTransport, errorTransport],
// });

// export default logger;



import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logDir = path.resolve(__dirname, '../../logs');
const debugLogDir = path.join(logDir, 'debug');
const errorLogDir = path.join(logDir, 'error');

[logDir, debugLogDir, errorLogDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Custom log formatter
const logFormatter = winston.format.printf(info => {
  const { timestamp, level, stack, message } = info;
  const symbols = Object.getOwnPropertySymbols(info);
  const errorMessage = stack || message;

  if (info[symbols[0]] !== 'error') {
    return `[${timestamp}] - ${level}: ${message}`;
  }

  return `[${timestamp}] ${level}: ${errorMessage}`;
});

// Daily Rotate File for debug logs
const debugTransport = new DailyRotateFile({
  filename: path.join(debugLogDir, 'debug-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'debug',
  maxFiles: '14d',
});

// Daily Rotate File for error logs
const errorTransport = new DailyRotateFile({
  filename: path.join(errorLogDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '30d',
});

// Console transport
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    logFormatter
  ),
});

// Final merged logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'web-scraper' },
  transports: [
    debugTransport,
    errorTransport,
    consoleTransport
  ]
});

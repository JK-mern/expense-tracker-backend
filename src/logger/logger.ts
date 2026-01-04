import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import * as winston from 'winston';

import {env} from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, {recursive: true});
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Logger {
  private static winstonInstance: undefined | winston.Logger;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): winston.Logger {
    if (!this.winstonInstance) {
      this.winstonInstance = winston.createLogger({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.json(),
          winston.format.simple(),
        ),
        level: 'info',
        transports: [
          new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
          }),
          new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
          }),
        ],
      });

      if (env.NODE_ENV !== 'production') {
        this.winstonInstance.add(
          new winston.transports.Console({
            format: winston.format.printf(({level, message}) => {
              return `[${level}]: ${String(message)}`;
            }),
          }),
        );
      }
    }
    return this.winstonInstance;
  }
}

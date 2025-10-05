import type {Application} from 'express';

import dotenv from 'dotenv';
import express from 'express';

import {Logger} from './logger/logger.js';

dotenv.config();

export class App {
  public app: Application;
  public port: number;
  private logger = Logger.getInstance();

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.logger.info(`server started on port : ${this.port.toString()}`);
    });
  }
}

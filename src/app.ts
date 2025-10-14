import type {Application} from 'express';

import dotenv from 'dotenv';
import express from 'express';

import type {Route} from './types/route.type.js';

import {Logger} from './logger/logger.js';

dotenv.config();

export class App {
  public app: Application;
  public port: number;
  private logger = Logger.getInstance();

  constructor(port: number, routes: Route[]) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.logger.info(`server started on port : ${this.port.toString()}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use(`/api/v1/${route.basePath}`, route.router);
      this.logger.info(`Route initialized at path: ${route.basePath}`);
    });
  }
}

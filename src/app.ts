import type {Application} from 'express';

import cors from 'cors';
import express from 'express';

import type {Route} from './types/route.type.js';

import {Logger} from './logger/logger.js';
import {errorMiddleware} from './middlewares/error.middleware.js';

export class App {
  public app: Application;
  public port: number;
  private logger = Logger.getInstance();

  constructor(port: number, routes: Route[]) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.logger.info(`server started on port : ${this.port.toString()}`);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use(`/api/v1/${route.basePath}`, route.router);
      this.logger.info(`Route initialized at path: ${route.basePath}`);
    });
  }
}

import type {NextFunction, Request, Response} from 'express';

import {Logger} from '../logger/logger.js';

type AppError = Error & {
  status?: number;
};

interface HandleError {
  err: AppError;
  next: NextFunction;
  req: Request;
  res: Response;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorHandler {
  static handleError({err, next: _next, req: _req, res}: HandleError) {
    const logger = Logger.getInstance();

    logger.error(err.message);

    const status = err.status ?? 500;

    res.status(status).json({
      message: err.message,
      status,
      success: false,
    });
  }
}

import type {NextFunction, Request, Response} from 'express';
import {Logger} from '../logger/logger.js';

export type AppError = Error & {
  status?: number;
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorHandler {
  static handleError = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const logger = Logger.getInstance();

    const message = err.message;
    const status = err.status ?? 500;

    logger.error(message);

    res.status(status).json({
      message,
      status,
      success: false,
    });
  };
}

export const errorMiddleware = ErrorHandler.handleError;

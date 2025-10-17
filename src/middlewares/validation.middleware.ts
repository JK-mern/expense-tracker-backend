import type {NextFunction, Request, Response} from 'express';
import type z4 from 'zod/v4';

import {Logger} from '../logger/logger.js';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Validator {
  static logger = Logger.getInstance();
  static validateSchema = (schema: z4.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const formattedErrors = result.error.issues.map((issue) => ({
          field: issue.path.length ? issue.path.join('.') : 'root',
          message: issue.message,
        }));

        return res.status(400).json({
          data: formattedErrors,
          success: false,
        });
      }

      req.body = result.data;
      next();
    };
  };
}

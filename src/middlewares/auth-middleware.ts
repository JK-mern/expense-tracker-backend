import type {NextFunction, Request, Response} from 'express';

import {supabase} from '../lib/supabase/supabase.js';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthMiddleware {
  static authMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({msg: 'Unauthorized', success: false});
      }

      const token = authHeader.split(' ')[1];
      const {
        data: {user},
        error,
      } = await supabase.auth.getUser(token);

      if (error)
        return res.status(401).json({msg: 'unauthorized', success: false});

      req.user = user;
      next();
    };
  };
}

export const authMiddleware = AuthMiddleware.authMiddleware();

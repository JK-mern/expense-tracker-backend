import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';
import {success} from 'zod';

import {Logger} from '../logger/logger.js';

export class BalanceController {
  private logger = Logger.getInstance();
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public getCurrentBalance = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(404).json({msg: 'unauthorized user'});
      }

      const userBalance = await this.prisma.user.findUnique({
        select: {
          currentBalance: true,
        },
        where: {
          id: userId,
        },
      });

      return res.status(200).json({
        data: {
          balance: userBalance?.currentBalance,
        },
        status: success,
      });
    } catch (error) {
      this.logger.error(error);
      res.status(500);
    }
  };
}

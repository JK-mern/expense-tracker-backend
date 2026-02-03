import {PrismaClient} from '@prisma/client';
import type {NextFunction, Request, Response} from 'express';
import type {AppError} from '../../middlewares/error.middleware.js';
import type {UpdateBalanceType} from '../../schemas/balance/index.js';
export class BalanceController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public getCurrentBalance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        const error: AppError = new Error('Unauthorized');
        error.status = 401;
        throw error;
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
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCurrentBalance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        const error: AppError = new Error('Unauthorized user');
        error.status = 401;
        throw error;
      }

      const {balance} = req.body as UpdateBalanceType;
      await this.prisma.user.update({
        data: {
          currentBalance: balance,
        },
        where: {
          id: req.user.id,
        },
      });

      res
        .status(200)
        .json({msg: 'balance updated successfully', success: true});
    } catch (error) {
      next(error);
    }
  };
}

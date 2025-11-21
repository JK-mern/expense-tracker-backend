import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';

import type {AppError} from '../middlewares/error.middleware.js';

export class UserController {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  public getCurrentUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        const error: AppError = new Error('Unauthorized');
        error.status = 400;
        throw error;
      }

      const userInfo = await this.prismaClient.user.findUnique({
        select: {
          currentBalance: true,
          email: true,
          isProfileCompleted: true,
          profilePicture: true,
          userName: true,
        },
        where: {
          id: userId,
        },
      });

      res.status(200).json({data: userInfo, status: true});
    } catch (error) {
      next(error);
    }
  };
}

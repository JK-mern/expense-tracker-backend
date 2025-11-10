import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';

import {Logger} from '../logger/logger.js';

export class UserController {
  private logger = Logger.getInstance();
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  public getCurrentUserDetails = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(404).json({msg: 'unauthorized user'});
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
      this.logger.error(error);
      res.status(500).json({status: false});
    }
  };
}

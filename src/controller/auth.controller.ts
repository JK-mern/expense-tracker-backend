import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';

import type {CheckUserExistType} from '../schemas/auth/index.js';

import {Logger} from '../logger/logger.js';

export class AuthContoller {
  private logger = Logger.getInstance();
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public checkUserExist = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const {email} = req.body as CheckUserExistType; //TODO : Add zod validation

      const userExist = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (userExist) {
        return res.status(400).json({data: {userExist: !!userExist}});
      }

      res.status(200).json({data: {userExist: !!userExist}, success: true});
    } catch (error: unknown) {
      this.logger.error('Failed to check if user exist', error);
      res.status(500).json({success: false});
    }
  };
}

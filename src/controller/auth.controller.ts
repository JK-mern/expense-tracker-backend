import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';

import type {
  CheckUserExistType,
  CreateUserType,
  UserNameExistType,
} from '../schemas/auth/index.js';

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
      const {email} = req.body as CheckUserExistType;

      const userExist = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      res.status(200).json({data: {userExist: !!userExist}, success: true});
    } catch (error: unknown) {
      this.logger.error('Failed to check if user exist', error);
      res.status(500).json({success: false});
    }
  };

  public checkUsernameExist = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const {userName} = req.body as UserNameExistType;

      const isUserNameAvailable = await this.prisma.user.findUnique({
        where: {
          userName: userName,
        },
      });

      res.status(200).json({
        data: {
          isUserNameAvailable: !isUserNameAvailable,
        },
        success: true,
      });
    } catch (error) {
      this.logger.error('Failed to check user name exist', error);
      res.status(500).json({success: false});
    }
  };

  public createUser = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const {currentBalance, profilePicture, userName} =
        req.body as CreateUserType;

      if (!req.user?.id || !req.user.email) {
        return res.status(400);
      }

      const userNameExist = await this.prisma.user.findUnique({
        where: {
          userName: userName,
        },
      });

      if (userNameExist) {
        return res.status(409).json({data: {userNameExist: true}});
      }

      await this.prisma.user.create({
        data: {
          currentBalance: currentBalance,
          email: req.user.email,
          id: req.user.id,
          profilePicture: profilePicture ?? null,
          userName: userName,
        },
      });

      res.status(201).json({success: true});
    } catch (error: unknown) {
      this.logger.error('Failed to create new user', error);
      res.status(500).json({success: false});
    }
  };
}

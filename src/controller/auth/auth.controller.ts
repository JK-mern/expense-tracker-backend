import {PrismaClient} from '@prisma/client';
import type {NextFunction, Request, Response} from 'express';
import type {AppError} from '../../middlewares/error.middleware.js';
import type {
  CheckUserExistType,
  CreateUserType,
  UserNameExistType,
} from '../../schemas/auth/index.js';

export class AuthContoller {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public checkUserExist = async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      next(error);
    }
  };

  public checkUsernameExist = async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      next(error);
    }
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {currentBalance, profilePicture, userName} =
        req.body as CreateUserType;

      if (!req.user?.id || !req.user.email) {
        const error: AppError = new Error('Unauthorized');
        error.status = 401;
        throw error;
      }

      const userNameExist = await this.prisma.user.findUnique({
        where: {
          userName: userName,
        },
      });

      if (userNameExist) {
        const error: AppError = new Error('Username exists');
        error.status = 409;
        throw error;
      }

      await this.prisma.user.create({
        data: {
          currentBalance: currentBalance,
          email: req.user.email,
          id: req.user.id,
          isProfileCompleted: true,
          profilePicture: profilePicture ?? null,
          userName: userName,
        },
      });

      res.status(201).json({success: true});
    } catch (error: unknown) {
      next(error);
    }
  };
}

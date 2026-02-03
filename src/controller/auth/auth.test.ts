/* eslint-disable @typescript-eslint/unbound-method */
import type {NextFunction, Request, Response} from 'express';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {getMockReq, getMockRes} from 'vitest-mock-express';
import {prismaMock} from '../../test/mocks/mock-primsa-client.js';
import {AuthContoller} from './auth.controller.js';
import {MockUser} from './mock-auth.js';

vi.mock('@prisma/client', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    PrismaClient: class {
      constructor() {
        return prismaMock;
      }
    },
  };
});

describe('AuthController', () => {
  let authController: AuthContoller;
  const {mockClear, next: mockNext, res: mockRes} = getMockRes();

  beforeEach(() => {
    vi.clearAllMocks();
    mockClear();
    authController = new AuthContoller();
  });

  describe('checkUserExist', () => {
    it('should return userExist: true if email is found', async () => {
      const mockReq = getMockReq({
        body: {
          email: MockUser.email,
        },
      });

      await authController.checkUserExist(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {email: MockUser.email},
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {userExist: false},
        success: true,
      });
    });

    it('should return userExist: false if email is not found', async () => {
      const mockReq = getMockReq({
        body: {
          email: MockUser.email,
        },
      });
      prismaMock.user.findUnique.mockResolvedValue(null);

      await authController.checkUserExist(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        data: {userExist: false},
        success: true,
      });
    });

    it('should call next(error) if prisma fails', async () => {
      const mockReq = getMockReq({body: {email: 'error@example.com'}});
      const error = new Error('DB Error');
      prismaMock.user.findUnique.mockRejectedValue(error);

      await authController.checkUserExist(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('checkUsernameExist', () => {
    it('should return isUserNameAvailable: false if username exists', async () => {
      const mockReq = getMockReq({body: {userName: MockUser.userName}});

      prismaMock.user.findUnique.mockResolvedValue(MockUser);
      await authController.checkUsernameExist(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {isUserNameAvailable: false},
        success: true,
      });
    });

    it('should return isUserNameAvailable: true if username does not exist', async () => {
      const mockReq = getMockReq({body: {userName: 'newUser'}});
      prismaMock.user.findUnique.mockResolvedValue(null);

      await authController.checkUsernameExist(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        data: {isUserNameAvailable: true},
        success: true,
      });
    });
  });

  describe('createUser', () => {
    const validBody = {
      currentBalance: 100,
      profilePicture: 'pic.jpg',
      userName: 'coolUser',
    };

    it('should throw 400 Unauthorized if req.user is missing', async () => {
      const mockReq = getMockReq({body: validBody, user: null});

      await authController.createUser(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unauthorized',
          status: 401,
        }),
      );
    });

    it('should create user successfully (201) when data is valid', async () => {
      const mockReq = getMockReq({
        body: validBody,
        user: {
          email: MockUser.email,
          id: MockUser.id,
        },
      });

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(MockUser);

      await authController.createUser(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.user.create).toHaveBeenCalled();

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({success: true});
    });
  });
});

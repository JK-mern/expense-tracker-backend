/* eslint-disable @typescript-eslint/unbound-method */
import type {NextFunction, Request, Response} from 'express';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {getMockReq, getMockRes} from 'vitest-mock-express';
import {prismaMock} from '../../test/mocks/mock-primsa-client.js';
import {MockUser} from '../auth/mock-auth.js';
import {BalanceController} from './balance.controller.js';

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

describe('BalanceController', () => {
  let balanceController: BalanceController;
  const {mockClear, next: mockNext, res: mockRes} = getMockRes();

  beforeEach(() => {
    vi.clearAllMocks();
    mockClear();
    balanceController = new BalanceController();
  });

  describe('get current user balance', () => {
    it('Should return the users current balance', async () => {
      const mockReq = getMockReq({
        user: {
          id: MockUser.id,
        },
      });

      prismaMock.user.findUnique.mockResolvedValue({
        ...MockUser,
      });

      await balanceController.getCurrentBalance(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        select: {
          currentBalance: true,
        },
        where: {
          id: MockUser.id,
        },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {balance: MockUser.currentBalance},
        success: true,
      });
    });

    it('should throw a UnAuthorized error if no user id is provided', async () => {
      const mockReq = getMockReq({
        user: null,
      });

      await balanceController.getCurrentBalance(
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
  });

  describe('Update current users balance', () => {
    it('Should update the current users balance succesfully', async () => {
      const mockReq = getMockReq({
        body: {
          balance: '2000',
        },
        user: {id: MockUser.id},
      });

      await balanceController.updateCurrentBalance(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        data: {
          currentBalance: '2000',
        },
        where: {
          id: MockUser.id,
        },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        msg: 'balance updated successfully',
        success: true,
      });
    });

    it('Should throw 404 Unauthorized if userId is not present', async () => {
      const mockReq = getMockReq({
        user: null,
      });

      await balanceController.updateCurrentBalance(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unauthorized user',
          status: 401,
        }),
      );
    });
  });
});

/* eslint-disable @typescript-eslint/unbound-method */

import type {NextFunction, Request, Response} from 'express';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {getMockReq, getMockRes} from 'vitest-mock-express';
import {prismaMock} from '../../test/mocks/mock-primsa-client.js';
import {MockUser} from '../auth/mock-auth.js';
import {
  CreateBalanceMock,
  CreateExpenseMock,
  ExpenseMockResult,
  MockFormattedResult,
} from './expense-mock.js';
import {ExpenseController} from './exprense.controller.js';

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

describe('ExpenseController', () => {
  let expenseController: ExpenseController;
  const {mockClear, next: mockNext, res: mockRes} = getMockRes();

  beforeEach(() => {
    vi.clearAllMocks();
    mockClear();
    expenseController = new ExpenseController();
  });

  describe('Create new Expense', () => {
    it('It should create a new expense successfully', async () => {
      const mockReq = getMockReq({
        body: {
          amount: CreateExpenseMock.amount,
          categoryId: CreateExpenseMock.categoryId,
          date: CreateExpenseMock.date,
          description: CreateExpenseMock.description,
        },
        user: {
          id: MockUser.id,
        },
      });

      prismaMock.$transaction.mockImplementation((callback) =>
        callback(prismaMock),
      );

      prismaMock.user.update.mockResolvedValue(MockUser);
      prismaMock.balance.create.mockResolvedValue(CreateBalanceMock);
      prismaMock.expense.create.mockResolvedValue(CreateExpenseMock);

      await expenseController.createNewExpense(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        data: {
          currentBalance: {
            decrement: CreateExpenseMock.amount,
          },
        },
        select: {
          currentBalance: true,
        },
        where: {id: MockUser.id},
      });
      expect(prismaMock.balance.create).toHaveBeenCalled();
      expect(prismaMock.expense.create).toHaveBeenCalled();

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          msg: 'new expense added successfully',
        },
        success: true,
      });
    });

    it('Should throw a 401 Unauthorized error  if no user id is present in request', async () => {
      const mockReq = getMockReq({
        user: null,
      });

      await expenseController.createNewExpense(
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

  describe('Get User Transaction History', () => {
    it('Should fetch the users transaction history with given parameters', async () => {
      const mockReq = getMockReq({
        query: {
          categoryId: '101',
        },
        user: {
          id: MockUser.id,
        },
      });

      prismaMock.expense.findMany.mockResolvedValue(ExpenseMockResult);

      await expenseController.getUserTransactionHistory(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.expense.findMany).toHaveBeenCalledWith({
        orderBy: {
          date: 'desc',
        },
        select: {
          amount: true,
          balance: {
            select: {
              amount: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          date: true,
          description: true,
          id: true,
        },

        skip: 0,
        take: 10,
        where: {
          categoryId: 101,
          userId: MockUser.id,
        },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: MockFormattedResult,
        success: true,
      });
    });

    it('Should throw 404 Unauthorized error when request id is not present', async () => {
      const mockReq = getMockReq({
        user: null,
      });

      await expenseController.getUserTransactionHistory(
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
});

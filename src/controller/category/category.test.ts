/* eslint-disable @typescript-eslint/unbound-method */

import type {NextFunction, Request, Response} from 'express';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {getMockReq, getMockRes} from 'vitest-mock-express';
import {prismaMock} from '../../test/mocks/mock-primsa-client.js';
import {MockUser} from '../auth/mock-auth.js';
import {CategoryController} from './category.controller.js';
import {
  MockCategories,
  MockCategoryWiseExpense,
  MockGroupByExpense,
} from './mock-categories.js';

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

describe('CategoryController', () => {
  let categoryController: CategoryController;
  const {mockClear, next: mockNext, res: mockRes} = getMockRes();

  beforeEach(() => {
    vi.clearAllMocks();
    mockClear();
    categoryController = new CategoryController();
  });

  describe('Add Categories', () => {
    it('should add a category successfully to the category table', async () => {
      const mockReq = getMockReq({
        body: {
          categoryName: 'Shopping',
        },
        user: {
          id: MockUser.id,
        },
      });

      await categoryController.addExpenseCategories(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Shopping',
        },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
      });
    });
  });

  describe('Get All Categories', () => {
    it('Should fetch all the categories successfully', async () => {
      const mockReq = getMockReq();

      prismaMock.category.findMany.mockResolvedValue(MockCategories);

      await categoryController.getAllCategories(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.category.findMany).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        categories: MockCategories,
        success: true,
      });
    });
  });

  describe('Get Category wise Expenses', () => {
    it('Should fetch the total Expense for a each category', async () => {
      const mockReq = getMockReq({
        user: {
          id: MockUser.id,
        },
      });

      // @ts-expect-error  the mockResolvedValue is actually working fine but ts seems to throw type mismatch error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      prismaMock.expense.groupBy.mockResolvedValue(MockGroupByExpense);
      prismaMock.category.findMany.mockResolvedValue(MockCategories);

      await categoryController.getCategoryWiseExpense(
        mockReq as unknown as Request,
        mockRes as unknown as Response,
        mockNext as NextFunction,
      );

      expect(prismaMock.expense.groupBy).toHaveBeenCalled();
      expect(prismaMock.category.findMany).toHaveBeenCalled();

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: MockCategoryWiseExpense,
        success: true,
      });
    });

    it('Should return 404 UnAuthorized if no userId is found in request', async () => {
      const mockReq = getMockReq({
        user: null,
      });

      await categoryController.getCategoryWiseExpense(
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

import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';

import type {AppError} from '../middlewares/error.middleware.js';
import type {
  ExpenseFiltering,
  NewExpenseType,
} from '../schemas/expense/expense.dto.js';

export class ExpenseController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public createNewExpense = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        const error: AppError = new Error('Unauthorized');
        error.status = 400;
        throw error;
      }

      const {amount, categoryId, date, description} =
        req.body as NewExpenseType;
      await this.prisma.$transaction([
        this.prisma.expense.create({
          data: {
            amount: amount,
            categoryId: categoryId,
            date: new Date(date),
            description: description ?? '',
            userId: req.user.id,
          },
        }),
        this.prisma.user.update({
          data: {
            currentBalance: {
              decrement: amount,
            },
          },
          where: {
            id: req.user.id,
          },
        }),
      ]);
      res.status(200).json({
        data: {
          msg: 'new expense added successfully',
        },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserTransactionHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categoryId = parseInt(req.query.categoryId as string) || undefined;
      const date = (req.query.date as string) || undefined;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = 10;

      if (!req.user?.id) {
        const error: AppError = new Error('Unauthorized');
        error.status = 400;
        throw error;
      }

      const offset = (page - 1) * pageSize;

      const filteringCondition: ExpenseFiltering = {
        userId: req.user.id,
        ...(categoryId && {categoryId}),
      };

      if (date) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        filteringCondition.date = {
          gte: startOfDay,
          lt: endOfDay,
        };
      }

      const results = await this.prisma.expense.findMany({
        orderBy: {
          date: 'desc',
        },
        select: {
          amount: true,
          category: {
            select: {
              name: true,
            },
          },
          date: true,
          id: true,
        },
        skip: offset,
        take: 10,
        where: filteringCondition,
      });

      const formattedResults = results.map((result) => ({
        amount: result.amount,
        categoryName: result.category.name,
        date: result.date,
        id: result.id,
      }));

      res.status(200).json({data: formattedResults, success: true});
    } catch (error) {
      next(error);
    }
  };
}

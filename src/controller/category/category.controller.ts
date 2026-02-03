import type {NextFunction, Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import type {AppError} from '../../middlewares/error.middleware.js';
import type {AddCategory} from '../../schemas/category/category.dto.js';

export class CategoryController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public addExpenseCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {categoryName} = req.body as AddCategory;
      await this.prisma.category.create({
        data: {
          name: categoryName,
        },
      });
      res.status(200).json({success: true});
    } catch (error) {
      next(error);
    }
  };

  public getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      res.status(200).json({categories, success: true});
    } catch (error) {
      next(error);
    }
  };

  public getCategoryWiseExpense = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        const error: AppError = new Error('Unauthorized');
        error.status = 401;
        throw error;
      }

      const results = await this.prisma.expense.groupBy({
        _sum: {
          amount: true,
        },
        by: 'categoryId',
        where: {
          userId: req.user.id,
        },
      });

      const categories = await this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const formattedResults = results.map((result) => ({
        amount: result._sum.amount,
        categoryName: categories.find(
          (category) => category.id === result.categoryId,
        )?.name,
      }));

      res.status(200).json({data: formattedResults, success: true});
    } catch (error) {
      next(error);
    }
  };
}

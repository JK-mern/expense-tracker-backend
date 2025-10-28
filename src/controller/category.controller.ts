import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';

import type {AddCategory} from '../schemas/category/category.dto.js';

import {Logger} from '../logger/logger.js';

export class CategoryController {
  private logger = Logger.getInstance();
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public addExpenseCategories = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const {categoryName} = req.body as AddCategory;
      await this.prisma.category.create({
        data: {
          name: categoryName,
        },
      });
      res.status(200).json({status: true});
    } catch (error) {
      this.logger.error(error);
      res.status(500).json();
    }
  };
}

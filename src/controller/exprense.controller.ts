import type {NextFunction, Request, Response} from 'express';

import {PrismaClient} from '@prisma/client';

import type {NewExpenseType} from '../schemas/expense/expense.dto.js';

import {Logger} from '../logger/logger.js';

export class ExpenseController {
  private logger = Logger.getInstance();
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public createNewExpense = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(404).json({msg: 'unauthorized user'});
      }

      const {amount, categoryId, description} = req.body as NewExpenseType;
      await this.prisma.$transaction([
        this.prisma.expense.create({
          data: {
            amount: amount,
            categoryId: categoryId,
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
        status: true,
      });
    } catch (error) {
      this.logger.error(error);
      res.status(500).json({status: false});
    }
  };
}

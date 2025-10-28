import {Router} from 'express';

import type {Route} from '../types/route.type.js';

import {ExpenseController} from '../controller/exprense.controller.js';
import {authMiddleware} from '../middlewares/auth-middleware.js';
import {Validator} from '../middlewares/validation.middleware.js';
import {addNewExpenseSchema} from '../schemas/expense/expense.schema.js';

export class ExpenseRoute {
  public route: Route;
  private expenseController: ExpenseController;
  private validate = Validator.validateSchema;

  constructor() {
    this.route = {
      basePath: 'expense',
      router: Router(),
    };
    this.expenseController = new ExpenseController();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.route.router.post(
      '/create',
      this.validate(addNewExpenseSchema),
      authMiddleware,
      this.expenseController.createNewExpense,
    );
  }
}

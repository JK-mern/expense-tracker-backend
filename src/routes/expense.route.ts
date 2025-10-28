import {Router} from 'express';

import type {Route} from '../types/route.type.js';

import {ExpenseController} from '../controller/exprense.controller.js';
import {Validator} from '../middlewares/validation.middleware.js';

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

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  private initializeRoute() {}
}

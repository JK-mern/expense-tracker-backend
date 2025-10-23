import {Router} from 'express';

import type {Route} from '../types/route.type.js';

import {BalanceController} from '../controller/balance.controller.js';
import {authMiddleware} from '../middlewares/auth-middleware.js';
import {Validator} from '../middlewares/validation.middleware.js';

export class BalanceRoutes {
  public route: Route;
  private balanceController: BalanceController;
  private validate = Validator.validateSchema;

  constructor() {
    this.route = {
      basePath: 'balance',
      router: Router(),
    };
    this.balanceController = new BalanceController();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.route.router.get(
      '/currentBalance',
      authMiddleware,
      this.balanceController.getCurrentBalance,
    );
  }
}

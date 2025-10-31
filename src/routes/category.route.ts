import {Router} from 'express';

import type {Route} from '../types/route.type.js';

import {CategoryController} from '../controller/category.controller.js';
import {authMiddleware} from '../middlewares/auth-middleware.js';
import {Validator} from '../middlewares/validation.middleware.js';
import {addCategorySchema} from '../schemas/category/index.js';

export class CategoryRoute {
  public route: Route;
  private categoryController: CategoryController;
  private validate = Validator.validateSchema;

  constructor() {
    this.route = {
      basePath: 'category',
      router: Router(),
    };
    this.categoryController = new CategoryController();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.route.router.post(
      '/addCategory', //Add a check so that only superuse can add categories
      this.validate(addCategorySchema),
      this.categoryController.addExpenseCategories,
    );
    this.route.router.get('/', this.categoryController.getAllCategories);
    this.route.router.get(
      '/aggregatedExpenses',
      authMiddleware,
      this.categoryController.getCategoryWiseExpense,
    );
  }
}

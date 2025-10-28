import {Router} from 'express';

import type {Route} from '../types/route.type.js';

import {UserController} from '../controller/user.controller.js';
import {authMiddleware} from '../middlewares/auth-middleware.js';
import {Validator} from '../middlewares/validation.middleware.js';

export class UserRoute {
  public route: Route;
  private userController: UserController;
  private validate = Validator.validateSchema;
  constructor() {
    this.route = {
      basePath: 'user',
      router: Router(),
    };
    this.userController = new UserController();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.route.router.get(
      '/currentUser',
      authMiddleware,
      this.userController.getCurrentUserDetails,
    );
  }
}

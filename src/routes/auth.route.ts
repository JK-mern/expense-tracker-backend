import {Router} from 'express';

import type {Route} from '../types/route.type.js';

import {AuthContoller} from '../controller/auth.controller.js';
import {Validator} from '../middlewares/validation.middleware.js';
import {checkUserExist, createUser} from '../schemas/auth/auth.schema.js';

export class AuthRoutes {
  public route: Route;
  private authController: AuthContoller;
  private validate = Validator.validateSchema;

  constructor() {
    this.route = {
      basePath: 'auth',
      router: Router(),
    };
    this.authController = new AuthContoller();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.route.router.post(
      '/checkUserExist',
      this.validate(checkUserExist),
      this.authController.checkUserExist,
    );
    this.route.router.post(
      '/createUser',
      this.validate(createUser),
      this.authController.createUser,
    );
  }
}

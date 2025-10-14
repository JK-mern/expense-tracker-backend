import {Router} from 'express';

import type {Route} from '../types/route.type.js';

import {AuthContoller} from '../controller/auth.controller.js';

export class AuthRoutes {
  public route: Route;
  private authController: AuthContoller;

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
      this.authController.checkUserExist,
    );
    this.route.router.post('/createUser', this.authController.createUser);
  }
}

import type {Router} from 'express';

export interface Route {
  basePath: string;
  router: Router;
}

import {App} from './app.js';
import {env} from './config/env.js';
import {
  AuthRoutes,
  BalanceRoutes,
  CategoryRoute,
  ExpenseRoute,
  UserRoute,
} from './routes/index.js';

const port = env.PORT;
const routes = [
  new AuthRoutes().route,
  new BalanceRoutes().route,
  new UserRoute().route,
  new CategoryRoute().route,
  new ExpenseRoute().route,
];
const app = new App(port, routes);
app.listen();

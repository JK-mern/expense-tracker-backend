import {App} from './app.js';
import {
  AuthRoutes,
  BalanceRoutes,
  CategoryRoute,
  ExpenseRoute,
  UserRoute,
} from './routes/index.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3500;
const routes = [
  new AuthRoutes().route,
  new BalanceRoutes().route,
  new UserRoute().route,
  new CategoryRoute().route,
  new ExpenseRoute().route,
];
const app = new App(port, routes);
app.listen();

import {App} from './app.js';
import {BalanceRoutes} from './routes/balance.route.js';
import {AuthRoutes} from './routes/index.js';
import {UserRoute} from './routes/user.route.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3500;
const routes = [
  new AuthRoutes().route,
  new BalanceRoutes().route,
  new UserRoute().route,
];
const app = new App(port, routes);
app.listen();

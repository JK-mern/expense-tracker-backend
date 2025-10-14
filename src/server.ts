import {App} from './app.js';
import {AuthRoutes} from './routes/index.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3500;
const routes = [new AuthRoutes().route];
const app = new App(port, routes);
app.listen();

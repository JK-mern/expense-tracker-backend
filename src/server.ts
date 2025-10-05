import {App} from './app.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3500;
const app = new App(port);
app.listen();

import express, { Express, Request, Response } from "express";
import registerAPIRoutes from './api';

const app: Express = express();
app.use(express.json());
registerAPIRoutes(app);

export default app;

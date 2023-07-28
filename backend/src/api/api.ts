import { Express } from 'express';
import { login } from '../db/databaseHandler';

export default function registerAPIRoutes(app: Express) {
    app.get("/login", login);
}

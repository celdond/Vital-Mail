import { Express } from 'express';
import { login, register } from '../db/databaseHandler';

export default function registerAPIRoutes(app: Express) {
    app.post("/login", login);
    app.post("/register", register);
}

import { Express } from 'express';
import { login } from '../db/db';

export default function registerAPIRoutes(app: Express) {
    app.get("/login", login);
}

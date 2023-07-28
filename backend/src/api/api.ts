import { Express } from 'express';
import { login } from '../db/databaseHandler';

export default function registerAPIRoutes(app: Express) {
    app.post("/login", login);
    app.post("/register", (req, res) => {
        console.log("reached\n");
    })
}

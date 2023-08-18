import { Express } from 'express';
import { login, register, check } from '../db/databaseHandler';
import { getMailboxes, getMail, sendMail } from './email';

export default function registerAPIRoutes(app: Express) {
    app.post("/login", login);
    app.post("/register", register);
    app.get("/mailbox", check, getMailboxes);
    app.get("/mail", check, getMail);
    app.post("/mail", check, sendMail);
}

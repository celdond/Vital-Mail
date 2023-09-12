import { Express } from "express";
import { login, register, check } from "../db/accountHandler";
import { getMailboxes, getMailbox, sendMail, getID } from "./email";
import { changeAccount } from "./account";

export default function registerAPIRoutes(app: Express) {
  app.post("/login", login);
  app.post("/register", register);
  app.get("/mailbox", check, getMailboxes);
  app.get("/mail", check, getMailbox);
  app.post("/mail", check, sendMail);
  app.get("/mail/:id", check, getID);
  app.post("/account", check, changeAccount);
}

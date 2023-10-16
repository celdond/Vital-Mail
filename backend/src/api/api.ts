import { Express } from "express";
import { login, register, check } from "../db/accountHandler";
import {
  getMailboxes,
  getMailbox,
  sendMail,
  getID,
  moveMail,
  deleteMail,
  createBox,
  deleteBox,
  searchMail
} from "./email";
import { changeAccount, deleteAccount } from "./account";

export default function registerAPIRoutes(app: Express) {
  app.post("/login", login);
  app.post("/register", register);
  app.get("/mailbox", check, getMailboxes);
  app.get("/mail", check, getMailbox);
  app.post("/mail", check, sendMail);
  app.get("/mail/:id", check, getID);
  app.put("/mail", check, moveMail);
  app.delete("/mail", check, deleteMail);
  app.post("/mailbox", check, createBox);
  app.delete("/mailbox", check, deleteBox);
  app.post("/account", check, changeAccount);
  app.delete("/account", check, deleteAccount);
  app.get("/search", check, searchMail);
}

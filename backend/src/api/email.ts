import {
  accessBoxes,
  accessMailbox,
  checkBox,
  createMail,
  accessMail,
} from "../db/databaseHandler";
import { CheckRequest, mailType } from "../appTypes";
import { Response } from "express";

export async function getMailboxes(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  console.log(usermail);
  if (usermail) {
    const boxes = await accessBoxes(usermail);
    if (boxes) {
      res.status(200).json(boxes);
    } else {
      res.status(404).send("No mailboxes found.");
    }
  } else {
    res.status(400).send("Bad Request.");
  }
}

export async function getID(req: CheckRequest, res: Response) {
  const email = await accessMail(req.params.id);
  if (email) {
    res.status(200).json(email);
    return;
  }
  res.status(404).send();
}

export async function getMailbox(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const mailbox = req.query.mailbox as string;

  if (usermail && mailbox) {
    const existBox = await checkBox(usermail, mailbox);
    if (existBox == -1) {
      res.status(404).send("Not Found.");
      return;
    }
    const mail = await accessMailbox(usermail, mailbox);
    res.status(200).json(mail);
  } else {
    res.status(400).send("Bad Request.");
  }
}

export async function sendMail(req: CheckRequest, res: Response) {
  const from = {
    email: req.usermail ?? "",
    name: req.name ?? "",
  };
  const success = await createMail(from, req.body);
  if (typeof success != "number") {
    res.status(201).json(success);
  } else {
    res.status(success).send();
  }
}

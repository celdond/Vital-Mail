import { accessBoxes, accessMail } from "../db/databaseHandler";
import { CheckRequest } from "../appTypes";
import { Response } from "express";

export async function getMailboxes(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
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

export async function getMail(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const mailbox = req.query.mailbox as string;

  if (usermail && mailbox) {
    const mail = await accessMail(usermail, mailbox);
    if (mail.length == 0) {
      res.status(404).send();
      return;
    }
    res.status(200).json(mail);
  } else {
    res.status(400).send("Bad Request.");
  }
}
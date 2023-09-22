import {
  accessBoxes,
  accessMailbox,
  checkBox,
  createMail,
  accessMail,
  moveBox,
} from "../db/mailHandler";
import { CheckRequest } from "../appTypes";
import { Response } from "express";

// getMailboxes:
//
// Response control for retrieving all user's mailboxes
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

// getID:
//
// Response control for retrieving mail content
export async function getID(req: CheckRequest, res: Response) {
  const email = await accessMail(req.params.id);
  if (email) {
    res.status(200).json(email);
    return;
  }
  res.status(404).send();
}

// getMailbox:
//
// Response control for retrieving all mailbox content
export async function getMailbox(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const mailbox = req.query.mailbox as string;
  if (usermail && mailbox) {
    const mail = await accessMailbox(usermail, mailbox);
    if (mail.length == 0) {
      res.status(404).json("Mailbox not found.");
      return;
    }
    res.status(200).json(mail);
  } else {
    res.status(400).send("Bad Request.");
  }
}

// sendMail:
//
// Response control for sending a message
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

// moveMail:
//
// Response control for changing the mailbox of a message
export async function moveMail(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  if (typeof(req.query.box) == 'string' && usermail) {
    const status = await moveBox(req.params.id, req.query.box, usermail);
    res.status(status).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

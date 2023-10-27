import {
  accessBoxes,
  accessMailbox,
  createMail,
  accessMail,
  moveBox,
  deleteIDs,
  insertBox,
  dbDeleteBox,
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
  if (email.status == 200) {
    res.status(200).json(email.content);
    return;
  }
  res.status(404).send();
}

// getMailbox:
//
// Response control for retrieving mailbox content
export async function getMailbox(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const mailbox = req.query.mailbox as string;
  const query = req.query.query as string;
  if (usermail && mailbox) {
    const mail = await accessMailbox(usermail, mailbox, query ?? null);
    if (typeof mail == "number") {
      res.status(404).send("Mailbox not found.");
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
  res.status(success).send();
}

// moveMail:
//
// Response control for changing the mailbox of a message
export async function moveMail(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const ids = req.body;
  const mailbox = req.query.mailbox;
  if (typeof mailbox == "string" && usermail && ids) {
    const status = await moveBox(ids, usermail, mailbox);
    res.status(status).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

// deleteMail:
//
// Response control for changing the mailbox of a message
export async function deleteMail(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const ids = req.body;
  if (typeof usermail == "string" && ids) {
    const status = await deleteIDs(ids, usermail);
    res.status(status).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

// createBox:
//
// Response control for creating a custom mailbox
export async function createBox(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const boxName = req.body.boxName;
  if (typeof usermail == "string" && boxName) {
    const status = await insertBox(boxName, usermail);
    res.status(status).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

// deleteBox:
//
// Response control for deleting a custom mailbox
export async function deleteBox(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const boxName = req.body.boxName;
  if (typeof usermail == "string" && boxName) {
    const status = await dbDeleteBox(boxName, usermail);
    res.status(status).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

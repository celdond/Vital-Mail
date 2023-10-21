import { Response } from "express";
import { CheckRequest } from "../appTypes";
import { updateAccount, deleteEmail } from "../db/accountHandler";

// changeAccount:
//
// allows users to alter their account
// all changes must go through for a success,
// otherwise no changes go through
export async function changeAccount(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const changes = req.body;
  if (usermail && changes) {
    const result = await updateAccount(changes, usermail);
    if (result != 200) {
      res.status(result).send();
      return;
    }
    res.status(200).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

// deleteAccount:
//
// deletes user's account
export async function deleteAccount(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  if (usermail) {
    const result = await deleteEmail(usermail);
    if (result != 200) {
      res.status(result).send();
      return;
    }
    res.status(200).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

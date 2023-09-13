import { Response } from "express";
import { CheckRequest, changeAccountType } from "../appTypes";
import { updateAccount } from "../db/accountHandler";

// changeAccount:
//
// allows users to alter their account
// all changes must go through for a success,
// otherwise no changes go through
export async function changeAccount(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  if (usermail && req.body) {
    const result = await updateAccount(req.body, usermail);
    if (result != 200) {
      res.status(result).send();
      return;
    }
    res.status(200).send();
  } else {
    res.status(400).send("Bad Request.");
  }
}

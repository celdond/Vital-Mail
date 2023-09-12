import { Response } from "express";
import { CheckRequest } from "../appTypes";

// changeAccount:
//
// allows users to alter their account
// all changes must go through for a success,
// otherwise no changes go through
export async function changeAccount(req: CheckRequest, res: Response) {
  const usermail = req.usermail;
  const changes = req.body.changes;
  if (usermail && changes) {

    res.status(200).send(JSON.stringify({}));
  } else {
    res.status(400).send("Bad Request.");
  }
}

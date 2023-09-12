import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import secrets from "../secrets/secret.json";
import { CheckRequest } from "../appTypes";

import { pool } from './pool';

const STATIC_MAILBOX = ["Inbox", "Sent", "Trash"];

// check:
//
// Validates the token of the client before allowing access to server functionality
export function check(req: CheckRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (auth) {
    const token = auth.split(" ")[1];
    jwt.verify(token, secrets.secretToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (typeof user == "object") {
        req.usermail = user.email;
        req.name = user.name;
        next();
      } else {
        return res.status(400).send("User could not be deciphered.");
      }
    });
  } else {
    return res.sendStatus(401);
  }
}

// login:
//
// function to handle login and token distribution
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const search = `SELECT username, email, credword
      FROM usermail WHERE email = $1`;
  const loginSearch = {
    text: search,
    values: [email],
  };
  const queryLogin = await pool.query(loginSearch);
  if (
    queryLogin.rows[0] &&
    bcrypt.compareSync(password, queryLogin.rows[0].credword)
  ) {
    const token = jwt.sign(
      { email: queryLogin.rows[0].email, name: queryLogin.rows[0].username },
      secrets.secretToken,
      { expiresIn: "60m", algorithm: "HS256" }
    );
    const account = {
      name: queryLogin.rows[0].username,
      email: queryLogin.rows[0].email,
      token: token,
    };
    res.status(200).json(account);
  } else {
    res.status(401).send("Invalid Login Information");
  }
}

// register
//
// Endpoint to create a new account in the database
export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  // Check to ensure valid entries
  if (username.length == 0) {
    res.status(400).send("No Username Entered.");
    return;
  } else if (email.length == 0) {
    res.status(400).send("No Email Entered.");
    return;
  } else if (email.password == 0) {
    res.status(400).send("No Password Entered.");
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if username already exists
    const search = `SELECT username, email, credword
        FROM usermail WHERE email = $1`;
    const registerSearch = {
      text: search,
      values: [email],
    };
    const query = await client.query(registerSearch);

    // Create Account if email is unique
    if (query.rows[0]) {
      throw 403;
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const entry = `INSERT INTO usermail VALUES ($1, $2, $3)`;
      const registerInsert = {
        text: entry,
        values: [username, email, hashedPassword],
      };
      await client.query(registerInsert);
    }

    // Insert static boxes
    for (const box of STATIC_MAILBOX) {
      const newBoxInsert = `INSERT INTO mailbox VALUES ($1, $2, $3)`;
      const newBoxCode = box + "@" + email;
      const registerBox = {
        text: newBoxInsert,
        values: [newBoxCode, box, email],
      };
      await client.query(registerBox);
    }

    await client.query("COMMIT");
    res.status(200).send("Success");
  } catch (e) {
    await client.query("ROLLBACK");
    if (e == 403) {
      res.status(403).send("Username Taken");
    } else {
      res
        .status(500)
        .send("Failure to Create Account, Please Try Again Later.");
    }
  } finally {
    client.release();
  }
}

import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import secrets from "../secrets/secret.json";
import { postgres_variables } from "../config/processVariables";
import { CheckRequest } from "../appTypes";

const pool = new Pool({
  host: postgres_variables.POSTGRES_HOST,
  port: 5432,
  database: postgres_variables.POSTGRES_DB,
  user: postgres_variables.POSTGRES_USER,
  password: postgres_variables.POSTGRES_PASSWORD,
});

const STATIC_MAILBOX = ['Inbox', 'Sent', 'Trash'];

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
        next();
      } else {
        return res.status(400).send("User could not be deciphered.");
      }
    });
  } else {
    return res.sendStatus(401);
  }
}

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

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
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
    const search = `SELECT username, email, credword
      FROM usermail WHERE email = $1`;
    const registerSearch = {
      text: search,
      values: [email],
    };
    const query = await pool.query(registerSearch);
    if (query.rows[0]) {
      throw 403;
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const entry = `INSERT INTO usermail VALUES ($1, $2, $3)`;
      const registerInsert = {
        text: entry,
        values: [username, email, hashedPassword],
      };
      await pool.query(registerInsert);
    }
    for (const box of STATIC_MAILBOX) {
      const newBoxInsert = `INSERT INTO mailbox VALUES ($1, $2, $3)`;
      const newBoxCode = box + '@' + email;
      const registerBox = {
        text: newBoxInsert,
        values: [newBoxCode, box, email],
      };
      await pool.query(registerBox);
    }
    await client.query("COMMIT");
    res.status(200).send("Success");
  } catch (e) {
    await client.query("ROLLBACK");
    if (e == 403) {
      res.status(403).send("Email Taken");
    } else {
      res
        .status(500)
        .send("Failure to Create Account, Please Try Again Later.");
    }
  } finally {
    client.release();
  }
}

export async function accessBoxes(usermail: string) {
  const search = "SELECT * FROM mailbox WHERE email = $1";
  const query = {
    text: search,
    values: [usermail],
  };

  const { rows } = await pool.query(query);
  const mailboxes = [];
  for (const row of rows) {
    mailboxes.push(row.mailbox);
  }
  return mailboxes;
}

export async function accessMail(usermail: string, mailbox: string) {
  const boxcode = mailbox + "@" + usermail;
  const search = "SELECT id, mail FROM mail WHERE boxcode = $1";
  const query = {
    text: search,
    values: [boxcode],
  };
  const { rows } = await pool.query(query);
  const receivedMail = [];
  if (rows.length > 0) {
    for (const row of rows) {
      row.mail.id = row.id;
      row.mail.preview = row.mail.content.slice(0, 18) + "...";
      delete row.mail.content;
      receivedMail.push(row.mail);
    }
  }
  return receivedMail;
}

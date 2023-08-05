import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import secrets from "../secrets/secret.json";
import { postgres_variables } from "../config/processVariables";

const pool = new Pool({
  host: postgres_variables.POSTGRES_HOST,
  port: 5432,
  database: postgres_variables.POSTGRES_DB,
  user: postgres_variables.POSTGRES_USER,
  password: postgres_variables.POSTGRES_PASSWORD,
});

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

  const search = `SELECT username, email, credword
    FROM usermail WHERE email = $1`;
  const registerSearch = {
    text: search,
    values: [email],
  };
  const query = await pool.query(registerSearch);
  if (query.rows[0]) {
    res.status(403).send("Email Taken");
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const entry = `INSERT INTO usermail VALUES ($1, $2, $3)`;
    const registerInsert = {
      text: entry,
      values: [username, email, hashedPassword],
    };
    try {
      const queryLogin = await pool.query(registerInsert);
      res.status(200).send("Success");
    } catch {
      res.status(500).send("Failure to Create Account, Please Try Again Later.");
    }
  }
}

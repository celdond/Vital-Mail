import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import secrets from "../secrets/secret.json";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5430,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const search = `SELECT name, email, password
    FROM user WHERE email = $1`;
  const loginSearch = {
    text: search,
    values: [email],
  };
  const queryLogin = await pool.query(loginSearch);
  if (
    queryLogin.rows[0] &&
    bcrypt.compareSync(password, queryLogin.rows[0].password)
  ) {
    const token = jwt.sign(
      { email: queryLogin.rows[0].email, name: queryLogin.rows[0].name },
      secrets.secretToken,
      { expiresIn: "60m", algorithm: "HS256" }
    );
    const account = {
      name: queryLogin.rows[0].name,
      email: queryLogin.rows[0].email,
      token: token,
    };
    res.status(200).json();
  } else {
    res.status(401).send("Invalid Login Information");
  }
}

import { Pool } from "pg";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from "express";

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
  res.status(401).send("Invalid Credentials");
}

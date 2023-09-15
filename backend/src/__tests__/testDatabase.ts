import fs from "fs";
import { Pool } from "pg";
import { postgres_variables } from "../config/processVariables";

export const pool = new Pool({
  host: postgres_variables.POSTGRES_HOST,
  port: 5432,
  database: postgres_variables.POSTGRES_DB,
  user: postgres_variables.POSTGRES_USER,
  password: postgres_variables.POSTGRES_PASSWORD,
});

async function runFile(file: string) {
  const file_content = fs.readFileSync(file, "utf8");
  const sql_commands = file_content.split(/\r?\n/);
  let command: string;
  for (command of sql_commands) {
    try {
      await pool.query(command);
    } catch (e) {
      console.log(`${e}\n`);
    }
  }
}

export async function startDatabase() {
  try {
    await runFile("src/db/sql/schema.sql");
    await runFile("src/db/sql/data.sql");
    await runFile("src/db/sql/indexes.sql");
  } catch (e) {
    console.log(`${e}\n`);
  }
}

export function end() {
    pool.end();
}

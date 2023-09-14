import { Pool } from "pg";
import { postgres_variables } from "../config/processVariables";

export const pool = new Pool({
  host: postgres_variables.POSTGRES_HOST,
  port: 5432,
  database: postgres_variables.POSTGRES_DB,
  user: postgres_variables.POSTGRES_USER,
  password: postgres_variables.POSTGRES_PASSWORD,
});

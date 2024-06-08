import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import pkg from "pg";

let { DB_CONNECTION } = process.env;

export const poolQuery = new pkg.Pool({
  connectionString: DB_CONNECTION,
  ssl: {
    rejectUnauthorized: false,
  },
});

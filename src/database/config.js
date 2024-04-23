import "dotenv/config";
import mysql from "mysql2/promise";
const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} = process.env;

import knex from "knex";
export const knexConnection = knex({
  client: "mysql2",
  connection: {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  },
  pool: { min: 0, max: 10 },
});
knexConnection.select(1).then((res) => console.log("database connected"));

export const pool = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  multipleStatements: true,
  port: DATABASE_PORT,
});

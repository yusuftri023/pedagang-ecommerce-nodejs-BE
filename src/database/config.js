import "dotenv/config";
import mysql from "mysql2/promise";
import knex from "knex";
const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} = process.env;

export const knexConnection = knex({
  client: "pg",
  connection: {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    database: DATABASE_NAME,
    password: DATABASE_PASSWORD,
    ssl: false ? { rejectUnauthorized: false } : false,
  },
  pool: {
    min: 0,
    max: 10,
  },
});
// const pg = require("knex")({
//   client: "pg",
//   connection: {
//     host: "aws-0-ap-southeast-1.pooler.supabase.com",
//     port: 6543,
//     user: "postgres.wrkeepqheqtybmystapb",
//     database: "postgres",
//     password: "mMaARb8mgpYFt8fa",
//     ssl: false ? { rejectUnauthorized: false } : false,
//   },
// });
// import dummy1 from "./dummy-1.json" with { type: "json" };
// import dummy2 from "./dummy-2.json" with { type: "json" };
// const dummy1map = dummy1.products.map((val) => {
//   return {
//     title: val.title,
//     description: val.description,
//     price: val.price,
//     image: val.thumbnail,
//     category: val.category,
//   };
// });
// const dummy2map = dummy2.map((val) => {
//   return {
//     title: val.title,
//     description: val.description,
//     price: val.price,
//     image: val.image,
//     category: val.category,
//   };
// });
// const allDummy = [...dummy1map, ...dummy2map].map(
//   ({ title, description, image }) => {
//     return {
//       title,
//       description,
//       image,
//       category_id: 3,
//     };
//   }
// );

// console.log(allDummy);

knexConnection.select(1).then(() => console.log("database connected"));
// knexConnection("product")
//   .insert(allDummy)
//   .onConflict("title")
//   .merge(["description", "image", "category_id"])
//   .then(() => console.log("insert success"));
// export const pool = mysql.createPool({
//   host: DATABASE_HOST,
//   user: DATABASE_USER,
//   database: DATABASE_NAME,
//   password: DATABASE_PASSWORD,
//   multipleStatements: true,
//   port: DATABASE_PORT,
// });

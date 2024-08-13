import express from "express";
// import https from "https";
// import fs from "fs";
import cors from "cors";
import "dotenv/config";
import router from "./routes/router.js";
import logger from "./middlewares/logger.js";
import cookieParser from "cookie-parser";

const app = express();
const { SERVER_PORT, SIGNED_COOKIE_SECRET, FRONT_END_DOMAIN } = process.env;
// const options = {
//   key: fs.readFileSync(
//     `./src/utils/SSL-Certificate/${FRONT_END_DOMAIN}-key.pem`
//   ),
//   cert: fs.readFileSync(`./src/utils/SSL-Certificate/${FRONT_END_DOMAIN}.pem`),
// };
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://127.0.0.1:5173",
      "https://127.0.0.1:8080",
      // `https://${FRONT_END_DOMAIN}:5173`,
      `https://${FRONT_END_DOMAIN}`,
      "https://pedagang-ecommerce.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser(SIGNED_COOKIE_SECRET));
app.use(logger);
app.use("/", router);
app.get("/", (req, res) => {
  return res.json({
    status: "success",
    message: "Welcome to HMS-Individual-API-Project",
  });
});
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not Found",
    data: null,
  });
});
app.listen(SERVER_PORT || 8080, () => {
  console.log(`Server is currently running`);
});
// https.createServer(options, app).listen(SERVER_PORT || 8080, () => {
//   console.log(`Server Running at 127.0.0.1:${SERVER_PORT || 8080}`);
// });

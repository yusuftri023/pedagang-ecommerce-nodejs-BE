import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import "dotenv/config";
import router from "./routes/router.js";
import logger from "./middlewares/logger.js";
import cookieParser from "cookie-parser";
const app = express();
const { SERVER_PORT, SIGNED_COOKIE_SECRET } = process.env;
const options = {
  key: fs.readFileSync("./src/utils/SSL-Certificate/127.0.0.1-key.pem"),
  cert: fs.readFileSync("./src/utils/SSL-Certificate/127.0.0.1.pem"),
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: "https://127.0.0.1:8080" }));
app.use(cookieParser(SIGNED_COOKIE_SECRET));
app.use(logger);
app.use("/", router);
app.get("/", (req, res) => {
  res.json({
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
https.createServer(options, app).listen(SERVER_PORT, () => {
  console.log(`Server Running at 127.0.0.1:${SERVER_PORT}`);
});

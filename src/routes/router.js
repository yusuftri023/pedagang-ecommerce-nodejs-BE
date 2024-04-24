import express from "express";
import customerRouter from "./customer/customer.js";
import authRouter from "./auth/auth.js";
import { auth } from "../middlewares/authJWT.js";
const router = express.Router();

router.use("/customers", auth, customerRouter);
router.use("/auth", authRouter);
export default router;

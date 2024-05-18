import express from "express";
import customerRouter from "./customer/customer.js";
import authRouter from "./auth/auth.js";
import { auth } from "../middlewares/authJWT.js";
import midtransRouter from "./midtrans/midtrans.js";
const router = express.Router();

router.use("/customers", auth, customerRouter);
router.use("/midtrans", midtransRouter);
router.use("/auth", authRouter);
export default router;

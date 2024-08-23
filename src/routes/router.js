import express from "express";
import customerRouter from "./customer/customer.js";
import authRouter from "./auth/auth.js";
import publicRouter from "./public/public.js";
import { auth } from "../middlewares/authJWT.js";
import midtransRouter from "./midtrans/midtrans.js";
import adminRouter from "./admin/admin.js";
const router = express.Router();

router.use("/customers", auth, customerRouter);
router.use("/admin", adminRouter);
router.use("/midtrans", midtransRouter);
router.use("/auth", authRouter);
router.use("/public", publicRouter);
export default router;

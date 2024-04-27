import express from "express";
import { customerPaymentDetail } from "../../../controllers/payment.js";

const router = express.Router();

router.get("/:paymentId", customerPaymentDetail);

export default router;

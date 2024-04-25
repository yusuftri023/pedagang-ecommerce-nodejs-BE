import express from "express";
import { midtransTransactionNotification } from "../../utils/midtrans.js";
const router = express.Router();
router.post("/order/finished", midtransTransactionNotification);
export default router;

import express from "express";
import { midtransTransactionNotification } from "../../controllers/midtrans.js";
const router = express.Router();

router.post("/order/notification", midtransTransactionNotification);
export default router;

import express from "express";
import {
  createOrder,
  customerOrderItemsList,
  customerOrders,
  paymentToken,
} from "../../../controllers/order.js";

const router = express.Router();

router.get("/:orderId", customerOrderItemsList);
router.get("/", customerOrders);
router.post("/", createOrder);
router.patch("/payment-link", paymentToken);

export default router;

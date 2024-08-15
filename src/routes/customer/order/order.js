import express from "express";
import {
  createOrder,
  customerOrderItemsList,
  customerOrders,
  newOrderLink,
} from "../../../controllers/order.js";

const router = express.Router();

router.get("/:orderId", customerOrderItemsList);
router.get("/", customerOrders);
router.post("/", createOrder);
router.patch("/payment-link", newOrderLink);

export default router;

import express from "express";
import {
  createOrder,
  customerOrderItemsList,
  customerOrders,
} from "../../../controllers/order.js";

const router = express.Router();

router.get("/:orderId", customerOrderItemsList);
router.get("/", customerOrders);
router.post("/", createOrder);

export default router;

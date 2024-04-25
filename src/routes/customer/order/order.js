import express from "express";
import { createOrder } from "../../../controllers/order.js";

const router = express.Router();

// router.get("/cart", cartLists);

router.post("/", createOrder);
// router.patch("/cart/:cartId", changeChartItemQuantity);
// router.delete("/cart/:cartId/delete", deleteCartItem);

export default router;

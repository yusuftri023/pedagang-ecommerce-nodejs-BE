import express from "express";
import {
  addToCart,
  cartLists,
  changeChartItemQuantity,
  deleteCartItem,
} from "../../../controllers/cart.js";

const router = express.Router();

router.get("/", cartLists);
router.post("/", addToCart);
router.patch("/", changeChartItemQuantity);
router.delete("/:cartId", deleteCartItem);

export default router;

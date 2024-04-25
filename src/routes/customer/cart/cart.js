import express from "express";
import {
  addToCart,
  cartLists,
  changeChartItemQuantity,
  deleteCartItem,
} from "../../../controllers/cart.js";

const router = express.Router();

router.get("/", cartLists);
router.post("/:productId", addToCart);
router.patch("/:cartId", changeChartItemQuantity);
router.delete("/:cartId/delete", deleteCartItem);

export default router;

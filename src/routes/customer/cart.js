import express from "express";
import {
  addToCart,
  cartLists,
  changeChartItemQuantity,
  deleteCartItem,
} from "../../controllers/cart";

const router = express.Router();

router.get("/cart", cartLists);
router.post("/cart/:productId", addToCart);
router.patch("/cart/:cartId", changeChartItemQuantity);
router.delete("/cart/:cartId/delete", deleteCartItem);

export default router;

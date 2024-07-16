import express from "express";
import {
  addToCart,
  cartLists,
  changeChartItemQuantity,
  deleteCartItem,
  postCartItemNote,
} from "../../../controllers/cart.js";

const router = express.Router();

router.get("/", cartLists);
router.post("/", addToCart);
router.post("/note", postCartItemNote);
router.patch("/", changeChartItemQuantity);
router.delete("/:cartId", deleteCartItem);

export default router;

import express from "express";
import {
  addWishlist,
  customerWishlist,
  deleteWishlist,
} from "../../../controllers/wishlist.js";

const router = express.Router();
router.get("/wishlist", customerWishlist);
router.post("/wishlist/:productId", addWishlist);
router.delete("/wishlist/:wishlistId/delete", deleteWishlist);

export default router;

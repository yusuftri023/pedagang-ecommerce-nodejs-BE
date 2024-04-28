import express from "express";
import {
  addWishlist,
  customerWishlist,
  deleteWishlist,
} from "../../../controllers/wishlist.js";

const router = express.Router();
router.get("/", customerWishlist);
router.post("/", addWishlist);
router.delete("/:wishlistId", deleteWishlist);

export default router;

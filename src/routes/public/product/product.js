import express from "express";
import {
  allProduct,
  detailProduct,
  detailProductVariation,
  productRating,
  productReview,
  searchProduct,
} from "../../../controllers/product.js";

const router = express.Router();

router.get("/", allProduct);
router.get("/search", searchProduct);
router.get("/:productId", detailProduct);
router.get("/:productId/rating", productRating);
router.get("/:productId/reviews", productReview);
router.get("/:productId/variation/:variationId", detailProductVariation);
export default router;

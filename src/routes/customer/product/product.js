import express from "express";
import {
  addProduct,
  deleteProduct,
  detailProduct,
  detailProductVariation,
} from "../../../controllers/product.js";

const router = express.Router();

router.get("/:productId", detailProduct);
router.get("/:productId/variation/:variationId", detailProductVariation);
router.post("/", addProduct);
router.delete("/:productId", deleteProduct);

export default router;

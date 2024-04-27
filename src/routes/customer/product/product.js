import express from "express";
import {
  addProduct,
  deleteProduct,
  detailProduct,
} from "../../../controllers/product.js";

const router = express.Router();

router.get("/:productId", detailProduct);
router.post("/", addProduct);
router.delete("/:productId/delete", deleteProduct);

export default router;

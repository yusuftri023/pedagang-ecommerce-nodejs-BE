import express from "express";
import { addProduct, deleteProduct } from "../../../controllers/product.js";
const router = express.Router();
router.post("/", addProduct);
router.delete("/:productId", deleteProduct);

export default router;

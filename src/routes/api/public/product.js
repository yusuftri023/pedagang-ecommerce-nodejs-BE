import express from "express";
import { allProduct, searchProduct } from "../../../controllers/product.js";

const router = express.Router();

router.get("/products", allProduct);
router.get("/products/search", searchProduct);
export default router;

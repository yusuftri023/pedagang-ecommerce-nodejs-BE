import express from "express";
import { updateProductInTransaction } from "../../../controllers/product.js";

const router = express.Router();

router.patch("/decrease-stock", updateProductInTransaction);

export default router;

import express from "express";
import productRouter from "./public/product.js";
const router = express.Router();
router.use("/public", productRouter);
export default router;

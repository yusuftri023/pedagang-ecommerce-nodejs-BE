import express from "express";
import productRouter from "./product/product.js";
import imageKitRouter from "./imageKit/imageKit.js";
const router = express.Router();
router.use("/product", productRouter);
router.use("/image-kit", imageKitRouter);
export default router;

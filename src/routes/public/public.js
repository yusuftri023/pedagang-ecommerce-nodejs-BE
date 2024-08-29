import express from "express";
import productRouter from "./product/product.js";
import imageKitRouter from "./imageKit/imageKit.js";
import categoryRouter from "./category/category.js";
const router = express.Router();
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/image-kit", imageKitRouter);
export default router;

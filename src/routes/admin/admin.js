import express from "express";
import productRouter from "./product/product.js";
import orderRouter from "./order/order.js";
import accountRouter from "./account/account.js";
import promotionRouter from "./promotion/promotion.js";
import authRouter from "./auth/auth.js";
const router = express.Router();

router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/account", accountRouter);
router.use("/promotion", promotionRouter);
router.use("/auth", authRouter);
export default router;

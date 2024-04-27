import express from "express";

import {
  changePicture,
  changepassword,
  customer,
  deleteCustomer,
} from "../../controllers/customer.js";
import { imageUpload } from "../../middlewares/multer.js";
import { imagekitUpload } from "../../middlewares/imagekit.js";
import addressRouter from "./address/address.js";
import cartRouter from "./cart/cart.js";
import orderRouter from "./order/order.js";
import wishlistRouter from "./wishlist/wishlist.js";
import paymentRouter from "./payment/payment.js";
import categoryRouter from "./category/category.js";
import promotionRouter from "./promotion/promotion.js";
import variationRouter from "./variation/variation.js";
import productRouter from "./product/product.js";
const router = express.Router();
router.use("/address", addressRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/wishlist", wishlistRouter);
router.use("/payment", paymentRouter);
router.use("/category", categoryRouter);
router.use("/promotion", promotionRouter);
router.use("/variation", variationRouter);
router.use("/product", productRouter);
router.get("/profile", customer);
router.patch(
  "/changepicture",
  imageUpload.single("image"),
  imagekitUpload,
  changePicture
);
router.patch("/changepassword", changepassword);
router.delete("/delete", deleteCustomer);

export default router;

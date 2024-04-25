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
const router = express.Router();
router.use("/address", addressRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/wishlist", wishlistRouter);
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

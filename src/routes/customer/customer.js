import express from "express";

import {
  changePicture,
  changepassword,
  customer,
  deleteCustomer,
} from "../../controllers/customer.js";
import { imageUpload } from "../../middlewares/multer.js";
import { imagekitUpload } from "../../middlewares/imagekit.js";
const router = express.Router();
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

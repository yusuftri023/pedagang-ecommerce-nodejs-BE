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

router.get("/:id", customer);
router.patch(
  "/:id/changepicture",
  imageUpload.single("image"),
  imagekitUpload,
  changePicture
);
router.patch("/:id/changepassword", changepassword);
router.delete("/:id", deleteCustomer);

export default router;

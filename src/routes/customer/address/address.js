import express from "express";
import {
  addCustomerAddress,
  changeAddressDetails,
  changeSelectedAddress,
  customerAddress,
  deleteAddress,
} from "../../../controllers/address.js";

const router = express.Router();
router.get("/", customerAddress);
router.post("/:productId", addCustomerAddress);
router.patch("/:addressId", changeAddressDetails);
router.patch("/:addressId", changeSelectedAddress);
router.delete("/:addressId/delete", deleteAddress);

export default router;

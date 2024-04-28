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
router.post("/", addCustomerAddress);
router.patch("/:addressId", changeAddressDetails);
router.patch("/:addressId/select", changeSelectedAddress);
router.delete("/:addressId", deleteAddress);

export default router;

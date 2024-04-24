import express from "express";
import {
  addCustomerAddress,
  changeAddressDetails,
  changeSelectedAddress,
  customerAddress,
  deleteAddress,
} from "../../controllers/address";

const router = express.Router();
router.get("/address", customerAddress);
router.post("/address/:productId", addCustomerAddress);
router.patch("/address/:addressId", changeAddressDetails);
router.patch("/address/:addressId", changeSelectedAddress);
router.delete("/address/:addressId/delete", deleteAddress);

export default router;

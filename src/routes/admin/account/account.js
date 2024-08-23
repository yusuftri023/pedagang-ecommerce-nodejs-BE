import express from "express";
import { adminDeleteCustomer } from "../../../controllers/customer.js";
const router = express.Router();

router.delete("/", adminDeleteCustomer);
export default router;

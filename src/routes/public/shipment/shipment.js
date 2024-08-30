import express from "express";
import { city, province } from "../../../controllers/shipment.js";

const router = express.Router();
router.get("/province", province);
router.get("/city", city);
export default router;

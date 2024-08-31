import express from "express";
import { city, province, shipmentCost } from "../../../controllers/shipment.js";

const router = express.Router();
router.get("/province", province);
router.get("/city", city);
router.post("/cost", shipmentCost);
export default router;

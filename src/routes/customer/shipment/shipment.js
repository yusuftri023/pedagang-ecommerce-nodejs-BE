import express from "express";

import { customerShipment } from "../../../controllers/shipment.js";

const router = express.Router();

router.get("/:shipmentId", customerShipment);

export default router;

import express from "express";
import {
  addPromotion,
  deletePromotion,
} from "../../../controllers/promotion.js";
const router = express.Router();
router.post("/", addPromotion);
router.delete("/:promotionId", deletePromotion);
export default router;

import express from "express";
import {
  addPromotion,
  allPromotion,
  deletePromotion,
} from "../../../controllers/promotion.js";

const router = express.Router();

router.get("/", allPromotion);
router.post("/", addPromotion);
router.delete("/:promotionId", deletePromotion);

export default router;

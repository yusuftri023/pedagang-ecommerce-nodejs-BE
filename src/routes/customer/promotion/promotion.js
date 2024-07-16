import express from "express";
import {
  addPromotion,
  allPromotion,
  deletePromotion,
  usePromotion,
} from "../../../controllers/promotion.js";

const router = express.Router();

router.get("/", allPromotion);
router.get("/use/:promotionCode", usePromotion);
router.post("/", addPromotion);
router.delete("/:promotionId", deletePromotion);

export default router;

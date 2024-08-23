import express from "express";
import { allPromotion, usePromotion } from "../../../controllers/promotion.js";

const router = express.Router();

router.get("/", allPromotion);
router.get("/use/:promotionCode", usePromotion);

export default router;

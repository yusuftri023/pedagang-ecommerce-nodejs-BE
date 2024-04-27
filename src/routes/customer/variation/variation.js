import express from "express";
import {
  addVariation,
  allVariationInCategory,
  deleteVariation,
} from "../../../controllers/variation.js";

const router = express.Router();

router.get("/categories/:categoryId", allVariationInCategory);
router.post("/", addVariation);
router.delete("/:variationId", deleteVariation);

export default router;

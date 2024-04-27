import express from "express";
import { addCategory, allCategory } from "../../../controllers/category.js";

const router = express.Router();

router.get("/", allCategory);
router.post("/", addCategory);

export default router;

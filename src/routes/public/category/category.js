import express from "express";
import { allCategory } from "../../../controllers/category.js";

const router = express.Router();

router.get("/", allCategory);

export default router;

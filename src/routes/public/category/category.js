import express from "express";
import { allCategory } from "../../../controllers/category";

const router = express.Router();

router.get("/", allCategory);

export default router;

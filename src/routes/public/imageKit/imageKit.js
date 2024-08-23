import express from "express";
import { imagekitTokenizer } from "../../../middlewares/imagekit.js";

const router = express.Router();
router.get("/token", imagekitTokenizer);
export default router;

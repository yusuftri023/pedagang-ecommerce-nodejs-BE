import express from "express";
import { login, logout, register } from "../../controllers/customer.js";
import { auth } from "../../middlewares/authJWT.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", auth, logout);
export default router;

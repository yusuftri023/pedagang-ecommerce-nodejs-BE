import express from "express";
import {
  generateGoogleLoginURL,
  googleLogin,
  login,
  logout,
  register,
} from "../../controllers/customer.js";
import { auth } from "../../middlewares/authJWT.js";

import { configDotenv } from "dotenv";
const { SIGNED_COOKIE_SECRET } = process.env;
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/refresh", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Authenticated",
    data: req.decodedToken,
  });
});
router.get("/google", generateGoogleLoginURL);
router.get("/google/callback", googleLogin);
export default router;

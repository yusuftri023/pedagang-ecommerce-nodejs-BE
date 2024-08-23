import express from "express";
import { auth } from "../../../middlewares/authJWT.js";
import { login, logout } from "../../../controllers/customer.js";
const router = express.Router();

router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/refresh", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Authenticated",
    data: req.decodedToken,
  });
});
export default router;

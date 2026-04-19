import express from "express";
import {
  signup,
  verifyOtp,
  resendOtp,
  login,
  getMe,
  updateMe,
} from "../controller/auth.controller.js";
import verifyAuthentication from "../middlewares/verifyAuth.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(login);
router.route("/me").get(verifyAuthentication, getMe).put(verifyAuthentication, updateMe);

export default router;

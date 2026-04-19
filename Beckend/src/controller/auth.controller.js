import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendTokenResponse } from "../utils/jwt.utils.js";
import { generateOtp, sendOtpEmail } from "../utils/otpEmail.js";
import { serializeUser, splitCsv } from "../utils/community.utils.js";

const allowedRoles = User.allowedRoles || ["Need Help", "Can Help", "Both"];

const createAccountWithOtp = async (
  { name, email, password, role },
  res,
  successMessage,
) => {
  const exists = await User.findOne({ email }).select(
    "+password +otp +otpExpires",
  );
  if (exists) {
    if (exists.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    }

    const otp = generateOtp();
    exists.name = name;
    exists.password = password;
    exists.role = role;
    exists.otp = otp;
    exists.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await exists.save();

    await sendOtpEmail({ email, otp, name });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
      role,
    });
  }

  const otp = generateOtp();
  const user = await User.create({
    name,
    email,
    password,
    role,
    isVerified: false,
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail({ email, otp, name });

  return res.status(201).json({
    success: true,
    message: successMessage,
    userId: user._id,
    role,
  });
};

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword || !role) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password must match.",
    });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}.`,
    });
  }

  return createAccountWithOtp(
    { name, email, password, role },
    res,
    "Account created. OTP sent to email.",
  );
});

// POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required." });
  }

  const user = await User.findOne({ email }).select(
    "+otp +otpExpires +password",
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (user.isVerified) {
    return res
      .status(200)
      .json({ success: true, message: "User already verified." });
  }

  if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
    return res
      .status(400)
      .json({ success: false, message: "OTP expired. Please resend OTP." });
  }

  if (String(user.otp) !== String(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save({ validateModifiedOnly: true });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
});

// POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  const user = await User.findOne({ email }).select("+otp +otpExpires");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (user.isVerified) {
    return res
      .status(400)
      .json({ success: false, message: "User is already verified." });
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateModifiedOnly: true });

  await sendOtpEmail({ email: user.email, otp, name: user.name });

  return res
    .status(200)
    .json({ success: true, message: "OTP resent successfully." });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required." });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password." });
  }

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ success: false, message: "Please verify your email first." });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, "Login successful!");
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.json({ success: true, user: serializeUser(user, { includeEmail: true }) });
});

// PUT /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const { name, role, location, skills, interests } = req.body;

  if (typeof name === "string" && name.trim()) {
    user.name = name.trim();
  }

  if (typeof role === "string" && allowedRoles.includes(role)) {
    user.role = role;
  }

  if (typeof location === "string") {
    user.location = location.trim() || "Remote";
  }

  if (skills !== undefined) {
    user.skills = Array.isArray(skills) ? skills : splitCsv(skills);
  }

  if (interests !== undefined) {
    user.interests = Array.isArray(interests) ? interests : splitCsv(interests);
  }

  await user.save({ validateModifiedOnly: true });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: serializeUser(user, { includeEmail: true }),
  });
});

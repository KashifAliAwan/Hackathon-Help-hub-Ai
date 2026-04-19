import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { serializeUser } from "../utils/community.utils.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ trustScore: -1, contributions: -1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    users: users.map((user) =>
      serializeUser(user, { includeEmail: String(user._id) === String(req.user.id) }),
    ),
  });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ trustScore: -1, contributions: -1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    leaderboard: users.map((user) => serializeUser(user)).slice(0, 20),
  });
});

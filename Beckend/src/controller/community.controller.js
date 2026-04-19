import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import Request from "../models/request.model.js";
import Notification from "../models/notification.model.js";
import Message from "../models/message.model.js";
import {
  deriveSkillSuggestions,
  getTopCategory,
  serializeMessage,
  serializeNotification,
  serializeRequest,
  serializeUser,
} from "../utils/community.utils.js";

async function loadCommunityState(userId) {
  const [currentUser, users, requests, notifications, messages] = await Promise.all([
    User.findById(userId),
    User.find().sort({ trustScore: -1, contributions: -1, createdAt: -1 }),
    Request.find()
      .populate("author")
      .populate("helpers")
      .sort({ createdAt: -1 }),
    Notification.find({ userId }).sort({ createdAt: -1 }),
    Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender")
      .populate("recipient")
      .sort({ createdAt: -1 }),
  ]);

  if (!currentUser) {
    return null;
  }

  return {
    currentUser: serializeUser(currentUser, { includeEmail: true }),
    users: users.map((user) =>
      serializeUser(user, { includeEmail: String(user._id) === String(userId) }),
    ),
    requests: requests.map((request) => serializeRequest(request)),
    notifications: notifications.map((notification) =>
      serializeNotification(notification),
    ),
    messages: messages.map((message) => serializeMessage(message)),
  };
}

export const getBootstrap = asyncHandler(async (req, res) => {
  const data = await loadCommunityState(req.user.id);

  if (!data) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  return res.status(200).json({ success: true, data });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await loadCommunityState(req.user.id);

  if (!data) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const currentUser = data.currentUser;
  const requests = data.requests;
  const notifications = data.notifications;

  const stats = [
    {
      label: "Trust score",
      value: `${currentUser.trustScore}%`,
      description: "Driven by solved requests and consistent support.",
    },
    {
      label: "Helping",
      value: requests.filter((request) => request.helperIds.includes(currentUser.id)).length,
      description: "Requests where you are currently listed as a helper.",
    },
    {
      label: "Open requests",
      value: requests.filter((request) => request.status === "Open").length,
      description: "Community requests currently active across the feed.",
    },
    {
      label: "AI pulse",
      value: `${requests.filter((request) => request.category === "Career").length} trends`,
      description: "Trend count detected in the latest request activity.",
    },
  ];

  const aiInsights = [
    {
      label: "Most requested category",
      value: getTopCategory(requests),
    },
    {
      label: "Your strongest trust driver",
      value: currentUser.badges[0] || "Top Mentor",
    },
    {
      label: "AI says you can mentor in",
      value: deriveSkillSuggestions(currentUser).helpWith.join(", "),
    },
    {
      label: "Your active requests",
      value: requests
        .filter((request) => request.requesterId === currentUser.id)
        .length.toString(),
    },
  ];

  return res.status(200).json({
    success: true,
    dashboard: {
      currentUser,
      stats,
      aiInsights,
      requests: requests.slice(0, 8),
      notifications: notifications.slice(0, 4),
    },
  });
});

export const getInsights = asyncHandler(async (req, res) => {
  const data = await loadCommunityState(req.user.id);

  if (!data) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const suggestions = deriveSkillSuggestions(data.currentUser);
  const requests = data.requests;
  const users = data.users;

  const insights = [
    {
      label: "Trend Pulse",
      value: getTopCategory(requests),
      desc: "Most common support area based on active community requests.",
    },
    {
      label: "Urgency Watch",
      value: requests.filter(
        (request) => request.urgency === "High" || request.urgency === "Critical",
      ).length.toString(),
      desc: "Requests currently flagged high priority by the urgency detector.",
    },
    {
      label: "Mentor Pool",
      value: users
        .filter((user) => user.trustScore >= 85)
        .length.toString(),
      desc: "Trusted helpers with strong response history and contribution signals.",
    },
  ];

  return res.status(200).json({
    success: true,
    aiCenter: {
      suggestions,
      insights,
      recommendedRequests: requests.slice(0, 6),
    },
  });
});

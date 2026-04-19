import asyncHandler from "../utils/asyncHandler.js";
import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import {
  buildAiSummary,
  detectUrgency,
  normalizeUrgency,
  serializeRequest,
  splitCsv,
  suggestCategory,
  suggestTags,
} from "../utils/community.utils.js";

async function loadRequest(requestId) {
  return Request.findById(requestId).populate("author").populate("helpers");
}

export const listRequests = asyncHandler(async (req, res) => {
  const { category, urgency, skill, location, status } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (urgency) {
    query.urgency = normalizeUrgency(urgency);
  }

  if (status) {
    query.status = status === "Solved" ? "Solved" : "Open";
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (skill) {
    query.$or = [
      { tags: { $regex: skill, $options: "i" } },
      { title: { $regex: skill, $options: "i" } },
      { description: { $regex: skill, $options: "i" } },
    ];
  }

  const requests = await Request.find(query)
    .populate("author")
    .populate("helpers")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    requests: requests.map((request) => serializeRequest(request)),
  });
});

export const getRequestById = asyncHandler(async (req, res) => {
  const request = await loadRequest(req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found." });
  }

  return res.status(200).json({
    success: true,
    request: serializeRequest(request),
  });
});

export const createRequest = asyncHandler(async (req, res) => {
  const { title, description, tags, category, urgency, location } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required.",
    });
  }

  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const normalizedTags = splitCsv(tags);
  const normalizedCategory = category?.trim() || suggestCategory(`${title} ${description}`);
  const normalizedUrgency = urgency
    ? normalizeUrgency(urgency)
    : detectUrgency(`${title} ${description}`);

  const request = await Request.create({
    title: title.trim(),
    description: description.trim(),
    tags: normalizedTags.length ? normalizedTags : suggestTags(`${title} ${description}`),
    category: normalizedCategory,
    urgency: normalizedUrgency,
    location: location?.trim() || currentUser.location || "Remote",
    status: "Open",
    author: currentUser._id,
    helpers: [],
    aiSummary: buildAiSummary({
      title,
      description,
      category: normalizedCategory,
      urgency: normalizedUrgency,
      tags: normalizedTags,
    }),
  });

  await Notification.create({
    userId: currentUser._id,
    type: "Request",
    message: `Your request "${request.title}" is now live in the community feed`,
  });

  const populatedRequest = await loadRequest(request._id);

  return res.status(201).json({
    success: true,
    message: "Request published successfully.",
    request: serializeRequest(populatedRequest),
  });
});

export const volunteerForRequest = asyncHandler(async (req, res) => {
  const request = await loadRequest(req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found." });
  }

  const helperUser = await User.findById(req.user.id);
  if (!helperUser) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (String(request.author._id) === String(helperUser._id)) {
    return res.status(400).json({
      success: false,
      message: "You cannot volunteer on your own request.",
    });
  }

  if (!["Can Help", "Both"].includes(helperUser.role)) {
    return res.status(403).json({
      success: false,
      message: "Only helpers can volunteer for requests.",
    });
  }

  if (request.helpers.some((helper) => String(helper._id) === String(helperUser._id))) {
    return res.status(200).json({
      success: true,
      message: "You are already listed as a helper.",
      request: serializeRequest(request),
    });
  }

  request.helpers.push(helperUser._id);
  await request.save({ validateModifiedOnly: true });

  helperUser.trustScore = Math.min(100, (helperUser.trustScore || 70) + 1);
  await helperUser.save({ validateModifiedOnly: true });

  await Notification.create({
    userId: request.author._id,
    type: "Match",
    message: `${helperUser.name} offered help on "${request.title}"`,
  });

  const updatedRequest = await loadRequest(request._id);

  return res.status(200).json({
    success: true,
    message: "You have been added to the helper pool.",
    request: serializeRequest(updatedRequest),
  });
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await loadRequest(req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found." });
  }

  const nextStatus = req.body.status === "Solved" ? "Solved" : "Open";
  const actorId = String(req.user.id);
  const isRequester = String(request.author._id) === actorId;
  const isHelper = request.helpers.some((helper) => String(helper._id) === actorId);

  if (!isRequester && !isHelper) {
    return res.status(403).json({
      success: false,
      message: "Only the requester or a helper can update this request.",
    });
  }

  const wasSolvedNow = request.status !== "Solved" && nextStatus === "Solved";
  request.status = nextStatus;
  await request.save({ validateModifiedOnly: true });

  if (wasSolvedNow) {
    const actor = await User.findById(actorId);

    if (actor) {
      actor.trustScore = Math.min(100, (actor.trustScore || 70) + 3);
      actor.contributions = (actor.contributions || 0) + 1;
      actor.badges = actor.badges?.length ? actor.badges : ["New Member"];

      if (actor.trustScore >= 90 && !actor.badges.includes("Top Mentor")) {
        actor.badges.push("Top Mentor");
      }

      await actor.save({ validateModifiedOnly: true });
    }

    await Notification.create({
      userId: request.author._id,
      type: "Status",
      message: `"${request.title}" was marked as solved`,
    });
  }

  const updatedRequest = await loadRequest(request._id);

  return res.status(200).json({
    success: true,
    message:
      nextStatus === "Solved"
        ? "Request marked as solved."
        : "Request reopened successfully.",
    request: serializeRequest(updatedRequest),
  });
});

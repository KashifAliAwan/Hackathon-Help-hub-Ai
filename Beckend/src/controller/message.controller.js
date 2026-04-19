import asyncHandler from "../utils/asyncHandler.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { serializeMessage } from "../utils/community.utils.js";

async function loadMessage(messageId) {
  return Message.findById(messageId).populate("sender").populate("recipient");
}

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.user.id }, { recipient: req.user.id }],
  })
    .populate("sender")
    .populate("recipient")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    messages: messages.map((message) => serializeMessage(message)),
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, text, requestId } = req.body;

  if (!recipientId || !text?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Recipient and message text are required.",
    });
  }

  if (String(recipientId) === String(req.user.id)) {
    return res.status(400).json({
      success: false,
      message: "You cannot send a message to yourself.",
    });
  }

  const recipient = await User.findById(recipientId);

  if (!recipient) {
    return res.status(404).json({ success: false, message: "Recipient not found." });
  }

  const message = await Message.create({
    sender: req.user.id,
    recipient: recipient._id,
    requestId: requestId || null,
    content: text.trim(),
  });

  await Notification.create({
    userId: recipient._id,
    type: "Message",
    message: `New message from ${req.user.name || "a community member"}`,
  });

  const populatedMessage = await loadMessage(message._id);

  return res.status(201).json({
    success: true,
    message: "Message sent.",
    data: serializeMessage(populatedMessage),
  });
});

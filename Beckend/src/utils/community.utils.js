const CATEGORY_RULES = {
  "Web Development": [
    "website",
    "frontend",
    "javascript",
    "html",
    "css",
    "react",
    "bug",
    "responsive",
    "next",
  ],
  Design: ["design", "figma", "ui", "ux", "poster", "brand"],
  Career: ["resume", "career", "job", "interview", "linkedin", "portfolio"],
  Academics: ["math", "assignment", "physics", "chemistry", "study", "exam"],
  Content: ["writing", "content", "script", "copy", "blog"],
  Community: ["event", "volunteer", "community", "coordination", "mentor"],
};

const URGENCY_RULES = [
  {
    level: "Critical",
    words: ["asap", "urgent", "deadline", "today"],
  },
  {
    level: "High",
    words: ["soon", "issue", "blocked", "tomorrow"],
  },
  {
    level: "Medium",
    words: ["guidance", "review", "feedback"],
  },
];

const SKILLS = [
  "JavaScript",
  "HTML/CSS",
  "React",
  "Node.js",
  "Python",
  "UI/UX",
  "Graphic Design",
  "Content Writing",
  "Public Speaking",
  "Data Analysis",
  "Math Tutoring",
  "Career Guidance",
  "Git/GitHub",
  "Figma",
  "Firebase",
  "Interview Prep",
  "Next.js",
  "Tailwind",
];

export function splitCsv(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
  }

  if (typeof value !== "string") {
    return [];
  }

  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

export function normalizeUrgency(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "critical" || normalized === "urgent") {
    return "Critical";
  }

  if (normalized === "high") {
    return "High";
  }

  if (normalized === "medium") {
    return "Medium";
  }

  return "Low";
}

export function suggestCategory(text) {
  const normalized = String(text || "").toLowerCase();
  let bestCategory = "Community";
  let bestScore = 0;

  Object.entries(CATEGORY_RULES).forEach(([category, words]) => {
    const score = words.reduce(
      (total, word) => total + Number(normalized.includes(word)),
      0,
    );

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  return bestCategory;
}

export function detectUrgency(text) {
  const normalized = String(text || "").toLowerCase();

  for (const rule of URGENCY_RULES) {
    if (rule.words.some((word) => normalized.includes(word))) {
      return rule.level;
    }
  }

  return "Low";
}

export function suggestTags(text) {
  const normalized = String(text || "").toLowerCase();
  const tags = SKILLS.filter(
    (skill) =>
      normalized.includes(skill.toLowerCase()) ||
      normalized.includes(skill.toLowerCase().replace("/", "")),
  ).slice(0, 4);

  if (normalized.includes("portfolio")) {
    tags.push("Portfolio");
  }

  if (normalized.includes("responsive")) {
    tags.push("Responsive");
  }

  if (normalized.includes("interview")) {
    tags.push("Interview Prep");
  }

  if (normalized.includes("design")) {
    tags.push("Design Review");
  }

  return [...new Set(tags)].slice(0, 5);
}

export function buildAiSummary({ title, description, category, urgency, tags }) {
  const summaryBits = [
    `${category} request`,
    `${normalizeUrgency(urgency).toLowerCase()} urgency`,
  ];

  if (tags?.length) {
    summaryBits.push(`best helpers know ${tags.join(", ")}`);
  }

  if (description) {
    summaryBits.push(description.trim().slice(0, 140));
  } else if (title) {
    summaryBits.push(title.trim());
  }

  return `AI summary: ${summaryBits.join(". ")}.`;
}

export function formatRelativeTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString();
}

export function serializeUser(user, options = {}) {
  if (!user) {
    return null;
  }

  const {
    includeEmail = false,
  } = options;

  return {
    id: String(user._id),
    name: user.name,
    email: includeEmail ? user.email : undefined,
    role: user.role,
    location: user.location || "Remote",
    interests: user.interests || [],
    skills: user.skills || [],
    trustScore: user.trustScore ?? 70,
    badges: user.badges?.length ? user.badges : ["New Member"],
    contributions: user.contributions ?? 0,
    isVerified: Boolean(user.isVerified),
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  };
}

export function serializeRequest(request) {
  if (!request) {
    return null;
  }

  const requester =
    request.author && typeof request.author === "object"
      ? serializeUser(request.author)
      : null;

  const helpers = Array.isArray(request.helpers)
    ? request.helpers
        .filter((helper) => helper && typeof helper === "object")
        .map((helper) => serializeUser(helper))
    : [];

  const helperIds = helpers.length
    ? helpers.map((helper) => helper.id)
    : Array.isArray(request.helpers)
      ? request.helpers.map((helper) => String(helper))
      : [];

  return {
    id: String(request._id),
    title: request.title,
    description: request.description,
    tags: request.tags || [],
    category: request.category,
    urgency: normalizeUrgency(request.urgency),
    location: request.location || requester?.location || "Remote",
    requesterId:
      requester?.id ||
      (request.author ? String(request.author) : ""),
    helperIds,
    status: request.status === "Solved" ? "Solved" : "Open",
    aiSummary:
      request.aiSummary ||
      buildAiSummary({
        title: request.title,
        description: request.description,
        category: request.category,
        urgency: request.urgency,
        tags: request.tags,
      }),
    requester,
    helpers,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

export function serializeNotification(notification) {
  if (!notification) {
    return null;
  }

  return {
    id: String(notification._id),
    title: notification.message,
    type: notification.type,
    status: notification.read ? "Read" : "Unread",
    time: formatRelativeTime(notification.createdAt),
    createdAt: notification.createdAt,
  };
}

export function serializeMessage(message) {
  if (!message) {
    return null;
  }

  const sender =
    message.sender && typeof message.sender === "object"
      ? serializeUser(message.sender)
      : null;
  const recipient =
    message.recipient && typeof message.recipient === "object"
      ? serializeUser(message.recipient)
      : null;

  return {
    id: String(message._id),
    from: sender?.name || "Unknown user",
    fromId: sender?.id || String(message.sender),
    to: recipient?.name || "Unknown user",
    toId: recipient?.id || String(message.recipient),
    text: message.content,
    time: formatRelativeTime(message.createdAt),
    createdAt: message.createdAt,
    requestId: message.requestId ? String(message.requestId) : null,
  };
}

export function deriveSkillSuggestions(user) {
  const source = [...(user?.interests || []), ...(user?.skills || [])]
    .join(" ")
    .toLowerCase();

  const helpWith = SKILLS.filter(
    (item) =>
      source.includes(item.toLowerCase()) ||
      item.split(" ").some((part) => source.includes(part.toLowerCase())),
  ).slice(0, 4);

  const needHelp = SKILLS.filter(
    (item) => !helpWith.includes(item) && !(user?.skills || []).includes(item),
  ).slice(0, 4);

  return {
    helpWith: helpWith.length
      ? helpWith
      : ["UI/UX", "Career Guidance", "Public Speaking"],
    needHelp: needHelp.length ? needHelp : ["Git/GitHub", "Interview Prep", "React"],
  };
}

export function getTopCategory(requests) {
  const counts = requests.reduce((accumulator, request) => {
    accumulator[request.category] = (accumulator[request.category] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Community";
}

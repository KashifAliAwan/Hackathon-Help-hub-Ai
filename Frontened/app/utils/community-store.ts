"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import api from "./api";
import type { AuthSession, CommunityRole } from "./auth-session";

export type CommunityUser = {
  id: string;
  name: string;
  email?: string;
  role: CommunityRole;
  location: string;
  interests: string[];
  skills: string[];
  trustScore: number;
  badges: string[];
  contributions: number;
};

export type CommunityRequest = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  urgency: "Critical" | "High" | "Medium" | "Low";
  location: string;
  requesterId: string;
  helperIds: string[];
  status: "Open" | "Solved";
  aiSummary: string;
  requester?: CommunityUser | null;
  helpers?: CommunityUser[];
};

export type CommunityNotification = {
  id: string;
  title: string;
  type: string;
  status: "Unread" | "Read";
  time: string;
};

export type CommunityMessage = {
  id: string;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  text: string;
  time: string;
  requestId?: string | null;
};

export type CommunityState = {
  currentUser: CommunityUser | null;
  users: CommunityUser[];
  requests: CommunityRequest[];
  notifications: CommunityNotification[];
  messages: CommunityMessage[];
};

const CATEGORY_RULES: Record<string, string[]> = {
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
    level: "Critical" as const,
    words: ["asap", "urgent", "deadline", "today"],
  },
  { level: "High" as const, words: ["soon", "issue", "blocked", "tomorrow"] },
  { level: "Medium" as const, words: ["guidance", "review", "feedback"] },
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

const emptyState: CommunityState = {
  currentUser: null,
  users: [],
  requests: [],
  notifications: [],
  messages: [],
};

async function fetchCommunityState() {
  const response = await api.get("/api/community/bootstrap");
  return response.data.data as CommunityState;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    const message = data?.message?.trim();

    if (message) {
      if (/recipient not found/i.test(message)) {
        return "Recipient not found.";
      }

      if (/user not found/i.test(message)) {
        return "User not found.";
      }

      return message;
    }

    if (error.response?.status === 404) {
      return "User not found.";
    }

    return fallback;
  }

  return fallback;
}

export function useCommunityStore() {
  const [state, setState] = useState<CommunityState>(emptyState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setIsLoading(true);

    try {
      const nextState = await fetchCommunityState();
      setState(nextState);
      setError(null);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Failed to load community data."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setIsLoading(true);

      try {
        const nextState = await fetchCommunityState();

        if (!ignore) {
          setState(nextState);
          setError(null);
        }
      } catch (error: unknown) {
        if (!ignore) {
          setError(getApiErrorMessage(error, "Failed to load community data."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  return { ...state, isLoading, error, refresh };
}

export function getCurrentCommunityUser(
  state: CommunityState,
  session: AuthSession,
) {
  return (
    state.currentUser ??
    state.users.find((user) => user.email === session.email) ??
    state.users.find((user) => user.name === session.name) ?? {
      id: "current-user",
      name: session.name || "Community Member",
      email: session.email,
      role: session.role,
      location: "Remote",
      interests: [],
      skills: [],
      trustScore: 70,
      badges: ["New Member"],
      contributions: 0,
    }
  );
}

export async function updateCurrentUserProfile(payload: {
  name?: string;
  location?: string;
  skills?: string[] | string;
  interests?: string[] | string;
  role?: CommunityRole;
}) {
  const response = await api.put("/api/auth/me", payload);
  return response.data.user as CommunityUser;
}

export async function markNotificationRead(notificationId: string) {
  const response = await api.patch(`/api/notifications/${notificationId}/read`);
  return response.data.notification as CommunityNotification;
}

export async function markAllNotificationsRead() {
  const response = await api.patch("/api/notifications/read-all");
  return response.data.notifications as CommunityNotification[];
}

export async function sendMessage(payload: {
  recipientId: string;
  text: string;
  requestId?: string;
}) {
  const response = await api.post("/api/messages", payload);
  return response.data.data as CommunityMessage;
}

export async function addHelperToRequest(requestId: string) {
  const response = await api.post(`/api/requests/${requestId}/helpers`);
  return response.data.request as CommunityRequest;
}

export async function markRequestSolved(requestId: string) {
  const response = await api.patch(`/api/requests/${requestId}/status`, {
    status: "Solved",
  });
  return response.data.request as CommunityRequest;
}

export async function createRequest(payload: {
  title: string;
  description: string;
  tags: string[] | string;
  category: string;
  urgency: CommunityRequest["urgency"];
  location: string;
}) {
  const response = await api.post("/api/requests", payload);
  return response.data.request as CommunityRequest;
}

export function suggestCategory(text: string) {
  const normalized = text.toLowerCase();
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

export function detectUrgency(text: string): CommunityRequest["urgency"] {
  const normalized = text.toLowerCase();

  for (const rule of URGENCY_RULES) {
    if (rule.words.some((word) => normalized.includes(word))) {
      return rule.level;
    }
  }

  return "Low";
}

export function suggestTags(text: string) {
  const normalized = text.toLowerCase();
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

export function rewriteDescription(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    return "";
  }

  return `I need focused support with ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}. A helper who can provide practical next steps, examples, and a quick review would be ideal.`;
}

export function deriveSkillSuggestions(user: CommunityUser) {
  const joined = [...user.interests, ...user.skills].join(" ").toLowerCase();
  const helpWith = SKILLS.filter(
    (item) =>
      joined.includes(item.toLowerCase()) ||
      item.split(" ").some((part) => joined.includes(part.toLowerCase())),
  ).slice(0, 4);

  const needHelp = SKILLS.filter(
    (item) => !user.skills.includes(item) && !helpWith.includes(item),
  ).slice(0, 4);

  return {
    helpWith: helpWith.length
      ? helpWith
      : ["UI/UX", "Career Guidance", "Public Speaking"],
    needHelp: needHelp.length ? needHelp : ["Git/GitHub", "Interview Prep", "React"],
  };
}

export function getTopCategory(requests: CommunityRequest[]) {
  const counts = requests.reduce<Record<string, number>>(
    (accumulator, request) => {
      accumulator[request.category] = (accumulator[request.category] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  return (
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Community"
  );
}


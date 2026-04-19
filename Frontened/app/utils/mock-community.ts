export type DemoRole = "Both" | "Need Help" | "Can Help";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
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
};

export type CommunityNotification = {
  id: string;
  title: string;
  type: string;
  status: "Unread" | "Read";
  time: string;
};

export const demoUsers: DemoUser[] = [
  {
    id: "user-1",
    name: "Ayesha Khan",
    email: "ayesha@helphub.ai",
    role: "Both",
    location: "Karachi",
    interests: ["Hackathons", "UI/UX", "Community Building"],
    skills: ["Figma", "UI/UX", "HTML/CSS", "Career Guidance"],
    trustScore: 92,
    badges: ["Design Ally", "Fast Responder", "Top Mentor"],
    contributions: 31,
  },
  {
    id: "user-2",
    name: "Hassan Ali",
    email: "hassan@helphub.ai",
    role: "Can Help",
    location: "Lahore",
    interests: ["Web Apps", "Teaching", "Open Source"],
    skills: ["JavaScript", "React", "Git/GitHub", "Node.js"],
    trustScore: 88,
    badges: ["Code Rescuer", "Bug Hunter"],
    contributions: 24,
  },
  {
    id: "user-3",
    name: "Sara Noor",
    email: "sara@helphub.ai",
    role: "Need Help",
    location: "Islamabad",
    interests: ["Learning", "Data", "Public Speaking"],
    skills: ["Python", "Data Analysis"],
    trustScore: 74,
    badges: ["Community Voice"],
    contributions: 11,
  },
];

export const communityRequests: CommunityRequest[] = [
  {
    id: "req-1",
    title: "Need help making my portfolio responsive before demo day",
    description:
      "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.",
    tags: ["HTML/CSS", "Responsive", "Portfolio"],
    category: "Web Development",
    urgency: "High",
    location: "Karachi",
    requesterId: "user-3",
    helperIds: ["user-1"],
    status: "Open",
    aiSummary:
      "Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.",
  },
  {
    id: "req-2",
    title: "Looking for Figma feedback on a volunteer event poster",
    description:
      "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.",
    tags: ["Figma", "Poster", "Design Review"],
    category: "Design",
    urgency: "Medium",
    location: "Lahore",
    requesterId: "user-1",
    helperIds: ["user-2"],
    status: "Open",
    aiSummary:
      "A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.",
  },
  {
    id: "req-3",
    title: "Need mock interview support for internship applications",
    description:
      "Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.",
    tags: ["Interview Prep", "Career", "Frontend"],
    category: "Career",
    urgency: "Low",
    location: "Remote",
    requesterId: "user-3",
    helperIds: ["user-1", "user-2"],
    status: "Solved",
    aiSummary:
      "Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.",
  },
];

export const communityNotifications: CommunityNotification[] = [
  {
    id: "note-1",
    title: "New helper matched to your responsive portfolio request",
    type: "Match",
    status: "Unread",
    time: "12 min ago",
  },
  {
    id: "note-2",
    title: "Your trust score increased after a solved request",
    type: "Reputation",
    status: "Unread",
    time: "1 hr ago",
  },
  {
    id: "note-3",
    title: "AI Center detected rising demand for interview prep",
    type: "Insight",
    status: "Read",
    time: "Today",
  },
];

export function getUserById(id: string) {
  return demoUsers.find((user) => user.id === id);
}

export function getUserByName(name?: string | null) {
  if (!name) {
    return demoUsers[0];
  }

  return demoUsers.find((user) => user.name === name) ?? demoUsers[0];
}

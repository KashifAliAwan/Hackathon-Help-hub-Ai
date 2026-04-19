"use client";

import { motion } from "framer-motion";

import Header from "../../components/header/header";
import {
  deriveSkillSuggestions,
  getCurrentCommunityUser,
  getTopCategory,
  useCommunityStore,
} from "../../utils/community-store";
import { readAuthSession } from "../../utils/auth-session";

export default function AICenterPage() {
  const session = readAuthSession();
  const state = useCommunityStore();
  const currentUser = getCurrentCommunityUser(state, session);
  const suggestions = deriveSkillSuggestions(currentUser);

  const insights = [
    {
      label: "Trend Pulse",
      value: getTopCategory(state.requests),
      desc: "Most common support area based on active community requests.",
    },
    {
      label: "Urgency Watch",
      value: state.requests.filter(
        (request) => request.urgency === "High" || request.urgency === "Critical",
      ).length.toString(),
      desc: "Requests currently flagged high priority by the urgency detector.",
    },
    {
      label: "Mentor Pool",
      value: state.users
        .filter((user) => user.trustScore >= 85)
        .length.toString(),
      desc: "Trusted helpers with strong response history and contribution signals.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="flex flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card-dark p-12 relative overflow-hidden"
          >
            <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-primary/15 blur-[120px] rounded-full" />
            <span className="section-label text-primary">AI Center</span>
            <h1 className="text-5xl font-bold mb-4 max-w-3xl">
              See what the platform intelligence is noticing.
            </h1>
            <p className="text-white/60 font-medium text-lg leading-relaxed">
              AI-like insights summarize demand trends, helper readiness,
              urgency signals, and request recommendations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="premium-card border-none bg-white/50 p-8"
              >
                <span className="section-label text-text-muted opacity-60">
                  {item.label}
                </span>
                <div className="text-3xl font-bold text-dark mb-3">{item.value}</div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="premium-card p-12">
            <span className="section-label text-primary">AI Recommendations</span>
            <h2 className="text-4xl font-bold text-dark mb-6">
              Requests needing attention
            </h2>
            <p className="helper-copy mb-8">
              Based on your profile, you are strongest in {suggestions.helpWith.join(", ")}.
            </p>

            <div className="flex flex-col gap-4">
              {state.requests.slice(0, 4).map((request) => (
                <div
                  key={request.id}
                  className="p-8 rounded-[2rem] bg-bg-card border border-black/5 hover:bg-white hover:shadow-xl transition-all cursor-pointer group"
                >
                  <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                    {request.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    {request.aiSummary}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="tag tag-blue">{request.category}</span>
                    <span
                      className={`tag ${
                        request.urgency === "High" || request.urgency === "Critical"
                          ? "tag-red"
                          : request.urgency === "Medium"
                            ? "tag-yellow"
                            : "tag-teal"
                      }`}
                    >
                      {request.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

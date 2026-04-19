"use client";

import { motion } from "framer-motion";

import Header from "../../components/header/header";
import { useCommunityStore } from "../../utils/community-store";

export default function LeaderboardPage() {
  const state = useCommunityStore();
  const rankings = [...state.users].sort(
    (a, b) => b.trustScore - a.trustScore || b.contributions - a.contributions,
  );

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
            <span className="section-label text-primary">Leaderboard</span>
            <h1 className="text-5xl font-bold mb-4 max-w-4xl">
              Recognize the people who keep the community moving.
            </h1>
            <p className="text-white/60 font-medium text-lg leading-relaxed">
              Trust score, contribution count, and badges create visible
              momentum for reliable helpers.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="premium-card h-full">
                <span className="section-label text-text-muted">Top Helpers</span>
                <h2 className="text-4xl font-bold text-dark mb-10">Rankings</h2>

                <div className="flex flex-col gap-4">
                  {rankings.map((user, index) => (
                    <div
                      key={user.id}
                      className="p-8 rounded-[2rem] bg-bg-card border border-black/5 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-16 h-16 ${
                            index === 0 ? "bg-primary" : index === 1 ? "bg-dark" : "bg-orange-500"
                          } rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                        >
                          {user.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-dark text-xl">
                            #{index + 1} {user.name}
                          </div>
                          <div className="text-text-muted text-sm">
                            {user.skills.slice(0, 3).join(", ")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-dark text-xl tracking-tight">
                          {user.trustScore}%
                        </div>
                        <div className="text-text-muted text-[11px] uppercase font-bold tracking-widest">
                          {user.contributions} contributions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="premium-card h-full">
                <span className="section-label text-primary">Badge System</span>
                <h2 className="text-4xl font-bold text-dark mb-10">
                  Trust and achievement
                </h2>

                <div className="flex flex-col gap-10">
                  {rankings.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-dark text-2xl">
                          {user.name}
                        </div>
                        <div className="text-text-muted font-medium">
                          {user.badges.join(" • ")}
                        </div>
                      </div>
                      <div className="w-full h-4 bg-bg-card rounded-full overflow-hidden border border-black/5 p-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${user.trustScore}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-primary rounded-full shadow-sm shadow-primary/20"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-text-muted">
                        <span>Progress to next badge</span>
                        <span>{user.trustScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

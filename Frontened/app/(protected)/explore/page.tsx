"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import Header from "../../components/header/header";
import { useCommunityStore } from "../../utils/community-store";

export default function ExplorePage() {
  const state = useCommunityStore();
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");

  const filteredRequests = useMemo(() => {
    return state.requests.filter((request) => {
      const matchesCategory = !category || request.category === category;
      const matchesUrgency = !urgency || request.urgency === urgency;
      const matchesSkill =
        !skill ||
        request.tags.join(" ").toLowerCase().includes(skill.toLowerCase()) ||
        request.title.toLowerCase().includes(skill.toLowerCase());
      const matchesLocation =
        !location || request.location.toLowerCase().includes(location.toLowerCase());

      return (
        matchesCategory && matchesUrgency && matchesSkill && matchesLocation
      );
    });
  }, [category, location, skill, state.requests, urgency]);

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
            <span className="section-label text-primary">Explore / Feed</span>
            <h1 className="text-5xl font-bold mb-4 max-w-4xl">
              Browse help requests with filterable community context.
            </h1>
            <p className="text-white/60 font-medium text-lg leading-relaxed max-w-3xl">
              Filter by category, urgency, skills, and location to surface the
              best matches.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="premium-card bg-bg-card border-none shadow-none sticky top-32 p-8">
                <span className="section-label text-primary">Filters</span>
                <h2 className="text-4xl font-bold text-dark mb-10 tracking-tight">
                  Refine feed
                </h2>

                <form className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">Category</label>
                    <div className="relative">
                      <select
                        className="form-select"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                      >
                        <option value="">All categories</option>
                        {[...new Set(state.requests.map((request) => request.category))].map(
                          (item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ),
                        )}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">Urgency</label>
                    <div className="relative">
                      <select
                        className="form-select"
                        value={urgency}
                        onChange={(event) => setUrgency(event.target.value)}
                      >
                        <option value="">All levels</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">Skills</label>
                    <input
                      type="text"
                      placeholder="React, Figma, Git"
                      className="form-input"
                      value={skill}
                      onChange={(event) => setSkill(event.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">Location</label>
                    <input
                      type="text"
                      placeholder="Karachi, Remote"
                      className="form-input"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <p className="helper-copy">
                  {filteredRequests.length} request
                  {filteredRequests.length === 1 ? "" : "s"} found
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setCategory("");
                    setUrgency("");
                    setSkill("");
                    setLocation("");
                  }}
                >
                  Reset filters
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {filteredRequests.length ? (
                  filteredRequests.map((request, index) => {
                    const requester = state.users.find(
                      (user) => user.id === request.requesterId,
                    );

                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="premium-card premium-card-hover p-10 flex flex-col gap-6 bg-white hover:shadow-2xl transition-all group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="tag tag-blue">{request.category}</span>
                            <span
                              className={`tag ${
                                request.urgency === "Critical" ||
                                request.urgency === "High"
                                  ? "tag-red"
                                  : request.urgency === "Medium"
                                    ? "tag-yellow"
                                    : "tag-teal"
                              }`}
                            >
                              {request.urgency}
                            </span>
                            <span
                              className={`tag ${
                                request.status === "Solved"
                                  ? "tag-green"
                                  : "tag-teal"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                          <Link
                            href={`/requests/${request.id}`}
                            className="px-6 py-2.5 rounded-2xl bg-bg-card text-xs font-bold text-dark hover:bg-dark hover:text-white transition-all"
                          >
                            Open details
                          </Link>
                        </div>

                        <div className="flex-grow">
                          <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                            {request.title}
                          </h3>
                          <p className="text-text-muted leading-relaxed mb-6 line-clamp-2">
                            {request.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {request.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1.5 rounded-xl bg-bg-card text-[11px] font-bold text-text-muted uppercase tracking-wider"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-8 border-t border-black/5 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-dark text-lg leading-tight">
                              {requester?.name ?? "Unknown user"}
                            </div>
                            <div className="text-sm text-text-muted">
                              {request.location} • {request.helperIds.length} helper
                              {request.helperIds.length === 1 ? "" : "s"} interested
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="premium-card p-10">
                    <h3 className="text-2xl font-bold text-dark mb-3">
                      No requests found
                    </h3>
                    <p>
                      Try clearing some filters to surface more community matches.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

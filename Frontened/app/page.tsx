"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  CheckCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import Header from "./components/header/header";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-start mb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-8"
          >
            <motion.div variants={itemVariants}>
              <span className="section-label text-text-muted">
                SMIT Grand Coding Night 2026
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] text-dark tracking-tight">
                Find help faster.
                <br />
                Become help that
                <br />
                matters.
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-text-muted max-w-lg leading-relaxed"
            >
              HelpHub AI is a community-powered support network for students,
              mentors, creators, and builders. Ask for help, offer help, track
              impact, and let AI surface smarter matches across the platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/login" className="btn-primary w-full sm:w-auto text-center">
                Open product demo
              </Link>
              <Link href="/login" className="btn-secondary w-full sm:w-auto text-center">
                Post a request
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            >
              {[
                {
                  label: "Members",
                  value: "384+",
                  icon: <Users size={16} />,
                  desc: "Students, mentors, and helpers in the loop.",
                },
                {
                  label: "Requests",
                  value: "72+",
                  icon: <MessageSquare size={16} />,
                  desc: "Support posts shared across learning journeys.",
                },
                {
                  label: "Solved",
                  value: "69+",
                  icon: <CheckCircle size={16} />,
                  desc: "Problems resolved through community action.",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="premium-card p-6 border-none bg-white/50"
                >
                  <span className="section-label text-text-muted mb-4">
                    {stat.label}
                  </span>
                  <div className="text-3xl font-bold text-dark mb-2">
                    {stat.value}
                  </div>
                  <p className="text-[11px] leading-relaxed text-text-muted">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Ecosystem Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="premium-card-dark p-10 flex flex-col gap-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-10">
              <Image
                src="/assets/hero-abstract.png"
                alt="Hero background"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-25 -right-25 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />

            <div className="relative z-10">
              <span className="section-label text-primary">
                Live Product Feel
              </span>
              <h2 className="text-4xl font-bold leading-tight mb-6">
                More than a form.
                <br />
                More like an ecosystem.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                A polished multi-page experience inspired by modern platforms,
                with AI summaries, trust scores, contribution signals,
                notifications, and leaderboard momentum.
              </p>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              {[
                {
                  title: "AI request intelligence",
                  desc: "Auto-categorization, urgency detection, tags, and trend snapshots.",
                  icon: <Sparkles className="text-primary" />,
                },
                {
                  title: "Community trust graph",
                  desc: "Badges, helper rankings, and visible contribution history.",
                  icon: <ShieldCheck className="text-primary" />,
                },
                {
                  label: "100%",
                  desc: "Top trust score currently active across the sample mentor network.",
                  icon: <TrendingUp className="text-primary" />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {item.title || item.label}
                    </span>
                    {item.icon}
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Core Flow Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="section-label text-text-muted">Core Flow</span>
              <h2 className="text-4xl font-bold text-dark">
                From struggling alone to solving together
              </h2>
            </div>
            <Link href="/login" className="btn-secondary text-sm">
              Try onboarding AI
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Ask for help clearly",
                desc: "Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.",
              },
              {
                title: "Discover the right people",
                desc: "Use the explore feed, helper lists, and notifications to move quickly once a match happens.",
              },
              {
                title: "Track real contribution",
                desc: "Trust scores, badges, and rankings help the community recognize meaningful support.",
              },
            ].map((flow, i) => (
              <div
                key={i}
                className="premium-card premium-card-hover p-8 group"
              >
                <h3 className="font-bold text-xl mb-4 group-hover:text-primary transition-colors">
                  {flow.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {flow.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Requests Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="section-label text-text-muted">
                Featured Requests
              </span>
              <h2 className="text-4xl font-bold text-dark">
                Community problems currently in motion
              </h2>
            </div>
            <Link href="/explore" className="btn-secondary text-sm">
              View full feed
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: "Web Development",
                urgency: "High",
                status: "Solved",
                title: "Need help",
                desc: "help needed",
                author: "Ayesha Khan",
                location: "Karachi • 1 helper interested",
              },
              {
                category: "Web Development",
                urgency: "High",
                status: "Solved",
                title:
                  "Need help making my portfolio responsive before demo day",
                desc: "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.",
                tags: ["HTML/CSS", "Responsive", "Portfolio"],
                author: "Sara Noor",
                location: "Karachi • 1 helper interested",
              },
              {
                category: "Design",
                urgency: "Medium",
                status: "Open",
                title: "Looking for Figma feedback on a volunteer event poster",
                desc: "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.",
                tags: ["Figma", "Poster", "Design Review"],
                author: "Ayesha Khan",
                location: "Lahore • 1 helper interested",
              },
            ].map((req, i) => (
              <div
                key={i}
                className="premium-card premium-card-hover p-8 flex flex-col gap-6 bg-white shadow-sm border border-black/5 hover:border-primary/20"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="tag tag-blue">{req.category}</span>
                  <span
                    className={`tag ${req.urgency === "High" ? "tag-red" : "tag-yellow"}`}
                  >
                    {req.urgency}
                  </span>
                  <span
                    className={`tag ${req.status === "Solved" ? "tag-green" : "tag-teal"}`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="flex-grow">
                  <h3 className="font-bold text-xl mb-2 leading-tight group-hover:text-primary transition-colors">
                    {req.title}
                  </h3>
                  <p className="text-text-muted text-sm line-clamp-3 mb-4">
                    {req.desc}
                  </p>

                  {req.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {req.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-bg-card text-[10px] font-bold text-text-muted uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-black/5 flex items-end justify-between">
                  <div>
                    <div className="font-bold text-dark text-sm">
                      {req.author}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {req.location}
                    </div>
                  </div>
                  <Link
                    href="/explore"
                    className="px-5 py-2.5 rounded-xl bg-bg-card text-xs font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    Open details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-black/5 text-center">
        <p className="text-text-muted text-[11px] font-medium tracking-wide uppercase">
          HelpHub AI • Community Powered Support Network 2026
        </p>
      </footer>
    </div>
  );
}

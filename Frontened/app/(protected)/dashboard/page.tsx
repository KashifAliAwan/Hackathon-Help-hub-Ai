"use client";

import Link from "next/link";

import Header from "../../components/header/header";
import { readAuthSession } from "../../utils/auth-session";
import {
  deriveSkillSuggestions,
  getCurrentCommunityUser,
  getTopCategory,
  useCommunityStore,
} from "../../utils/community-store";

export default function DashboardPage() {
  const session = readAuthSession();
  const state = useCommunityStore();
  const currentUser = getCurrentCommunityUser(state, session);

  const dashboardStats = [
    {
      label: "Trust score",
      value: `${currentUser.trustScore}%`,
      description: "Driven by solved requests and consistent support.",
    },
    {
      label: "Helping",
      value: state.requests.filter((request) =>
        request.helperIds.includes(currentUser.id),
      ).length,
      description: "Requests where you are currently listed as a helper.",
    },
    {
      label: "Open requests",
      value: state.requests.filter((request) => request.status === "Open").length,
      description: "Community requests currently active across the feed.",
    },
    {
      label: "AI pulse",
      value: `${state.requests.filter((request) => request.category === "Career").length} trends`,
      description: "Trend count detected in the latest request activity.",
    },
  ];

  const aiInsights = [
    {
      label: "Most requested category",
      value: getTopCategory(state.requests),
    },
    {
      label: "Your strongest trust driver",
      value: currentUser.badges[0] ?? "Top Mentor",
    },
    {
      label: "AI says you can mentor in",
      value: deriveSkillSuggestions(currentUser).helpWith.join(", "),
    },
    {
      label: "Your active requests",
      value: state.requests
        .filter((request) => request.requesterId === currentUser.id)
        .length.toString(),
    },
  ];

  return (
    <div className="site-shell">
      <Header />

      <main className="container">
        <section className="page-hero">
          <div className="panel">
            <p className="eyebrow">Dashboard</p>
            <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4.2rem)" }}>
              Welcome back, {currentUser.name}.
            </h1>
            <p>
              Your command center for requests, AI insights, helper momentum,
              and live community activity.
            </p>
          </div>
        </section>

        <section className="mini-grid section">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="eyebrow">{stat.label}</p>
              <div className="stat-value">{stat.value}</div>
              <p>{stat.description}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-grid section">
          <div className="stack">
            <div className="section-head">
              <div>
                <p className="section-kicker">Recent requests</p>
                <h2>What the community needs right now</h2>
              </div>
              <Link href="/explore" className="btn btn-secondary">
                Go to feed
              </Link>
            </div>

            <div className="stack">
              {state.requests.map((request) => {
                const requester = request.requester ?? state.users.find(
                  (user) => user.id === request.requesterId,
                );

                return (
                  <article key={request.id} className="request-card">
                    <div className="card-meta">
                      <span className="tag">{request.category}</span>
                      <span
                        className={`tag ${["Critical", "High"].includes(request.urgency) ? "urgent" : ""}`}
                      >
                        {request.urgency}
                      </span>
                      <span
                        className={`tag ${request.status === "Solved" ? "success" : ""}`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <h3>{request.title}</h3>
                    <p>{request.description}</p>

                    <div className="tag-row">
                      {request.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="list-item" style={{ paddingBottom: 0, borderBottom: 0 }}>
                      <div>
                        <strong>{requester?.name ?? "Unknown user"}</strong>
                        <p>
                          {request.location} • {request.helperIds.length} helper
                          {request.helperIds.length === 1 ? "" : "s"} interested
                        </p>
                      </div>
                      <Link href={`/requests/${request.id}`} className="btn btn-secondary">
                        Open details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="stack">
            <div className="panel">
              <p className="section-kicker">AI insights</p>
              <h3>Suggested actions for you</h3>
              <div>
                {aiInsights.map((insight) => (
                  <div key={insight.label} className="metric">
                    <span>{insight.label}</span>
                    <strong>{insight.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <p className="section-kicker">Notifications</p>
              <h3>Latest updates</h3>
              <div className="notif-list">
                {state.notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="notif-item">
                    <div>
                      <strong>{notification.title}</strong>
                      <p>
                        {notification.type} • {notification.time}
                      </p>
                    </div>
                    <span
                      className={`tag ${notification.status === "Unread" ? "urgent" : ""}`}
                    >
                      {notification.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


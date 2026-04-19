"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";

import { clearAuthSession } from "../../utils/auth-session";
import { protectedRoutes } from "../../utils/routes";
import { motion, AnimatePresence } from "framer-motion";

const publicLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Explore", href: "/explore" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Create Request", href: "/create-request" },
  { label: "Messages", href: "/messages" },
  { label: "Profile", href: "/profile" },
];

const protectedLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Explore", href: "/explore" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Create Request", href: "/create-request" },
  { label: "Messages", href: "/messages" },
  { label: "Profile", href: "/profile" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const canUseDOM = typeof document !== "undefined";

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const links = isProtected ? protectedLinks : publicLinks;

  const handleSignOut = () => {
    clearAuthSession();
    toast.success("Signed out successfully.");
    router.push("/login");
    router.refresh();
  };
  return (
    <>
      <header className="topbar">
        <div className="container h-20 flex items-center justify-between gap-4">
        <Link href="/" className="brand flex items-center gap-2 shrink-0">
          <span className="brand-badge w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl font-bold text-xl shrink-0">
            H
          </span>
          <span className="font-bold text-xl sm:text-2xl tracking-tight hidden sm:block">
            HelpHub AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden min-[1130px]:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-black/5" />

          <div className="flex items-center gap-3">
            {isProtected ? (
              <>
                <Link
                  href="/notifications"
                  className="text-sm font-semibold text-text-muted hover:text-dark px-2"
                >
                  Notifications
                </Link>
                <Link
                  href="/ai-center"
                  className="btn btn-primary py-2.5! px-6! text-sm! shadow-none!"
                >
                  AI Center
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn btn-secondary py-2.5! px-6! text-sm! shadow-none!"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/leaderboard"
                  className="text-sm font-semibold text-text-muted hover:text-dark px-2"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/login"
                  className="btn btn-primary py-2.5! px-6! text-sm! shadow-none!"
                >
                  Join platform
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Partial Desktop Navigation (Links only, no right buttons) */}
        <div className="hidden lg:max-[1129px]:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="min-[1130px]:hidden p-3 rounded-xl bg-white border border-black/5 shadow-sm text-dark hover:bg-bg-card transition-colors z-110"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {canUseDOM &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-100 min-[1130px]:hidden overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute inset-0 bg-dark/20 backdrop-blur-md"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute top-0 right-0 bottom-0 w-70 bg-white shadow-2xl p-8 flex flex-col"
                >
                  <div className="flex flex-col gap-8 mt-12 overflow-y-auto">
                    <nav className="flex flex-col gap-4">
                      {links.map((link) => {
                        const isActive =
                          pathname === link.href ||
                          pathname.startsWith(`${link.href}/`);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-lg font-bold transition-colors ${
                              isActive ? "text-primary" : "text-text-muted"
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </nav>

                    <div className="h-px w-full bg-black/5" />

                    <div className="flex flex-col gap-4">
                      {isProtected ? (
                        <>
                          <Link
                            href="/notifications"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-bold text-text-muted"
                          >
                            Notifications
                          </Link>
                          <Link
                            href="/ai-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="btn btn-primary w-full py-4!"
                          >
                            AI Center
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              handleSignOut();
                              setIsMobileMenuOpen(false);
                            }}
                            className="btn btn-secondary w-full py-4!"
                          >
                            Sign out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/leaderboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-bold text-text-muted"
                          >
                            Leaderboard
                          </Link>
                          <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="btn btn-primary w-full py-4!"
                          >
                            Join HelpHub
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

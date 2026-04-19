/* ---------------- ROUTE DEFINITIONS ---------------- */

/**
 * Public routes accessible without authentication
 */
const publicRoutes = [
  "/",
  "/signup",
  "/login",
  "/resetPassword",
  "/verifyemail",
  "/forgotPassword",
];

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/messages",
  "/ai-center",
  "/leaderboard",
  "/notifications",
  "/create-request",
  "/explore",
  "/requests",
  "/onboarding",
];

export { publicRoutes, protectedRoutes };

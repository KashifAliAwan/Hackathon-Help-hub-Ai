import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_NAME_KEY = "auth_user_name";
export const AUTH_USER_ROLE_KEY = "auth_user_role";
export const AUTH_USER_EMAIL_KEY = "auth_user_email";

export const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7,
};

export type CommunityRole = "Both" | "Need Help" | "Can Help";

export type AuthSession = {
  name: string;
  email: string;
  role: CommunityRole;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type SignupValues = LoginValues & {
  name: string;
  confirmPassword: string;
  role: CommunityRole;
};

export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

export function validateLoginForm(values: LoginValues) {
  const errors: ValidationErrors<keyof LoginValues> = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateSignupForm(values: SignupValues) {
  const errors: ValidationErrors<keyof SignupValues> = {
    ...validateLoginForm(values),
  };

  if (values.password.trim() && !isStrongPassword(values.password)) {
    errors.password =
      "Password must be at least 8 characters with upper, lower, and number.";
  }

  if (!values.name.trim()) {
    errors.name = "Full name is required.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Name should be at least 3 characters.";
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.role) {
    errors.role = "Select a role to continue.";
  }

  return errors;
}

export function startAuthSession(
  token: string,
  user: { name: string; email: string; role?: string },
) {
  setCookie(AUTH_TOKEN_KEY, token, COOKIE_OPTIONS);
  setCookie(AUTH_USER_NAME_KEY, user.name, COOKIE_OPTIONS);
  setCookie(AUTH_USER_EMAIL_KEY, user.email, COOKIE_OPTIONS);
  if (user.role) {
    setCookie(AUTH_USER_ROLE_KEY, user.role, COOKIE_OPTIONS);
  }
}

export function clearAuthSession() {
  deleteCookie(AUTH_TOKEN_KEY, { path: "/" });
  deleteCookie(AUTH_USER_NAME_KEY, { path: "/" });
  deleteCookie(AUTH_USER_EMAIL_KEY, { path: "/" });
  deleteCookie(AUTH_USER_ROLE_KEY, { path: "/" });
}

export function readAuthSession(): AuthSession {
  const storedName = readCookieValue(AUTH_USER_NAME_KEY) ?? "";
  const storedEmail = readCookieValue(AUTH_USER_EMAIL_KEY) ?? "";
  const storedRole = readCookieValue(AUTH_USER_ROLE_KEY) as
    | CommunityRole
    | undefined;

  return {
    name: storedName,
    email: storedEmail,
    role: storedRole ?? "Need Help",
  };
}

function readCookieValue(key: string) {
  if (typeof window === "undefined") {
    return undefined;
  }

  return getCookie(key)?.toString();
}


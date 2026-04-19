"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import Header from "../../components/header/header";
import {
  startAuthSession,
  validateLoginForm,
  type LoginValues,
  type ValidationErrors,
} from "../../utils/auth-session";
import api from "../../utils/api";

type JwtPayload = {
  name?: string;
  email?: string;
  role?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }

  return fallback;
};

const parseTokenPayload = (token: string): JwtPayload | null => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) {
      return null;
    }

    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const submitLockRef = useRef(false);
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors<keyof LoginValues>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = <T extends keyof LoginValues>(
    field: T,
    value: LoginValues[T],
  ) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading || submitLockRef.current) {
      return;
    }

    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted login fields.");
      return;
    }

    setIsLoading(true);
    submitLockRef.current = true;

    try {
      const response = await api.post("/api/auth/login", {
        email: values.email.trim(),
        password: values.password,
      });

      const { token, message } = response.data;
      const tokenPayload = parseTokenPayload(token);

      startAuthSession(token, {
        name: tokenPayload?.name || values.email.trim().split("@")[0] || "User",
        email: tokenPayload?.email || values.email.trim(),
        role: tokenPayload?.role,
      });

      toast.success(message || "Welcome back! Redirecting to your dashboard.");
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "User not found."));
    } finally {
      submitLockRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <Header />

      <main className="container auth-layout">
        <div className="auth-wrap">
          <section className="auth-side">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />

            <p className="eyebrow">Community Access</p>
            <h1>Enter the support network.</h1>
            <p>
              Choose a demo identity, set your role, and jump into the same
              premium dashboard flow shown in the reference design.
            </p>

            <ul>
              <li>Role-based entry for Need Help, Can Help, or Both.</li>
              <li>
                Direct path into dashboard, requests, AI Center, and feed.
              </li>
              <li>Persistent demo session with a polished auth experience.</li>
            </ul>
          </section>

          <section className="auth-card">
            <p className="eyebrow">Login</p>
            <h2>Authenticate your community profile</h2>
            <p className="helper-copy">
              Sign in with your registered account to continue into the live
              community dashboard.
            </p>

            <form onSubmit={handleSubmit} className="stack">
              <div className="auth-grid">
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className={errors.email ? "input-error" : undefined}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      className={errors.password ? "input-error pr-12" : "pr-12"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                {isLoading ? "Authenticating..." : "Continue to dashboard"}
              </button>
            </form>

            <p className="helper-copy">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="font-bold text-primary">
                Create one
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}


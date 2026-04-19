"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronDown, Eye, EyeOff, Loader2, X, SendHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../../components/header/header";
import {
  validateSignupForm,
  type SignupValues,
  type ValidationErrors,
  type CommunityRole,
} from "../../utils/auth-session";
import api from "../../utils/api";

const initialValues: SignupValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Both",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || fallback;
  }

  return fallback;
};

export default function SignupPage() {
  const router = useRouter();
  const signupLockRef = useRef(false);
  const otpVerifyLockRef = useRef(false);
  const otpResendLockRef = useRef(false);
  const [values, setValues] = useState<SignupValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<keyof SignupValues>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const updateField = <T extends keyof SignupValues>(
    field: T,
    value: SignupValues[T],
  ) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading || signupLockRef.current) {
      return;
    }

    const nextErrors = validateSignupForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please complete the signup form correctly.");
      return;
    }

    setIsLoading(true);
    signupLockRef.current = true;

    try {
      const response = await api.post("/api/auth/signup", {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
        role: values.role,
      });

      toast.success(response.data.message || "Signup successful! Please verify your email.");
      setShowOtpModal(true);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Signup failed. Please try again."));
    } finally {
      signupLockRef.current = false;
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isVerifying || otpVerifyLockRef.current) {
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    otpVerifyLockRef.current = true;
    try {
      const response = await api.post("/api/auth/verify-otp", {
        email: values.email.trim(),
        otp,
      });

      toast.success(response.data.message || "Email verified! You can now log in.");
      setShowOtpModal(false);
      router.push("/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Verification failed."));
    } finally {
      otpVerifyLockRef.current = false;
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (isVerifying || isResending || otpResendLockRef.current) {
      return;
    }

    setIsResending(true);
    otpResendLockRef.current = true;
    try {
      const response = await api.post("/api/auth/resend-otp", {
        email: values.email.trim(),
      });
      toast.success(response.data.message || "OTP resent successfully.");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to resend OTP."));
    } finally {
      otpResendLockRef.current = false;
      setIsResending(false);
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

            <p className="eyebrow">Join the Network</p>
            <h1>Become part of something real.</h1>
            <p>
              Create your community identity, choose your role, and land inside
              the same polished HelpHub interface used across the product.
            </p>

            <ul>
              <li>Choose to give help, get help, or do both.</li>
              <li>Build a trust score with community-first product flows.</li>
              <li>Start with clean validation instead of loose demo forms.</li>
            </ul>
          </section>

          <section className="auth-card">
            <p className="eyebrow">Create Account</p>
            <h2>Set up your community profile</h2>
            <p className="helper-copy">
              Signup now validates all required fields, email format, password
              strength, and password confirmation before creating a session.
            </p>

            <form onSubmit={handleSubmit} className="stack">
              <div className="auth-grid">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    type="text"
                    value={values.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className={errors.name ? "input-error" : undefined}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                  {errors.name ? (
                    <span className="error-text">{errors.name}</span>
                  ) : (
                    <span className="helper-copy">
                      Use the same name you want to appear on the dashboard.
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className={errors.email ? "input-error" : undefined}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email ? (
                    <span className="error-text">{errors.email}</span>
                  ) : (
                    <span className="helper-copy">
                      A valid email is required before signup completes.
                    </span>
                  )}
                </div>
              </div>

              <div className="auth-grid">
                <div className="field">
                  <label htmlFor="role">Role</label>
                  <div className="relative">
                    <select
                      id="role"
                      value={values.role}
                      onChange={(event) =>
                        updateField("role", event.target.value as CommunityRole)
                      }
                      className={errors.role ? "input-error" : undefined}
                    >
                      <option value="Both">Both</option>
                      <option value="Need Help">Need Help</option>
                      <option value="Can Help">Can Help</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                      size={18}
                    />
                  </div>
                  {errors.role ? (
                    <span className="error-text">{errors.role}</span>
                  ) : (
                    <span className="helper-copy">
                      Choose how you want to participate in the community.
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      className={errors.password ? "input-error pr-12" : "pr-12"}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password ? (
                    <span className="error-text">{errors.password}</span>
                  ) : (
                    <span className="helper-copy">
                      Minimum 8 characters with upper, lower, and number.
                    </span>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="confirm-password">Confirm password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    className={errors.confirmPassword ? "input-error pr-12" : "pr-12"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <span className="error-text">{errors.confirmPassword}</span>
                ) : (
                  <span className="helper-copy">
                    Confirmation must match the password exactly.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="helper-copy">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary">
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="premium-card bg-white w-full max-w-md p-8 relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="absolute right-6 top-6 text-text-muted hover:text-dark transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col gap-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <SendHorizontal size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">Verify your email</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    We&apos;ve sent a 6-digit verification code to <br />
                    <strong className="text-dark">{values.email}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider text-left pl-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      className="form-input text-center text-3xl font-bold tracking-[0.5em] py-5 rounded-2xl! border-2 focus:border-primary transition-all"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otp.length !== 6 || isVerifying}
                    className="btn btn-primary w-full py-5 text-base shadow-lg shadow-primary/20"
                  >
                    {isVerifying ? <Loader2 size={18} className="animate-spin" /> : null}
                    {isVerifying ? "Verifying..." : "Verify & Continue"}
                  </button>
                </form>

                <div className="pt-2">
                  <p className="text-sm text-text-muted">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending || isVerifying}
                      className="text-primary font-bold hover:underline"
                    >
                      {isResending ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          Resending...
                        </span>
                      ) : (
                        "Resend OTP"
                      )}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


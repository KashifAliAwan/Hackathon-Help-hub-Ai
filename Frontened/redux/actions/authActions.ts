import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getCookie } from "cookies-next";

import type { CommunityRole } from "../../app/utils/auth-session";
import {
  beginPendingRequest,
  finishPendingRequest,
} from "../../app/utils/network-pending";

export type AuthApiError = {
  message: string;
  success?: boolean;
};

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role: CommunityRole;
  location?: string;
  skills?: string[];
  interests?: string[];
  trustScore?: number;
  badges?: string[];
  contributions?: number;
};

type AuthSuccessResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = LoginPayload & {
  name: string;
  confirmPassword: string;
  role: CommunityRole;
};

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT || "http://localhost:3080"
    : process.env.NEXT_PUBLIC_BACKEND_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  beginPendingRequest();

  const token = getCookie("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    finishPendingRequest();
    return response;
  },
  (error) => {
    finishPendingRequest();
    return Promise.reject(error);
  },
);

const getRejectPayload = (error: unknown): AuthApiError => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as AuthApiError | undefined) ?? {
        message: error.message,
      }
    );
  }

  return { message: "Request failed." };
};

export const loginUser = createAsyncThunk<
  AuthSuccessResponse,
  LoginPayload,
  { rejectValue: AuthApiError }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    return response.data as AuthSuccessResponse;
  } catch (error: unknown) {
    return rejectWithValue(getRejectPayload(error));
  }
});

export const signupUser = createAsyncThunk<
  AuthSuccessResponse,
  SignupPayload,
  { rejectValue: AuthApiError }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/auth/signup", userData);
    return response.data as AuthSuccessResponse;
  } catch (error: unknown) {
    return rejectWithValue(getRejectPayload(error));
  }
});

export const verifyOtp = createAsyncThunk<
  AuthSuccessResponse,
  VerifyOtpPayload,
  { rejectValue: AuthApiError }
>("auth/verifyOtp", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/auth/verify-otp", data);
    return response.data as AuthSuccessResponse;
  } catch (error: unknown) {
    return rejectWithValue(getRejectPayload(error));
  }
});

export const resendOtp = createAsyncThunk<
  AuthSuccessResponse,
  Pick<VerifyOtpPayload, "email">,
  { rejectValue: AuthApiError }
>("auth/resendOtp", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/auth/resend-otp", data);
    return response.data as AuthSuccessResponse;
  } catch (error: unknown) {
    return rejectWithValue(getRejectPayload(error));
  }
});

export const getMe = createAsyncThunk<
  AuthSuccessResponse,
  void,
  { rejectValue: AuthApiError }
>("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data as AuthSuccessResponse;
  } catch (error: unknown) {
    return rejectWithValue(getRejectPayload(error));
  }
});


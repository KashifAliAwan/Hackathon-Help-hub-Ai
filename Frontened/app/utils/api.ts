import axios from "axios";
import { getCookie } from "cookies-next";

import { beginPendingRequest, finishPendingRequest } from "./network-pending";

const isDevelopment = process.env.NODE_ENV === "development";

export const BASE_URL = isDevelopment
  ? process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT || "http://localhost:3080"
  : process.env.NEXT_PUBLIC_BACKEND_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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

export default api;


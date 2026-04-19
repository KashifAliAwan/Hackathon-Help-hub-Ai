import { createSlice } from "@reduxjs/toolkit";
import { getMe, loginUser, type AuthApiError, type AuthUser } from "../actions/authActions";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: AuthApiError | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token ?? null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? { message: "Login failed." };
    });

    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user ?? null;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? { message: "Failed to load profile." };
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;


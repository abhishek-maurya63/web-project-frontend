import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const storedUser = localStorage.getItem("user");

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const normalizeAuthPayload = (payload) => ({
  user: payload?.user || payload?.data?.user || payload?.data || payload,
  token: payload?.token || payload?.data?.token || null,
});

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/user/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/user/register", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
  },
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.get("/api/auth/user/me");
      return {
        user:
          response.data?.user ||
          response.data?.data?.user ||
          getState().auth.user,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Not authenticated"));
    }
  },
);

const initialState = {
  isAuthenticated: Boolean(storedUser),
  user: storedUser ? JSON.parse(storedUser) : null,
  token: null,
  loading: false,
  status: "idle",
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = normalizeAuthPayload(action.payload);

      state.isAuthenticated = Boolean(user);
      state.user = user || null;
      state.token = token;
      state.loading = false;
      state.status = user ? "succeeded" : "failed";
      state.initialized = true;
      state.error = null;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.status = "idle";
      state.initialized = true;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.status = action.payload ? "loading" : state.status;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.status = "failed";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = normalizeAuthPayload(action.payload);

        state.loading = false;
        state.status = "succeeded";
        state.initialized = true;
        state.isAuthenticated = Boolean(user);
        state.user = user || null;
        state.token = token;
        state.error = null;

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, token } = normalizeAuthPayload(action.payload);

        state.loading = false;
        state.status = "succeeded";
        state.initialized = true;
        state.isAuthenticated = Boolean(user);
        state.user = user || null;
        state.token = token;
        state.error = null;

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        const user = action.payload?.user || state.user;

        state.loading = false;
        state.status = "succeeded";
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = user;
        state.error = null;

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.status = "failed";
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  },
});

export const { setCredentials, logout, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;

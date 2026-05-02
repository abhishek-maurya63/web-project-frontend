import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { logout } from "./authSlice";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const getIssueList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.feed || payload?.issues || payload?.data || payload?.issue || [];
};

const getIssue = (payload) => payload?.issue || payload?.data || payload;

const handleIssueRouteError = (error, dispatch, rejectWithValue, fallback) => {
  if (error.response?.status === 401) {
    dispatch(logout());

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  return rejectWithValue(getErrorMessage(error, fallback));
};

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/api/issue/");
      return response.data;
    } catch (error) {
      return handleIssueRouteError(
        error,
        dispatch,
        rejectWithValue,
        "Failed to fetch issues",
      );
    }
  },
);

export const fetchMyIssues = createAsyncThunk(
  "issues/fetchMyIssues",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/api/issue/my-issues");
      return response.data;
    } catch (error) {
      return handleIssueRouteError(
        error,
        dispatch,
        rejectWithValue,
        "Failed to fetch your issues",
      );
    }
  },
);

export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/api/issue/create", formData);
      return response.data;
    } catch (error) {
      return handleIssueRouteError(
        error,
        dispatch,
        rejectWithValue,
        "Failed to create issue",
      );
    }
  },
);

export const updateIssueStatus = createAsyncThunk(
  "issues/updateIssueStatus",
  async ({ issueId, status = "validated" }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/issue/${issueId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return handleIssueRouteError(
        error,
        dispatch,
        rejectWithValue,
        "Failed to update issue status",
      );
    }
  },
);

export const voteOnIssue = updateIssueStatus;

const issueSlice = createSlice({
  name: "issues",
  initialState: {
    feed: [],
    issues: [],
    myIssues: [],
    loading: false,
    myIssuesLoading: false,
    status: "idle",
    myIssuesStatus: "idle",
    votingIssueId: null,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.status = action.payload ? "loading" : state.status;
    },

    setIssues: (state, action) => {
      state.feed = action.payload;
      state.issues = action.payload;
      state.loading = false;
      state.status = "succeeded";
    },

    addIssue: (state, action) => {
      state.feed.unshift(action.payload);
      state.issues.unshift(action.payload);
      state.myIssues.unshift(action.payload);
    },

    updateIssue: (state, action) => {
      const updated = action.payload;
      state.feed = state.feed.map((issue) =>
        issue._id === updated._id ? updated : issue,
      );
      state.issues = state.issues.map((issue) =>
        issue._id === updated._id ? updated : issue,
      );
      state.myIssues = state.myIssues.map((issue) =>
        issue._id === updated._id ? updated : issue,
      );
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.status = "failed";
    },

    clearIssues: (state) => {
      state.feed = [];
      state.issues = [];
      state.myIssues = [];
      state.status = "idle";
      state.myIssuesStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        const feed = getIssueList(action.payload);

        state.loading = false;
        state.status = "succeeded";
        state.feed = feed;
        state.issues = feed;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMyIssues.pending, (state) => {
        state.myIssuesLoading = true;
        state.myIssuesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMyIssues.fulfilled, (state, action) => {
        state.myIssuesLoading = false;
        state.myIssuesStatus = "succeeded";
        state.myIssues = getIssueList(action.payload);
      })
      .addCase(fetchMyIssues.rejected, (state, action) => {
        state.myIssuesLoading = false;
        state.myIssuesStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createIssue.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        const issue = getIssue(action.payload);

        state.loading = false;
        state.status = "succeeded";
        state.feed.unshift(issue);
        state.issues.unshift(issue);
        state.myIssues.unshift(issue);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateIssueStatus.pending, (state, action) => {
        const { issueId, status } = action.meta.arg;

        state.votingIssueId = issueId;
        state.error = null;
        state.feed = state.feed.map((issue) =>
          issue._id === issueId
            ? { ...issue, status, upvotes: (issue.upvotes || 0) + 1 }
            : issue,
        );
        state.issues = state.issues.map((issue) =>
          issue._id === issueId
            ? { ...issue, status, upvotes: (issue.upvotes || 0) + 1 }
            : issue,
        );
        state.myIssues = state.myIssues.map((issue) =>
          issue._id === issueId
            ? { ...issue, status, upvotes: (issue.upvotes || 0) + 1 }
            : issue,
        );
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const updated = getIssue(action.payload);

        state.votingIssueId = null;
        state.feed = state.feed.map((issue) =>
          issue._id === updated._id ? updated : issue,
        );
        state.issues = state.issues.map((issue) =>
          issue._id === updated._id ? updated : issue,
        );
        state.myIssues = state.myIssues.map((issue) =>
          issue._id === updated._id ? updated : issue,
        );
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        const { issueId } = action.meta.arg;

        state.feed = state.feed.map((issue) =>
          issue._id === issueId
            ? { ...issue, upvotes: Math.max((issue.upvotes || 1) - 1, 0) }
            : issue,
        );
        state.issues = state.issues.map((issue) =>
          issue._id === issueId
            ? { ...issue, upvotes: Math.max((issue.upvotes || 1) - 1, 0) }
            : issue,
        );
        state.myIssues = state.myIssues.map((issue) =>
          issue._id === issueId
            ? { ...issue, upvotes: Math.max((issue.upvotes || 1) - 1, 0) }
            : issue,
        );
        state.votingIssueId = null;
        state.error = action.payload;
      });
  },
});

export const {
  setLoading,
  setIssues,
  addIssue,
  updateIssue,
  setError,
  clearIssues,
} = issueSlice.actions;

export default issueSlice.reducer;

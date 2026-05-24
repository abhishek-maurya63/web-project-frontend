import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { logout } from "./authSlice";

const VERIFICATION_TARGET = 3;

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const getIssueList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return (
    payload?.issues ||
    payload?.feed ||
    payload?.data?.issues ||
    payload?.data?.feed ||
    payload?.data ||
    []
  );
};

const getIssue = (payload) =>
  payload?.issue || payload?.data?.issue || payload?.data || payload;

const getId = (value) => value?._id || value?.id || value;

const idsMatch = (left, right) =>
  Boolean(left && right && getId(left)?.toString() === getId(right)?.toString());

const updateIssueInList = (list, updatedIssue) =>
  list.map((issue) => (idsMatch(issue, updatedIssue) ? updatedIssue : issue));

const updateIssueEverywhere = (state, updatedIssue) => {
  if (!updatedIssue?._id) {
    return;
  }

  state.feed = updateIssueInList(state.feed, updatedIssue);
  state.issues = updateIssueInList(state.issues, updatedIssue);
  state.myIssues = updateIssueInList(state.myIssues, updatedIssue);
};

const mapIssueEverywhere = (state, issueId, mapper) => {
  state.feed = state.feed.map((issue) =>
    idsMatch(issue, issueId) ? mapper(issue) : issue,
  );
  state.issues = state.issues.map((issue) =>
    idsMatch(issue, issueId) ? mapper(issue) : issue,
  );
  state.myIssues = state.myIssues.map((issue) =>
    idsMatch(issue, issueId) ? mapper(issue) : issue,
  );
};

const toggleUserInList = (list = [], userId) => {
  const existing = list.some((entry) => idsMatch(entry, userId));

  if (existing) {
    return list.filter((entry) => !idsMatch(entry, userId));
  }

  return [...list, userId];
};

const addUserToList = (list = [], userId) =>
  list.some((entry) => idsMatch(entry, userId)) ? list : [...list, userId];

const removeUserFromList = (list = [], userId) =>
  list.filter((entry) => !idsMatch(entry, userId));

const getSatisfactionLevel = (votes = []) =>
  Math.min(votes.length / VERIFICATION_TARGET, 1);

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
  async (
    { issueId, status, actionTakenReport },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const body = { status };

      if (actionTakenReport !== undefined) {
        body.actionTakenReport = actionTakenReport;
      }

      const response = await api.patch(`/api/issue/status/${issueId}`, body);
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

export const toggleIssueLike = createAsyncThunk(
  "issues/toggleIssueLike",
  async ({ issueId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/api/social/${issueId}/like`);
      return response.data;
    } catch (error) {
      return handleIssueRouteError(
        error,
        dispatch,
        rejectWithValue,
        "Failed to update like",
      );
    }
  },
);

export const verifyIssue = createAsyncThunk(
  "issues/verifyIssue",
  async ({ issueId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/social/${issueId}/verify`);
      return response.data;
    } catch (error) {
      return handleIssueRouteError(
        error,
        dispatch,
        rejectWithValue,
        "Failed to verify issue",
      );
    }
  },
);

export const appealIssue = createAsyncThunk(
  "issues/appealIssue",
  async ({ issueId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/api/social/${issueId}/appeal`);
      return response.data;
    } catch (error) {
      return handleIssueRouteError(
        error,
        dispatch,
        rejectWithValue,
        "Failed to submit feedback",
      );
    }
  },
);

export const voteOnIssue = toggleIssueLike;

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
      updateIssueEverywhere(state, action.payload);
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
        state.votingIssueId = action.meta.arg.issueId;
        state.error = null;
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const updated = getIssue(action.payload);

        state.votingIssueId = null;
        updateIssueEverywhere(state, updated);
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        state.votingIssueId = null;
        state.error = action.payload;
      })
      .addCase(toggleIssueLike.pending, (state, action) => {
        const { issueId, userId } = action.meta.arg;

        state.votingIssueId = issueId;
        state.error = null;

        if (!userId) {
          return;
        }

        mapIssueEverywhere(state, issueId, (issue) => ({
          ...issue,
          likes: toggleUserInList(issue.likes || [], userId),
        }));
      })
      .addCase(toggleIssueLike.fulfilled, (state, action) => {
        const updated = getIssue(action.payload);

        state.votingIssueId = null;
        updateIssueEverywhere(state, updated);
      })
      .addCase(toggleIssueLike.rejected, (state, action) => {
        const { issueId, userId } = action.meta.arg;

        if (userId) {
          mapIssueEverywhere(state, issueId, (issue) => ({
            ...issue,
            likes: toggleUserInList(issue.likes || [], userId),
          }));
        }

        state.votingIssueId = null;
        state.error = action.payload;
      })
      .addCase(verifyIssue.pending, (state, action) => {
        const { issueId, userId } = action.meta.arg;

        state.votingIssueId = issueId;
        state.error = null;

        if (!userId) {
          return;
        }

        mapIssueEverywhere(state, issueId, (issue) => {
          if (issue.status !== "resolved") {
            return issue;
          }

          const verificationVotes = addUserToList(
            issue.verificationVotes || [],
            userId,
          );

          return {
            ...issue,
            verificationVotes,
            satisfactionLevel: getSatisfactionLevel(verificationVotes),
            status:
              verificationVotes.length >= VERIFICATION_TARGET
                ? "closed"
                : issue.status,
          };
        });
      })
      .addCase(verifyIssue.fulfilled, (state, action) => {
        const updated = getIssue(action.payload);

        state.votingIssueId = null;
        updateIssueEverywhere(state, updated);
      })
      .addCase(verifyIssue.rejected, (state, action) => {
        const { issueId, userId } = action.meta.arg;

        if (userId) {
          mapIssueEverywhere(state, issueId, (issue) => {
            const verificationVotes = removeUserFromList(
              issue.verificationVotes || [],
              userId,
            );

            return {
              ...issue,
              verificationVotes,
              satisfactionLevel: getSatisfactionLevel(verificationVotes),
              status: issue.status === "closed" ? "resolved" : issue.status,
            };
          });
        }

        state.votingIssueId = null;
        state.error = action.payload;
      })
      .addCase(appealIssue.pending, (state, action) => {
        state.votingIssueId = action.meta.arg.issueId;
        state.error = null;
      })
      .addCase(appealIssue.fulfilled, (state, action) => {
        const updated = getIssue(action.payload);

        state.votingIssueId = null;
        updateIssueEverywhere(state, updated);
      })
      .addCase(appealIssue.rejected, (state, action) => {
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

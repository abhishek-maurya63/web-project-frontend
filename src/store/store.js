import { configureStore } from "@reduxjs/toolkit";
import issueReducer from "./reducers/issueSlice";
import authReducer from "./reducers/authSlice";

const store = configureStore({
  reducer: {
    issues: issueReducer,
    auth: authReducer,
  },
});

export default store;

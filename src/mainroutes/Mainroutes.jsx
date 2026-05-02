import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Leaderboard from "../pages/Leaderboard";
import ReportIssue from "../pages/ReportIssue";
import MainLayout from "../components/layout/MainLayout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const MainRoutes = () => {
  return (
    <Routes>
      {/* Login route (no navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* All these routes will be rendered inside the MainLayout's Outlet */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Protected: User must be logged in to report or see profile */}
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportIssue />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/near-me" element={<Home filter="nearby" />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;

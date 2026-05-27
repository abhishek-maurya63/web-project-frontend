import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Loader2 } from "lucide-react";
import { loginUser } from "../../store/reducers/authSlice";
import GoogleAuthButton from "./GoogleAuthButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const googleError =
    searchParams.get("error") === "google_auth_failed"
      ? "Google sign-in could not be completed. Please try again."
      : null;
  const authError = error || googleError;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/");
    } catch {
      // The thunk writes the backend error message into Redux.
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-96 space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <FileText className="w-12 h-12 text-cyan-400 mb-2" />
          <h2 className="text-3xl font-bold text-white">
            Log in to CivicPulse
          </h2>
        </div>

        <GoogleAuthButton />

        <div className="flex items-center gap-4 text-xs font-semibold uppercase text-slate-500">
          <span className="h-px flex-1 bg-slate-800" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
              {authError}
            </div>
          )}

          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-black border border-slate-800 rounded-md p-4 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-slate-800 rounded-md p-4 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold p-3 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Log In"}
          </button>
        </form>

        <p className="text-slate-500 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

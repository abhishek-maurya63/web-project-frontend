import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { checkAuthStatus } from "../../store/reducers/authSlice";

const AuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const finishGoogleLogin = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
        navigate("/", { replace: true });
      } catch {
        navigate("/login?error=google_auth_failed", { replace: true });
      }
    };

    finishGoogleLogin();
  }, [dispatch, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1419] px-4 text-slate-300">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        Signing you in...
      </div>
    </div>
  );
};

export default AuthSuccess;

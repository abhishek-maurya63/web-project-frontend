import { API_BASE_URL } from "../../services/api";

const GoogleAuthButton = ({ label = "Continue with Google" }) => {
  const handleGoogleAuth = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-700 bg-white p-3 font-bold text-slate-950 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f1419]"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-black text-blue-600">
        G
      </span>
      <span>{label}</span>
    </button>
  );
};

export default GoogleAuthButton;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/reducers/authSlice";
import { FileText, Loader2 } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(registerUser(formData)).unwrap();
      navigate("/");
    } catch {
      // The thunk writes the backend error message into Redux.
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-96 space-y-8">
        <div className="flex flex-col items-center">
          <FileText className="w-12 h-12 text-cyan-400 mb-2" />
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Join the community
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-black border border-slate-800 rounded-md p-4 text-white focus:border-cyan-500 focus:outline-none transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black border border-slate-800 rounded-md p-4 text-white focus:border-cyan-500 focus:outline-none transition-colors"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black border border-slate-800 rounded-md p-4 text-white focus:border-cyan-500 focus:outline-none transition-colors"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-white font-bold p-3 rounded-full hover:bg-cyan-600 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-slate-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

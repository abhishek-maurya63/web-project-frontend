import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Calendar, Loader2 } from "lucide-react";
import IssueCard from "../features/issues/IssueCard";
import { fetchMyIssues } from "../store/reducers/issueSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myIssues, myIssuesLoading, error } = useSelector(
    (state) => state.issues,
  );

  useEffect(() => {
    dispatch(fetchMyIssues());
  }, [dispatch]);

  const displayName = user?.name || "Citizen";

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header Navigation */}
      <div className="sticky top-0 z-10 bg-[#0f1419]/80 backdrop-blur-md p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">{displayName}</h2>
        <p className="text-xs text-slate-500">{myIssues.length} Reports</p>
      </div>

      {/* Cover Image & Profile Info */}
      <div className="relative">
        <div className="h-48 bg-linear-to-r from-cyan-900 to-slate-800"></div>

        {/* Avatar & Edit Button */}
        <div className="absolute -bottom-16 left-4 flex justify-between items-end w-[calc(100%-2rem)]">
          <div className="w-32 h-32 rounded-full bg-black p-1">
            <div className="w-full h-full rounded-full bg-cyan-600 flex items-center justify-center border-4 border-black text-4xl font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
          <button className="px-4 py-2 border border-slate-700 rounded-full text-white font-bold hover:bg-slate-900 transition-colors">
            Edit profile
          </button>
        </div>
      </div>

      {/* User Details */}
      <div className="mt-20 px-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="text-slate-500">
            @{displayName.toLowerCase().replace(/\s/g, "")}
          </p>
        </div>

        <p className="text-slate-300 leading-relaxed">
          Active citizen committed to improving the civic infrastructure of our
          community. Building a better tomorrow, one report at a time.
        </p>

        <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={16} /> <span>Srinagar, India</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} /> <span>Joined April 2026</span>
          </div>
        </div>

        {/* Stats / Impact Section */}
        <div className="flex gap-6 pt-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-white">
              {user?.impactPoints || 0}
            </span>
            <span className="text-slate-500">Civic Karma</span>
          </div>
          <div className="flex items-center gap-1 hover:underline cursor-pointer">
            <span className="font-bold text-white">{myIssues.length}</span>
            <span className="text-slate-500">Reports filed</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button className="flex-1 py-4 text-white font-bold border-b-4 border-cyan-500">
          Your Reports
        </button>
        <button className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-900 transition-colors">
          Resolved
        </button>
        <button className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-900 transition-colors">
          Likes
        </button>
      </div>

      {/* User's Posts Feed */}
      <div className="divide-y divide-slate-800">
        {myIssuesLoading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            Loading your reports...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-400">{error}</div>
        ) : myIssues.length > 0 ? (
          myIssues.map((issue) => <IssueCard key={issue._id} issue={issue} />)
        ) : (
          <div className="p-10 text-center space-y-2">
            <h3 className="text-xl font-bold text-white">No reports yet</h3>
            <p className="text-slate-500">
              When you report a civic issue, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

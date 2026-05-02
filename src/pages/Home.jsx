import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssues } from "../store/reducers/issueSlice";
import CreateIssueBox from "../features/issues/CreateIssueBox";
import IssueCard from "../features/issues/IssueCard";
import { Loader2, Sparkles } from "lucide-react";

const Home = ({ filter = "all" }) => {
  const dispatch = useDispatch();
  const { feed, loading, error } = useSelector((state) => state.issues);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (feed.length === 0) {
      dispatch(fetchIssues());
    }
  }, [dispatch, feed.length]);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-20 bg-[#0f1419]/80 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          {filter === "nearby" ? "Issues Near You" : "Home Feed"}
        </h2>
        <Sparkles className="text-cyan-400 w-5 h-5 cursor-pointer hover:rotate-12 transition-transform" />
      </div>

      {/* "What's happening?" Section - Only for logged in users */}
      {isAuthenticated && (
        <div className="border-b border-slate-800">
          <CreateIssueBox />
        </div>
      )}

      {/* Issue Feed Container */}
      <div className="flex flex-col">
        {loading && feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-cyan-500 w-10 h-10" />
            <p className="text-slate-500 font-medium">
              Fetching civic reports...
            </p>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
              Error loading feed: {error}
            </p>
          </div>
        ) : feed.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {feed.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Your street is quiet!
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              No civic issues have been reported here yet. Be the first to
              report a problem.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

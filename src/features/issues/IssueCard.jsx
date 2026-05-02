import { Heart, MapPin, MessageCircle, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { voteOnIssue } from "../../store/reducers/issueSlice";

const IssueCard = ({ issue }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { votingIssueId } = useSelector((state) => state.issues);
  const reporterName = issue?.reportedBy?.name || "Anonymous";
  const status = issue?.status || "pending";
  const isVoting = votingIssueId === issue?._id;

  const handleVote = () => {
    if (!issue?._id || !isAuthenticated || isVoting) {
      return;
    }

    dispatch(voteOnIssue({ issueId: issue._id, status: "validated" }));
  };

  return (
    <div className="p-4 border-b border-slate-800 hover:bg-slate-900/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold">
            {reporterName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-white">{reporterName}</h3>
            <span className="text-slate-500">
              @{reporterName.toLowerCase().replace(/\s/g, "")}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-500">
              {issue?.createdAt
                ? new Date(issue.createdAt).toLocaleDateString()
                : "Today"}
            </span>
          </div>

          <h2 className="text-white font-bold text-lg mt-2">{issue?.title}</h2>
          <p className="text-slate-300 mt-2">{issue?.description}</p>

          {issue?.location && (
            <div className="flex items-center gap-1 text-slate-500 text-sm mt-2">
              <MapPin size={14} />
              <span>{issue.location.address || "Unknown location"}</span>
            </div>
          )}

          {issue?.image && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-700">
              <img
                src={issue.image}
                alt={issue?.title || "Reported civic issue"}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="flex gap-6 mt-3 text-slate-500 text-sm">
            <span>{issue?.upvotes || 0} upvotes</span>
            <span>{issue?.comments || 0} comments</span>
            <span className="text-cyan-400 font-bold capitalize">{status}</span>
          </div>

          <div className="flex justify-around mt-3 pt-3 border-t border-slate-800 text-slate-500">
            <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors group">
              <MessageCircle
                size={16}
                className="group-hover:bg-cyan-400/10 rounded-full p-2 w-8 h-8"
              />
              <span className="text-xs">Comment</span>
            </button>
            <button
              type="button"
              onClick={handleVote}
              disabled={!isAuthenticated || isVoting}
              className="flex items-center gap-2 hover:text-cyan-400 transition-colors group disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Heart
                size={16}
                className="group-hover:bg-cyan-400/10 rounded-full p-2 w-8 h-8"
              />
              <span className="text-xs">{isVoting ? "Voting" : "Upvote"}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors group">
              <Share2
                size={16}
                className="group-hover:bg-cyan-400/10 rounded-full p-2 w-8 h-8"
              />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;

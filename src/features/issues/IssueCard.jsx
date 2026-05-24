import { useState } from "react";
import {
  CheckCircle2,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  appealIssue,
  toggleIssueLike,
  updateIssueStatus,
  verifyIssue,
} from "../../store/reducers/issueSlice";

const STATUS_BADGES = {
  reported: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  reviewing: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
  resolved: "border-green-400/30 bg-green-400/10 text-green-300",
  closed: "border-blue-400/30 bg-blue-400/10 text-blue-300",
};

const getId = (value) => value?._id || value?.id || value;

const idsMatch = (left, right) =>
  Boolean(left && right && getId(left)?.toString() === getId(right)?.toString());

const IssueCard = ({ issue }) => {
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [actionTakenReport, setActionTakenReport] = useState(
    issue?.actionTakenReport || "",
  );
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { votingIssueId } = useSelector((state) => state.issues);

  const reporterName = issue?.reportedBy?.name || "Anonymous";
  const status = issue?.status || "reported";
  const currentUserId = user?._id;
  const isAdmin = user?.role === "admin";
  const isCitizen = user?.role === "citizen";
  const isBusy = votingIssueId === issue?._id;
  const likes = Array.isArray(issue?.likes) ? issue.likes : [];
  const comments = Array.isArray(issue?.comments) ? issue.comments : [];
  const verificationVotes = Array.isArray(issue?.verificationVotes)
    ? issue.verificationVotes
    : [];
  const hasLiked = likes.some((like) => idsMatch(like, currentUserId));
  const hasVerified = verificationVotes.some((vote) =>
    idsMatch(vote, currentUserId),
  );
  const canAdminAct = isAuthenticated && isAdmin && status !== "closed";
  const canCitizenVerify =
    isAuthenticated && isCitizen && status === "resolved";
  const imageSrc = issue?.imageUrl || issue?.image;
  const badgeClass =
    STATUS_BADGES[status] ||
    "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";

  const handleLike = () => {
    if (!issue?._id || !isAuthenticated || isBusy) {
      return;
    }

    dispatch(toggleIssueLike({ issueId: issue._id, userId: currentUserId }));
  };

  const handleReview = () => {
    if (!issue?._id || isBusy) {
      return;
    }

    dispatch(updateIssueStatus({ issueId: issue._id, status: "reviewing" }));
  };

  const handleResolve = async (event) => {
    event.preventDefault();

    if (!issue?._id || !actionTakenReport.trim() || isBusy) {
      return;
    }

    try {
      await dispatch(
        updateIssueStatus({
          issueId: issue._id,
          status: "resolved",
          actionTakenReport: actionTakenReport.trim(),
        }),
      ).unwrap();
      setShowResolveForm(false);
    } catch {
      // Redux stores the API message for display elsewhere.
    }
  };

  const handleVerify = () => {
    if (!issue?._id || isBusy || hasVerified) {
      return;
    }

    dispatch(verifyIssue({ issueId: issue._id, userId: currentUserId }));
  };

  const handleAppeal = () => {
    if (!issue?._id || isBusy) {
      return;
    }

    dispatch(appealIssue({ issueId: issue._id }));
  };

  return (
    <article className="border-b border-slate-800 p-4 transition-colors hover:bg-slate-900/50">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-600">
          <span className="font-bold text-white">
            {reporterName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0 flex-1">
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
            <span
              className={`rounded-md border px-2 py-1 text-xs font-bold capitalize ${badgeClass}`}
            >
              {status}
            </span>
          </div>

          <h2 className="mt-2 text-lg font-bold text-white">{issue?.title}</h2>
          <p className="mt-2 text-slate-300">{issue?.description}</p>

          {issue?.location && (
            <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={14} />
              <span>{issue.location.address || "Unknown location"}</span>
            </div>
          )}

          {imageSrc && (
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-700">
              <img
                src={imageSrc}
                alt={issue?.title || "Reported civic issue"}
                className="max-h-96 w-full object-cover"
              />
            </div>
          )}

          {issue?.actionTakenReport && (
            <div className="mt-3 rounded-lg border border-green-400/20 bg-green-400/5 p-3 text-sm text-green-100">
              <p className="font-semibold text-green-300">Action Taken</p>
              <p className="mt-1 text-slate-200">{issue.actionTakenReport}</p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
            <span>{likes.length} upvotes</span>
            <span>{comments.length} comments</span>
            {(status === "resolved" || status === "closed") && (
              <span>{verificationVotes.length}/3 verified</span>
            )}
          </div>

          {canAdminAct && (
            <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex flex-wrap gap-2">
                {status === "reported" && (
                  <button
                    type="button"
                    onClick={handleReview}
                    disabled={isBusy}
                    className="flex items-center gap-2 rounded-md border border-yellow-400/30 px-3 py-2 text-sm font-semibold text-yellow-300 transition-colors hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    Review
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowResolveForm((value) => !value)}
                  disabled={isBusy || status === "resolved"}
                  className="flex items-center gap-2 rounded-md border border-green-400/30 px-3 py-2 text-sm font-semibold text-green-300 transition-colors hover:bg-green-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Wrench className="h-4 w-4" />
                  Resolve Issue
                </button>
              </div>

              {showResolveForm && (
                <form onSubmit={handleResolve} className="mt-3 space-y-2">
                  <textarea
                    value={actionTakenReport}
                    onChange={(event) =>
                      setActionTakenReport(event.target.value)
                    }
                    placeholder="Action taken report"
                    rows="3"
                    className="w-full resize-none rounded-md border border-slate-700 bg-[#0f1419] p-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-green-400"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isBusy || !actionTakenReport.trim()}
                    className="flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit Resolution
                  </button>
                </form>
              )}
            </div>
          )}

          {canCitizenVerify && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleVerify}
                disabled={isBusy || hasVerified}
                className="flex items-center gap-2 rounded-md border border-green-400/30 px-3 py-2 text-sm font-semibold text-green-300 transition-colors hover:bg-green-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {hasVerified ? "Verified" : "Verify"}
              </button>

              <button
                type="button"
                onClick={handleAppeal}
                disabled={isBusy}
                className="flex items-center gap-2 rounded-md border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Not Satisfied
              </button>
            </div>
          )}

          <div className="mt-3 flex justify-around border-t border-slate-800 pt-3 text-slate-500">
            <button className="group flex items-center gap-2 transition-colors hover:text-cyan-400">
              <MessageCircle
                size={16}
                className="h-8 w-8 rounded-full p-2 group-hover:bg-cyan-400/10"
              />
              <span className="text-xs">Comment</span>
            </button>
            <button
              type="button"
              onClick={handleLike}
              disabled={!isAuthenticated || isBusy}
              className="group flex items-center gap-2 transition-colors hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Heart
                size={16}
                className={`h-8 w-8 rounded-full p-2 group-hover:bg-cyan-400/10 ${
                  hasLiked ? "fill-cyan-400 text-cyan-400" : ""
                }`}
              />
              <span className="text-xs">{hasLiked ? "Upvoted" : "Upvote"}</span>
            </button>
            <button className="group flex items-center gap-2 transition-colors hover:text-cyan-400">
              <Share2
                size={16}
                className="h-8 w-8 rounded-full p-2 group-hover:bg-cyan-400/10"
              />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default IssueCard;

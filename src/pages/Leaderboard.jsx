import { Trophy } from "lucide-react";
import { useSelector } from "react-redux";

const Leaderboard = () => {
  const { issues } = useSelector((state) => state.issues);

  const citizens = issues.reduce((acc, issue) => {
    const reporter = issue.reportedBy;
    if (!reporter?.name) {
      return acc;
    }

    const id = reporter._id || reporter.name;
    const current = acc[id] || {
      id,
      name: reporter.name,
      reports: 0,
      resolved: 0,
      karma: 0,
    };

    current.reports += 1;
    current.resolved += issue.status === "resolved" ? 1 : 0;
    current.karma += 10 + (issue.upvotes || 0) * 2;
    acc[id] = current;
    return acc;
  }, {});

  const leaders = Object.values(citizens).sort((a, b) => b.karma - a.karma);

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="sticky top-0 z-20 bg-[#0f1419]/80 backdrop-blur-md border-b border-slate-800 p-4">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <p className="text-xs text-slate-500">Top civic contributors</p>
      </div>

      <div className="divide-y divide-slate-800">
        {leaders.length > 0 ? (
          leaders.map((citizen, index) => (
            <div
              key={citizen.id}
              className="flex items-center gap-4 p-4 hover:bg-slate-900/50 transition-colors"
            >
              <div className="w-10 text-center font-bold text-slate-500">
                #{index + 1}
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center">
                <span className="font-bold">
                  {citizen.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{citizen.name}</h3>
                <p className="text-sm text-slate-500">
                  {citizen.reports} reports · {citizen.resolved} resolved
                </p>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Trophy size={18} />
                {citizen.karma}
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center space-y-2">
            <h3 className="text-2xl font-bold">No rankings yet</h3>
            <p className="text-slate-500">
              Reported issues will build the civic leaderboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

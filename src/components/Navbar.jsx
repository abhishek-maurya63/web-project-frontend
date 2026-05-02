import { NavLink, Link } from "react-router-dom";
import {
  Bell,
  FileText,
  Home,
  MapPin,
  Plus,
  Target,
  UserCircle,
} from "lucide-react";
import { useSelector } from "react-redux";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Near Me", path: "/near-me", icon: MapPin },
  { name: "Leaderboard", path: "/leaderboard", icon: Target },
  { name: "Profile", path: "/profile", icon: UserCircle },
];

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.name || user?.username || "Citizen";
  const civicKarma = user?.civicKarma ?? user?.impactPoints ?? user?.karma ?? 0;

  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-4 p-3 rounded-full transition-all duration-200 group
     ${isActive ? "bg-slate-800 font-semibold" : "hover:bg-slate-900/50"}`;

  return (
    <>
      <nav className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-800/50 bg-[#0f1419] p-5 sm:flex">
        <Link to="/" className="mb-10 flex items-center gap-2 px-3">
          <FileText className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold tracking-tight text-white">
            Civic<span className="text-cyan-400">Hub</span>
          </span>
        </Link>

        <div className="flex-1 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink key={link.path} to={link.path} className={getLinkClass}>
                <Icon className="h-6 w-6 text-slate-300 group-hover:text-white" />
                <span className="text-lg text-slate-100 group-hover:text-white">
                  {link.name}
                </span>
              </NavLink>
            );
          })}
        </div>

        <Link
          to="/report"
          className="mb-8 flex items-center justify-center gap-3 rounded-full bg-cyan-500 py-3 font-bold text-white shadow-lg transition-colors hover:bg-cyan-600"
        >
          <Plus className="h-5 w-5" />
          Report Issue
        </Link>

        {user && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-cyan-700 bg-cyan-900/50">
              <span className="text-lg font-bold text-cyan-100">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{displayName}</p>
              <p className="text-sm text-cyan-400">{civicKarma} Civic Karma</p>
            </div>
          </div>
        )}
      </nav>

      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-800/50 bg-[#0f1419] p-2 sm:hidden">
        <div className="flex h-16 items-center justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink key={link.path} to={link.path} className={getLinkClass}>
                <Icon className="h-6 w-6 text-slate-300 group-hover:text-white" />
              </NavLink>
            );
          })}
          <NavLink to="/notifications" className={getLinkClass}>
            <Bell className="h-6 w-6 text-slate-300 group-hover:text-white" />
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

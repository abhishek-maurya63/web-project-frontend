import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl sm:pl-64">
        <main className="min-h-screen w-full border-x border-slate-800 pb-20 sm:pb-0 lg:max-w-2xl">
          <Outlet />
        </main>

        <aside className="sticky top-0 hidden h-screen flex-1 border-r border-slate-800 px-6 py-5 lg:block">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <h2 className="text-lg font-bold">Civic Pulse</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Track local reports, vote on urgent issues, and keep your civic
              karma moving.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <h2 className="text-lg font-bold">Focus Areas</h2>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <p>Roads and infrastructure</p>
              <p>Sanitation and waste</p>
              <p>Water and electricity</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MainLayout;

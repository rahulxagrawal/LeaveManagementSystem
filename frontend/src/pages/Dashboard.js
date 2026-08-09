import { useEffect, useState } from "react";
import LeaveBalance from "../components/LeaveBalance";
import LeaveForm from "../components/LeaveForm";
import LeaveHistory from "../components/LeaveHistory";
import AdminLeaveTable from "../components/AdminLeaveTable";
import ThemeToggle from "../components/ThemeToggle";
import { getLeaves } from "../services/leaveService";
import logo from "../assets/logo.svg";

function Dashboard({ user, onLogout, theme, onToggleTheme }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Loads the latest leave data whenever the dashboard needs a refresh.
   * @returns {Promise<void>} Resolves after the leave list is updated.
   */
  const loadLeaves = async () => {
    try {
      setError("");
      const data = await getLeaves();
      setLeaves(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  // Employees see only their own requests; admins need the complete list.
  const userLeaves =
    user.role === "admin"
      ? leaves
      : leaves.filter((leave) => leave.userId === user.id);

  return (
    <div className="dashboard-shell min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex min-h-16 w-[92%] max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img className="h-9 w-9" src={logo} alt="LeaveFlow logo" />
            <div>
              <strong className="block text-sm font-extrabold sm:text-base">LeaveFlow</strong>
              <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Leave Management System
              </span>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              {user.role}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:block">
              Hi, <b>{user.name}</b>
            </span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-blue-600 shadow-sm transition hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[92%] max-w-7xl py-8 sm:py-10">
        <section className="mb-7">
          <p className="text-xs font-extrabold tracking-[0.18em] text-blue-600 dark:text-blue-400">
            OVERVIEW
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {user.role === "admin"
              ? "Manage employee leave requests from one place."
              : "Apply for leave and keep track of your requests."}
          </p>
        </section>

        {error && (
          <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Loading leave data...
          </div>
        ) : user.role === "admin" ? (
          <AdminLeaveTable leaves={leaves} onUpdated={loadLeaves} />
        ) : (
          <>
            <LeaveBalance leaves={userLeaves} />
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(300px,0.78fr)_minmax(500px,1.22fr)]">
              <LeaveForm userId={user.id} onSubmitted={loadLeaves} />
              <LeaveHistory leaves={userLeaves} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

/**
 * Displays the employee's submitted leave requests.
 * @param {Object} props - Component props.
 * @param {Array} props.leaves - Leave records to display.
 */
import { getWorkingDays } from "../utils/leaveDays";

function LeaveHistory({ leaves }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-extrabold tracking-[0.16em] text-blue-600 dark:text-blue-400">ACTIVITY</p>
        <h2 className="mt-1 text-lg font-extrabold">Leave History</h2>
      </div>

      {leaves.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No leave applications yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="px-3 py-3 font-bold">Type</th>
                <th className="px-3 py-3 font-bold">From</th>
                <th className="px-3 py-3 font-bold">To</th>
                <th className="px-3 py-3 font-bold">Days</th>
                <th className="px-3 py-3 font-bold">Reason</th>
                <th className="px-3 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-3 py-4 font-semibold">{leave.leaveType}</td>
                  <td className="px-3 py-4 text-slate-600 dark:text-slate-300">{leave.fromDate}</td>
                  <td className="px-3 py-4 text-slate-600 dark:text-slate-300">{leave.toDate}</td>
                  <td className="px-3 py-4 font-semibold">{leave.days || getWorkingDays(leave.fromDate, leave.toDate)}</td>
                  <td className="max-w-xs px-3 py-4 text-slate-600 dark:text-slate-300">{leave.reason}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ${leave.status === "Approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : leave.status === "Rejected" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default LeaveHistory;

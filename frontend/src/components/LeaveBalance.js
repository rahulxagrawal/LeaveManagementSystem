import { getLeaveAllowances, getWorkingDays } from "../utils/leaveDays";

function LeaveBalance({ leaves }) {
  const allowances = getLeaveAllowances();

  // Only approved working days reduce the available balance.
  const usedDays = leaves.reduce(
    (totals, leave) => {
      if (leave.status !== "Approved") return totals;

      const days = Number(leave.days) || getWorkingDays(leave.fromDate, leave.toDate);
      totals[leave.leaveType] = (totals[leave.leaveType] || 0) + days;
      return totals;
    },
    { Casual: 0, Sick: 0, Annual: 0 }
  );

  const cards = Object.entries(allowances).map(([leaveType, allowance]) => ({
    label: `${leaveType} Leave`,
    value: Math.max(allowance - (usedDays[leaveType] || 0), 0),
    note: `${usedDays[leaveType] || 0} used of ${allowance} days`
  }));

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          className="soft-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          key={card.label}
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 dark:bg-blue-950/40" />
          <span className="relative text-sm font-semibold text-slate-500 dark:text-slate-400">
            {card.label}
          </span>
          <strong className="relative mt-3 block text-4xl font-extrabold tracking-tight">
            {card.value}
          </strong>
          <small className="relative mt-1 block text-xs text-slate-400 dark:text-slate-500">
            {card.note}
          </small>
        </div>
      ))}
    </section>
  );
}

export default LeaveBalance;

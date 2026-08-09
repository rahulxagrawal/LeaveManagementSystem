import { useState } from "react";
import { applyLeave } from "../services/leaveService";
import { validateLeaveForm } from "../utils/validation";
import { getWorkingDays, getLeaveAllowances } from "../utils/leaveDays";

function LeaveForm({ userId, onSubmitted }) {
  const [formData, setFormData] = useState({
    leaveType: "Casual",
    fromDate: "",
    toDate: "",
    reason: ""
  });
  const [message, setMessage] = useState("");
  const workingDays = getWorkingDays(formData.fromDate, formData.toDate);
  const allowances = getLeaveAllowances();

  // Keep all form fields in one object so the submit handler stays simple.
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  /**
   * Validates and submits the leave application.
   * @param {Event} event - Form submit event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate on the client before making an API request.
    const validationMessage = validateLeaveForm(formData);

    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setMessage("");

    try {
      await applyLeave({ ...formData, userId, days: workingDays });
      setMessage("Leave application submitted successfully.");
      setFormData({
        leaveType: "Casual",
        fromDate: "",
        toDate: "",
        reason: ""
      });
      onSubmitted();
    } catch (submitError) {
      setMessage(submitError.message);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-extrabold tracking-[0.16em] text-blue-600 dark:text-blue-400">NEW REQUEST</p>
        <h2 className="mt-1 text-lg font-extrabold">Apply for Leave</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="leaveType">
            Leave Type
          </label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
          >
            <option>Casual</option>
            <option>Sick</option>
            <option>Annual</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="fromDate">
              From
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              id="fromDate"
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="toDate">
              To
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              id="toDate"
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {workingDays > 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-sm dark:border-blue-900/60 dark:bg-blue-950/30">
            <p className="font-bold text-blue-800 dark:text-blue-300">
              {workingDays} {workingDays === 1 ? "leave day" : "leave days"} will be counted
            </p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
              Saturdays and Sundays are not counted. {formData.leaveType} allowance: {allowances[formData.leaveType]} days per year.
            </p>
          </div>
        )}

        {workingDays === 0 && formData.fromDate && formData.toDate && (
          <p className="rounded-xl bg-amber-50 px-3.5 py-3 text-sm font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            No working days are selected. Weekend days are not counted.
          </p>
        )}

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="reason">
            Reason
          </label>
          <textarea
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Briefly explain your reason"
            rows="4"
            required
          />
        </div>

        <button
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          type="submit"
        >
          Submit Leave Request
        </button>

        {message && (
          <p className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${message.includes("successfully") ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"}`}>
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

export default LeaveForm;

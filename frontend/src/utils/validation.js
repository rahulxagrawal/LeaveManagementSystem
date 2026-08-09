import { getWorkingDays } from "./leaveDays";

/**
 * Validates a leave application before it is sent to the backend.
 * @param {Object} formData - Leave form data.
 * @returns {string} Validation message or an empty string when valid.
 */
export function validateLeaveForm(formData) {
  if (!formData.leaveType || !formData.fromDate || !formData.toDate || !formData.reason.trim()) {
    return "Please fill in all leave details.";
  }

  if (new Date(`${formData.toDate}T00:00:00`) < new Date(`${formData.fromDate}T00:00:00`)) {
    return "To date cannot be before the from date.";
  }

  const workingDays = getWorkingDays(formData.fromDate, formData.toDate);

  if (workingDays === 0) {
    return "The selected range contains no working days. Saturday and Sunday are not counted.";
  }

  if (formData.reason.trim().length < 5) {
    return "Please enter a slightly longer reason.";
  }

  return "";
}

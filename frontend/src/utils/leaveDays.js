/**
 * Returns the number of weekdays between two dates, including both dates.
 * Saturday and Sunday are not counted as leave days.
 * @param {string} fromDate - Start date in YYYY-MM-DD format.
 * @param {string} toDate - End date in YYYY-MM-DD format.
 * @returns {number} Number of working days.
 */
export function getWorkingDays(fromDate, toDate) {
  if (!fromDate || !toDate) return 0;

  const start = new Date(`${fromDate}T00:00:00`);
  const end = new Date(`${toDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return 0;
  }

  let workingDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();

    if (day !== 0 && day !== 6) {
      workingDays += 1;
    }

    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Returns the annual allowance for each leave type.
 * @returns {Object} Leave allowance by type.
 */
export function getLeaveAllowances() {
  return {
    Casual: 10,
    Sick: 10,
    Annual: 15
  };
}

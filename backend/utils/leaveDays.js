/**
 * Counts weekdays in an inclusive date range.
 * Saturday and Sunday are excluded from the leave day count.
 * @param {string} fromDate - Start date in YYYY-MM-DD format.
 * @param {string} toDate - End date in YYYY-MM-DD format.
 * @returns {number} Number of working days.
 */
function getWorkingDays(fromDate, toDate) {
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

function getLeaveAllowances() {
  return {
    Casual: 10,
    Sick: 10,
    Annual: 15
  };
}

module.exports = { getWorkingDays, getLeaveAllowances };

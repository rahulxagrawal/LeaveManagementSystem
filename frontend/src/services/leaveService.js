const API_URL = "http://localhost:5000/api";

/**
 * Sends login credentials to the backend.
 * @param {Object} credentials - Email and password.
 * @returns {Promise<Object>} Logged-in user data.
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  // Surface the backend message instead of hiding the actual error.
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data.user;
}

/**
 * Gets all leave records from the backend.
 * @returns {Promise<Array>} Leave records.
 */
export async function getLeaves() {
  const response = await fetch(`${API_URL}/leaves`);

  if (!response.ok) {
    throw new Error("Could not load leaves");
  }

  return response.json();
}

/**
 * Submits a new leave application.
 * @param {Object} leaveData - Leave application data.
 * @returns {Promise<Object>} Created leave.
 */
export async function applyLeave(leaveData) {
  const response = await fetch(`${API_URL}/leaves`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(leaveData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not apply for leave");
  }

  return data;
}

/**
 * Updates a leave status.
 * @param {number} leaveId - Leave ID.
 * @param {string} status - Approved or Rejected.
 * @returns {Promise<Object>} Updated leave.
 */
export async function updateLeaveStatus(leaveId, status) {
  const response = await fetch(`${API_URL}/leaves/${leaveId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not update leave");
  }

  return data;
}

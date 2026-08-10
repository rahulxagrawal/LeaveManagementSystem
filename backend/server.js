const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { getWorkingDays, getLeaveAllowances } = require("./utils/leaveDays");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "leaves.json");

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    name: "Rahul Agrawal",
    email: "rahul@gmail.com",
    password: "password123",
    role: "employee"
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  }
];

const leaveAllowances = getLeaveAllowances();

// Read the local data file each time so new requests are immediately available.
function readLeaves() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function saveLeaves(leaves) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leaves, null, 2));
}

/**
 * Checks the demo login credentials.
 * @param {Object} credentials - Email and password.
 * @returns {Object|null} Matching user or null.
 */
function findUser(credentials) {
  return users.find(
    (user) =>
      user.email === credentials.email &&
      user.password === credentials.password
  );
}

/**
 * Calculates approved working days used by a user for one leave type.
 * @param {Array} leaves - All leave records.
 * @param {number} userId - Employee ID.
 * @param {string} leaveType - Casual, Sick, or Annual.
 * @returns {number} Approved working days already used.
 */
function getUsedDays(leaves, userId, leaveType) {
  return leaves.reduce((total, leave) => {
    if (
      leave.userId !== Number(userId) ||
      leave.leaveType !== leaveType ||
      leave.status !== "Approved"
    ) {
      return total;
    }

    return total + (Number(leave.days) || getWorkingDays(leave.fromDate, leave.toDate));
  }, 0);
}

app.get("/", (req, res) => {
  res.json({ message: "Leave Management API is running" });
});

// Mock login endpoint.
app.post("/api/login", (req, res) => {
  const user = findUser(req.body);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Get all leaves.
app.get("/api/leaves", (req, res) => {
  res.json(readLeaves());
});

// Apply for a leave.
app.post("/api/leaves", (req, res) => {
  const { userId, leaveType, fromDate, toDate, reason } = req.body;

  if (!userId || !leaveType || !fromDate || !toDate || !reason?.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!Object.prototype.hasOwnProperty.call(leaveAllowances, leaveType)) {
    return res.status(400).json({ message: "Invalid leave type" });
  }

  const workingDays = getWorkingDays(fromDate, toDate);

  if (workingDays === 0) {
    return res.status(400).json({
      message: "The selected range contains no working days. Saturday and Sunday are not counted."
    });
  }

  const leaves = readLeaves();
  const usedDays = getUsedDays(leaves, userId, leaveType);
  const remainingDays = leaveAllowances[leaveType] - usedDays;

  if (workingDays > remainingDays) {
    return res.status(400).json({
      message: `Only ${Math.max(remainingDays, 0)} ${leaveType.toLowerCase()} leave days are remaining.`
    });
  }

  // Store the calculated working days so every part of the app uses the same value.
  const newLeave = {
    id: Date.now(),
    userId: Number(userId),
    leaveType,
    fromDate,
    toDate,
    days: workingDays,
    reason: reason.trim(),
    status: "Pending"
  };

  leaves.push(newLeave);
  saveLeaves(leaves);

  res.status(201).json(newLeave);
});

// Admin approves or rejects a leave.
app.patch("/api/leaves/:id", (req, res) => {
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const leaves = readLeaves();

  // Only an existing request can be approved or rejected.
  const leaveIndex = leaves.findIndex(
    (leave) => leave.id === Number(req.params.id)
  );

  if (leaveIndex === -1) {
    return res.status(404).json({ message: "Leave not found" });
  }

  const leave = leaves[leaveIndex];

  if (status === "Approved") {
    const requestedDays =
      Number(leave.days) || getWorkingDays(leave.fromDate, leave.toDate);
    const usedDays = getUsedDays(leaves, leave.userId, leave.leaveType);
    const remainingDays = leaveAllowances[leave.leaveType] - usedDays;

    if (requestedDays > remainingDays) {
      return res.status(400).json({
        message: `Cannot approve. Only ${Math.max(remainingDays, 0)} ${leave.leaveType.toLowerCase()} leave days remain.`
      });
    }

    leave.days = requestedDays;
  }

  leaves[leaveIndex].status = status;
  saveLeaves(leaves);

  res.json(leaves[leaveIndex]);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

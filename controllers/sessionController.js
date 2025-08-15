const Session = require("../models/Session");

// GET /api/sessions - list sessions for current user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// POST /api/sessions - create a new session
exports.createSession = async (req, res) => {
  try {
    const { goal, duration, result, startTime, endTime, completed } = req.body;

    if (!goal || typeof duration !== "number" || !startTime || !endTime) {
      return res.status(400).json({ message: "Invalid session data" });
    }

    const session = await Session.create({
      user: req.user.id,
      goal,
      duration,
      result: result || "",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      completed: completed !== undefined ? Boolean(completed) : true,
    });

    res.status(201).json({ session });
  } catch (error) {
    res.status(500).json({ message: "Failed to create session" });
  }
};

// DELETE /api/sessions - delete all sessions for current user
exports.clearSessions = async (req, res) => {
  try {
    await Session.deleteMany({ user: req.user.id });
    res.json({ message: "All sessions cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear sessions" });
  }
};



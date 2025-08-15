// Server app configuration (exported app)

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import usersRouter from "./routes/users.js";
import sessionsRouter from "./routes/sessions.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://focus-flow-client.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing with JSON validation
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({ error: "Invalid JSON" });
        throw new Error("Invalid JSON");
      }
    },
  })
);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Progress Tracker API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// DB
connectDB();

// Routes
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

// 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handler
app.use(errorHandler);

export default app;




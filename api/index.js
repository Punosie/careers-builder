import express from "express";
import cors from "cors";
import { db } from "./firebase-admin.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await db.listCollections();
    return res.status(200).json({
      status: "ok",
      firebase: "connected",
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// Root route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome my friend!",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});

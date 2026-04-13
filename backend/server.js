// C:\Users\hp\Desktop\project_management\backend\server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { pool } from "./db.js";
import cookieParser from "cookie-parser";
import { registerSocketHandlers } from "./socketHandlers.js";
import "./jobs/recycleCleanup.js";
import fs from "fs";

dotenv.config();

/* ============================================================
   DATABASE CONNECTION LOG
============================================================ */
pool.query("SELECT current_database()", (err, result) => {
  if (err) {
    console.error("❌ DB connection error:", err);
  } else {
    console.log("✅ Connected to DB:", result?.rows[0]?.current_database);
  }
});

/* ============================================================
   EXPRESS APP
============================================================ */
const app = express();

/* ============================================================
   COOKIE PARSER (REQUIRED FOR AUTH)
============================================================ */
app.use(cookieParser());

/* ============================================================
   HTTP SERVER (IIS / AZURE SAFE)
============================================================ */
const server = http.createServer(app);

// 🔒 Prevent Azure / IIS idle disconnects
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.maxConnections = 1000;

// 🔥 Azure IIS upload safe timeouts
server.requestTimeout = 10 * 60 * 1000; // 10 minutes
server.timeout = 10 * 60 * 1000;

/* ============================================================
   CORS (MUST COME BEFORE SOCKET + ROUTES)
============================================================ */
app.use(
  cors({
    origin: true, // IIS / Azure reverse proxy safe
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// /* ============================================================
//    BODY PARSER
// ============================================================ */
// app.use(express.json({ limit: "30mb" }));
// app.use(express.urlencoded({ extended: true }));

/* ============================================================
   BODY PARSER (UPLOAD-SAFE)
============================================================ */
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ============================================================
   SOCKET.IO (WEB SOCKET ONLY — IIS SAFE)
============================================================ */
export const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  transports: ["websocket"], // 🚨 Disable polling (IIS breaks it)
  allowEIO3: true,
});

// Register all socket listeners
registerSocketHandlers(io);

/* ============================================================
   STATIC FILES (UPLOADS)
============================================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "uploads");

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Add after uploadsPath declaration ----------
// HEAD (content-length) and tail endpoints to help client-side buffering
app.head("/uploads/:dateFolder/:filename", (req, res) => {
  const { dateFolder, filename } = req.params;
  const filePath = path.join(uploadsPath, dateFolder, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).end();
  }

  try {
    const stat = fs.statSync(filePath);
    res.setHeader("Content-Length", stat.size);
    // tell clients we support ranges
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).end();
  } catch (err) {
    console.error("HEAD error:", err);
    return res.status(500).end();
  }
});

/**
 * Return the last `len` bytes of the file.
 * Useful for the client to probe for 'moov' placement or to
 * warm caches quickly.
 * Query param: ?len=2000000 (2MB default)
 */
app.get("/uploads/:dateFolder/:filename/tail", (req, res) => {
  const { dateFolder, filename } = req.params;
  const len = parseInt(req.query.len || "2000000", 10); // default 2MB
  const filePath = path.join(uploadsPath, dateFolder, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const start = Math.max(0, fileSize - len);
    const end = fileSize - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    });

    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
  } catch (err) {
    console.error("tail endpoint error:", err);
    res.status(500).send("Server error");
  }
});

// ================= MAIN VIDEO STREAM ROUTE =================
// app.get("/uploads/:dateFolder/:filename", (req, res) => {
//   const { dateFolder, filename } = req.params;
//   const filePath = path.join(uploadsPath, dateFolder, filename);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send("File not found");
//   }

//   const stat = fs.statSync(filePath);
//   const fileSize = stat.size;
//   const range = req.headers.range;

//   const ext = path.extname(filename).toLowerCase();
//   const mimeTypes = {
//     ".mp4": "video/mp4",
//     ".webm": "video/webm",
//     ".ogg": "video/ogg",
//     ".mov": "video/mp4",
//   };

//   const contentType = mimeTypes[ext] || "application/octet-stream";

//   // 🔥 IMPORTANT HEADERS FOR SMOOTH STREAMING
//   res.setHeader("Accept-Ranges", "bytes");
//   res.setHeader("Cache-Control", "public, max-age=86400");
//   res.setHeader("Connection", "keep-alive");

//   if (!range) {
//     res.writeHead(200, {
//       "Content-Length": fileSize,
//       "Content-Type": contentType,
//     });

//     return fs
//       .createReadStream(filePath, {
//         // highWaterMark: 1024 * 1024 * 8, // 8MB buffer
//         highWaterMark: 1024 * 256, // 256KB safer for Azure VM
//       })
//       .pipe(res);
//   }

//   const parts = range.replace(/bytes=/, "").split("-");
//   const start = parseInt(parts[0], 10);
//   const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

//   const chunkSize = end - start + 1;

//   res.writeHead(206, {
//     "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//     "Content-Length": chunkSize,
//     "Content-Type": contentType,
//   });

//   fs.createReadStream(filePath, {
//     start,
//     end,
//     // highWaterMark: 1024 * 1024 * 8, // 8MB streaming chunk
//     highWaterMark: 1024 * 256, // 256KB safer for Azure VM
//   }).pipe(res);
// });

app.get("/uploads/:dateFolder/:filename", (req, res) => {
  const { dateFolder, filename } = req.params;
  const filePath = path.join(uploadsPath, dateFolder, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const ext = path.extname(filename).toLowerCase();

  const videoTypes = [".mp4", ".webm", ".ogg", ".mov"];

  // --------------------------------------------------
  // NON-VIDEO FILE → NORMAL DOWNLOAD (CSV / PDF / XLSX)
  // --------------------------------------------------
  if (!videoTypes.includes(ext)) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    });

    return fs.createReadStream(filePath).pipe(res);
  }

  // --------------------------------------------------
  // VIDEO FILE → STREAMING MODE
  // --------------------------------------------------

  const mimeTypes = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogg": "video/ogg",
    ".mov": "video/mp4",
  };

  const contentType = mimeTypes[ext] || "video/mp4";

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "public, max-age=86400");

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
    });

    return fs.createReadStream(filePath).pipe(res);
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Content-Length": chunkSize,
    "Content-Type": contentType,
  });

  fs.createReadStream(filePath, { start, end }).pipe(res);
});

/* ============================================================
   ROUTES
============================================================ */
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import documentRoutes from "./routes/documents.js";
import projectRoutes from "./routes/projects.js";
import folderRoutes from "./routes/folders.js";
import dashboardRoutes from "./routes/dashboard.js";
import departmentRoutes from "./routes/departments.js";
import notificationRoutes from "./routes/notifications.js";
import aiChatRoutes from "./routes/aiChat.js";
import aiMetaRoutes from "./routes/aiMetaRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiChatRoutes);
app.use("/api/ai/meta", aiMetaRoutes);

/* ============================================================
   HEALTH CHECK
============================================================ */
app.get("/", (req, res) => {
  res.send("Project Management Backend Running with Real-Time Features...");
});

/* ============================================================
   START SERVER
============================================================ */
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT} (Azure VM + IIS ready)`);
});

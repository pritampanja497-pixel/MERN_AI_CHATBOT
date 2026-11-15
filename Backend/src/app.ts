import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
const backendEnvPath = path.resolve(__dirname, "../.env");
if (!process.env.MONGODB_URL && fs.existsSync(backendEnvPath)) {
  config({ path: backendEnvPath });
}
const app = express();

// health check endpoint for cloud platforms like Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// middlewares
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin or matching configured origins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "default_cookie_secret"));

// logging middleware in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/v1", appRouter);

// Serve frontend static assets if built
const candidateFrontendPaths = [
  path.resolve(__dirname, "../../Frontend/dist"),
  path.resolve(process.cwd(), "Frontend/dist"),
  path.resolve(process.cwd(), "../Frontend/dist"),
];
const frontendDist = candidateFrontendPaths.find((dir) => fs.existsSync(dir));

if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;

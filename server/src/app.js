import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import routes from "./routes/index.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

app.set("trust proxy", 1); // needed behind Render/Railway/Nginx for correct client IPs (rate limiting, logs)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Cloudinary images/PDFs need this
  }),
);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Strips any $ or . operators from req.body/query/params — blocks
// NoSQL injection attempts like { "username": { "$ne": null } }.
app.use(mongoSanitize());

// Blocks HTTP Parameter Pollution, e.g. ?status=active&status=inactive
// resolving to an array and silently bypassing filters.
app.use(hpp());

app.use(
  morgan(env.nodeEnv === "development" ? "dev" : "combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, try again later" },
});
app.use("/api/auth/login", authLimiter);

// General API-wide limiter as a safety net beyond the per-route ones
// already on /auth/login and /portal/:token.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

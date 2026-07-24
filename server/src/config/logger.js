import winston from "winston";
import { env } from "./env.js";

/**
 * Replaces raw console.log/console.error across the app. In production
 * this writes structured JSON (easy to ship to a log aggregator later);
 * in development it stays human-readable in the terminal.
 */
const { combine, timestamp, printf, colorize, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${ts} [${level}] ${message} ${metaStr}`;
  })
);

const prodFormat = combine(timestamp(), json());

export const logger = winston.createLogger({
  level: env.nodeEnv === "production" ? "info" : "debug",
  format: env.nodeEnv === "production" ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiry,
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiry,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.jwt.accessSecret);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.jwt.refreshSecret);

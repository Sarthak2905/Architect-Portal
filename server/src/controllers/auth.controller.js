import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { env } from "../config/env.js";

const REFRESH_COOKIE_NAME = "refreshToken";

const isProduction = env.nodeEnv === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * POST /api/auth/login
 * Body: { username, password }
 */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        user: { id: user._id, username: user.username, role: user.role },
      },
      "Logged in successfully",
    ),
  );
});

/**
 * POST /api/auth/refresh
 * Reads refresh token from httpOnly cookie, issues a new access token.
 */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new ApiError(401, "No refresh token, please log in again");
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, "Refresh token invalid or expired");
  }

  const user = await User.findById(payload.sub).select("+refreshTokenHash");
  if (!user || !user.refreshTokenHash) {
    throw new ApiError(401, "Session not found, please log in again");
  }

  const matches = await bcrypt.compare(token, user.refreshTokenHash);
  if (!matches) {
    throw new ApiError(401, "Session invalid, please log in again");
  }

  const accessToken = generateAccessToken(user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshTokenHash = null;
    await req.user.save();
  }
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
  return res.status(200).json(new ApiResponse(200, null, "Logged out"));
});

/**
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const { _id, username, role } = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, { id: _id, username, role }));
});

/**
 * PATCH /api/auth/credentials
 * Body: { currentPassword, newUsername?, newPassword? }
 * This is how the owner changes their own login "from the backend" —
 * it's an authenticated endpoint, not a public signup/reset flow.
 */
export const updateCredentials = asyncHandler(async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    throw new ApiError(400, "Current password is required to make changes");
  }
  if (!newUsername && !newPassword) {
    throw new ApiError(400, "Provide a new username and/or new password");
  }

  const user = req.user;
  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  if (newUsername) {
    user.username = newUsername.toLowerCase().trim();
  }
  if (newPassword) {
    if (newPassword.length < 8) {
      throw new ApiError(400, "New password must be at least 8 characters");
    }
    user.passwordHash = await User.hashPassword(newPassword);
  }

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { username: user.username },
        "Credentials updated successfully",
      ),
    );
});

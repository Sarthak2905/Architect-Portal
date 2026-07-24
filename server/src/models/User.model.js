import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Phase 1 uses this for a single "owner" account, but the schema is kept
 * extensible (role field) in case you ever add staff logins later.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "owner",
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false, // never returned unless explicitly requested
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 12);
};

export const User = mongoose.model("User", userSchema);

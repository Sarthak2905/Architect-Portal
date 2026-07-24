import mongoose from "mongoose";
import crypto from "crypto";

export const PROJECT_STATUSES = [
  "Project Created",
  "Site Visit",
  "Drawing Approved",
  "Invoice Generated",
  "Payment Received",
  "Construction Started",
  "Completed",
];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: PROJECT_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: "Project Created",
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    budget: {
      type: Number,
      min: 0,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    estimatedEndDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // The client portal "login" — a long random token embedded in the
    // URL the client is given. No username/password for clients at all.
    portalAccessToken: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(24).toString("hex"),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

projectSchema.index({ title: "text" });
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });

export const Project = mongoose.model("Project", projectSchema);

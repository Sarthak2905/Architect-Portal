import mongoose from "mongoose";

export const NOTIFICATION_EVENTS = [
  "new_invoice",
  "payment_reminder",
  "new_document",
  "work_update",
  "status_change",
  "project_completion",
  "connectivity_test",
];

export const NOTIFICATION_CHANNELS = ["whatsapp", "email", "sms"];

/**
 * A log of every notification attempt — so the owner dashboard (Phase 10)
 * can show "sent" / "failed" history, and a failed send can be identified
 * instead of silently vanishing.
 */
const notificationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    event: {
      type: String,
      enum: NOTIFICATION_EVENTS,
      required: true,
    },
    channel: {
      type: String,
      enum: NOTIFICATION_CHANNELS,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      required: true,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

notificationSchema.index({ project: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);

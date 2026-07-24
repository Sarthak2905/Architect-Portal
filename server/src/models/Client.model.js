import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // used later for client portal login/magic-link
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String, // owner-only internal notes, never shown on client portal
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true, // soft-delete flag instead of destroying records
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

clientSchema.index({ name: "text", email: "text", phone: "text" });

export const Client = mongoose.model("Client", clientSchema);

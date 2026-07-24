import mongoose from "mongoose";
import { PROJECT_STATUSES } from "./Project.model.js";

export const UPDATE_TYPES = [
  "status_change", // auto-created when project status changes
  "work_update", // "Flooring completed on 2nd floor"
  "site_update", // general site note, often with photos
  "milestone", // e.g. "Foundation completed"
  "general", // anything else the owner wants to log
];

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, trim: true, default: "" },
  },
  { _id: false },
);
// Phase 5 will replace manual URL entry with real Cloudinary uploads —
// the shape of this subdocument stays the same, so nothing above it breaks.

const updateSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    type: {
      type: String,
      enum: UPDATE_TYPES,
      default: "general",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      // only populated when type === "status_change"
      type: String,
      enum: PROJECT_STATUSES,
    },
    photos: {
      type: [photoSchema],
      default: [],
    },
    visibleToClient: {
      type: Boolean,
      default: true, // owner can log internal-only notes by setting this false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

updateSchema.index({ project: 1, createdAt: 1 });

export const Update = mongoose.model("Update", updateSchema);

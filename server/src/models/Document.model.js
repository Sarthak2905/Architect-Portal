import mongoose from "mongoose";

export const DOCUMENT_TYPES = [
  "Invoice",
  "Quotation",
  "Challan",
  "Drawing",
  "Agreement",
  "Photo",
  "Other",
];

const documentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    type: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String, // "image" or "raw", as returned by Cloudinary
      required: true,
    },
    originalFileName: {
      type: String,
      default: "",
    },
    visibleToClient: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

documentSchema.index({ project: 1, type: 1 });

export const Document = mongoose.model("Document", documentSchema);

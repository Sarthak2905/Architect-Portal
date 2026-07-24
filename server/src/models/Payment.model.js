import mongoose from "mongoose";

export const PAYMENT_ENTRY_TYPES = ["Invoice", "Payment"];

export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other",
];

/**
 * A single collection holds both sides of the ledger:
 * - type "Invoice"  -> money owed (raised against the client)
 * - type "Payment"  -> money actually received
 * Balance = sum(Invoice amounts) - sum(Payment amounts).
 * Keeping both in one model makes the running history/statement trivial
 * to generate later (just sort by date).
 */
const paymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    type: {
      type: String,
      enum: PAYMENT_ENTRY_TYPES,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    method: {
      // only meaningful when type === "Payment"
      type: String,
      enum: PAYMENT_METHODS,
    },
    referenceNumber: {
      type: String, // cheque no, UTR no, invoice no, etc.
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    document: {
      // optional link to an uploaded Invoice/Challan document (Phase 5)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ project: 1, date: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);

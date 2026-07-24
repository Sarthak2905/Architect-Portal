import mongoose from "mongoose";
import { Update } from "../models/Update.model.js";
import { Document } from "../models/Document.model.js";
import { Payment } from "../models/Payment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/portal/:token/overview
 * One-shot summary: project details, current status, payment summary,
 * and the client's own info. Meant for the portal's landing page.
 */
export const getPortalOverview = asyncHandler(async (req, res) => {
  const project = req.project;

  const rows = await Payment.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(project._id) } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);
  const totals = { Invoice: 0, Payment: 0 };
  rows.forEach((r) => (totals[r._id] = r.total));

  return res.status(200).json(
    new ApiResponse(200, {
      project: {
        id: project._id,
        title: project.title,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        estimatedEndDate: project.estimatedEndDate,
      },
      client: {
        name: project.client.name,
        email: project.client.email,
        phone: project.client.phone,
      },
      paymentSummary: {
        totalInvoiced: totals.Invoice,
        totalReceived: totals.Payment,
        balanceDue: totals.Invoice - totals.Payment,
      },
    }),
  );
});

/**
 * GET /api/portal/:token/timeline
 * Same Update collection the owner uses, but filtered to
 * visibleToClient: true only — internal notes never leak here.
 */
export const getPortalTimeline = asyncHandler(async (req, res) => {
  const project = req.project;

  const updates = await Update.find({
    project: project._id,
    visibleToClient: true,
  }).sort({ createdAt: 1 }).lean();

  return res.status(200).json(new ApiResponse(200, updates));
});

/**
 * GET /api/portal/:token/documents?type=
 */
export const getPortalDocuments = asyncHandler(async (req, res) => {
  const project = req.project;
  const { type } = req.query;

  const filter = { project: project._id, visibleToClient: true };
  if (type) filter.type = type;

  const documents = await Document.find(filter).sort({ createdAt: -1 }).lean();

  return res.status(200).json(new ApiResponse(200, documents));
});

/**
 * GET /api/portal/:token/photos
 * Convenience endpoint — same as documents but pre-filtered to Photo type,
 * since that's a dedicated section in the portal UI ("Site Photos").
 */
export const getPortalPhotos = asyncHandler(async (req, res) => {
  const project = req.project;

  const photos = await Document.find({
    project: project._id,
    visibleToClient: true,
    type: "Photo",
  }).sort({ createdAt: -1 }).lean();

  return res.status(200).json(new ApiResponse(200, photos));
});

/**
 * GET /api/portal/:token/payments
 * Full ledger + summary — clients should be able to see exactly what
 * was invoiced and what they've paid, this builds trust.
 */
export const getPortalPayments = asyncHandler(async (req, res) => {
  const project = req.project;

  const payments = await Payment.find({ project: project._id }).sort({
    date: 1,
  }).lean();

  const rows = await Payment.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(project._id) } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);
  const totals = { Invoice: 0, Payment: 0 };
  rows.forEach((r) => (totals[r._id] = r.total));

  return res.status(200).json(
    new ApiResponse(200, {
      payments,
      summary: {
        totalInvoiced: totals.Invoice,
        totalReceived: totals.Payment,
        balanceDue: totals.Invoice - totals.Payment,
      },
    }),
  );
});

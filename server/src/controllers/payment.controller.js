import mongoose from "mongoose";
import { Payment } from "../models/Payment.model.js";
import { Project } from "../models/Project.model.js";
import { Update } from "../models/Update.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validatePaymentPayload } from "../validators/payment.validator.js";
import { sendNotification } from "../services/notification.service.js";

const computeSummary = async (projectId) => {
  const rows = await Payment.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  const totals = { Invoice: 0, Payment: 0 };
  rows.forEach((r) => (totals[r._id] = r.total));

  return {
    totalInvoiced: totals.Invoice,
    totalReceived: totals.Payment,
    balanceDue: totals.Invoice - totals.Payment,
  };
};

/**
 * POST /api/projects/:projectId/payments
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { type, amount, method, referenceNumber, date, notes, document } =
    req.body;

  validatePaymentPayload(req.body);

  const project = await Project.findById(projectId).populate("client");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const payment = await Payment.create({
    project: projectId,
    type,
    amount,
    method: type === "Payment" ? method : undefined,
    referenceNumber: referenceNumber?.trim() || "",
    date: date || Date.now(),
    notes: notes?.trim() || "",
    document,
    createdBy: req.user._id,
  });

  const summary = await computeSummary(projectId);

  const updateTitle =
    type === "Invoice"
      ? `Invoice raised for ₹${amount.toLocaleString("en-IN")}`
      : `Payment of ₹${amount.toLocaleString("en-IN")} received`;

  await Update.create({
    project: projectId,
    type: "general",
    title: updateTitle,
    visibleToClient: true,
    createdBy: req.user._id,
  });

  if (type === "Invoice") {
    await sendNotification({
      event: "new_invoice",
      project,
      client: project.client,
      templateData: {
        clientName: project.client.name,
        projectTitle: project.title,
        amount,
      },
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { payment, summary }, "Payment entry recorded"));
});

/**
 * GET /api/projects/:projectId/payments
 * Returns full ledger + running summary for the project.
 */
export const getProjectPayments = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { type } = req.query;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const filter = { project: projectId };
  if (type) filter.type = type;

  const [payments, summary] = await Promise.all([
    Payment.find(filter).sort({ date: 1 }).lean(),
    computeSummary(projectId),
  ]);

  return res.status(200).json(new ApiResponse(200, { payments, summary }));
});

/**
 * GET /api/payments/:id
 */
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    throw new ApiError(404, "Payment entry not found");
  }
  return res.status(200).json(new ApiResponse(200, payment));
});

/**
 * PATCH /api/payments/:id
 * Type is locked after creation — editing Invoice into Payment (or back)
 * would silently rewrite the ledger's meaning, so that always requires
 * delete + recreate instead.
 */
export const updatePayment = asyncHandler(async (req, res) => {
  const { amount, method, referenceNumber, date, notes } = req.body;
  validatePaymentPayload(req.body, { partial: true });

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    throw new ApiError(404, "Payment entry not found");
  }

  if (amount !== undefined) payment.amount = amount;
  if (method !== undefined && payment.type === "Payment")
    payment.method = method;
  if (referenceNumber !== undefined)
    payment.referenceNumber = referenceNumber.trim();
  if (date !== undefined) payment.date = date;
  if (notes !== undefined) payment.notes = notes.trim();

  await payment.save();

  const summary = await computeSummary(payment.project);

  return res
    .status(200)
    .json(new ApiResponse(200, { payment, summary }, "Payment entry updated"));
});

/**
 * DELETE /api/payments/:id
 */
export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    throw new ApiError(404, "Payment entry not found");
  }

  const { project } = payment;
  await payment.deleteOne();
  const summary = await computeSummary(project);

  return res
    .status(200)
    .json(new ApiResponse(200, { summary }, "Payment entry deleted"));
});

import mongoose from "mongoose";
import { Notification } from "../models/Notification.model.js";
import { Project } from "../models/Project.model.js";
import { Payment } from "../models/Payment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendNotification } from "../services/notification.service.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";

/**
 * GET /api/projects/:projectId/notifications
 */
export const getProjectNotifications = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notifications = await Notification.find({ project: projectId }).sort({
    createdAt: -1,
  });

  return res.status(200).json(new ApiResponse(200, notifications));
});

/**
 * POST /api/projects/:projectId/notifications/payment-reminder
 */
export const sendPaymentReminder = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).populate("client");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const rows = await Payment.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);
  const totals = { Invoice: 0, Payment: 0 };
  rows.forEach((r) => (totals[r._id] = r.total));
  const balanceDue = totals.Invoice - totals.Payment;

  if (balanceDue <= 0) {
    throw new ApiError(400, "No outstanding balance on this project");
  }

  await sendNotification({
    event: "payment_reminder",
    project,
    client: project.client,
    templateData: {
      clientName: project.client.name,
      projectTitle: project.title,
      balanceDue,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { balanceDue }, "Payment reminder sent"));
});

/**
 * POST /api/notifications/test-whatsapp
 * Body: { phone: "9876543210" }
 * TEMPORARY setup helper — sends Meta's built-in hello_world template
 * to confirm your access token + phone number ID work. Safe to delete
 * this route once WhatsApp is confirmed working.
 */
export const testWhatsAppConnection = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    throw new ApiError(400, "phone is required");
  }

  const result = await sendWhatsAppMessage({
    event: "connectivity_test",
    client: { phone },
    templateData: {},
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Test WhatsApp message sent"));
});

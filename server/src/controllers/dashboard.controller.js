import mongoose from "mongoose";
import { Project } from "../models/Project.model.js";
import { Client } from "../models/Client.model.js";
import { Payment } from "../models/Payment.model.js";
import { Update } from "../models/Update.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/dashboard/summary
 * The top-of-dashboard numbers: active projects, total clients,
 * projects grouped by status, and total outstanding balance across
 * every active project.
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [activeProjectsCount, totalClients, statusBreakdown, balanceRows] =
    await Promise.all([
      Project.countDocuments({ isActive: true }),
      Client.countDocuments({ isActive: true }),
      Project.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "project",
            foreignField: "_id",
            as: "projectDoc",
          },
        },
        { $unwind: "$projectDoc" },
        { $match: { "projectDoc.isActive": true } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]),
    ]);

  const totals = { Invoice: 0, Payment: 0 };
  balanceRows.forEach((r) => (totals[r._id] = r.total));

  const projectsByStatus = {};
  statusBreakdown.forEach((s) => (projectsByStatus[s._id] = s.count));

  return res.status(200).json(
    new ApiResponse(200, {
      activeProjectsCount,
      totalClients,
      projectsByStatus,
      totalInvoiced: totals.Invoice,
      totalReceived: totals.Payment,
      totalOutstandingBalance: totals.Invoice - totals.Payment,
    }),
  );
});

/**
 * GET /api/dashboard/pending-payments?limit=
 * Every active project with a positive balance due, worst-first —
 * this is the "who do I need to follow up with" list.
 */
export const getPendingPayments = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

  const rows = await Payment.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projectDoc",
      },
    },
    { $unwind: "$projectDoc" },
    { $match: { "projectDoc.isActive": true } },
    {
      $group: {
        _id: "$project",
        projectTitle: { $first: "$projectDoc.title" },
        clientId: { $first: "$projectDoc.client" },
        invoiced: {
          $sum: { $cond: [{ $eq: ["$type", "Invoice"] }, "$amount", 0] },
        },
        received: {
          $sum: { $cond: [{ $eq: ["$type", "Payment"] }, "$amount", 0] },
        },
      },
    },
    {
      $addFields: {
        balanceDue: { $subtract: ["$invoiced", "$received"] },
      },
    },
    { $match: { balanceDue: { $gt: 0 } } },
    { $sort: { balanceDue: -1 } },
    { $limit: limitNum },
    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    },
    { $unwind: "$client" },
    {
      $project: {
        _id: 0,
        projectId: "$_id",
        projectTitle: 1,
        balanceDue: 1,
        clientName: "$client.name",
        clientPhone: "$client.phone",
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, rows));
});

/**
 * GET /api/dashboard/recent-activity?limit=
 * The latest updates across ALL projects — status changes, work
 * updates, document uploads, payments — one unified feed, newest first.
 * Owner-facing, so it includes internal (visibleToClient: false) items
 * too, unlike the client portal timeline.
 */
export const getRecentActivity = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

  const activity = await Update.find({})
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .populate("project", "title")
    .populate("createdBy", "username")
    .lean();

  return res.status(200).json(new ApiResponse(200, activity));
});

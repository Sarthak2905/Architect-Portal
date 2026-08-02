import { Project, PROJECT_STATUSES } from "../models/Project.model.js";
import { Client } from "../models/Client.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateProjectPayload } from "../validators/project.validator.js";
import { Update } from "../models/Update.model.js";
import { sendNotification } from "../services/notification.service.js";
import crypto from "crypto";
import { Document } from "../models/Document.model.js";
import { Payment } from "../models/Payment.model.js";
import { Notification } from "../models/Notification.model.js";
import { deleteFromCloudinary } from "../utils/uploadToCloudinary.js";

/**
 * DELETE /api/projects/:id/permanent
 * Real, irreversible delete — removes the project AND every related
 * record (updates, documents, payments, notifications), and purges
 * each document's actual file from Cloudinary too. Unlike archiveProject
 * (soft delete), there is no undo for this.
 */
export const hardDeleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Delete every uploaded file from Cloudinary before removing the DB
  // records that reference them — otherwise the files become orphaned
  // and keep counting against your Cloudinary storage forever.
  const documents = await Document.find({ project: project._id });
  await Promise.all(
    documents.map((doc) =>
      deleteFromCloudinary(doc.cloudinaryPublicId, doc.resourceType).catch((err) => {
        // Don't let one failed Cloudinary delete block the rest of the
        // cleanup — log it and continue; a stray orphaned file is a far
        // smaller problem than a stuck, half-deleted project.
        console.error(`Cloudinary delete failed for ${doc.cloudinaryPublicId}:`, err.message);
      })
    )
  );

  await Promise.all([
    Update.deleteMany({ project: project._id }),
    Document.deleteMany({ project: project._id }),
    Payment.deleteMany({ project: project._id }),
    Notification.deleteMany({ project: project._id }),
  ]);

  await project.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project and all related data permanently deleted"));
});

/**
 * PATCH /api/projects/:id/regenerate-portal-link
 * Invalidates the old portal URL immediately (old token stops resolving)
 * and issues a new one. Use this if a link is ever shared/leaked
 * somewhere it shouldn't be.
 */
export const regeneratePortalLink = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.portalAccessToken = crypto.randomBytes(24).toString("hex");
  await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { portalAccessToken: project.portalAccessToken },
        "Portal link regenerated — the old link no longer works",
      ),
    );
});

/**
 * POST /api/projects
 */
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, client, budget, startDate, estimatedEndDate } =
    req.body;
  validateProjectPayload(req.body);

  const clientDoc = await Client.findById(client);
  if (!clientDoc || !clientDoc.isActive) {
    throw new ApiError(400, "Client not found or inactive");
  }

  const project = await Project.create({
    title: title.trim(),
    description: description?.trim() || "",
    client,
    budget: budget || 0,
    startDate: startDate || Date.now(),
    estimatedEndDate,
    createdBy: req.user._id,
    statusHistory: [{ status: "Project Created", changedBy: req.user._id }],
  });

  await Update.create({
    project: project._id,
    type: "status_change",
    status: "Project Created",
    title: "Project Created",
    message: `Project "${project.title}" was created.`,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

/**
 * GET /api/projects?search=&status=&client=&page=&limit=&archived=false
 */
export const getProjects = asyncHandler(async (req, res) => {
  const {
    search = "",
    status,
    client,
    page = 1,
    limit = 10,
    archived = "false",
  } = req.query;

  const filter = {};
  if (archived === "false") filter.isActive = true;
  if (archived === "true") filter.isActive = false;
  // archived === "all" -> no filter

  if (status) filter.status = status;
  if (client) filter.client = client;
  if (search.trim()) filter.$text = { $search: search.trim() };

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("client", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      projects,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }),
  );
});

/**
 * GET /api/projects/:id
 */
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "client",
    "name email phone address",
  );
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res.status(200).json(new ApiResponse(200, project));
});

/**
 * PATCH /api/projects/:id
 * For general field edits (title, description, budget, dates).
 * Status changes go through the dedicated endpoint below so every
 * change is logged in statusHistory.
 */
export const updateProject = asyncHandler(async (req, res) => {
  const { title, description, budget, startDate, estimatedEndDate } = req.body;
  validateProjectPayload(req.body, { partial: true });

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (title !== undefined) project.title = title.trim();
  if (description !== undefined) project.description = description.trim();
  if (budget !== undefined) project.budget = budget;
  if (startDate !== undefined) project.startDate = startDate;
  if (estimatedEndDate !== undefined)
    project.estimatedEndDate = estimatedEndDate;

  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

/**
 * PATCH /api/projects/:id/status
 * Body: { status }
 * Dedicated endpoint because this is the trigger point Phase 7/8 will
 * hook into for client notifications ("your project moved to X").
 */
export const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !PROJECT_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Status must be one of: ${PROJECT_STATUSES.join(", ")}`,
    );
  }

  const project = await Project.findById(req.params.id).populate("client");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.status = status;
  project.statusHistory.push({ status, changedBy: req.user._id });
  await project.save();

  await Update.create({
    project: project._id,
    type: "status_change",
    status,
    title: `Status changed to "${status}"`,
    createdBy: req.user._id,
  });

  const event = status === "Completed" ? "project_completion" : "status_change";
  await sendNotification({
    event,
    project,
    client: project.client,
    templateData: {
      clientName: project.client.name,
      projectTitle: project.title,
      status,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, `Status updated to "${status}"`));
});

/**
 * DELETE /api/projects/:id
 * Soft delete/archive.
 */
export const archiveProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.isActive = false;
  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project archived"));
});

/**
 * PATCH /api/projects/:id/restore
 */
export const restoreProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.isActive = true;
  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project restored"));
});

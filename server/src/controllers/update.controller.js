import { Update } from "../models/Update.model.js";
import { Project } from "../models/Project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateUpdatePayload } from "../validators/update.validator.js";
import { sendNotification } from "../services/notification.service.js";

/**
 * POST /api/projects/:projectId/updates
 * Manual updates only — status_change updates are created automatically
 * by updateProjectStatus in project.controller.js, not through this route.
 */
export const createUpdate = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, message, type, photos, visibleToClient } = req.body;

  validateUpdatePayload(req.body);

  const project = await Project.findById(projectId).populate("client");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (type === "status_change") {
    throw new ApiError(
      400,
      "status_change updates are created automatically when you change project status",
    );
  }

  const update = await Update.create({
    project: projectId,
    type: type || "general",
    title: title.trim(),
    message: message?.trim() || "",
    photos: photos || [],
    visibleToClient: visibleToClient ?? true,
    createdBy: req.user._id,
  });

  if (update.visibleToClient) {
    await sendNotification({
      event: "work_update",
      project,
      client: project.client,
      templateData: {
        clientName: project.client.name,
        projectTitle: project.title,
        updateTitle: update.title,
      },
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, update, "Update posted successfully"));
});

/**
 * GET /api/projects/:projectId/updates?page=&limit=&type=&order=asc|desc
 * This IS the project timeline — status changes and manual updates live
 * in the same collection, sorted chronologically.
 */
export const getProjectUpdates = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page = 1, limit = 20, type, order = "asc" } = req.query;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const filter = { project: projectId };
  if (type) filter.type = type;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (pageNum - 1) * limitNum;
  const sortDir = order === "desc" ? -1 : 1;

  const [updates, total] = await Promise.all([
    Update.find(filter)
      .sort({ createdAt: sortDir })
      .skip(skip)
      .limit(limitNum)
      .populate("createdBy", "username")
      .lean(),
    Update.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      updates,
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
 * PATCH /api/updates/:id
 * Lets the owner fix a typo/caption. Status-change updates and the
 * "type" field itself are locked to avoid corrupting the timeline's
 * meaning after the fact.
 */
export const editUpdate = asyncHandler(async (req, res) => {
  const { title, message, photos, visibleToClient } = req.body;

  const update = await Update.findById(req.params.id);
  if (!update) {
    throw new ApiError(404, "Update not found");
  }
  if (update.type === "status_change") {
    throw new ApiError(400, "Status-change entries can't be edited manually");
  }

  if (title !== undefined) update.title = title.trim();
  if (message !== undefined) update.message = message.trim();
  if (photos !== undefined) update.photos = photos;
  if (visibleToClient !== undefined) update.visibleToClient = visibleToClient;

  await update.save();

  return res
    .status(200)
    .json(new ApiResponse(200, update, "Update edited successfully"));
});

/**
 * DELETE /api/updates/:id
 */
export const deleteUpdate = asyncHandler(async (req, res) => {
  const update = await Update.findById(req.params.id);
  if (!update) {
    throw new ApiError(404, "Update not found");
  }
  if (update.type === "status_change") {
    throw new ApiError(
      400,
      "Status-change entries can't be deleted directly — they reflect project history",
    );
  }

  await update.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Update deleted"));
});

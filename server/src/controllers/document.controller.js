import { Document, DOCUMENT_TYPES } from "../models/Document.model.js";
import { Project } from "../models/Project.model.js";
import { Update } from "../models/Update.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendNotification } from "../services/notification.service.js";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

/**
 * POST /api/projects/:projectId/documents
 * multipart/form-data: file=<binary>, type=Invoice, title=..., visibleToClient=true
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { type, title, visibleToClient } = req.body;

  if (!req.file) {
    throw new ApiError(400, "A file is required");
  }
  if (!type || !DOCUMENT_TYPES.includes(type)) {
    throw new ApiError(
      400,
      `Type must be one of: ${DOCUMENT_TYPES.join(", ")}`,
    );
  }
  if (!title || !title.trim()) {
    throw new ApiError(400, "A title is required");
  }

  const project = await Project.findById(projectId).populate("client");
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: `architect-portal/${projectId}`,
    filename: `${type}-${Date.now()}`,
  });

  const isVisible = visibleToClient !== "false";

  const document = await Document.create({
    project: projectId,
    type,
    title: title.trim(),
    fileUrl: result.secure_url,
    cloudinaryPublicId: result.public_id,
    resourceType: result.resource_type,
    originalFileName: req.file.originalname,
    visibleToClient: isVisible,
    uploadedBy: req.user._id,
  });

  await Update.create({
    project: projectId,
    type: "general",
    title: `New ${type.toLowerCase()} uploaded: ${document.title}`,
    photos: type === "Photo" ? [{ url: document.fileUrl }] : [],
    visibleToClient: isVisible,
    createdBy: req.user._id,
  });

  if (isVisible) {
    const event = type === "Invoice" ? "new_invoice" : "new_document";
    await sendNotification({
      event,
      project,
      client: project.client,
      templateData: {
        clientName: project.client.name,
        projectTitle: project.title,
        documentType: type,
        documentTitle: document.title,
        amount: 0,
      },
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, document, "Document uploaded successfully"));
});

/**
 * GET /api/projects/:projectId/documents?type=
 */
export const getProjectDocuments = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { type } = req.query;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const filter = { project: projectId };
  if (type) filter.type = type;

  const documents = await Document.find(filter).sort({ createdAt: -1 }).lean();

  return res.status(200).json(new ApiResponse(200, documents));
});

/**
 * GET /api/documents/:id
 */
export const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) {
    throw new ApiError(404, "Document not found");
  }
  return res.status(200).json(new ApiResponse(200, document));
});

/**
 * DELETE /api/documents/:id
 * Hard delete — removes from Cloudinary too, since documents (unlike
 * clients/projects) don't need a soft-delete/history trail.
 */
export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  await deleteFromCloudinary(
    document.cloudinaryPublicId,
    document.resourceType,
  );
  await document.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Document deleted"));
});

import { ApiError } from "../utils/ApiError.js";
import { UPDATE_TYPES } from "../models/Update.model.js";

export const validateUpdatePayload = (body) => {
  const { title, type } = body;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Update title is required");
  }

  if (type !== undefined && !UPDATE_TYPES.includes(type)) {
    throw new ApiError(400, `Type must be one of: ${UPDATE_TYPES.join(", ")}`);
  }
};

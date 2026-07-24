import { ApiError } from "../utils/ApiError.js";
import { PROJECT_STATUSES } from "../models/Project.model.js";

export const validateProjectPayload = (body, { partial = false } = {}) => {
  const { title, client, status, budget } = body;

  if (!partial || title !== undefined) {
    if (!title || !title.trim()) {
      throw new ApiError(400, "Project title is required");
    }
  }

  if (!partial) {
    if (!client) {
      throw new ApiError(400, "A client is required to create a project");
    }
  }

  if (status !== undefined && !PROJECT_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Status must be one of: ${PROJECT_STATUSES.join(", ")}`,
    );
  }

  if (budget !== undefined && (isNaN(budget) || budget < 0)) {
    throw new ApiError(400, "Budget must be a non-negative number");
  }
};

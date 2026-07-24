import { Project } from "../models/Project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * There's no client login — the token IN THE URL is the credential.
 * This middleware resolves it to a project and attaches it to req,
 * so every portal controller just reads req.project instead of
 * re-querying and re-checking on every route.
 */
export const resolvePortalProject = asyncHandler(async (req, _res, next) => {
  const { token } = req.params;

  const project = await Project.findOne({ portalAccessToken: token }).populate(
    "client",
    "name email phone address",
  );

  if (!project || !project.isActive) {
    // Deliberately vague — don't reveal whether the token format was
    // valid but the project doesn't exist, vs genuinely wrong token.
    throw new ApiError(404, "Portal link not found or no longer active");
  }

  req.project = project;
  next();
});

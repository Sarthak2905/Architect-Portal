import { ApiError } from "../utils/ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateClientPayload = (body, { partial = false } = {}) => {
  const { name, email, phone } = body;

  if (!partial || name !== undefined) {
    if (!name || !name.trim()) {
      throw new ApiError(400, "Client name is required");
    }
  }

  if (!partial || email !== undefined) {
    if (!email || !EMAIL_REGEX.test(email)) {
      throw new ApiError(400, "A valid email is required");
    }
  }

  if (!partial || phone !== undefined) {
    if (!phone || phone.trim().length < 7) {
      throw new ApiError(400, "A valid phone number is required");
    }
  }
};

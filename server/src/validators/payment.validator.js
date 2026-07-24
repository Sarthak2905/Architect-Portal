import { ApiError } from "../utils/ApiError.js";
import {
  PAYMENT_ENTRY_TYPES,
  PAYMENT_METHODS,
} from "../models/Payment.model.js";

export const validatePaymentPayload = (body, { partial = false } = {}) => {
  const { type, amount, method } = body;

  if (!partial) {
    if (!type || !PAYMENT_ENTRY_TYPES.includes(type)) {
      throw new ApiError(
        400,
        `Type must be one of: ${PAYMENT_ENTRY_TYPES.join(", ")}`,
      );
    }
    if (amount === undefined || isNaN(amount) || amount <= 0) {
      throw new ApiError(400, "Amount must be a positive number");
    }
    if (type === "Payment" && method && !PAYMENT_METHODS.includes(method)) {
      throw new ApiError(
        400,
        `Method must be one of: ${PAYMENT_METHODS.join(", ")}`,
      );
    }
  } else {
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      throw new ApiError(400, "Amount must be a positive number");
    }
    if (method !== undefined && !PAYMENT_METHODS.includes(method)) {
      throw new ApiError(
        400,
        `Method must be one of: ${PAYMENT_METHODS.join(", ")}`,
      );
    }
  }
};

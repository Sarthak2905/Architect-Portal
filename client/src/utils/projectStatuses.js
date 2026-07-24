// Mirrors PROJECT_STATUSES from server/src/models/Project.model.js —
// keep these two lists in sync if you ever add/reorder a stage there.
export const PROJECT_STATUSES = [
  "Project Created",
  "Site Visit",
  "Drawing Approved",
  "Invoice Generated",
  "Payment Received",
  "Construction Started",
  "Completed",
];

export const STATUS_BADGE_TONE = {
  "Project Created": "neutral",
  "Site Visit": "primary",
  "Drawing Approved": "primary",
  "Invoice Generated": "warning",
  "Payment Received": "success",
  "Construction Started": "primary",
  Completed: "success",
};

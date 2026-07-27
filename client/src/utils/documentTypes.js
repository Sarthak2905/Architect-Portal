// Mirrors DOCUMENT_TYPES from server/src/models/Document.model.js
export const DOCUMENT_TYPES = [
  "Invoice",
  "Quotation",
  "Challan",
  "Drawing",
  "Agreement",
  "Photo",
  "Other",
];

// Mirrors UPDATE_TYPES from server/src/models/Update.model.js
// (status_change is excluded — that one is system-generated only)
export const UPDATE_TYPES = [
  "work_update",
  "site_update",
  "milestone",
  "general",
];

export const UPDATE_TYPE_LABELS = {
  status_change: "Status change",
  work_update: "Work update",
  site_update: "Site update",
  milestone: "Milestone",
  general: "General",
};

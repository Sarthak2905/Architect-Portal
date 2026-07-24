import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("Incoming file:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    encoding: file.encoding,
  });

  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  // Some clients (Postman, some browsers/OSes) send a generic
  // application/octet-stream mimetype instead of the real one.
  // Trust the extension as a fallback in that case rather than rejecting
  // a legitimate file.
  if (!mimeOk && !extOk) {
    return cb(
      new ApiError(400, "Only JPG, PNG, WEBP, and PDF files are allowed"),
      false,
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * Cloudinary serves files inline (opens in browser) by default.
 * Inserting fl_attachment into the URL tells Cloudinary to send the
 * file with a Content-Disposition: attachment header instead, so the
 * browser downloads it rather than just previewing it.
 */
export const toDownloadUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return cloudinaryUrl;
  return cloudinaryUrl.replace("/upload/", "/upload/fl_attachment/");
};
/**
 * Fetches the file and triggers a real browser download, instead of
 * relying on Cloudinary's fl_attachment transformation (which some
 * account tiers/settings silently ignore). Works regardless of
 * Cloudinary configuration.
 */
export const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("Failed to fetch file");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: at least open it in a new tab so the user can save
    // manually via right-click → Save As, rather than nothing happening.
    window.open(url, "_blank");
  }
};

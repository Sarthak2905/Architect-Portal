import { useState } from "react";
import { Trash2, Download, X } from "lucide-react";
import { Card } from "../ui/Card";
import { downloadFile } from "../../utils/downloadFile";

export const PhotoGallery = ({ photos, isLoading, onDelete }) => {
    const [previewPhoto, setPreviewPhoto] = useState(null);

    if (isLoading) {
        return <Card className="text-sm text-muted">Loading photos...</Card>;
    }

    if (!photos?.length) {
        return (
            <Card className="text-sm text-muted text-center py-8">
                No site photos uploaded yet.
            </Card>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo) => (
                    <div
                        key={photo._id}
                        className="relative group rounded-md overflow-hidden border border-border aspect-square cursor-pointer"
                        onClick={() => setPreviewPhoto(photo)}
                    >
                        <img
                            src={photo.fileUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay actions — visible on hover (desktop) and always
                tappable on mobile since hover doesn't apply there */}
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(photo.fileUrl, photo.originalFileName || photo.title);
                                }}
                                className="p-1.5 rounded-md bg-slate-900/60 text-white hover:bg-slate-900/80"
                                aria-label="Download photo"
                            >
                                <Download size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(photo._id);
                                }}
                                className="p-1.5 rounded-md bg-slate-900/60 text-white hover:bg-red-600/80"
                                aria-label="Delete photo"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full-size lightbox preview */}
            {previewPhoto && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/80 flex items-center justify-center p-4"
                    onClick={() => setPreviewPhoto(null)}
                >
                    <button
                        onClick={() => setPreviewPhoto(null)}
                        className="absolute top-4 right-4 p-2 rounded-md bg-white/10 text-white hover:bg-white/20"
                        aria-label="Close preview"
                    >
                        <X size={20} />
                    </button>

                    <img
                        src={previewPhoto.fileUrl}
                        alt={previewPhoto.title}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-full max-h-[85vh] rounded-md object-contain"
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(previewPhoto.fileUrl, previewPhoto.originalFileName || previewPhoto.title);
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-md bg-white text-ink text-sm font-medium hover:bg-slate-100"
                    >
                        <Download size={16} /> Download
                    </button>
                </div>
            )}
        </>
    );
};
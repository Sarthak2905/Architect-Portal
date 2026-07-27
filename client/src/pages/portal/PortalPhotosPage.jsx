import { useParams } from "react-router-dom";
import { useState } from "react";
import { X, Download } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { usePortalPhotos } from "../../api/hooks/usePortal";
import { PortalNotFoundPage } from "./PortalNotFoundPage";
import { downloadFile } from "../../utils/downloadFile";

export const PortalPhotosPage = () => {
    const { token } = useParams();
    const { data: photos, isLoading, isError } = usePortalPhotos(token);
    const [preview, setPreview] = useState(null);

    if (isError) return <PortalNotFoundPage />;

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-4">
            <h1 className="text-2xl">Site Photos</h1>

            {isLoading ? (
                <p className="text-sm text-muted">Loading...</p>
            ) : !photos?.length ? (
                <Card className="text-sm text-muted text-center py-8">No photos shared yet.</Card>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo) => (
                        <div
                            key={photo._id}
                            onClick={() => setPreview(photo)}
                            className="rounded-md overflow-hidden border border-border aspect-square cursor-pointer"
                        >
                            <img src={photo.fileUrl} alt={photo.title} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {preview && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/80 flex items-center justify-center p-4"
                    onClick={() => setPreview(null)}
                >
                    <button
                        onClick={() => setPreview(null)}
                        className="absolute top-4 right-4 p-2 rounded-md bg-white/10 text-white hover:bg-white/20"
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={preview.fileUrl}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-full max-h-[85vh] rounded-md object-contain"
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(preview.fileUrl, preview.originalFileName || preview.title);
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-md bg-white text-ink text-sm font-medium hover:bg-slate-100"
                    >
                        <Download size={16} /> Download
                    </button>
                </div>
            )}
        </div>
    );
};
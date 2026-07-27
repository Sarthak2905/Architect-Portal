import { useParams } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { usePortalDocuments } from "../../api/hooks/usePortal";
import { PortalNotFoundPage } from "./PortalNotFoundPage";
import { downloadFile } from "../../utils/downloadFile";
import { formatDate } from "../../utils/formatters";

export const PortalDocumentsPage = () => {
    const { token } = useParams();
    const { data: documents, isLoading, isError } = usePortalDocuments(token);

    if (isError) return <PortalNotFoundPage />;

    const nonPhotoDocs = documents?.filter((d) => d.type !== "Photo");

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-4">
            <h1 className="text-2xl">Documents</h1>

            {isLoading ? (
                <p className="text-sm text-muted">Loading...</p>
            ) : !nonPhotoDocs?.length ? (
                <Card className="text-sm text-muted text-center py-8">No documents shared yet.</Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {nonPhotoDocs.map((doc) => (
                        <Card key={doc._id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 rounded-md bg-slate-100 text-muted shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate">{doc.title}</p>
                                        <Badge tone="neutral">{doc.type}</Badge>
                                    </div>
                                    <p className="text-xs text-muted mt-0.5">{formatDate(doc.createdAt)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => downloadFile(doc.fileUrl, doc.originalFileName || doc.title)}
                                className="p-2 rounded-md text-muted hover:text-primary hover:bg-slate-100 transition-colors shrink-0"
                                aria-label="Download"
                            >
                                <Download size={16} />
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
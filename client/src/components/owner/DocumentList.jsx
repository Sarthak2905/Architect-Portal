import { FileText, Download, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatters";
import { downloadFile } from "../../utils/downloadFile";

export const DocumentList = ({ documents, isLoading, onDelete }) => {
    if (isLoading) {
        return <Card className="text-sm text-muted">Loading documents...</Card>;
    }

    if (!documents?.length) {
        return (
            <Card className="text-sm text-muted text-center py-8">
                No documents uploaded yet.
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {documents.map((doc) => (
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
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={() => downloadFile(doc.fileUrl, doc.originalFileName || doc.title)}
                            className="p-2 rounded-md text-muted hover:text-primary hover:bg-slate-100 transition-colors"
                            aria-label="Download"
                        >
                            <Download size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(doc._id)}
                            className="p-2 rounded-md text-muted hover:text-error hover:bg-red-50 transition-colors"
                            aria-label="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </Card>
            ))}
        </div>
    );
};
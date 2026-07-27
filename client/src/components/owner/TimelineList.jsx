import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatRelativeTime } from "../../utils/formatters";
import { UPDATE_TYPE_LABELS } from "../../utils/documentTypes";

const TYPE_TONE = {
    status_change: "primary",
    work_update: "success",
    site_update: "warning",
    milestone: "primary",
    general: "neutral",
};

export const TimelineList = ({ updates, isLoading }) => {
    if (isLoading) {
        return <Card className="text-sm text-muted">Loading timeline...</Card>;
    }

    if (!updates?.length) {
        return (
            <Card className="text-sm text-muted text-center py-8">
                No updates yet. Status changes and posted updates will appear here.
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {updates.map((update) => (
                <Card key={update._id}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Badge tone={TYPE_TONE[update.type] || "neutral"}>
                                    {UPDATE_TYPE_LABELS[update.type] || update.type}
                                </Badge>
                                {!update.visibleToClient && <Badge tone="neutral">Internal only</Badge>}
                            </div>
                            <p className="text-sm font-medium">{update.title}</p>
                            {update.message && (
                                <p className="text-sm text-muted mt-1">{update.message}</p>
                            )}
                            {update.photos?.length > 0 && (
                                <div className="flex gap-2 mt-2 overflow-x-auto">
                                    {update.photos.map((photo, i) => (
                                        <img
                                            key={i}
                                            src={photo.url}
                                            alt={photo.caption || "Update photo"}
                                            className="w-16 h-16 rounded-md object-cover border border-border shrink-0"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-mono text-muted shrink-0">
                            {formatRelativeTime(update.createdAt)}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    );
};
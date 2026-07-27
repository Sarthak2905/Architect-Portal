import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { usePortalTimeline } from "../../api/hooks/usePortal";
import { PortalNotFoundPage } from "./PortalNotFoundPage";
import { formatRelativeTime } from "../../utils/formatters";
import { UPDATE_TYPE_LABELS } from "../../utils/documentTypes";

const TYPE_TONE = {
    status_change: "primary",
    work_update: "success",
    site_update: "warning",
    milestone: "primary",
    general: "neutral",
};

export const PortalTimelinePage = () => {
    const { token } = useParams();
    const { data: updates, isLoading, isError } = usePortalTimeline(token);

    if (isError) return <PortalNotFoundPage />;

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-4">
            <h1 className="text-2xl">Timeline</h1>

            {isLoading ? (
                <p className="text-sm text-muted">Loading...</p>
            ) : !updates?.length ? (
                <Card className="text-sm text-muted text-center py-8">No updates yet.</Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {updates.map((u) => (
                        <Card key={u._id}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <Badge tone={TYPE_TONE[u.type] || "neutral"} className="mb-1.5">
                                        {UPDATE_TYPE_LABELS[u.type] || u.type}
                                    </Badge>
                                    <p className="text-sm font-medium">{u.title}</p>
                                    {u.message && <p className="text-sm text-muted mt-1">{u.message}</p>}
                                    {u.photos?.length > 0 && (
                                        <div className="flex gap-2 mt-2 overflow-x-auto">
                                            {u.photos.map((photo, i) => (
                                                <img
                                                    key={i}
                                                    src={photo.url}
                                                    alt=""
                                                    className="w-16 h-16 rounded-md object-cover border border-border shrink-0"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-mono text-muted shrink-0">
                                    {formatRelativeTime(u.createdAt)}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
import { Card } from "../ui/Card";
import { formatRelativeTime } from "../../utils/formatters";

export const ActivityFeed = ({ activity, isLoading }) => {
    if (isLoading) {
        return <Card className="text-sm text-muted">Loading recent activity...</Card>;
    }

    if (!activity?.length) {
        return (
            <Card className="text-sm text-muted text-center py-8">
                No activity yet — updates will show up here.
            </Card>
        );
    }

    return (
        <Card className="p-0 overflow-hidden">
            <ul className="divide-y divide-border">
                {activity.map((item) => (
                    <li key={item._id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{item.title}</p>
                                <p className="text-xs text-muted truncate">
                                    {item.project?.title || "Unknown project"}
                                </p>
                            </div>
                            <span className="text-xs font-mono text-muted shrink-0">
                                {formatRelativeTime(item.createdAt)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};
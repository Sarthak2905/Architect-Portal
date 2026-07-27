import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { ListSkeleton } from "./ListSkeleton";
import { formatRelativeTime } from "../../utils/formatters";
import { Activity } from "lucide-react";

export const ActivityFeed = ({ activity, isLoading }) => {
    if (isLoading) return <ListSkeleton rows={4} />;

    if (!activity?.length) {
        return (
            <EmptyState
                icon={Activity}
                title="No activity yet"
                description="Updates will show up here as you work on projects."
            />
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
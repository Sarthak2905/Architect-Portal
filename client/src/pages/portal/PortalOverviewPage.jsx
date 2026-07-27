import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { usePortalOverview } from "../../api/hooks/usePortal";
import { PortalNotFoundPage } from "./PortalNotFoundPage";
import { STATUS_BADGE_TONE, PROJECT_STATUSES } from "../../utils/projectStatuses";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const PortalOverviewPage = () => {
    const { token } = useParams();
    const { data, isLoading, isError } = usePortalOverview(token);

    if (isError) return <PortalNotFoundPage />;
    if (isLoading) return <div className="p-6 text-sm text-muted">Loading...</div>;

    const { project, client, paymentSummary } = data;
    const currentIndex = PROJECT_STATUSES.indexOf(project.status);
    const progressPct = ((currentIndex + 1) / PROJECT_STATUSES.length) * 100;

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-5">
            <div>
                <h1 className="text-2xl">{project.title}</h1>
                <p className="text-muted mt-1">Welcome, {client.name}</p>
            </div>

            <Card className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current stage</span>
                    <Badge tone={STATUS_BADGE_TONE[project.status] || "neutral"}>{project.status}</Badge>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <p className="text-xs text-muted">
                    Stage {currentIndex + 1} of {PROJECT_STATUSES.length}
                </p>
            </Card>

            {project.description && (
                <Card>
                    <p className="text-sm font-medium mb-1">About this project</p>
                    <p className="text-sm text-muted">{project.description}</p>
                </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <p className="text-xs font-mono text-muted uppercase tracking-wide">Started</p>
                    <p className="text-sm font-semibold mt-1">{formatDate(project.startDate)}</p>
                </Card>
                <Card>
                    <p className="text-xs font-mono text-muted uppercase tracking-wide">Balance Due</p>
                    <p className={`text-sm font-semibold mt-1 ${paymentSummary.balanceDue > 0 ? "text-warning" : "text-success"}`}>
                        {formatCurrency(paymentSummary.balanceDue)}
                    </p>
                </Card>
            </div>
        </div>
    );
};
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { ListSkeleton } from "./ListSkeleton";
import { formatCurrency } from "../../utils/formatters";
import { CheckCircle2 } from "lucide-react";

export const PendingPaymentsList = ({ payments, isLoading }) => {
    if (isLoading) return <ListSkeleton rows={3} />;

    if (!payments?.length) {
        return (
            <EmptyState
                icon={CheckCircle2}
                title="All settled"
                description="No pending payments right now."
            />
        );
    }

    return (
        <Card className="p-0 overflow-hidden">
            <ul className="divide-y divide-border">
                {payments.map((p) => (
                    <li key={p.projectId} className="flex items-center justify-between px-4 py-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{p.projectTitle}</p>
                            <p className="text-xs text-muted truncate">{p.clientName}</p>
                        </div>
                        <Badge tone="warning" className="shrink-0 ml-3">
                            {formatCurrency(p.balanceDue)}
                        </Badge>
                    </li>
                ))}
            </ul>
        </Card>
    );
};
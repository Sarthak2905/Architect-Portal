import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/formatters";

export const PendingPaymentsList = ({ payments, isLoading }) => {
    if (isLoading) {
        return <Card className="text-sm text-muted">Loading pending payments...</Card>;
    }

    if (!payments?.length) {
        return (
            <Card className="text-sm text-muted text-center py-8">
                No pending payments — everything is settled.
            </Card>
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
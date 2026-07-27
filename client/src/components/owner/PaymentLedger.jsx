import { Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const PaymentLedger = ({ payments, isLoading, onDelete }) => {
    if (isLoading) {
        return <Card className="text-sm text-muted">Loading payment history...</Card>;
    }

    if (!payments?.length) {
        return (
            <Card className="text-sm text-muted text-center py-8">
                No invoices or payments recorded yet.
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {[...payments].reverse().map((entry) => {
                const isInvoice = entry.type === "Invoice";
                return (
                    <Card key={entry._id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`p-2 rounded-md shrink-0 ${isInvoice ? "bg-amber-50 text-warning" : "bg-emerald-50 text-success"
                                    }`}
                            >
                                {isInvoice ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-medium">
                                        {isInvoice ? "Invoice raised" : "Payment received"}
                                    </p>
                                    {!isInvoice && entry.method && <Badge tone="neutral">{entry.method}</Badge>}
                                </div>
                                <p className="text-xs text-muted mt-0.5">
                                    {formatDate(entry.date)}
                                    {entry.referenceNumber && ` · ${entry.referenceNumber}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-sm font-mono font-semibold ${isInvoice ? "text-warning" : "text-success"}`}>
                                {isInvoice ? "+" : "-"}{formatCurrency(entry.amount)}
                            </span>
                            <button
                                onClick={() => onDelete(entry._id)}
                                className="p-1.5 rounded-md text-muted hover:text-error hover:bg-red-50 transition-colors"
                                aria-label="Delete entry"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
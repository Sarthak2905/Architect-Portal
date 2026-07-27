import { useParams } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { usePortalPayments } from "../../api/hooks/usePortal";
import { PortalNotFoundPage } from "./PortalNotFoundPage";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const PortalPaymentsPage = () => {
    const { token } = useParams();
    const { data, isLoading, isError } = usePortalPayments(token);

    if (isError) return <PortalNotFoundPage />;

    const summary = data?.summary;
    const payments = data?.payments;
    const receivedPct =
        summary?.totalInvoiced > 0 ? Math.min((summary.totalReceived / summary.totalInvoiced) * 100, 100) : 0;

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-4">
            <h1 className="text-2xl">Payments</h1>

            {isLoading ? (
                <p className="text-sm text-muted">Loading...</p>
            ) : (
                <>
                    <Card className="flex flex-col gap-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <p className="text-xs font-mono text-muted uppercase tracking-wide">Invoiced</p>
                                <p className="text-lg font-semibold mt-1">{formatCurrency(summary?.totalInvoiced)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-mono text-muted uppercase tracking-wide">Paid</p>
                                <p className="text-lg font-semibold mt-1 text-success">{formatCurrency(summary?.totalReceived)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-mono text-muted uppercase tracking-wide">Due</p>
                                <p className={`text-lg font-semibold mt-1 ${summary?.balanceDue > 0 ? "text-warning" : "text-success"}`}>
                                    {formatCurrency(summary?.balanceDue)}
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-success transition-all duration-300" style={{ width: `${receivedPct}%` }} />
                        </div>
                    </Card>

                    {!payments?.length ? (
                        <Card className="text-sm text-muted text-center py-8">No payment history yet.</Card>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {[...payments].reverse().map((entry) => {
                                const isInvoice = entry.type === "Invoice";
                                return (
                                    <Card key={entry._id} className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`p-2 rounded-md shrink-0 ${isInvoice ? "bg-amber-50 text-warning" : "bg-emerald-50 text-success"}`}>
                                                {isInvoice ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{isInvoice ? "Invoice" : "Payment"}</p>
                                                    {!isInvoice && entry.method && <Badge tone="neutral">{entry.method}</Badge>}
                                                </div>
                                                <p className="text-xs text-muted mt-0.5">{formatDate(entry.date)}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-mono font-semibold ${isInvoice ? "text-warning" : "text-success"}`}>
                                            {isInvoice ? "+" : "-"}{formatCurrency(entry.amount)}
                                        </span>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
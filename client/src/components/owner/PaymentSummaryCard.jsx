import { Card } from "../ui/Card";
import { formatCurrency } from "../../utils/formatters";

/**
 * The balance visual — a simple horizontal bar showing received vs
 * outstanding, so the owner sees the payment health of a project at a
 * glance instead of doing math on two numbers.
 */
export const PaymentSummaryCard = ({ summary }) => {
    const { totalInvoiced = 0, totalReceived = 0, balanceDue = 0 } = summary || {};
    const receivedPct = totalInvoiced > 0 ? Math.min((totalReceived / totalInvoiced) * 100, 100) : 0;

    return (
        <Card className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <p className="text-xs font-mono text-muted uppercase tracking-wide">Invoiced</p>
                    <p className="text-lg font-semibold mt-1">{formatCurrency(totalInvoiced)}</p>
                </div>
                <div>
                    <p className="text-xs font-mono text-muted uppercase tracking-wide">Received</p>
                    <p className="text-lg font-semibold mt-1 text-success">{formatCurrency(totalReceived)}</p>
                </div>
                <div>
                    <p className="text-xs font-mono text-muted uppercase tracking-wide">Balance</p>
                    <p className={`text-lg font-semibold mt-1 ${balanceDue > 0 ? "text-warning" : "text-success"}`}>
                        {formatCurrency(balanceDue)}
                    </p>
                </div>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className="h-full bg-success transition-all duration-300"
                    style={{ width: `${receivedPct}%` }}
                />
            </div>
        </Card>
    );
};
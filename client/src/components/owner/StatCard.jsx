import { Card } from "../ui/Card";
import { cn } from "../../utils/cn";

export const StatCard = ({ label, value, tone = "default", icon: Icon }) => {
    const toneClasses = {
        default: "text-ink",
        success: "text-success",
        warning: "text-warning",
    };

    return (
        <Card className="flex items-start justify-between">
            <div>
                <p className="text-xs font-mono text-muted uppercase tracking-wide">{label}</p>
                <p className={cn("text-2xl font-semibold mt-1.5", toneClasses[tone])}>{value}</p>
            </div>
            {Icon && (
                <div className="p-2 rounded-md bg-slate-100 text-muted">
                    <Icon size={18} />
                </div>
            )}
        </Card>
    );
};
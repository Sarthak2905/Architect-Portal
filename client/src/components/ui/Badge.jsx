import { cn } from "../../utils/cn";

const TONES = {
    neutral: "bg-slate-100 text-muted",
    primary: "bg-indigo-50 text-primary",
    success: "bg-emerald-50 text-success",
    warning: "bg-amber-50 text-warning",
    error: "bg-red-50 text-error",
};

export const Badge = ({ tone = "neutral", className, children }) => {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium font-mono tracking-wide",
                TONES[tone],
                className
            )}
        >
            {children}
        </span>
    );
};
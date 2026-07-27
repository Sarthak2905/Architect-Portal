import { cn } from "../../utils/cn";

export const Tabs = ({ tabs, active, onChange }) => {
    return (
        <div className="flex gap-1 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={cn(
                        "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                        active === tab.value
                            ? "border-primary text-primary"
                            : "border-transparent text-muted hover:text-ink"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
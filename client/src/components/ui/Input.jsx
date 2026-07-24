import { cn } from "../../utils/cn";

export const Input = ({ label, error, className, id, ...props }) => {
    const inputId = id || props.name;

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-muted">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    "w-full rounded-md border bg-white px-3 py-2.5 text-ink placeholder:text-muted/60 transition-colors",
                    error ? "border-error" : "border-border focus:border-primary",
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-error">{error}</span>}
        </div>
    );
};
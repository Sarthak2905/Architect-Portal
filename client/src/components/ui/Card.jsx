import { cn } from "../../utils/cn";

/**
 * Base card surface. `elevated` bumps the shadow for cards that need
 * to stand out (e.g. modals, the primary dashboard stat) — used
 * sparingly, most cards use the default flat shadow.
 */
export const Card = ({ elevated = false, className, children, ...props }) => {
    return (
        <div
            className={cn(
                "bg-surface border border-border rounded-md p-4",
                elevated ? "shadow-elevated" : "shadow-card",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
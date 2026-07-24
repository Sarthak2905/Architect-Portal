import { Check } from "lucide-react";
import { PROJECT_STATUSES } from "../../utils/projectStatuses";
import { cn } from "../../utils/cn";

/**
 * Visual progress stepper. Clicking any step (other than the current
 * one) sets the project's status directly to that stage — the owner
 * moves the project forward or corrects a wrong stage in one tap,
 * rather than clicking through every intermediate stage.
 */
export const StatusStepper = ({ currentStatus, onSelectStatus, isUpdating }) => {
    const currentIndex = PROJECT_STATUSES.indexOf(currentStatus);

    return (
        <div className="flex flex-col gap-0">
            {PROJECT_STATUSES.map((status, index) => {
                const isDone = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isLast = index === PROJECT_STATUSES.length - 1;

                return (
                    <button
                        key={status}
                        disabled={isUpdating || isCurrent}
                        onClick={() => onSelectStatus(status)}
                        className="flex items-start gap-3 text-left disabled:cursor-default group"
                    >
                        <div className="flex flex-col items-center">
                            <span
                                className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 transition-colors",
                                    isDone && "bg-success text-white",
                                    isCurrent && "bg-primary text-white",
                                    !isDone && !isCurrent && "bg-slate-100 text-muted group-hover:bg-slate-200"
                                )}
                            >
                                {isDone ? <Check size={13} /> : index + 1}
                            </span>
                            {!isLast && (
                                <span
                                    className={cn(
                                        "w-0.5 flex-1 min-h-[20px]",
                                        isDone ? "bg-success" : "bg-border"
                                    )}
                                />
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-sm pb-5",
                                isCurrent ? "font-semibold text-ink" : "text-muted group-hover:text-ink"
                            )}
                        >
                            {status}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

/**
 * Used for any irreversible action (permanent delete). Requires an
 * explicit confirm click — never triggered by a single misclick on the
 * original button.
 */
export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isSubmitting,
    confirmLabel = "Delete permanently",
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4"
            onClick={onClose}
        >
            <div
                className="bg-surface w-full max-w-sm rounded-md shadow-elevated p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-red-50 text-error shrink-0">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-muted mt-1">{description}</p>
                    </div>
                </div>

                <div className="flex gap-2 justify-end mt-5">
                    <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="danger" size="sm" onClick={onConfirm} disabled={isSubmitting}>
                        {isSubmitting ? "Deleting..." : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};
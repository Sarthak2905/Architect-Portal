import { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        // Prevent background scroll while a modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-surface w-full sm:max-w-md sm:rounded-md rounded-t-2xl shadow-elevated max-h-[90vh] overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface">
                    <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-slate-100 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};
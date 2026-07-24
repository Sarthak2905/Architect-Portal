import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4">
            <div
                className="bg-surface w-full sm:max-w-md sm:rounded-md rounded-t-2xl shadow-elevated max-h-[90vh] overflow-y-auto"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};
import { Mail, Phone, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useClickOutside } from "../../api/hooks/useClickOutside";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useHardDeleteClient } from "../../api/hooks/useClients";
export const ClientCard = ({ client, onEdit, onDeactivate, onReactivate }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useClickOutside(() => setMenuOpen(false));
    const [confirmOpen, setConfirmOpen] = useState(false);
    const hardDeleteClient = useHardDeleteClient();
    const [deleteError, setDeleteError] = useState("");

    const handleHardDelete = async () => {
        try {
            await hardDeleteClient.mutateAsync(client._id);
            setConfirmOpen(false);
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Failed to delete client");
        }
    };
    return (
        <Card className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{client.name}</p>
                    {!client.isActive && <Badge tone="neutral">Inactive</Badge>}
                </div>
                <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
                    <Mail size={14} /> <span className="truncate">{client.email}</span>
                </p>
                <p className="text-sm text-muted flex items-center gap-1.5 mt-0.5">
                    <Phone size={14} /> {client.phone}
                </p>
            </div>

            <div className="relative shrink-0" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-slate-100 transition-colors"
                    aria-label="More options"
                >
                    <MoreVertical size={18} />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-1 w-36 bg-surface border border-border rounded-md shadow-elevated z-10 overflow-hidden">
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                onEdit(client);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                        >
                            Edit
                        </button>
                        {client.isActive ? (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onDeactivate(client._id);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-red-50 transition-colors"
                            >
                                Deactivate
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onReactivate(client._id);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-success hover:bg-emerald-50 transition-colors"
                            >
                                Reactivate
                                </button>     
                        )}
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                setDeleteError("");
                                setConfirmOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-error hover:bg-red-50 transition-colors border-t border-border"
                        >
                            Delete permanently
                        </button>
                    </div>
                )}
            </div>
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleHardDelete}
                title="Delete this client permanently?"
                description={deleteError || `This will permanently remove ${client.name} from the database. This cannot be undone. You can only do this if the client has no projects.`}
                isSubmitting={hardDeleteClient.isPending}
            />
        </Card>
    );
};
import { useState } from "react";
import { MoreVertical, IndianRupee } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { STATUS_BADGE_TONE } from "../../utils/projectStatuses";
import { formatCurrency } from "../../utils/formatters";
import { useClickOutside } from "../../api/hooks/useClickOutside";
import { useNavigate } from "react-router-dom";

export const ProjectCard = ({ project, onEdit, onArchive, onRestore, onUpdateStatus }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useClickOutside(() => setMenuOpen(false));
    const navigate = useNavigate();

    return (
        <Card
            className="flex items-start justify-between gap-3 cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate(`/projects/${project._id}`)}
        >
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">{project.title}</p>
                    <Badge tone={STATUS_BADGE_TONE[project.status] || "neutral"}>{project.status}</Badge>
                    {!project.isActive && <Badge tone="neutral">Archived</Badge>}
                </div>
                <p className="text-sm text-muted mt-1 truncate">{project.client?.name}</p>
                {project.budget > 0 && (
                    <p className="text-sm text-muted flex items-center gap-1 mt-0.5">
                        <IndianRupee size={13} /> {formatCurrency(project.budget)}
                    </p>
                )}
            </div>

            <div className="relative shrink-0" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((v) => !v);
                    }}
                    className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-slate-100 transition-colors"
                    aria-label="More options"
                >
                    <MoreVertical size={18} />
                </button>

                {menuOpen && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-1 w-44 bg-surface border border-border rounded-md shadow-elevated z-10 overflow-hidden"
                    >
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                onUpdateStatus(project);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                        >
                            Update status
                        </button>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                onEdit(project);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                        >
                            Edit details
                        </button>
                        {project.isActive ? (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onArchive(project._id);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-red-50 transition-colors"
                            >
                                Archive
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onRestore(project._id);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-success hover:bg-emerald-50 transition-colors"
                            >
                                Restore
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};
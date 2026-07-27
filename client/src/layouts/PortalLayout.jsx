import { Outlet, NavLink, useParams } from "react-router-dom";
import { LayoutGrid, Clock, FileText, Image, Wallet } from "lucide-react";

const PORTAL_NAV = [
    { label: "Overview", path: "", icon: LayoutGrid },
    { label: "Timeline", path: "timeline", icon: Clock },
    { label: "Documents", path: "documents", icon: FileText },
    { label: "Photos", path: "photos", icon: Image },
    { label: "Payments", path: "payments", icon: Wallet },
];

/**
 * Mobile-first by design: bottom tab bar always visible (this is a
 * client-facing view, most will open it on their phone from a WhatsApp
 * link). At desktop widths it becomes a top tab bar instead of a
 * sidebar, since this is a simple read-only view, not a full app shell.
 */
export const PortalLayout = () => {
    const { token } = useParams();

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            <header className="bg-white border-b border-border px-4 py-4 md:px-8">
                <p className="text-sm text-muted">Project Portal</p>
            </header>

            {/* Desktop top tabs */}
            <nav className="hidden md:flex gap-1 px-8 border-b border-border bg-white">
                {PORTAL_NAV.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path ? `/portal/${token}/${path}` : `/portal/${token}`}
                        end={path === ""}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${isActive ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"
                            }`
                        }
                    >
                        <Icon size={16} /> {label}
                    </NavLink>
                ))}
            </nav>

            <main className="flex-1 pb-20 md:pb-8">
                <Outlet />
            </main>

            {/* Mobile bottom tabs */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around items-center h-16 z-20">
                {PORTAL_NAV.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path ? `/portal/${token}/${path}` : `/portal/${token}`}
                        end={path === ""}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 text-[11px] font-medium flex-1 h-full transition-colors ${isActive ? "text-primary" : "text-muted"
                            }`
                        }
                    >
                        <Icon size={20} />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};
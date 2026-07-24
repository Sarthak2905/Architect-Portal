import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "../routes/navConfig";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../api/hooks/useAuth";
import { cn } from "../utils/cn";

/**
 * Responsive shell: a fixed left sidebar from md breakpoint up, and a
 * fixed bottom tab bar below it. Both read the same NAV_ITEMS, so
 * there's one place to add/remove pages.
 */
export const OwnerLayout = () => {
    const { user, logout } = useAuth();
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-bg md:flex">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 bg-dark text-white">
                <div className="px-5 py-5 border-b border-white/10">
                    <p className="font-semibold">Architect Portal</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user?.username}</p>
                </div>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 w-full transition-colors"
                    >
                        <LogOut size={18} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 pb-20 md:pb-0">
                <Outlet />
            </main>

            {/* Mobile bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark border-t border-white/10 flex justify-around items-center h-16 z-20">
                {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center gap-1 text-[11px] font-medium flex-1 h-full transition-colors",
                                isActive ? "text-white" : "text-slate-500"
                            )
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
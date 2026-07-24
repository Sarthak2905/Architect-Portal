import { LayoutDashboard, Users, FolderKanban, Settings } from "lucide-react";

// Single source of truth for both the desktop sidebar and the mobile
// bottom tab bar — add a page here once and both layouts pick it up.
export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", path: "/clients", icon: Users },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Settings", path: "/settings", icon: Settings },
];

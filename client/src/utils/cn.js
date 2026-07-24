import clsx from "clsx";

// Small wrapper so components can pass conditional classNames cleanly:
// cn("base-class", isActive && "active-class", className)
export const cn = (...args) => clsx(...args);

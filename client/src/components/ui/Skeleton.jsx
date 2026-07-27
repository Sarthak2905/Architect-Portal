import { cn } from "../../utils/cn";

// Simple animated placeholder block — used instead of "Loading..." text
// everywhere, so the layout doesn't jump once real content arrives.
export const Skeleton = ({ className }) => (
    <div className={cn("animate-pulse bg-slate-200 rounded-md", className)} />
);